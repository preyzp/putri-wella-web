import { Suspense } from 'react';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/public-shell';
import { ActivityContent } from '@/components/activity-content';
import { ContentState } from '@/components/content-state';
import { fetchPublished } from '@/sanity/client';
import type { PublicActivity } from '@/sanity/types';
import { isLocale, type Locale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';

async function PublishedActivities({ locale }: { locale: Locale }) {
  await connection();
  let activities: PublicActivity[];
  try { activities = await fetchPublished('activities', {}); }
  catch { return <ContentState locale={locale} page="activity" state="error" retryPath={`/${locale}/aktivitas`} />; }
  return <ActivityContent activities={activities} locale={locale} />;
}

export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export const metadata = { title: 'Aktivitas — Putri Wella Sibarani', description: 'Galeri aktivitas Putri Wella Sibarani. Preview rancangan website.' };
export default async function ActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = publicCopy[locale];
  return <PublicShell locale={locale} title={t.activities} blog>
    <Suspense fallback={<ContentState locale={locale} page="activity" state="loading" />}><PublishedActivities locale={locale} /></Suspense>
  </PublicShell>;
}
