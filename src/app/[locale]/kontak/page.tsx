import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/public-shell';
import { isLocale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';

export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = publicCopy[locale];
  return <PublicShell locale={locale} title={t.contact} intro={t.contactIntro}>
    <div className="contact-status"><p>{t.contactNote}</p><dl>{t.contactChannels.map(channel => <div key={channel}><dt>{channel}</dt><dd>{t.placeholder}</dd></div>)}</dl></div>
  </PublicShell>;
}
