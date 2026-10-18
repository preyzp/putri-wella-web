import { readSettings } from '@/sanity/settings';
import { siteName, siteDescription } from '@/lib/site-settings';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { SanityImage, SanityPortableText } from '@/sanity/portable-text';
import { readPost } from '@/sanity/blog';
import { fetchPublished } from '@/sanity/client';
import { blogCopy, categoryLabel, formatLabel, postDate, postHref } from '@/lib/blog';
import { BlogState } from '@/components/blog-state';
import { CopyLink } from '@/components/copy-link';
import { PostCard } from '@/components/post-card';
import { PublicShell } from '@/components/public-shell';
import { isLocale } from '@/lib/dictionaries';

type Props = { params: Promise<{ locale: string; slug: string }> };
// Only root locales are prerendered; article slugs are resolved on every request.
export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  try {
    const [post, settings] = await Promise.all([readPost(slug), readSettings()]);
    return { title: post ? `${post.title} — ${siteName(settings)}` : 'Tulisan tidak ditemukan', description: post?.seo?.description?.trim() || post?.excerpt || siteDescription(settings, 'id'), alternates: post ? { canonical: postHref(post) } : undefined };
  } catch { return { title: 'Tulisan belum dapat dimuat' }; }
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
  const date = postDate(post.publishedAt, 'id');
  return <PublicShell locale="id" title={post.title} blog>

    <article className="reading-column" lang={post.language} aria-label={post.title}>
      <p className="article-meta">{post.categories.map(category => categoryLabel(category, 'id')).join(' · ')} · {formatLabel(post.format, 'id')} · {blogCopy.id.languages[post.language]}{date && <> · <time dateTime={post.publishedAt}>{date}</time></>}</p>
      {post.excerpt && <p className="article-summary">{post.excerpt}</p>}
      {post.cover && <SanityImage value={post.cover} />}
      <SanityPortableText value={post.body || []} />
      <CopyLink path={postHref(post)} />
      <Link className="text-link" href="/id/tulisan" prefetch={false}>Kembali ke semua tulisan</Link>
    </article>
    <section className="related-section" aria-labelledby="related-title"><h2 id="related-title">Tulisan terkait</h2>{relatedFailed ? <BlogState locale="id" state="error" retryPath={postHref(post)} /> : related.length ? <div className="article-grid">{related.map(item => <PostCard key={item._id} post={item} locale="id" />)}</div> : <p className="sample-notice">{blogCopy.id.noRelated}</p>}</section>
  </PublicShell>;
}

export default function ArticlePage(props: Props) {
  return <Suspense fallback={<main className="container public-page"><h1>Tulisan</h1><BlogState locale="id" state="loading" /></main>}><ArticleContent {...props} /></Suspense>;
}
