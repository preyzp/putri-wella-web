import 'server-only';
import { createClient } from '@sanity/client';
import { getSanityEnvironment } from './env';
import { queries, type QueryParameters, type QueryResults } from './queries';

export function getPublicSanityClient() {
  const environment = getSanityEnvironment();
  if (!environment.configured) throw new Error('Sanity belum dikonfigurasi. Isi identifier publik di .env.local sesuai SANITY_SETUP.md.');
  return createClient({ ...environment.value, perspective: 'published', useCdn: false, stega: false, timeout: 10000, maxRetries: 1 });
}

export function fetchPublished<Key extends keyof QueryResults>(key: Key, params: QueryParameters[Key]): Promise<QueryResults[Key]> {
  // No token, no preview, no shared cache or revalidation integration at this stage.
  return getPublicSanityClient().fetch<QueryResults[Key]>(queries[key], params, { cache: 'no-store', perspective: 'published' });
}
