import { SiteHeader } from '@/components/site-header';
import { dictionaries, type Locale } from '@/lib/dictionaries';

export function PublicShell({ locale, title, intro, children, blog = false }: { locale: Locale; title: string; intro?: string; children: React.ReactNode; blog?: boolean }) {
  const t = dictionaries[locale];
  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <SiteHeader locale={locale} t={t} />
    <main id="main" className="container public-page" tabIndex={-1}>
      <div className="page-heading"><p className="preview-label">{t.preview}</p><h1>{title}</h1>{intro && <p className="excerpt">{intro}</p>}</div>
      {children}
    </main>
    <footer className="container site-footer"><div><p className="footer-name">Putri Wella Sibarani</p><p>{t.footer}</p></div><p className="meta">{blog ? t.preview : t.sample}</p></footer>
  </>;
}
