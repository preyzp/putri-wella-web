// Optional read-only inventory. Reports counts/flags only; never logs content or SDK errors.
import { createRequire } from 'node:module';
import { createClient } from '@sanity/client';
const require = createRequire(import.meta.url);
createRequire(require.resolve('next/package.json'))('@next/env').loadEnvConfig(process.cwd());
try {
  const { queries } = require('../node_modules/.cache/putri-sanity-check/queries.js');
  const { getSanityEnvironment } = require('../node_modules/.cache/putri-sanity-check/env.js');
  const environment = getSanityEnvironment(); if (!environment.configured) throw new Error();
  const client = createClient({ ...environment.value, useCdn: false, perspective: 'published', stega: false, timeout: 10000, maxRetries: 0 });
  const keys = ['sitemap', 'posts', 'settings', 'profile', 'activities', 'experiences', 'education', 'organizations', 'recognition'];
  const values = await Promise.all(keys.map(key => client.fetch(queries[key], {}, { cache: 'no-store', perspective: 'published' })));
  const [index, posts, settings, profile, activities, experiences, education, organizations, recognition] = values;
  if (index.posts.length !== posts.length) throw new Error();
  const report = { cloudReadOnly: 'PASS', sitemapPublishedPosts: index.posts.length, articleActualUpdatedDates: index.posts.filter(post => !!post.updatedAt).length, articleTitlesOrExcerptsNeedingEditorialReview: posts.filter(post => /\b(dummy|contoh|test|tes)\b/i.test(`${post.title} ${post.excerpt || ''}`)).length, settingsPublished: !!settings, defaultOgImageConfigured: !!settings?.defaultSeo?.id?.ogImage?.asset, profilePublished: !!profile, portraitConfigured: !!profile?.portrait?.asset, skills: profile?.skills?.length || 0, activities: activities.length, experiences: experiences.length, education: education.length, organizations: organizations.length, recognition: recognition.length, tokenUsed: false, mutations: false };
  console.log(JSON.stringify(report));
} catch { console.error('Cloud release inventory unavailable; verify configuration/access. No private error details logged.'); process.exitCode = 1; }
