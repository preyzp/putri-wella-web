import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { fetchPublished } from './client';

// React cache only deduplicates within a render/request; no cross-request data cache.
export const readSettings = cache(async () => {
  await connection();
  try { return await fetchPublished('settings', {}); }
  catch {
    console.error('[siteSettings] Published settings unavailable; using public defaults.');
    return null;
  }
});
