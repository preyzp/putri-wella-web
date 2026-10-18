import Link from 'next/link';
import { postHref, type SamplePost } from '@/fixtures/posts';
import { dictionaries, type Locale } from '@/lib/dictionaries';

export function PostCard({ post, locale }: { post: SamplePost; locale: Locale }) {
  const t = dictionaries[locale];
  return <article className="article-item">
    <p className="eyebrow">{t[post.category]}</p>
    <h3 lang={post.language}><Link href={postHref(post)}>{post.title}</Link></h3>
    <p lang={post.language} className={`excerpt ${post.format === 'poem' ? 'poem' : ''}`}>{post.excerpt}</p>
    <p className="meta">{t[post.format]} · {t.original}</p>
    <span className="sample-label">{t.sample}</span>
  </article>;
}
