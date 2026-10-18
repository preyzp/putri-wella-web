import Image from 'next/image';
import Link from 'next/link';
import type { PublicPostSummary } from '@/sanity/types';
import type { Locale } from '@/lib/dictionaries';
import { blogCopy, categoryLabel, formatLabel, postDate, postHref } from '@/lib/blog';
import { croppedImageSource } from '@/sanity/cropped-image';

export function HomeLatestPost({ post, locale }: { post: PublicPostSummary; locale: Locale }) {
  const date = postDate(post.publishedAt, locale);
  const src = post.cover ? croppedImageSource(post.cover, 960, 600) : null;
  const titleId = `latest-${post._id}`;
  return <article className="article-item home-latest-item">
    <p className="eyebrow">{post.categories.map(category => categoryLabel(category, locale)).join(' · ')}</p>
    <Link className="home-latest-link" href={postHref(post)} prefetch={false} aria-labelledby={titleId}>
      <span className="home-latest-cover" aria-hidden="true">
        {src && <Image src={src} alt="" fill sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 96px) / 2), (max-width: 1199px) calc((100vw - 176px) / 3), 342px" />}
      </span>
      <h3 id={titleId} lang={post.language}>{post.title}</h3>
    </Link>
    {post.excerpt?.trim() && <p lang={post.language} className={`excerpt ${post.format === 'poem' ? 'poem' : ''}`}>{post.excerpt}</p>}
    <p className="meta">{formatLabel(post.format, locale)} · {blogCopy[locale].languages[post.language]}{date && <> · <time dateTime={post.publishedAt}>{date}</time></>}</p>
  </article>;
}
