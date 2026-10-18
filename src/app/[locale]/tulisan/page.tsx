import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/public-shell';
import { WritingList } from '@/components/writing-list';
import { samplePosts } from '@/fixtures/posts';
import { dictionaries, isLocale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';

export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export default async function WritingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PublicShell locale={locale} title={dictionaries[locale].writing} intro={publicCopy[locale].listingIntro}>
    <p className="sample-notice">{dictionaries[locale].note}</p>
    <WritingList posts={samplePosts} locale={locale} />
  </PublicShell>;
}
