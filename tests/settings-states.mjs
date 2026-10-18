// Controlled production requests: local API responses only, never cloud mutations.
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
const directory = await mkdtemp(join(tmpdir(), 'putri-settings-'));
const statePath = join(directory, 'state.json');
const state = { mode: 'populated', documents: [] };
const save = () => writeFile(statePath, JSON.stringify(state));
await save();
const preload = new URL('./helpers/sanity-fetch-preload.mjs', import.meta.url).href;
let logs = '';
const server = spawn(process.execPath, ['--import', preload, 'node_modules/next/dist/bin/next', 'start', '--port', '3195'], { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, SANITY_TEST_STATE_FILE: statePath, SITE_URL: 'https://putriwellasibarani.vercel.app' } });
server.stdout.on('data', value => { logs += value; }); server.stderr.on('data', value => { logs += value; });
const origin = 'http://127.0.0.1:3195';
const html = async path => (await fetch(origin + path)).text();
const canonical = (markup, path) => assert(markup.includes(`<link rel="canonical" href="https://putriwellasibarani.vercel.app${path}"`), `Absolute canonical: ${path}`);
const defaults = markup => { for (const value of ['mailto:putriwella97@gmail.com', 'https://www.linkedin.com/in/putriwella97/', 'https://www.instagram.com/wellasibarani/']) assert(markup.includes(`href="${value}"`)); };
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) { try { await fetch(origin + '/id/kontak'); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); } }
  assert(ready);
  defaults(await html('/id/kontak'));
  const empty = await html('/en'); assert(empty.includes('Putri Wella Sibarani')); assert(empty.includes('Where ideas on economics')); canonical(empty, '/en');
  const settings = { _id: 'siteSettings', _type: 'siteSettings', siteName: 'CONTROLLED_SITE_NAME', introduction: { id: 'INTRO_ID_FALLBACK', en: ' ' }, defaultSeo: { id: { description: 'SEO_ID_FALLBACK' }, en: { description: ' ' } }, publicEmail: '', linkedInUrl: '', instagramUrl: '', navigationLabels: { home: { id: 'IGNORE_NAV_CMS', en: 'IGNORE_NAV_CMS' } } };
  const post = (id, date) => ({ _id: id, _type: 'post', title: `TITLE_${id}`, slug: { current: id }, language: 'id', format: 'article', excerpt: '', publishedAt: date, categories: [], body: [], relatedPosts: [] });
  const latest = post('latest-live', '2026-10-03T00:00:00Z'), older = post('older-live', '2026-10-01T00:00:00Z');
  state.documents = [settings, latest, older, post('drafts.private', '2026-10-04T00:00:00Z'), post('versions.private', '2026-10-04T00:00:00Z')]; await save();
  let home = await html('/en');
  for (const value of ['CONTROLLED_SITE_NAME', 'INTRO_ID_FALLBACK', 'SEO_ID_FALLBACK']) assert(home.includes(value));
  assert(!home.includes('IGNORE_NAV_CMS')); assert(!home.includes('TITLE_drafts.private'));
  defaults(await html('/en/kontak'));
  // Invalid schemes, foreign domains, credentials and email header injection all preserve approved defaults.
  for (const [email, linkedin, instagram] of [
    ['bad@example.test?subject=inject', 'javascript:alert(1)', 'http://www.instagram.com/unsafe/'],
    ['bad@example.test\r\nBcc:private@example.test', 'https://linkedin.com.evil.test/person', 'https://name:pass@instagram.com/person'],
    ['mailto:bad@example.test', 'https://www.linkedin.com:444/person', 'data:text/html,unsafe'],
  ]) { Object.assign(settings, { publicEmail: email, linkedInUrl: linkedin, instagramUrl: instagram }); await save(); defaults(await html('/id/kontak')); }
  Object.assign(settings, { publicEmail: 'approved@example.test', linkedInUrl: 'https://www.linkedin.com/in/approved/?tracking=removed', instagramUrl: 'https://www.instagram.com/approved/#fragment' }); await save();
  const contacts = await html('/en/kontak');
  for (const value of ['mailto:approved@example.test', 'https://www.linkedin.com/in/approved/', 'https://www.instagram.com/approved/']) assert(contacts.includes(`href="${value}"`));
  assert(contacts.includes('rel="noopener noreferrer"')); assert(!contacts.includes('<form'));
  settings.publicEmail = 'tag#part%0a@example.test'; await save();
  assert((await html('/id/kontak')).includes('href="mailto:tag%23part%250a@example.test"'), 'Mailbox URI characters must be encoded, not treated as fragments or headers');
  settings.publicEmail = 'approved@example.test'; await save();
  for (const refs of [[], [{ _ref: 'missing' }], [{ _ref: 'drafts.private' }, { _ref: 'versions.private' }]]) {
    settings.featuredPosts = refs; await save(); home = await html('/id');
    assert(home.match(/class="featured"[\s\S]*?<h3[^>]*><a[^>]*href="\/id\/tulisan\/latest-live"/));
  }
  settings.featuredPosts = [{ _ref: 'missing' }, { _ref: 'older-live' }]; await save();
  assert((await html('/id')).match(/class="featured"[\s\S]*?<h3[^>]*><a[^>]*href="\/id\/tulisan\/older-live"/));
  state.documents = state.documents.filter(doc => doc._id !== 'older-live'); await save();
  assert((await html('/id')).match(/class="featured"[\s\S]*?<h3[^>]*><a[^>]*href="\/id\/tulisan\/latest-live"/));
  settings.introduction.en = 'INTRO_EN'; settings.defaultSeo.en.description = 'SEO_EN'; await save();
  home = await html('/en'); assert(home.includes('INTRO_EN')); assert(home.includes('SEO_EN'));
  for (const path of ['/id', '/en', '/id/tentang', '/en/aktivitas', '/id/kontak', '/en/tulisan', '/id/tulisan/latest-live']) canonical(await html(path), path);
  const alias = await fetch(origin + '/en/tulisan/latest-live', { redirect: 'manual' }); assert.equal(alias.status, 308);
  if (process.env.RUN_SETTINGS_BROWSER === '1') {
    const child = spawn(process.execPath, ['tests/public-pages.mjs'], { stdio: 'inherit', env: { ...process.env, CHECK_ONLY: 'settings', NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${preload}`.trim(), SANITY_TEST_STATE_FILE: statePath } });
    assert.equal(await new Promise(resolve => child.on('exit', resolve)), 0);
  }
  state.documents = state.documents.filter(doc => doc._id !== 'siteSettings');
  state.documents.push({ ...settings, _id: 'drafts.siteSettings' }); await save();
  home = await html('/id'); assert(!home.includes('CONTROLLED_SITE_NAME')); defaults(await html('/id/kontak'));
  state.mode = 'error'; await save();
  const error = await html('/id/kontak'); defaults(error); assert(!error.includes('Controlled test outage')); assert(!error.includes('api.sanity.io'));
  assert(logs.includes('[siteSettings] Published settings unavailable; using public defaults.'));
  assert(!logs.includes('Controlled test outage'));
  const requests = (await readFile(statePath + '.requests', 'utf8')).trim().split('\n').map(JSON.parse);
  assert(requests.every(request => request.cache === 'no-store' && !request.cdn && request.perspective === 'published'));
  console.log('PASS CONTROLLED settings: absent/draft/error defaults, ID fallback/EN override, CMS contacts and unsafe input rejection, published/unavailable featured references, next-request changes, absolute canonical, EN article redirect, safe server logging, published/no-store');
} finally { server.kill(); }
