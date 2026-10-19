import { SiteHeader } from '@/components/site-header';
import { dictionaries, type Locale } from '@/lib/dictionaries';
import { Suspense } from 'react';
import { readSettings } from '@/sanity/settings';
import { siteName as resolveSiteName } from '@/lib/site-settings';
import { SiteFooter } from './site-footer';

type ShellProps = { locale: Locale; title: string; intro?: string; children: React.ReactNode; blog?: boolean };
export function PublicShell(props: ShellProps) {
  return <Suspense fallback={<ShellView {...props} />}><ConfiguredShell {...props} /></Suspense>;
}
async function ConfiguredShell(props: ShellProps) {
  const settings = await readSettings();
  return <ShellView {...props} siteName={resolveSiteName(settings)} />;
}
function ShellView({ locale, title, intro, children, siteName = 'Putri Wella Sibarani' }: ShellProps & { siteName?: string }) {
  const t = dictionaries[locale];
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <SiteHeader locale={locale} t={t} siteName={siteName} />
    <main id="main" className="container public-page" tabIndex={-1}>
      <div className="page-heading"><h1>{title}</h1>{intro && <p className="excerpt">{intro}</p>}</div>
      {children}
    </main>
    <SiteFooter locale={locale} />
  </>;
}
