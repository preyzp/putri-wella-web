import { pageMetadata } from '@/lib/site-metadata';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { PublicShell } from '@/components/public-shell';
import { WritingList } from '@/components/writing-list';
import { dictionaries, isLocale, type Locale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';
import { blogCopy } from '@/lib/blog';
import { fetchPublished } from '@/sanity/client';
import { BlogState } from '@/components/blog-state';
import type { QueryResults } from '@/sanity/queries';

async function PublishedWriting({ locale }: { locale: Locale }) {
  await connection();
  let data: [QueryResults['posts'], QueryResults['categories']];
  try {
    data = await Promise.all([fetchPublished('posts', {}), fetchPublished('categories', {})]);
  } catch { return <BlogState locale={locale} state="error" retryPath={`/${locale}/tulisan`} />; }
  return <WritingList posts={data[0]} categories={data[1]} locale={locale} />;
}

export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMetadata(params, '/tulisan', 'Tulisan', 'Tulisan yang diterbitkan dalam bahasa naskah aslinya. Preview rancangan website Putri Wella Sibarani.'); }
export default async function WritingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PublicShell locale={locale} title={dictionaries[locale].writing} intro={publicCopy[locale].listingIntro} blog>
    <p className="sample-notice">{blogCopy[locale].original}</p>
    <Suspense fallback={<BlogState locale={locale} state="loading" />}><PublishedWriting locale={locale} /></Suspense>
  </PublicShell>;
}
