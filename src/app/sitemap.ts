import type { MetadataRoute } from 'next';
import { connection } from 'next/server';
import { fetchPublished } from '@/sanity/client';
import { siteOrigin } from '@/lib/site-metadata';
import type { QueryResults } from '@/sanity/queries';

function latest(values: (string | null | undefined)[]): Date | undefined {
  const timestamps = values.filter((value): value is string => !!value).map(Date.parse).filter(Number.isFinite);
  return timestamps.length ? new Date(Math.max(...timestamps)) : undefined;
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  let data: QueryResults['sitemap'];
  try { data = await fetchPublished('sitemap', {}); }
  catch { throw new Error('Sitemap unavailable: published content could not be loaded.'); }
  const origin = siteOrigin();
  const settings = [data.settings];
  const writing = [...data.posts.map(post => post.updatedAt || post.publishedAt), ...data.categories];
  const pages = [
    { path: '', dates: [...settings, ...writing] },
    { path: '/tulisan', dates: [...settings, ...writing] },
    { path: '/tentang', dates: [...settings, ...data.about] },
    { path: '/aktivitas', dates: [...settings, ...data.activities] },
    { path: '/kontak', dates: settings },
  ];
  return [
    ...['id', 'en'].flatMap(locale => pages.map(page => ({ url: new URL(`/${locale}${page.path}`, origin).href, lastModified: latest(page.dates) }))),
    ...data.posts.map(post => ({ url: new URL(`/id/tulisan/${encodeURIComponent(post.slug)}`, origin).href, lastModified: latest([post.updatedAt || post.publishedAt]) })),
  ];
}
