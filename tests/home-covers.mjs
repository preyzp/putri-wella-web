// Local response fixtures only; no Sanity mutations or uploads.
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const { post } = JSON.parse(await readFile('node_modules/.cache/putri-sanity-check/cloud.json', 'utf8'));
const asset = post.cover?.asset;
assert(asset, 'Run sanity-local.mjs and blog-cloud.mjs first with a published article cover');
const directory = await mkdtemp(join(tmpdir(), 'putri-home-covers-'));
const statePath = join(directory, 'state.json');
const documents = [{ _id: asset._id, _type: 'sanity.imageAsset', url: asset.url, metadata: { dimensions: { width: asset.width, height: asset.height } } }];
for (let index = 0; index < 3; index++) documents.push({
  _id: `controlled-cover-${index}`, _type: 'post', slug: { current: `controlled-cover-${index}` },
  title: index === 0 ? 'Judul contoh yang sangat panjang untuk menguji pembungkusan teks editorial pada ukuran layar kecil '.repeat(3) : `Contoh lokal ${index}`,
  language: 'id', format: 'essay', excerpt: 'Ringkasan contoh pengujian lokal.', publishedAt: `2026-10-0${3 - index}T00:00:00Z`, categories: [],
  cover: index === 1 ? null : { _type: 'editorialImage', alt: 'Cover contoh lokal', asset: { _ref: asset._id }, crop: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 }, hotspot: { x: 0.6, y: 0.4, width: 0.1, height: 0.1 } },
});
await writeFile(statePath, JSON.stringify({ mode: 'populated', documents }));
const preload = new URL('./helpers/sanity-fetch-preload.mjs', import.meta.url).href;
const child = spawn(process.execPath, ['tests/public-pages.mjs'], { stdio: 'inherit', env: { ...process.env, CHECK_ONLY: 'home-covers', HOME_COVERS_CONTROLLED: '1', NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${preload}`.trim(), SANITY_TEST_STATE_FILE: statePath } });
assert.equal(await new Promise(resolve => child.on('exit', resolve)), 0);
