import Link from 'next/link';
import type { PublicPostSummary } from '@/sanity/types';
import type { Locale } from '@/lib/dictionaries';
import { blogCopy, categoryLabel, formatLabel, postDate, postHref } from '@/lib/blog';

export function PostCard({ post, locale }: { post: PublicPostSummary; locale: Locale }) {
  const date = postDate(post.publishedAt, locale);
  return <article className="article-item">
    <p className="eyebrow">{post.categories.map(category => categoryLabel(category, locale)).join(' · ')}</p>
    <h3 lang={post.language}><Link href={postHref(post)} prefetch={false}>{post.title}</Link></h3>
    <p lang={post.language} className={`excerpt ${post.format === 'poem' ? 'poem' : ''}`}>{post.excerpt}</p>
    <p className="meta">{formatLabel(post.format, locale)} · {blogCopy[locale].languages[post.language]}{date && <> · <time dateTime={post.publishedAt}>{date}</time></>}</p>
  </article>;
}
