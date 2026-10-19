"use client";
import { useState } from 'react';
import type { PublicCategory, PublicPostSummary } from '@/sanity/types';
import type { Locale } from '@/lib/dictionaries';
import { categoryLabel, formatLabel, postFormats } from '@/lib/blog';
import { publicCopy } from '@/lib/public-copy';
import { HomeLatestPost } from './home-latest-post';
import { BlogState } from './blog-state';
import { NativeSelect } from './native-select';

export function WritingList({ posts, categories, locale }: { posts: PublicPostSummary[]; categories: PublicCategory[]; locale: Locale }) {
  const [category, setCategory] = useState('all');
  const [format, setFormat] = useState('all');
  const copy = publicCopy[locale];
  const filtered = posts.filter(post => (category === 'all' || post.categories.some(item => item._id === category)) && (format === 'all' || post.format === format));
  if (!posts.length) return <BlogState locale={locale} state="empty" />;
  return <>
    <div className="filters">
      <label>{copy.category}<NativeSelect value={category} onChange={event => setCategory(event.target.value)}><option value="all">{copy.all}</option>{categories.map(item => <option key={item._id} value={item._id}>{categoryLabel(item, locale)}</option>)}</NativeSelect></label>
      <label>{copy.format}<NativeSelect value={format} onChange={event => setFormat(event.target.value)}><option value="all">{copy.all}</option>{postFormats.map(key => <option key={key} value={key}>{formatLabel(key, locale)}</option>)}</NativeSelect></label>
      <button className="action-button" type="button" onClick={() => { setCategory('all'); setFormat('all'); }}>{copy.reset}</button>
    </div>
    <p className="meta" role="status">{copy.results}: {filtered.length}</p>
    {filtered.length ? <div className="article-grid">{filtered.map(post => <HomeLatestPost key={post._id} post={post} locale={locale} />)}</div> : <div className="empty-state" data-blog-state="filtered-empty"><p>{copy.empty}</p></div>}
  </>;
}
