import Link from 'next/link';
import { SanityImage, SanityPortableText } from '@/sanity/portable-text';
import type { PublicPost } from '@/sanity/types';
import { blogCopy, categoryLabel, formatLabel, postDate, postHref } from '@/lib/blog';
import { CopyLink } from './copy-link';

export function ArticleReading({ post, preview = false }: { post: PublicPost; preview?: boolean }) {
  const date = postDate(post.publishedAt, 'id');
  return <article className="reading-column" lang={post.language} aria-label={post.title}>
    <p className="article-meta">{post.categories.map(category => categoryLabel(category, 'id')).join(' · ')} · {formatLabel(post.format, 'id')} · {blogCopy.id.languages[post.language]}{date && <> · <time dateTime={post.publishedAt}>{date}</time></>}</p>
    {post.excerpt && <p className="article-summary">{post.excerpt}</p>}
    {post.cover && <SanityImage value={post.cover} />}
    <SanityPortableText value={post.body || []} />
    {!preview && <CopyLink path={postHref(post)} />}
    <Link className="text-link" href="/id/tulisan" prefetch={false}>Kembali ke semua tulisan</Link>
  </article>;
}
