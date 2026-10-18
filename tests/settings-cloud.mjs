// Read-only public settings verification. Do not log content, identifiers or SDK errors.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createClient } from '@sanity/client';
const require = createRequire(import.meta.url);
createRequire(require.resolve('next/package.json'))('@next/env').loadEnvConfig(process.cwd());
try {
  const { queries } = require('../node_modules/.cache/putri-sanity-check/queries.js');
  const { getSanityEnvironment } = require('../node_modules/.cache/putri-sanity-check/env.js');
  const environment = getSanityEnvironment(); assert(environment.configured);
  const client = createClient({ ...environment.value, useCdn: false, perspective: 'published', stega: false, timeout: 10000, maxRetries: 0 });
  const [settings, home] = await Promise.all(['settings', 'home'].map(key => client.fetch(queries[key], {}, { cache: 'no-store' })));
  assert(!home.featured || (!home.featured._id.startsWith('drafts.') && !home.featured._id.startsWith('versions.')));
  console.log(JSON.stringify({ cloudReadOnly: 'PASS', settingsPublished: !!settings, siteName: !!settings?.siteName?.trim(), introductionID: !!settings?.introduction?.id?.trim(), introductionEN: !!settings?.introduction?.en?.trim(), seoDescriptionID: !!settings?.defaultSeo?.id?.description?.trim(), seoDescriptionEN: !!settings?.defaultSeo?.en?.description?.trim(), publicEmail: !!settings?.publicEmail, linkedInUrl: !!settings?.linkedInUrl, instagramUrl: !!settings?.instagramUrl, validFeaturedReferences: settings?.featuredPosts?.length || 0, latestPosts: home.latest.length, tokenUsed: false }));
} catch { console.error('Public settings cloud verification unavailable (no environment or upstream details logged).'); process.exitCode = 1; }
