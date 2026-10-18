import { Suspense } from 'react';
import Link from 'next/link';
import { getSanityEnvironment } from '@/sanity/env';
import Studio from './studio';

export default function StudioPage() {
  if (!getSanityEnvironment().configured) return <main style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px', fontFamily: 'system-ui, sans-serif', lineHeight: 1.7 }}>
    <h1>Studio belum dikonfigurasi</h1>
    <p>Konfigurasi Sanity wajib belum lengkap. Studio belum terhubung; halaman publik tetap preview dengan konten contoh.</p>
    <ol><li>Salin <code>.env.example</code> ke <code>.env.local</code>.</li><li>Isi <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> dan <code>NEXT_PUBLIC_SANITY_DATASET</code> dari proyek Sanity yang benar.</li><li>Ikuti <code>SANITY_SETUP.md</code>, lalu restart server development atau build ulang.</li></ol>
    <p>Jangan masukkan token pada variabel NEXT_PUBLIC. Akses pengelolaan memakai login dan otorisasi Sanity.</p>
    <Link href="/id">Kembali ke beranda preview</Link>
  </main>;
  return <Suspense fallback={<p>Memuat Studio…</p>}><Studio /></Suspense>;
}
