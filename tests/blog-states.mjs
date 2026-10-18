// Production app with in-memory Sanity responses. Never writes to Sanity or mutates cloud content.
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
const directory = await mkdtemp(join(tmpdir(), 'putri-blog-states-'));
const statePath = join(directory, 'state.json');
const origin = 'http://127.0.0.1:3193';
const state = { mode: 'empty', documents: [] };
const save = () => writeFile(statePath, JSON.stringify(state));
await save();
const server = spawn(process.execPath, ['--import', new URL('./helpers/sanity-fetch-preload.mjs', import.meta.url).href, 'node_modules/next/dist/bin/next', 'start', '--port', '3193'], { stdio: ['ignore', 'ignore', 'inherit'], env: { ...process.env, SANITY_TEST_STATE_FILE: statePath } });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { await fetch(origin + '/id/kontak'); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert(ready);
  for (const path of ['/id', '/en', '/id/tulisan', '/en/tulisan']) {
    const html = await (await fetch(origin + path)).text();
    assert(html.includes('data-blog-state="empty"'), `Empty state: ${path}`);
    assert(!html.includes('Melihat ekonomi dari hal-hal yang dekat'), 'Never silently substitute fixture content');
  }
  assert.equal((await fetch(origin + '/id/tulisan/added-after-build')).status, 404);
  state.mode = 'populated';
  const post = { _id: 'local-published', _type: 'post', title: 'Controlled published article', slug: { current: 'added-after-build' }, language: 'id', format: 'poem', publishedAt: '2026-10-01T00:00:00Z', categories: [{ _ref: 'local-category' }], relatedPosts: [{ _ref: 'drafts.hidden' }], body: [{ _type: 'poemStanza', _key: 'one', text: 'baris satu\nbaris dua' }, { _type: 'poemStanza', _key: 'two', text: 'bait kedua' }] };
  state.documents = [post, { ...post, _id: 'drafts.hidden', title: 'DRAFT_SHOULD_NOT_LEAK', slug: { current: 'draft-only' } }, { ...post, _id: 'versions.test.hidden', title: 'VERSION_SHOULD_NOT_LEAK' }, { _id: 'local-category', _type: 'category', title: { id: 'Kategori ID fallback', en: '' }, slug: { current: 'local-category' } }];
  // Reuse an already-public asset for local render tests, without uploading or changing cloud content.
  let imageCheck = false;
  try {
    const snapshot = JSON.parse(await readFile('node_modules/.cache/putri-sanity-check/cloud.json', 'utf8'));
    const asset = snapshot.post.cover?.asset;
    if (asset) {
      state.documents.push({ _type: 'sanity.imageAsset', _id: asset._id, url: asset.url, metadata: { dimensions: { width: asset.width, height: asset.height } } });
      post.cover = { _type: 'editorialImage', asset: { _ref: asset._id }, alt: 'Controlled cover alt', caption: 'Controlled cover caption' };
      post.body.push({ _type: 'editorialImage', _key: 'body-image', asset: { _ref: asset._id }, alt: 'Controlled body alt', caption: 'Controlled body caption' });
      imageCheck = true;
    }
  } catch { /* An offline run may have no cloud snapshot; unresolved assets are tested separately. */ }
  await save();
  const detail = await fetch(origin + '/id/tulisan/added-after-build');
  assert.equal(detail.status, 200, 'A slug introduced after build and server start must be reachable');
  const detailHtml = await detail.text();
  assert(detailHtml.includes('Controlled published article'));
  assert(detailHtml.includes('baris satu\nbaris dua'));
  assert.equal((detailHtml.match(/<p class="poem">/g) || []).length, 2);
  assert(!detailHtml.includes('DRAFT_SHOULD_NOT_LEAK'));
  assert(!detailHtml.includes('VERSION_SHOULD_NOT_LEAK'));
  if (imageCheck) {
    for (const text of ['Controlled cover alt', 'Controlled cover caption', 'Controlled body alt', 'Controlled body caption']) assert(detailHtml.includes(text));
    assert.equal((detailHtml.match(/<img /g) || []).length, 2);
    console.log('PASS CONTROLLED: cover/body image alt and captions rendered using an existing public asset');
  } else console.log('SKIP CONTROLLED image render: run blog-cloud.mjs to obtain a public asset snapshot');
  const listing = await (await fetch(origin + '/en/tulisan')).text();
  assert(listing.includes('Kategori ID fallback'));
  assert(listing.includes('/id/tulisan/added-after-build'));
  assert(!listing.includes('DRAFT_SHOULD_NOT_LEAK'));
  assert.equal((await fetch(origin + '/id/tulisan/draft-only')).status, 404);
  assert.equal((await fetch(origin + '/en/tulisan/added-after-build', { redirect: 'manual' })).status, 308);
  post.title = 'Controlled edit on next request'; await save();
  assert((await (await fetch(origin + '/id/tulisan/added-after-build')).text()).includes(post.title));
  assert((await (await fetch(origin + '/id')).text()).includes(post.title));
  assert((await (await fetch(origin + '/id/tulisan')).text()).includes(post.title));
  state.documents = state.documents.filter(document => document._id !== post._id); await save();
  assert.equal((await fetch(origin + '/id/tulisan/added-after-build')).status, 404, 'Unpublish takes effect on the next request');
  state.mode = 'error'; await save();
  for (const path of ['/id', '/en/tulisan', '/id/tulisan/added-after-build']) {
    const response = await fetch(origin + path);
    assert.notEqual(response.status, 404, 'An upstream failure is not a missing article');
    const html = await response.text();
    assert(html.includes('data-blog-state="error"'));
    assert(!html.includes('data-blog-state="empty"'));
    assert(!html.includes('Controlled test outage'), 'No raw SDK error in public HTML');
  }
  const requests = (await readFile(statePath + '.requests', 'utf8')).trim().split('\n').map(line => JSON.parse(line));
  assert(requests.length > 0);
  assert(requests.every(request => request.cache === 'no-store' && !request.cdn && request.perspective === 'published'));
  console.log('PASS CONTROLLED: empty vs error, no dummy fallback, ID fallback, draft/version exclusion, poetry, 404, EN alias, post-build slug, edit/unpublish next request, no-store/no-CDN/published requests');
} finally { server.kill(); }
