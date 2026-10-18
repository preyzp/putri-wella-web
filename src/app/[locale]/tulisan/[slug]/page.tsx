import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { ArticleBody, EditorialImage } from '@/components/article-body';
import { CopyLink } from '@/components/copy-link';
import { PostCard } from '@/components/post-card';
import { PublicShell } from '@/components/public-shell';
import { getPost, postHref, samplePosts } from '@/fixtures/posts';
import { dictionaries, isLocale } from '@/lib/dictionaries';

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return samplePosts.flatMap(post => ['id', 'en'].map(locale => ({ locale, slug: post.id }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? `${post.title} — Konten contoh` : 'Tulisan tidak ditemukan', description: post?.excerpt };
}
export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getPost(slug);
  if (!post) notFound();
  if (locale !== post.language) permanentRedirect(postHref(post));
  const t = dictionaries.id;
  const related = samplePosts.filter(item => item.id !== post.id).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 2);
  return <PublicShell locale="id" title={post.title}>
    {/* Relative to the current origin until the real production domain is supplied. */}
    <link rel="canonical" href={postHref(post)} />
    <article className="reading-column" lang={post.language} aria-label={post.title}>
      <p className="sample-notice">Konten dan tanggal contoh — bukan naskah, pandangan, atau tanggal publikasi Putri.</p>
      <p className="article-meta">{t[post.category]} · {t[post.format]} · Bahasa Indonesia · <time dateTime={post.date}>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${post.date}T00:00:00Z`))}</time> (contoh)</p>
      <p className="article-summary">{post.excerpt}</p>
      {post.cover && <EditorialImage image={post.cover} />}
      <ArticleBody blocks={post.body} />
      <CopyLink path={postHref(post)} />
      <Link className="text-link" href="/id/tulisan">Kembali ke semua tulisan</Link>
    </article>
    <section className="related-section" aria-labelledby="related-title"><h2 id="related-title">Tulisan terkait</h2><div className="article-grid">{related.map(item => <PostCard key={item.id} post={item} locale="id" />)}</div></section>
  </PublicShell>;
}
