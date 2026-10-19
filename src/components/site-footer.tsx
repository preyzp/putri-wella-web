import { Suspense } from 'react';
import { connection } from 'next/server';
import { dictionaries, type Locale } from '@/lib/dictionaries';
import { siteContact, siteName } from '@/lib/site-settings';
import { readSettings } from '@/sanity/settings';
import { InstagramLogo, LinkedInLogo } from './brand-icons';

async function PublishedFooter({ locale }: { locale: Locale }) {
  await connection();
  const settings = await readSettings();
  const contacts = siteContact(settings);
  const year = new Date().getFullYear();
  return <footer className="container site-footer">
    <div className="footer-identity"><p className="footer-name">{siteName(settings)}</p><p>{dictionaries[locale].footer}</p></div>
    <div className="footer-details">
      <div className="footer-credits"><p>© {year} Putri Wella Sibarani.</p><p>Website by TednCo.</p></div>
      <nav className="footer-socials" aria-label={locale === 'id' ? 'Media sosial Putri Wella Sibarani' : 'Putri Wella Sibarani social media'}>
        <a className="icon-button footer-social-link" href={contacts.instagram.href} aria-label="Instagram Putri Wella Sibarani" target="_blank" rel="noopener noreferrer"><InstagramLogo /></a>
        <a className="icon-button footer-social-link" href={contacts.linkedin.href} aria-label="LinkedIn Putri Wella Sibarani" target="_blank" rel="noopener noreferrer"><LinkedInLogo /></a>
      </nav>
    </div>
  </footer>;
}

export function SiteFooter({ locale }: { locale: Locale }) {
  return <Suspense><PublishedFooter locale={locale} /></Suspense>;
}
