import { blogCopy } from '@/lib/blog';
import type { Locale } from '@/lib/dictionaries';

export function BlogState({ locale, state, retryPath }: { locale: Locale; state: 'empty' | 'error' | 'loading'; retryPath?: string }) {
  const t = blogCopy[locale];
  return <div className="empty-state" data-blog-state={state} role={state === 'error' ? 'alert' : 'status'}>
    <p>{t[state]}</p>
    {state === 'error' && retryPath && <form action={retryPath} method="get"><button className="action-button" type="submit">{t.retry}</button></form>}
  </div>;
}
