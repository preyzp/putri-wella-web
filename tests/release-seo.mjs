// Request-time release SEO checks against local Sanity responses; no cloud writes.
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
const directory = await mkdtemp(join(tmpdir(), 'putri-release-seo-'));
const statePath = join(directory, 'state.json');
const canonicalOrigin = new URL(process.env.SITE_URL || 'https://putriwella.web.id').origin;
const origin = 'http://127.0.0.1:3198';
const updatedAt = '2026-10-18T10:00:00.000Z';
const live = { _id: 'release-live', _type: 'post', _updatedAt: updatedAt, title: 'RELEASE_ARTICLE', slug: { current: 'release-live' }, language: 'id', format: 'article', excerpt: 'RELEASE_EXCERPT', publishedAt: '2026-10-01T00:00:00.000Z', categories: [{ _ref: 'release-category' }], body: [{ _type: 'block', _key: 'one', style: 'normal', children: [{ _type: 'span', _key: 'text', text: 'RELEASE_BODY', marks: [] }], markDefs: [] }], seo: { title: 'ARTICLE_META_TITLE', description: 'ARTICLE_META_DESCRIPTION' } };
const settings = { _id: 'siteSettings', _type: 'siteSettings', _updatedAt: '2026-10-17T00:00:00.000Z', siteName: 'RELEASE_SITE', introduction: { id: 'INTRO_RELEASE' }, defaultSeo: { id: { title: 'HOME_META_TITLE', description: 'SITE_META_DESCRIPTION' }, en: { title: ' ', description: ' ' } } };
const state = { mode: 'populated', documents: [live, settings, { _id: 'release-category', _type: 'category', _updatedAt: '2026-10-19T00:00:00.000Z', title: { id: 'Kategori' }, slug: { current: 'kategori' } }, { ...live, _id: 'drafts.release-live', title: 'DRAFT_NEVER_PUBLIC', _updatedAt: '2030-01-01T00:00:00Z' }, { ...live, _id: 'drafts.release-only', title: 'DRAFT_ONLY_NEVER_PUBLIC', slug: { current: 'draft-only' } }, { ...live, _id: 'versions.release.live', title: 'VERSION_NEVER_PUBLIC', slug: { current: 'version-only' } }] };
let asset;
try {
  const snapshot = JSON.parse(await readFile('node_modules/.cache/putri-sanity-check/cloud.json', 'utf8'));
  asset = snapshot.post.cover?.asset;
  if (asset) {
    state.documents.push({ _id: asset._id, _type: 'sanity.imageAsset', url: asset.url, metadata: { dimensions: { width: asset.width, height: asset.height } } }, { _id: 'release-og-asset', _type: 'sanity.imageAsset', url: asset.url + '?release=og', metadata: { dimensions: { width: asset.width, height: asset.height } } }, { _id: 'release-default-asset', _type: 'sanity.imageAsset', url: asset.url + '?release=default', metadata: { dimensions: { width: asset.width, height: asset.height } } });
    live.cover = { _type: 'editorialImage', alt: 'RELEASE_COVER_ALT', asset: { _ref: asset._id } };
    live.seo.ogImage = { _type: 'editorialImage', alt: 'RELEASE_OG_ALT', asset: { _ref: 'release-og-asset' } };
    settings.defaultSeo.id.ogImage = { _type: 'editorialImage', alt: 'RELEASE_DEFAULT_ALT', asset: { _ref: 'release-default-asset' } };
  }
} catch { /* Image metadata assertions report skipped when no public snapshot is available. */ }
const save = () => writeFile(statePath, JSON.stringify(state)); await save();
const preload = new URL('./helpers/sanity-fetch-preload.mjs', import.meta.url).href;
const server = spawn(process.execPath, ['--import', preload, 'node_modules/next/dist/bin/next', 'start', '--port', '3198'], { stdio: 'ignore', env: { ...process.env, SANITY_TEST_STATE_FILE: statePath, SITE_URL: canonicalOrigin } });
const request = (path, options) => fetch(origin + path, options);
const html = async path => (await request(path)).text();
function locations(xml) { return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]); }
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) { try { await request('/robots.txt'); ready = true; break; } catch { await new Promise(resolve => setTimeout(resolve, 100)); } } assert(ready);
  const robots = await html('/robots.txt');
  assert(robots.includes('Allow: /')); assert(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
  for (const path of ['/studio', '/api/', '/id/preview/', '/en/preview/']) assert(robots.includes(`Disallow: ${path}`));
  let response = await request('/sitemap.xml'); assert.equal(response.status, 200); assert(response.headers.get('content-type').includes('xml'));
  let xml = await response.text(), urls = locations(xml); assert.equal(urls.length, 11); assert.equal(new Set(urls).size, 11);
  for (const locale of ['id', 'en']) for (const path of ['', '/tentang', '/aktivitas', '/kontak', '/tulisan']) assert(urls.includes(`${canonicalOrigin}/${locale}${path}`));
  assert(urls.includes(`${canonicalOrigin}/id/tulisan/release-live`));
  assert(!urls.some(url => /\/studio|\/api\/|\/preview\/|\/en\/tulisan\/.+|draft-only|version-only/.test(url)));
  assert(xml.includes(`<loc>${canonicalOrigin}/id/tulisan/release-live</loc>\n<lastmod>${updatedAt}</lastmod>`));
  assert(!xml.includes('2030-01-01'));
  for (const locale of ['id', 'en']) for (const page of ['', '/tulisan', '/tentang', '/aktivitas', '/kontak']) {
    const markup = await html(`/${locale}${page}`);
    assert(markup.includes(`<link rel="canonical" href="${canonicalOrigin}/${locale}${page}"`));
    assert(markup.includes('name="robots" content="index, follow"'));
    const renderedMarkup = markup.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    assert(!/Preview awal|Rancangan belum final|Early preview|Design is not final|— Preview|preview-label/.test(renderedMarkup));
    assert(markup.includes('property="og:type" content="website"')); assert(markup.includes('SITE_META_DESCRIPTION'));
    if (!page) assert(markup.includes('<title>HOME_META_TITLE</title>'));
  }
  let detail = await html('/id/tulisan/release-live');
  for (const value of ['<title>ARTICLE_META_TITLE</title>', 'name="description" content="ARTICLE_META_DESCRIPTION"', 'property="og:type" content="article"', `property="og:url" content="${canonicalOrigin}/id/tulisan/release-live"`]) assert(detail.includes(value));
  assert(!detail.includes('DRAFT_NEVER_PUBLIC')); assert(!detail.includes('VERSION_NEVER_PUBLIC'));
  if (asset) {
    assert(detail.includes(`property="og:image" content="${asset.url}"`), 'Cover takes precedence over article OG override and default');
    delete live.cover; await save(); detail = await html('/id/tulisan/release-live'); assert(detail.includes(`property="og:image" content="${asset.url}?release=og"`));
    delete live.seo.ogImage; await save(); detail = await html('/id/tulisan/release-live'); assert(detail.includes(`property="og:image" content="${asset.url}?release=default"`));
    delete settings.defaultSeo.id.ogImage; await save(); detail = await html('/id/tulisan/release-live'); assert(!detail.includes('property="og:image"'));
  }
  const alias = await request('/en/tulisan/release-live', { redirect: 'manual' }); assert.equal(alias.status, 308);
  assert.equal((await request('/id/tulisan/draft-only')).status, 404);
  const preview = await request('/id/preview/tulisan/release-live'); assert(preview.headers.get('x-robots-tag').includes('noindex')); assert((await preview.text()).includes('noindex'));
  assert((await html('/studio')).includes('noindex'));
  state.documents.push({ ...live, _id: 'release-later', slug: { current: 'after-build' }, _updatedAt: '2026-10-20T00:00:00.000Z' }); await save();
  assert((await html('/sitemap.xml')).includes(`${canonicalOrigin}/id/tulisan/after-build`), 'New published article appears after server start without rebuild');
  state.documents = state.documents.filter(doc => doc._id !== live._id); await save(); assert(!(await html('/sitemap.xml')).includes(`${canonicalOrigin}/id/tulisan/release-live`));
  state.mode = 'empty'; await save(); xml = await html('/sitemap.xml'); assert.equal(locations(xml).length, 10); assert(!xml.includes('<lastmod>'), 'Do not invent modification dates for empty content');
  state.mode = 'error'; await save(); response = await request('/sitemap.xml'); assert.equal(response.status, 500, 'Upstream failure must not masquerade as a successful sitemap with all articles missing'); assert(!(await response.text()).includes('<urlset'));
  state.mode = 'populated'; await save(); assert.equal((await request('/sitemap.xml')).status, 200, 'Failure must not be cached');
  const metrics = (await readFile(statePath + '.requests', 'utf8')).trim().split('\n').map(JSON.parse); assert(metrics.every(item => item.cache === 'no-store' && !item.cdn && item.perspective === 'published' && !item.authenticated));
  console.log(`PASS CONTROLLED release SEO: request-time published sitemap, canonical ID/EN, real lastmod/no invented dates, draft/version/redirect exclusion, post-build publish/removal, empty vs upstream 500/recovery, robots, indexable public/noindex private, titles/descriptions/OG${asset ? ' and cover/OG/default image precedence' : ' (image snapshot unavailable)'}, no preview labels, published-only/no-store/no token. No cloud changes.`);
} finally { server.kill(); }
