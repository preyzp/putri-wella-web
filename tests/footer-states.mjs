// Controlled settings/clock responses only. Never writes to Sanity.
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
const directory = await mkdtemp(join(tmpdir(), 'putri-footer-'));
const statePath = join(directory, 'state.json');
const year = new Date().getFullYear();
const state = { mode: 'populated', documents: [], footerYear: year };
const save = () => writeFile(statePath, JSON.stringify(state)); await save();
const preload = new URL('./helpers/sanity-fetch-preload.mjs', import.meta.url).href;
const clock = new URL('./helpers/footer-clock-preload.mjs', import.meta.url).href;
const server = spawn(process.execPath, ['--import', preload, '--import', clock, 'node_modules/next/dist/bin/next', 'start', '--port', '3199'], { stdio: 'ignore', env: { ...process.env, SANITY_TEST_STATE_FILE: statePath } });
const origin = 'http://127.0.0.1:3199';
const html = async path => (await fetch(origin + path)).text();
function footer(markup) { const value = markup.match(/<footer\b[^>]*class="container site-footer"[\s\S]*?<\/footer>/g)?.at(-1); assert(value, 'Public footer is rendered'); return value.replace(/<!--[\s\S]*?-->/g, ''); }
function check(markup, expectedYear, instagram, linkedin) {
  const value = footer(markup);
  assert(value.includes(`© ${expectedYear} Putri Wella Sibarani.`)); assert.equal((value.match(/© /g) || []).length, 1);
  assert(value.includes('Website by TednCo.')); assert(!/<a[^>]*>[^<]*TednCo/.test(value));
  for (const [name, href] of [['Instagram', instagram], ['LinkedIn', linkedin]]) {
    assert(value.includes(`href="${href}"`)); assert(value.includes(`aria-label="${name} Putri Wella Sibarani"`));
  }
  assert.equal((value.match(/target="_blank"/g) || []).length, 2);
  assert.equal((value.match(/rel="noopener noreferrer"/g) || []).length, 2);
  assert.equal((value.match(/aria-hidden="true"/g) || []).length, 2);
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) { try { await fetch(origin + '/id/kontak'); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); } } assert(ready);
  const instagram = 'https://www.instagram.com/wellasibarani/', linkedin = 'https://www.linkedin.com/in/putriwella97/';
  const article = { _id: 'footer-post', _type: 'post', title: 'FOOTER_ARTICLE', slug: { current: 'footer-post' }, language: 'id', format: 'article', publishedAt: '2026-10-01T00:00:00Z', categories: [], body: [] };
  state.documents.push(article); await save();
  for (const locale of ['id', 'en']) for (const page of ['', '/tulisan', '/tentang', '/aktivitas', '/kontak']) check(await html(`/${locale}${page}`), year, instagram, linkedin);
  check(await html('/id/tulisan/footer-post'), year, instagram, linkedin);
  state.footerYear = year + 5; await save(); check(await html('/id'), year + 5, instagram, linkedin);
  const settings = { _id: 'siteSettings', _type: 'siteSettings', siteName: 'CMS_FOOTER_NAME', instagramUrl: 'https://www.instagram.com/approved-footer/?tracking=removed', linkedInUrl: 'https://www.linkedin.com/in/approved-footer/#fragment' };
  state.documents.push(settings); await save();
  for (const locale of ['id', 'en']) for (const page of ['', '/tulisan', '/tentang', '/aktivitas', '/kontak']) {
    const markup = await html(`/${locale}${page}`); check(markup, year + 5, 'https://www.instagram.com/approved-footer/', 'https://www.linkedin.com/in/approved-footer/'); assert(footer(markup).includes('CMS_FOOTER_NAME'));
  }
  if (process.env.RUN_FOOTER_BROWSER === '1') {
    const child = spawn(process.execPath, ['tests/public-pages.mjs'], { stdio: 'inherit', env: { ...process.env, CHECK_ONLY: 'footer', FOOTER_EXPECT_YEAR: String(year + 5), SANITY_TEST_STATE_FILE: statePath, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${preload} --import=${clock}`.trim() } });
    assert.equal(await new Promise(resolve => child.on('exit', resolve)), 0);
  }
  settings.instagramUrl = 'javascript:alert(1)'; settings.linkedInUrl = 'https://example.test/invalid'; await save(); check(await html('/id/kontak'), year + 5, instagram, linkedin);
  state.mode = 'error'; await save(); check(await html('/id/kontak'), year + 5, instagram, linkedin);
  assert(!(await html('/studio')).includes('Website by TednCo.'));
  const requests = (await readFile(statePath + '.requests', 'utf8')).trim().split('\n').map(JSON.parse); assert(requests.every(request => request.cache === 'no-store' && request.perspective === 'published' && !request.authenticated && !request.cdn));
  console.log('PASS CONTROLLED footer: all public ID/EN routes/detail, one copyright, current and changed runtime year, plain-text TednCo, accessible brand links, CMS overrides, empty/invalid/error contact fallback, Studio unchanged, published/no-store. No cloud changes.');
} finally { server.kill(); }
