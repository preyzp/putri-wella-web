"use client";
import Link from 'next/link';
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
    const select = useRef<HTMLSelectElement>(null);
    useEffect(() => {
        const media = matchMedia('(prefers-color-scheme: dark)');
        const sync = () => { let p = 'system'; try {
            p = localStorage.getItem('putri-theme') || 'system';
        }
        catch { } ; if (!['light', 'dark'].includes(p))
            p = 'system'; if (select.current)
            select.current.value = p; document.documentElement.dataset.theme = p === 'system' ? (media.matches ? 'dark' : 'light') : p; };
        sync();
        media.addEventListener('change', sync);
        window.addEventListener('storage', sync);
        return () => { media.removeEventListener('change', sync); window.removeEventListener('storage', sync); };
    }, []);
    useEffect(() => { if (open)
        nav.current?.querySelector<HTMLAnchorElement>('a')?.focus(); }, [open]);
    function close() { setOpen(false); button.current?.focus(); }
    return <header className="container site-header">
  <Link className="wordmark" href={`/${locale}`}>Putri Wella Sibarani<span aria-hidden="true">.</span></Link>
  <div className="header-controls">
   <nav aria-label={locale === 'id' ? 'Bahasa' : 'Language'} className="language-switch"><Link href={`/id${suffix}`} hrefLang="id" lang="id" aria-label="Bahasa Indonesia" aria-current={locale === 'id' ? 'page' : undefined}>ID</Link><span aria-hidden="true">/</span><Link href={`/en${suffix}`} hrefLang="en" lang="en" aria-label="English" aria-current={locale === 'en' ? 'page' : undefined}>EN</Link></nav>
   <label><span className="sr-only">{t.theme}</span><select ref={select} defaultValue="system" onChange={e => { const p = e.target.value; try {
        localStorage.setItem('putri-theme', p);
    }
    catch { } ; document.documentElement.dataset.theme = p === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : p; }}><option value="system">{t.system}</option><option value="light">{t.light}</option><option value="dark">{t.dark}</option></select></label>
   <button ref={button} className="menu-toggle" type="button" aria-expanded={open} aria-controls="main-navigation" onClick={() => open ? close() : setOpen(true)}>{open ? t.close : t.menu}<span aria-hidden="true">{open ? '−' : '+'}</span></button>
  </div>
  <nav ref={nav} id="main-navigation" className={`main-navigation ${open ? 'is-open' : ''}`} aria-label={locale === 'id' ? 'Navigasi utama' : 'Main navigation'} onKeyDown={e => { if (e.key === 'Escape') {
        e.preventDefault();
        close();
    } }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget))
        setOpen(false); }}>
   {navigation.map(item => <Link key={item.path} href={`/${locale}${item.path ? `/${item.path}` : ''}`} aria-current={section === item.path ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}
  </nav>
 </header>;
}
