import { pageMetadata } from '@/lib/site-metadata';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { PublicShell } from '@/components/public-shell';
import { AboutContent } from '@/components/about-content';
import { ContentState } from '@/components/content-state';
import { readAbout } from '@/sanity/about';
import type { PublicAbout } from '@/sanity/types';
import { isLocale, type Locale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';

async function PublishedAbout({ locale }: { locale: Locale }) {
  await connection();
  let data: PublicAbout;
  try { data = await readAbout(); }
  catch { return <ContentState locale={locale} page="about" state="error" retryPath={`/${locale}/tentang`} />; }
  return <AboutContent data={data} locale={locale} />;
}

export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMetadata(params, '/tentang', 'Tentang', 'Profil Putri Wella Sibarani. Preview rancangan website.'); }
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = publicCopy[locale];
  return <PublicShell locale={locale} title={t.about} blog>
    <Suspense fallback={<ContentState locale={locale} page="about" state="loading" />}><PublishedAbout locale={locale} /></Suspense>
  </PublicShell>;
}
