import { readSettings } from '@/sanity/settings';
import { siteName, siteIntroduction } from '@/lib/site-settings';
import { pageMetadata } from '@/lib/site-metadata';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { HomeWriting } from '@/components/home-writing';
import { BlogState } from '@/components/blog-state';
import { SiteHeader } from '@/components/site-header';
import { dictionaries, isLocale } from '@/lib/dictionaries';
export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { return pageMetadata(params, ''); }
async function HomeContent({ params }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const t = dictionaries[locale];
    const settings = await readSettings();
    return <>
  <a className="skip-link" href="#main">{t.skip}</a><SiteHeader locale={locale} t={t} siteName={siteName(settings)}/>
  <main id="main" className="container" tabIndex={-1}>
   <section className="intro" aria-labelledby="intro-title"><p className="eyebrow">{t.eyebrow}</p><h1 id="intro-title">{t.title}</h1><div className="intro-bottom"><p>{siteIntroduction(settings, locale)}</p><a className="text-link" href="#tulisan">{t.explore}<span aria-hidden="true">↓</span></a></div></section>
   <Suspense fallback={<BlogState locale={locale} state="loading" />}><HomeWriting locale={locale} /></Suspense>
  </main><footer className="container site-footer"><div><p className="footer-name">{siteName(settings)}</p><p>{t.footer}</p></div></footer>
 </>;
}

export default function Home(props: { params: Promise<{ locale: string }> }) { return <Suspense><HomeContent {...props} /></Suspense>; }
