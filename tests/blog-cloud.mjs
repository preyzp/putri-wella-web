// Read-only verification against the user's configured public dataset. No tokens or mutations.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { createClient } from '@sanity/client';
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve('next/package.json'));
nextRequire('@next/env').loadEnvConfig(process.cwd());
try {
  const { queries } = require('../node_modules/.cache/putri-sanity-check/queries.js');
  const { getSanityEnvironment } = require('../node_modules/.cache/putri-sanity-check/env.js');
  const environment = getSanityEnvironment();
  assert(environment.configured, 'Sanity configuration is required');
  const client = createClient({ ...environment.value, useCdn: false, perspective: 'published', stega: false, timeout: 10000, maxRetries: 0 });
  const [posts, categories, home] = await Promise.all(['posts', 'categories', 'home'].map(key => client.fetch(queries[key], {}, { cache: 'no-store' })));
  assert(posts.length > 0, 'No published article available for cloud verification');
  assert(posts.every(post => !post._id.startsWith('drafts.') && !post._id.startsWith('versions.')));
  const post = await client.fetch(queries.post, { slug: posts[0].slug }, { cache: 'no-store' });
  assert(post && home.latest.some(item => item._id === post._id));
  assert.equal(await client.fetch(queries.postRoute, { slug: 'local-verification-missing-slug-71f3d6' }, { cache: 'no-store' }), null);
  const images = [post.cover, ...post.body.filter(block => block._type === 'editorialImage')].filter(Boolean);
  const imageChecks = [];
  for (const image of images) {
    assert(image.asset?.url && image.alt?.trim(), 'Referenced images should have an asset and alt text');
    const response = await fetch(image.asset.url, { method: 'HEAD' });
    assert.equal(response.status, 200);
    imageChecks.push({ alt: !!image.alt, caption: !!image.caption, accessible: true });
  }
  await mkdir('node_modules/.cache/putri-sanity-check', { recursive: true });
  await writeFile('node_modules/.cache/putri-sanity-check/cloud.json', JSON.stringify({ post, categories }));
  console.log(JSON.stringify({ cloudReadOnly: 'PASS', publishedPosts: posts.length, publishedCategories: categories.length, cover: !!post.cover, bodyImages: post.body.filter(block => block._type === 'editorialImage').length, imageChecks, missingSlug: 'null', tokenUsed: false }));
} catch (error) {
  // Never print SDK error URLs, environment values, or raw response bodies.
  console.error('Cloud verification failed or unavailable.', error instanceof assert.AssertionError ? error.message : `HTTP status: ${error.statusCode || 'unavailable'}`);
  process.exitCode = 1;
}
