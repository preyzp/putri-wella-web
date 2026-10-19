// Local published responses only. No Sanity content mutations or account access.
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
const directory = await mkdtemp(join(tmpdir(), 'putri-selects-'));
const path = join(directory, 'state.json');
const category = { _id: 'long-category', _type: 'category', title: { id: 'Kategori contoh panjang untuk memastikan pilihan tidak memperlebar kolom filter '.repeat(4), en: 'A long sample category that must stay inside its filter column '.repeat(4) }, slug: { current: 'long-category' } };
const documents = [category, { _id: 'other-category', _type: 'category', title: { id: 'Kategori lain', en: 'Other category' }, slug: { current: 'other-category' } }];
for (const [index, format] of ['article', 'poem', 'short-note'].entries()) documents.push({ _id: `select-post-${index}`, _type: 'post', title: `Contoh lokal ${index}`, slug: { current: `select-post-${index}` }, language: 'id', format, excerpt: 'Contoh pengujian lokal.', publishedAt: '2026-10-01T00:00:00Z', categories: index === 0 ? [{ _ref: category._id }] : [] });
await writeFile(path, JSON.stringify({ mode: 'populated', documents }));
const preload = new URL('./helpers/sanity-fetch-preload.mjs', import.meta.url).href;
const child = spawn(process.execPath, ['tests/public-pages.mjs'], { stdio: 'inherit', env: { ...process.env, CHECK_ONLY: 'selects', SANITY_TEST_STATE_FILE: path, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --import=${preload}`.trim() } });
assert.equal(await new Promise(resolve => child.on('exit', resolve)), 0);
