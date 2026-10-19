// All draft documents and handshake secrets below are LOCAL fixtures, never cloud writes.
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
const origin = 'http://127.0.0.1:3196';
const directory = await mkdtemp(join(tmpdir(), 'putri-preview-'));
const statePath = join(directory, 'state.json');
const fakeToken = 'local-controlled-reader-not-a-real-token';
const secret = 'controlled-handshake-only';
const post = { _id: 'live', _type: 'post', title: 'PUBLIC_TITLE', slug: { current: 'live' }, language: 'id', format: 'poem', excerpt: 'PUBLIC_SUMMARY', publishedAt: '2026-10-01T00:00:00Z', categories: [{ _ref: 'category' }], body: [{ _type: 'poemStanza', _key: 'one', text: 'PUBLIC_BODY' }] };
const draft = { ...post, _id: 'drafts.live', title: 'DRAFT_TITLE', excerpt: 'DRAFT_SUMMARY', body: [{ _type: 'poemStanza', _key: 'one', text: 'DRAFT_LINE_ONE\nDRAFT_LINE_TWO' }, { _type: 'poemStanza', _key: 'two', text: 'DRAFT_STANZA_TWO' }] };
const handshake = { _id: 'drafts.local-preview-secret', _type: 'sanity.previewUrlSecret', secret, studioUrl: origin + '/studio', _updatedAt: new Date().toISOString() };
const state = { mode: 'populated', simulatePerspectives: true, documents: [post, draft, { ...draft, _id: 'drafts.new', slug: { current: 'new' }, title: 'DRAFT_ONLY_TITLE' }, { _id: 'category', _type: 'category', title: { id: 'PUBLIC_CATEGORY' }, slug: { current: 'category' } }, { _id: 'drafts.category', _type: 'category', title: { id: 'DRAFT_CATEGORY' }, slug: { current: 'category' } }, handshake] };
let imageCheck = false;
try {
  const { post: snapshot } = JSON.parse(await readFile('node_modules/.cache/putri-sanity-check/cloud.json', 'utf8'));
  const asset = snapshot.cover?.asset;
  if (asset) {
    state.documents.push({ _id: asset._id, _type: 'sanity.imageAsset', url: asset.url, metadata: { dimensions: { width: asset.width, height: asset.height } } });
    draft.cover = { _type: 'editorialImage', alt: 'DRAFT_COVER_ALT', caption: 'DRAFT_COVER_CAPTION', asset: { _ref: asset._id } };
    draft.body.push({ _type: 'editorialImage', _key: 'image', alt: 'DRAFT_BODY_ALT', caption: 'DRAFT_BODY_CAPTION', asset: { _ref: asset._id } });
    imageCheck = true;
  }
} catch { /* Offline runs can test content without an asset snapshot. */ }
const save = () => writeFile(statePath, JSON.stringify(state)); await save();
state.documents.push({ _id: 'drafts.incomplete', _type: 'post', slug: { current: 'incomplete' }, categories: [{ _ref: 'missing' }] }); await save();
const preload = new URL('./helpers/sanity-fetch-preload.mjs', import.meta.url).href;
let logs = '';
function start(token) {
  const child = spawn(process.execPath, ['--import', preload, 'node_modules/next/dist/bin/next', 'start', '--port', '3196'], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, SANITY_TEST_STATE_FILE: statePath, SANITY_API_READ_TOKEN: token } });
  child.stdout.on('data', value => { logs += value; }); child.stderr.on('data', value => { logs += value; });
  return child;
}
async function ready() { for (let i = 0; i < 80; i++) { try { await fetch(origin + '/id/kontak'); return; } catch { await new Promise(resolve => setTimeout(resolve, 100)); } } throw new Error('Server unavailable'); }
function enable(path, key = secret) { const url = new URL('/api/draft-mode/enable', origin); url.searchParams.set('sanity-preview-pathname', path); if (key !== null) url.searchParams.set('sanity-preview-secret', key); return fetch(url, { redirect: 'manual' }); }
const request = (path, cookie) => fetch(origin + path, { headers: cookie ? { Cookie: cookie } : {}, redirect: 'manual' });
let server = start(fakeToken);
try {
  await ready();
  for (const path of ['https://evil.test/id/preview/tulisan/live', '//evil.test/id/preview/tulisan/live', '/id/tulisan/live', '/id/preview/tulisan/%2fsecret', '/id/preview/tulisan/..', '/id/preview/tulisan/live?next=https://evil.test', '/id/preview/tulisan/%252fsecret']) assert.equal((await enable(path)).status, 400);
  for (const key of [null, 'invalid']) { const result = await enable('/id/preview/tulisan/live', key); assert.equal(result.status, 401); assert(!result.headers.has('set-cookie')); }
  handshake._updatedAt = '2000-01-01T00:00:00Z'; await save(); assert.equal((await enable('/id/preview/tulisan/live')).status, 401);
  handshake._updatedAt = new Date().toISOString(); await save();
  const opened = await enable('/id/preview/tulisan/live'); assert.equal(opened.status, 303); assert.equal(opened.headers.get('location'), '/id/preview/tulisan/live');
  const cookieHeader = opened.headers.getSetCookie().find(value => value.startsWith('__prerender_bypass=')); assert(cookieHeader?.includes('HttpOnly')); assert(cookieHeader.includes('Max-Age=3600'));
  const cookie = cookieHeader.split(';')[0];
  const incomplete = await (await request('/id/preview/tulisan/incomplete', cookie)).text(); assert(incomplete.includes('Tulisan tanpa judul')); assert(!incomplete.includes('1970')); assert.equal((await request('/id/tulisan/incomplete')).status, 404);
  for (const slug of ['live', 'new']) {
    const response = await request(`/id/preview/tulisan/${slug}`, cookie);
    assert(response.headers.get('cache-control').includes('no-store')); assert(response.headers.get('x-robots-tag').includes('noindex'));
    const html = await response.text();
    assert(html.includes(slug === 'new' ? 'DRAFT_ONLY_TITLE' : 'DRAFT_TITLE')); assert(html.includes('Preview draft')); assert(html.includes('Keluar preview')); assert(html.includes('/api/draft-mode/disable'));
    assert(!html.includes(fakeToken)); assert(!html.includes(secret));
    if (slug === 'live') {
      for (const text of ['DRAFT_SUMMARY', 'DRAFT_CATEGORY', 'DRAFT_LINE_ONE\nDRAFT_LINE_TWO', 'DRAFT_STANZA_TWO']) assert(html.includes(text));
      if (imageCheck) for (const text of ['DRAFT_COVER_ALT', 'DRAFT_COVER_CAPTION', 'DRAFT_BODY_ALT', 'DRAFT_BODY_CAPTION']) assert(html.includes(text));
    }
  }
  for (const cookieValue of [undefined, cookie, '__prerender_bypass=forged']) {
    assert.equal((await request('/id/tulisan/new', cookieValue)).status, 404, 'Draft-only remains public 404 even for editors');
    for (const path of ['/id', '/id/tulisan', '/id/tulisan/live']) {
      const html = await (await request(path, cookieValue)).text(); assert(html.includes('PUBLIC_TITLE')); assert(!html.includes('DRAFT_TITLE')); assert(!html.includes('DRAFT_ONLY_TITLE')); assert(!html.includes('DRAFT_SUMMARY')); assert(!html.includes('DRAFT_CATEGORY'));
    }
  }
  for (const cookieValue of [undefined, '__prerender_bypass=forged']) assert(!(await (await request('/id/preview/tulisan/live?preview=true', cookieValue)).text()).includes('DRAFT_TITLE'));
  draft.title = 'DRAFT_EDIT_NEXT_REQUEST'; await save(); assert((await (await request('/id/preview/tulisan/live', cookie)).text()).includes(draft.title));
  if (process.env.RUN_PREVIEW_BROWSER === '1') {
    const child = spawn(process.execPath, ['tests/public-pages.mjs'], { stdio: 'inherit', env: { ...process.env, CHECK_ONLY: 'preview', PREVIEW_TEST_COOKIE: cookie.slice(cookie.indexOf('=') + 1), SANITY_API_READ_TOKEN: fakeToken, SANITY_TEST_STATE_FILE: statePath, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${preload}`.trim() } });
    assert.equal(await new Promise(resolve => child.on('exit', resolve)), 0);
  }
  assert.equal((await fetch(origin + '/api/draft-mode/disable', { method: 'POST', headers: { Origin: 'https://evil.test', Cookie: cookie } })).status, 403);
  for (const [slug, target] of [['live', '/id/tulisan/live'], ['new', '/id/tulisan']]) {
    const result = await fetch(origin + '/api/draft-mode/disable', { method: 'POST', redirect: 'manual', headers: { Origin: origin, Cookie: cookie }, body: new URLSearchParams({ slug }) });
    assert.equal(result.status, 303); assert.equal(result.headers.get('location'), target);
    assert(result.headers.getSetCookie().some(value => value.startsWith('__prerender_bypass=;') && /Expires=Thu, 01 Jan 1970/.test(value)));
  }
  assert(!(await (await request('/id/preview/tulisan/live')).text()).includes('DRAFT_EDIT_NEXT_REQUEST'));
  const metrics = (await readFile(statePath + '.requests', 'utf8')).trim().split('\n').map(JSON.parse);
  assert(metrics.every(item => item.cache === 'no-store' && !item.cdn));
  assert(metrics.filter(item => item.perspective === 'published').every(item => !item.authenticated));
  assert(metrics.filter(item => ['drafts', 'raw'].includes(item.perspective)).every(item => item.authenticated));
  assert(!logs.includes(fakeToken)); assert(!logs.includes(secret));
  // Look for the sentinel token in shipped client assets, without logging it.
  async function scan(path) { for (const item of await readdir(path, { withFileTypes: true })) { const file = join(path, item.name); if (item.isDirectory()) await scan(file); else if (file.endsWith('.js')) assert(!(await readFile(file, 'utf8')).includes(fakeToken)); } }
  await scan('.next/static');
  await new Promise(resolve => { server.once('exit', resolve); server.kill(); });
  server = start(''); await ready();
  const missing = await enable('/id/preview/tulisan/live'); assert.equal(missing.status, 503); assert((await missing.text()).includes('SANITY_API_READ_TOKEN'));
  assert((await (await request('/id/preview/tulisan/live')).text()).includes('Preview belum dikonfigurasi'));
  assert((await (await request('/id/tulisan/live')).text()).includes('PUBLIC_TITLE'));
  console.log(`PASS CONTROLLED preview: valid/invalid/expired handshake, redirect allowlist, Draft Mode cookie/exit, draft-only, edits, title/excerpt/category/poems${imageCheck ? '/cover/body alt/captions' : ' (image snapshot unavailable)'}, public/metadata isolation with and without cookie, no-store/noindex, server-only credentials, missing-token setup. No cloud writes.`);
} finally { server.kill(); }
