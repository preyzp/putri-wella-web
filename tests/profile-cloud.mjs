// Read-only public profile/activity verification. Never writes data, uploads assets, or uses tokens.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { createClient } from '@sanity/client';
const require = createRequire(import.meta.url);
createRequire(require.resolve('next/package.json'))('@next/env').loadEnvConfig(process.cwd());
try {
  const { queries } = require('../node_modules/.cache/putri-sanity-check/queries.js');
  const { getSanityEnvironment } = require('../node_modules/.cache/putri-sanity-check/env.js');
  const environment = getSanityEnvironment();
  assert(environment.configured, 'Configured public dataset required');
  const client = createClient({ ...environment.value, useCdn: false, perspective: 'published', stega: false, timeout: 10000, maxRetries: 0 });
  const keys = ['profile', 'experiences', 'education', 'organizations', 'recognition', 'activities'];
  const values = await Promise.all(keys.map(key => client.fetch(queries[key], {}, { cache: 'no-store' })));
  const data = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
  const counts = Object.fromEntries(keys.map(key => [key, Array.isArray(data[key]) ? data[key].length : Number(!!data[key])]));
  const images = [data.profile?.portrait, ...data.activities.flatMap(activity => activity.photos || [])].filter(image => image?.asset);
  for (const image of images) assert.equal((await fetch(image.asset.url, { method: 'HEAD' })).status, 200);
  await writeFile('node_modules/.cache/putri-sanity-check/profile-cloud.json', JSON.stringify(data));
  console.log(JSON.stringify({ cloudReadOnly: 'PASS', publishedCounts: counts, assetsAccessible: images.length, tokenUsed: false }));
} catch (error) {
  console.error('Profile cloud verification failed/unavailable.', error instanceof assert.AssertionError ? error.message : `HTTP status: ${error.statusCode || 'unavailable'}`);
  process.exitCode = 1;
}
