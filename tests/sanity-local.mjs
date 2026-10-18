// Offline checks only. No Sanity account, dataset access, mutation, or generated project identifiers.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const output = join(process.cwd(), 'node_modules/.cache/putri-sanity-check');
const files = ['env.ts', 'links.ts', 'types.ts', 'queries.ts', 'portable-text.tsx', 'schemas/shared.ts', 'schemas/documents.ts', 'schemas/index.ts'];
for (const file of files) {
  const destination = join(output, file.replace(/\.tsx?$/, '.js'));
  await mkdir(join(destination, '..'), { recursive: true });
  const source = await readFile(join('src/sanity', file), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } });
  await writeFile(destination, outputText);
}
await writeFile(join(output, 'package.json'), '{"type":"commonjs"}');
const { createSchema } = await import('sanity');
const { schemaTypes } = require(join(output, 'schemas/index.js'));
const schema = createSchema({ name: 'local-check', types: schemaTypes });
const errors = schema._validation.flatMap(group => group.problems.filter(problem => problem.severity === 'error'));
assert.deepEqual(errors, [], 'Sanity must compile the complete schema without errors');
assert.equal(schemaTypes.filter(type => type.type === 'document').length, 10);
console.log('PASS all 10 document schemas compile');

async function validateField(type, name, value, parent = {}) {
  const field = schema.get(type).fields.find(candidate => candidate.name === name);
  const context = { schema, type: field.type, parent, document: { _id: 'local-validation', _type: type }, path: [name], i18n: { t: key => key }, getClient: () => { throw new Error('Network is forbidden in local validation tests'); } };
  return (await Promise.all(field.type.validation.map(rule => rule.validate(value, context)))).flat();
}
assert((await validateField('post', 'title', undefined)).some(marker => marker.level === 'error'));
assert((await validateField('post', 'title', 'x'.repeat(101))).every(marker => marker.level === 'warning'));
assert((await validateField('post', 'categories', [])).some(marker => marker.level === 'error'));
assert((await validateField('poemStanza', 'text', '')).some(marker => marker.level === 'error'));
assert((await validateField('organization', 'publicUrl', 'http://example.test')).some(marker => marker.level === 'error'));
assert((await validateField('editorialImage', 'alt', '', { asset: { _ref: 'local-image' } })).some(marker => marker.level === 'error'));
assert.equal((await validateField('editorialImage', 'alt', undefined)).length, 0);
console.log('PASS publish validation: required fields, soft title limit, references, HTTPS, poem text, conditional image alt');

const { parseSanityEnvironment, selectContentSource } = require(join(output, 'env.js'));
for (const args of [[undefined, undefined], ['', ''], ['<project-id>', '<dataset>'], ['your-project-id', 'your-dataset']]) {
  const environment = parseSanityEnvironment(...args);
  assert.equal(environment.configured, false);
  assert.equal(selectContentSource(environment, 'development'), 'fixtures');
  for (const mode of ['production', 'test', undefined]) assert.throws(() => selectContentSource(environment, mode), /Fallback fixture hanya/);
}
console.log('PASS absent/placeholder config and development-only fallback');

const sanityRequire = createRequire(require.resolve('sanity/package.json'));
const { parse, evaluate } = sanityRequire('groq-js');
const { queries } = require(join(output, 'queries.js'));
// Synthetic document IDs below belong only to this in-memory test, not to a cloud project.
const privateValue = 'PRIVATE_FIELD_SENTINEL';
const doc = { _type: 'post', title: 'Contoh lokal', slug: { current: 'contoh-lokal' }, language: 'id', format: 'poem', publishedAt: '2026-10-01T00:00:00Z', categories: [{ _ref: 'category-public' }, { _ref: 'drafts.category-hidden' }], relatedPosts: [{ _ref: 'drafts.hidden' }, { _ref: 'versions.local.hidden' }], body: [{ _type: 'poemStanza', _key: 'stanza', text: 'baris satu\nbaris dua', privateField: privateValue }], privateField: privateValue };
const dataset = [
  { ...doc, _id: 'post-public' }, { ...doc, _id: 'drafts.hidden' }, { ...doc, _id: 'versions.local.hidden' },
  { _type: 'category', _id: 'category-public', title: { id: 'Sastra', en: 'Literature' }, slug: { current: 'sastra' } },
  { _type: 'category', _id: 'drafts.category-hidden', title: { id: 'Rahasia', en: 'Hidden' } },
  { _type: 'siteSettings', _id: 'siteSettings', featuredPosts: [{ _ref: 'post-public' }, { _ref: 'drafts.hidden' }], privateField: privateValue },
  { _type: 'newsletterIssue', _id: 'editorial-only', title: privateValue },
];
const results = {};
for (const [key, query] of Object.entries(queries)) {
  const parsed = parse(query);
  results[key] = await (await evaluate(parsed, { dataset, params: { slug: 'contoh-lokal' } })).get();
  assert(!JSON.stringify(results[key]).includes(privateValue), `${key}: unprojected fields must stay private`);
}
assert.deepEqual(results.posts.map(post => post._id), ['post-public']);
assert.deepEqual(results.post.categories.map(category => category._id), ['category-public']);
assert.deepEqual(results.post.relatedPosts, []);
assert.equal(results.post.body[0].text, 'baris satu\nbaris dua');
assert.equal(results.settings.featuredPosts.length, 1);
assert.equal(await (await evaluate(parse(queries.post), { dataset, params: { slug: 'missing' } })).get(), null);
console.log('PASS every GROQ query parses, draft/version references excluded, explicit projections, missing detail null');

const { SanityPortableText } = require(join(output, 'portable-text.js'));
const { safeHref } = require(join(output, 'links.js'));
for (const url of ['javascript:alert(1)', 'data:text/html,hello', '//untrusted.test', '/\\untrusted.test', 'java\nscript:alert(1)']) assert.equal(safeHref(url), null);
for (const url of ['/id/tulisan', '#bait', 'https://www.sanity.io/docs']) assert.equal(safeHref(url), url);
const html = renderToStaticMarkup(createElement(SanityPortableText, { value: [
  { _type: 'poemStanza', _key: 'one', text: 'baris satu\nbaris dua' },
  { _type: 'poemStanza', _key: 'two', text: 'bait berikutnya <script>alert(1)</script>' },
  { _type: 'block', _key: 'link', style: 'normal', markDefs: [{ _type: 'link', _key: 'unsafe', href: 'javascript:alert(1)' }], children: [{ _type: 'span', _key: 'span', text: 'Tautan berbahaya', marks: ['unsafe'] }] },
  { _type: 'editorialImage', _key: 'missing', alt: 'Gambar contoh', caption: 'Caption contoh', credit: null, asset: null },
] }));
assert.equal((html.match(/class="poem"/g) || []).length, 2);
assert(html.includes('baris satu\nbaris dua'));
assert(!html.includes('<script>'));
assert(!html.includes('href="javascript:'));
assert(html.includes('Gambar belum tersedia.'));
console.log('PASS Portable Text poem lines/stanzas, escaped text, unsafe link blocked, unresolved image');
