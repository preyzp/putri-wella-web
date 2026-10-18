import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { dictionaries, isLocale } from '@/lib/dictionaries';
import { samplePosts, postHref } from '@/fixtures/posts';
export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export default async function Home({ params }: {
    params: Promise<{
        locale: string;
    }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale))
        notFound();
    const t = dictionaries[locale];
    const [featured, ...latest] = samplePosts;
    return <>
  <a className="skip-link" href="#main">{t.skip}</a><SiteHeader locale={locale} t={t}/>
  <main id="main" className="container" tabIndex={-1}>
   <section className="intro" aria-labelledby="intro-title"><p className="preview-label">○ {t.preview}</p><p className="eyebrow">{t.eyebrow}</p><h1 id="intro-title">{t.title}</h1><div className="intro-bottom"><p>{t.intro}</p><a className="text-link" href="#tulisan">{t.explore}<span aria-hidden="true">↓</span></a></div></section>
   <section id="tulisan" aria-labelledby="featured-title"><div className="section-heading"><h2 id="featured-title">{t.featured}</h2><span className="section-number" aria-hidden="true">01 /</span></div><p className="sample-notice">{t.note}</p><article className="featured" lang={featured.language}><div><p className="eyebrow">{t[featured.category]}</p><p className="meta">{t[featured.format]} · {t.original}</p><span className="sample-label">{t.sample}</span></div><div><h3><Link href={postHref(featured)}>{featured.title}</Link></h3><p className="excerpt">{featured.excerpt}</p></div></article></section>
   <section className="latest-section" aria-labelledby="latest-title"><div className="section-heading"><h2 id="latest-title">{t.latest}</h2><span className="section-number" aria-hidden="true">02 /</span></div><div className="article-grid">{latest.map(post => <article className="article-item" lang={post.language} key={post.id}><p className="eyebrow">{t[post.category]}</p><h3><Link href={postHref(post)}>{post.title}</Link></h3><p className={`excerpt ${post.format === 'poem' ? 'poem' : ''}`}>{post.excerpt}</p><p className="meta">{t[post.format]} · {t.original}</p><span className="sample-label">{t.sample}</span></article>)}</div><Link className="text-link all-writing-link" href={`/${locale}/tulisan`}>{t.explore} <span aria-hidden="true">→</span></Link></section>
  </main><footer className="container site-footer"><div><p className="footer-name">Putri Wella Sibarani</p><p>{t.footer}</p></div><p className="meta">{t.preview}</p></footer>
 </>;
}
