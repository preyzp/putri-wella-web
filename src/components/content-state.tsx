import type { Locale } from '@/lib/dictionaries';
import { profileCopy } from '@/lib/profile-content';

export function ContentState({ locale, state, page, retryPath }: { locale: Locale; state: 'empty' | 'loading' | 'error'; page: 'about' | 'activity'; retryPath?: string }) {
  const copy = profileCopy[locale];
  return <div className="empty-state" data-content-state={state} role={state === 'error' ? 'alert' : 'status'}>
    <p>{state === 'empty' ? page === 'about' ? copy.aboutEmpty : copy.activityEmpty : copy[state]}</p>
    {state === 'error' && retryPath && <form action={retryPath} method="get"><button className="action-button" type="submit">{copy.retry}</button></form>}
  </div>;
}
