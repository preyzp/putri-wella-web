import 'server-only';
import { cache } from 'react';
import { fetchPublished } from './client';

// Only deduplicate metadata and render within one server request, never across requests.
export const readPost = cache((slug: string) => fetchPublished('post', { slug }));
