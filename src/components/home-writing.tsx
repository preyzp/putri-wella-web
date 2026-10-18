import Link from 'next/link';
import { connection } from 'next/server';
import { fetchPublished } from '@/sanity/client';
import type { QueryResults } from '@/sanity/queries';
import { blogCopy, categoryLabel, formatLabel, postHref } from '@/lib/blog';
import { dictionaries, type Locale } from '@/lib/dictionaries';
import { BlogState } from './blog-state';
import { HomeLatestPost } from './home-latest-post';

export async function HomeWriting({ locale }: { locale: Locale }) {
  await connection();
  let data: QueryResults['home'];
  try { data = await fetchPublished('home', {}); }
  catch { return <section id="tulisan" className="latest-section"><BlogState locale={locale} state="error" retryPath={`/${locale}`} /></section>; }
  const t = dictionaries[locale];
  const featured = data.featured || data.latest[0];
  return <>
    <section id="tulisan" aria-labelledby="featured-title"><div className="section-heading"><h2 id="featured-title">{t.featured}</h2><span className="section-number" aria-hidden="true">01 /</span></div><p className="sample-notice">{blogCopy[locale].original}</p>
      {featured ? <article className="featured"><div><p className="eyebrow">{featured.categories.map(category => categoryLabel(category, locale)).join(' · ')}</p><p className="meta">{formatLabel(featured.format, locale)} · {blogCopy[locale].languages[featured.language]}</p></div><div><h3 lang={featured.language}><Link href={postHref(featured)} prefetch={false}>{featured.title}</Link></h3>{featured.excerpt && <p lang={featured.language} className="excerpt">{featured.excerpt}</p>}</div></article> : <BlogState locale={locale} state="empty" />}
    </section>
    <section className="latest-section" aria-labelledby="latest-title"><div className="section-heading"><h2 id="latest-title">{t.latest}</h2><span className="section-number" aria-hidden="true">02 /</span></div>
      {data.latest.length ? <div className="article-grid">{data.latest.map(post => <HomeLatestPost key={post._id} post={post} locale={locale} />)}</div> : <BlogState locale={locale} state="empty" />}
      <Link className="text-link all-writing-link" href={`/${locale}/tulisan`} prefetch={false}>{t.explore} <span aria-hidden="true">→</span></Link>
    </section>
  </>;
}
