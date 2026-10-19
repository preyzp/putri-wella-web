// Read-only optional cloud probe. No preview-secret creation and no content mutations.
import { createRequire } from 'node:module';
import { createClient } from '@sanity/client';
const require = createRequire(import.meta.url);
createRequire(require.resolve('next/package.json'))('@next/env').loadEnvConfig(process.cwd());
if (!process.env.SANITY_API_READ_TOKEN?.trim()) {
  console.log('SKIP CLOUD preview: server read token is not configured. Controlled tests cover the handshake and rendering; no cloud content was changed.');
} else {
  try {
    const { getSanityEnvironment } = require('../node_modules/.cache/putri-sanity-check/env.js');
    const environment = getSanityEnvironment();
    if (!environment.configured) throw new Error();
    const client = createClient({ ...environment.value, token: process.env.SANITY_API_READ_TOKEN, perspective: 'drafts', useCdn: false, stega: false, timeout: 10000, maxRetries: 0 });
    const count = await client.fetch('count(*[_type == "post"])', {}, { cache: 'no-store', perspective: 'drafts' });
    console.log(JSON.stringify({ cloudReadOnly: 'PASS', authenticatedDraftPerspectiveQuery: true, availableArticleCount: count, studioHandshake: 'not exercised: would create temporary preview secret', contentMutations: false }));
  } catch { console.error('CLOUD preview read unavailable. Check server token/configuration; details intentionally omitted.'); process.exitCode = 1; }
}
