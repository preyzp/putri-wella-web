import 'server-only';
import { draftMode } from 'next/headers';
import { createClient } from '@sanity/client';
import { getSanityEnvironment } from './env';
import { previewPostQuery } from './preview-query';
import type { PublicPost } from './types';

export function previewConfigured() {
  const token = process.env.SANITY_API_READ_TOKEN?.trim();
  return getSanityEnvironment().configured && !!token && !/placeholder|replace|your[-_]|<|>/i.test(token);
}
export function previewClient() {
  const environment = getSanityEnvironment();
  if (!environment.configured || !previewConfigured()) throw new Error('Preview belum dikonfigurasi.');
  return createClient({ ...environment.value, token: process.env.SANITY_API_READ_TOKEN, useCdn: false, perspective: 'drafts', stega: false, timeout: 10000, maxRetries: 0 });
}
export async function readPreviewPost(slug: string): Promise<PublicPost | null> {
  if (!(await draftMode()).isEnabled) throw new Error('Preview memerlukan sesi tervalidasi.');
  const post = await previewClient().fetch<PublicPost | null>(previewPostQuery, { slug }, { perspective: 'drafts', cache: 'no-store' });
  if (!post) return null;
  // Drafts can be incomplete before Studio's publish validation passes.
  return { ...post, title: post.title?.trim() || 'Tulisan tanpa judul', publishedAt: post.publishedAt || '', language: post.language === 'en' ? 'en' : 'id', format: ['article', 'short-note', 'poem'].includes(post.format) ? post.format : 'article', categories: (post.categories || []).filter(Boolean) };
}
