import { readSettings } from '@/sanity/settings';
import { siteName, siteDescription } from '@/lib/site-settings';
import type { Metadata } from 'next';
import { ArticleReading } from '@/components/article-reading';
import { notFound, permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { readPost } from '@/sanity/blog';
import { fetchPublished } from '@/sanity/client';
import { blogCopy, postHref } from '@/lib/blog';
import { BlogState } from '@/components/blog-state';
import { PostCard } from '@/components/post-card';
import { PublicShell } from '@/components/public-shell';
import { isLocale } from '@/lib/dictionaries';
import { seoImage } from '@/lib/seo-image';
import { siteOrigin } from '@/lib/site-metadata';

type Props = { params: Promise<{ locale: string; slug: string }> };
// Only root locales are prerendered; article slugs are resolved on every request.
export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  try {
    const [post, settings] = await Promise.all([readPost(slug), readSettings()]);
    if (!post) return { title: 'Tulisan tidak ditemukan', robots: { index: false, follow: false } };
    const title = post.seo?.title?.trim() || `${post.title} — ${siteName(settings)}`;
    const description = post.seo?.description?.trim() || post.excerpt || siteDescription(settings, 'id');
    const image = seoImage(post.cover) || seoImage(post.seo?.ogImage) || seoImage(settings?.defaultSeo?.id?.ogImage);
    return { metadataBase: siteOrigin(), title, description, robots: { index: true, follow: true }, alternates: { canonical: postHref(post) }, openGraph: { type: 'article', url: postHref(post), title, description, siteName: siteName(settings), locale: post.language === 'en' ? 'en_US' : 'id_ID', ...(post.publishedAt && Number.isFinite(Date.parse(post.publishedAt)) ? { publishedTime: post.publishedAt } : {}), images: image ? [image] : [] } };
  } catch { return { title: 'Tulisan belum dapat dimuat', robots: { index: false, follow: false } }; }
}
async function ArticleContent({ params }: Props) {
  await connection();
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  let post;
  try { post = await readPost(slug); }
  catch { return <PublicShell locale={locale} title="Tulisan" blog><BlogState locale={locale} state="error" retryPath={`/${locale}/tulisan/${encodeURIComponent(slug)}`} /></PublicShell>; }
  if (!post) notFound();
  if (locale === 'en') permanentRedirect(postHref(post));
  let related = post.relatedPosts.filter(item => item._id !== post._id).slice(0, 2);
  let relatedFailed = false;
  if (!related.length) {
    try { related = await fetchPublished('related', { id: post._id, categoryIds: post.categories.map(category => category._id) }); }
    catch { relatedFailed = true; }
  }
  return <PublicShell locale="id" title={post.title} blog>

    <ArticleReading post={post} />
    <section className="related-section" aria-labelledby="related-title"><h2 id="related-title">Tulisan terkait</h2>{relatedFailed ? <BlogState locale="id" state="error" retryPath={postHref(post)} /> : related.length ? <div className="article-grid">{related.map(item => <PostCard key={item._id} post={item} locale="id" />)}</div> : <p className="sample-notice">{blogCopy.id.noRelated}</p>}</section>
  </PublicShell>;
}

export default function ArticlePage(props: Props) {
  return <Suspense fallback={<main className="container public-page"><h1>Tulisan</h1><BlogState locale="id" state="loading" /></main>}><ArticleContent {...props} /></Suspense>;
}
