import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/public-shell';
import { activities } from '@/fixtures/pages';
import { dictionaries, isLocale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';

export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export default async function ActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = publicCopy[locale];
  return <PublicShell locale={locale} title={t.activities} intro={t.activitiesIntro}>
    <div className="gallery">{activities.map(item => <figure key={item.id}><Image src={item.src} alt={item.alt[locale]} width={1200} height={750} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" /><figcaption><span className="sample-label">{dictionaries[locale].sample}</span><p>{item.caption[locale]}</p></figcaption></figure>)}</div>
  </PublicShell>;
}
