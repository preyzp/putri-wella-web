import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/public-shell';
import { profileSections } from '@/fixtures/pages';
import { isLocale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';

export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = publicCopy[locale];
  return <PublicShell locale={locale} title={t.about} intro={t.aboutIntro}>
    <div className="about-layout"><div className="portrait-placeholder"><p>{t.photo}</p></div>
      <div className="profile-sections">{profileSections.map((key, index) => <section key={key} aria-labelledby={`profile-${key}`}><h2 id={`profile-${key}`}>{t.profileSections[index]}</h2><p className="excerpt">{t.placeholder}</p></section>)}</div>
    </div>
  </PublicShell>;
}
