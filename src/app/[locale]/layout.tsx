import type { Metadata } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import { isLocale } from '@/lib/dictionaries';
import '../globals.css';
const sans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'], display: 'swap' });
const serif = DM_Serif_Display({ variable: '--font-dm-serif', weight: '400', subsets: ['latin'], display: 'swap' });
export const metadata: Metadata = { title: 'Putri Wella Sibarani — Preview', description: 'Preview rancangan website tulisan Putri Wella Sibarani. Konten contoh, bukan naskah final.', robots: { index: false, follow: false } };
// Before-paint initialization. Storage may be unavailable in restricted browsers.
const themeScript = `(function(){var p='system';try{p=localStorage.getItem('putri-theme')||'system'}catch(e){}document.documentElement.dataset.theme=p==='light'||p==='dark'?p:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')})()`;
export default async function RootLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{
        locale?: string;
    }>;
}) {
    const { locale } = await params;
    return <html lang={locale && isLocale(locale) ? locale : 'id'} className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body>{children}</body></html>;
}
