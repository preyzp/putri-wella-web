import { notFound } from 'next/navigation';
import { ArrowUpRight, Mail } from 'lucide-react';
import { InstagramLogo, LinkedInLogo } from '@/components/brand-icons';
import { PublicShell } from '@/components/public-shell';
import { isLocale } from '@/lib/dictionaries';
import { publicCopy } from '@/lib/public-copy';
import { contact } from '@/lib/contact';

export function generateStaticParams() { return [{ locale: 'id' }, { locale: 'en' }]; }
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = publicCopy[locale];
  return <PublicShell locale={locale} title={t.contact} intro={t.contactIntro}>
    <div className="contact-status"><p>{t.contactNote}</p><dl>
      <div><dt><Mail size={20} aria-hidden="true" /> Email</dt><dd><a className="contact-link" href={contact.email.href}>{contact.email.label}</a></dd></div>
      <div><dt><LinkedInLogo /> LinkedIn</dt><dd><a className="contact-link" href={contact.linkedin.href} target="_blank" rel="noopener noreferrer">{contact.linkedin.label}<ArrowUpRight size={18} aria-hidden="true" /></a></dd></div>
      <div><dt><InstagramLogo /> Instagram</dt><dd><a className="contact-link" href={contact.instagram.href} target="_blank" rel="noopener noreferrer">{contact.instagram.label}<ArrowUpRight size={18} aria-hidden="true" /></a></dd></div>
    </dl></div>
  </PublicShell>;
}
