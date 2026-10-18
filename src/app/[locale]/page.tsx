import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { HomeWriting } from '@/components/home-writing';
import { BlogState } from '@/components/blog-state';
import { SiteHeader } from '@/components/site-header';
import { dictionaries, isLocale } from '@/lib/dictionaries';
export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export const metadata = { title: 'Putri Wella Sibarani — Preview', description: 'Ruang tulisan Putri Wella Sibarani. Preview rancangan website editorial.' };
export default async function Home({ params }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const t = dictionaries[locale];
    return <>
  <a className="skip-link" href="#main">{t.skip}</a><SiteHeader locale={locale} t={t}/>
  <main id="main" className="container" tabIndex={-1}>
   <section className="intro" aria-labelledby="intro-title"><p className="preview-label">○ {t.preview}</p><p className="eyebrow">{t.eyebrow}</p><h1 id="intro-title">{t.title}</h1><div className="intro-bottom"><p>{t.intro}</p><a className="text-link" href="#tulisan">{t.explore}<span aria-hidden="true">↓</span></a></div></section>
   <Suspense fallback={<BlogState locale={locale} state="loading" />}><HomeWriting locale={locale} /></Suspense>
  </main><footer className="container site-footer"><div><p className="footer-name">Putri Wella Sibarani</p><p>{t.footer}</p></div><p className="meta">{t.preview}</p></footer>
 </>;
}
