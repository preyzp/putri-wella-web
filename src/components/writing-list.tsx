"use client";
import { useState } from 'react';
import { categories, formats, type SamplePost } from '@/fixtures/posts';
import { dictionaries, type Locale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';
import { PostCard } from './post-card';

export function WritingList({ posts, locale }: { posts: SamplePost[]; locale: Locale }) {
  const [category, setCategory] = useState('all');
  const [format, setFormat] = useState('all');
  const t = dictionaries[locale];
  const copy = publicCopy[locale];
  const filtered = posts.filter(post => (category === 'all' || post.category === category) && (format === 'all' || post.format === format));
  return <>
    <div className="filters">
      <label>{copy.category}<select value={category} onChange={event => setCategory(event.target.value)}><option value="all">{copy.all}</option>{categories.map(key => <option key={key} value={key}>{t[key]}</option>)}</select></label>
      <label>{copy.format}<select value={format} onChange={event => setFormat(event.target.value)}><option value="all">{copy.all}</option>{formats.map(key => <option key={key} value={key}>{t[key]}</option>)}</select></label>
      <button className="action-button" type="button" onClick={() => { setCategory('all'); setFormat('all'); }}>{copy.reset}</button>
    </div>
    <p className="meta" role="status">{copy.results}: {filtered.length}</p>
    {filtered.length ? <div className="article-grid">{filtered.map(post => <PostCard key={post.id} post={post} locale={locale} />)}</div> : <div className="empty-state"><p>{copy.empty}</p></div>}
  </>;
}
