"use client";
import Link from 'next/link';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { publicCopy } from '@/lib/public-copy';
import { useEffect, useRef, useState } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
export function SiteHeader({ locale, t }: {
    locale: Locale;
    t: Dictionary;
}) {
    const pathname = usePathname();
    const copy = publicCopy[locale];
    const section = pathname.split('/')[2] || '';
    const suffix = section ? `/${section}` : '';
    const navigation = [
        { path: '', label: t.home }, { path: 'tulisan', label: t.writing },
        { path: 'tentang', label: copy.about }, { path: 'aktivitas', label: copy.activities },
        { path: 'kontak', label: copy.contact },
    ];
    const [open, setOpen] = useState(false);
    const button = useRef<HTMLButtonElement>(null);
    const nav = useRef<HTMLElement>(null);
    useEffect(() => {
        const media = matchMedia('(prefers-color-scheme: dark)');
        const sync = () => {
            let preference = 'system';
            try { preference = localStorage.getItem('putri-theme') || 'system'; } catch { }
            const resolved = preference === 'light' || preference === 'dark'
                ? preference : media.matches ? 'dark' : 'light';
            document.documentElement.dataset.theme = resolved;
        };
        sync();
        media.addEventListener('change', sync);
        window.addEventListener('storage', sync);
        return () => { media.removeEventListener('change', sync); window.removeEventListener('storage', sync); };
    }, []);
    useEffect(() => { if (open)
        nav.current?.querySelector<HTMLAnchorElement>('a')?.focus(); }, [open]);
    function close() { setOpen(false); button.current?.focus(); }
    function toggleTheme() {
        const resolved = document.documentElement.dataset.theme
            || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        const next = resolved === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem('putri-theme', next); } catch { }
        document.documentElement.dataset.theme = next;
    }
    return <header className="container site-header">
  <Link className="wordmark" href={`/${locale}`}>Putri Wella Sibarani<span aria-hidden="true">.</span></Link>
  <div className="header-controls">
   <nav aria-label={locale === 'id' ? 'Bahasa' : 'Language'} className="language-switch"><Link href={`/id${suffix}`} hrefLang="id" lang="id" aria-label="Bahasa Indonesia" aria-current={locale === 'id' ? 'page' : undefined}>ID</Link><span aria-hidden="true">/</span><Link href={`/en${suffix}`} hrefLang="en" lang="en" aria-label="English" aria-current={locale === 'en' ? 'page' : undefined}>EN</Link></nav>
   <button className="icon-button theme-toggle" type="button" onClick={toggleTheme}>
    {/* CSS follows the pre-paint resolved theme, keeping server/client markup identical. */}
    <Moon className="theme-to-dark" size={20} aria-hidden="true" />
    <Sun className="theme-to-light" size={20} aria-hidden="true" />
    <span className="sr-only theme-to-dark">{copy.toDark}</span>
    <span className="sr-only theme-to-light">{copy.toLight}</span>
   </button>
   <button ref={button} className="icon-button menu-toggle" type="button" aria-label={open ? copy.closeMenu : copy.openMenu} aria-expanded={open} aria-controls="main-navigation" onClick={() => open ? close() : setOpen(true)}>{open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button>
  </div>
  <nav ref={nav} id="main-navigation" className={`main-navigation ${open ? 'is-open' : ''}`} aria-label={locale === 'id' ? 'Navigasi utama' : 'Main navigation'} onKeyDown={e => { if (e.key === 'Escape') {
        e.preventDefault();
        close();
    } }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget) && e.relatedTarget !== button.current)
        setOpen(false); }}>
   {navigation.map(item => <Link key={item.path} href={`/${locale}${item.path ? `/${item.path}` : ''}`} aria-current={section === item.path ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
  </nav>
 </header>;
}
