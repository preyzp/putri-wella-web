# Setup Sanity lokal

Halaman publik masih preview dengan fixture. Setup ini belum memigrasikan data halaman, menjalankan seed, membuat proyek cloud, atau mengaktifkan preview/webhook/interaksi.

## Paket dan kompatibilitas

Next.js 16.4.2, React/React DOM 19.3.0, TypeScript 5.9.3, dan pnpm 12.11.2 dipertahankan. Paket dipin: `next-sanity` 13.3.4, `sanity` 5.29.0, `@sanity/client` 7.26.2, `@portabletext/react` 7.0.1, `@portabletext/types` 4.0.2, dan `styled-components` 6.1.19. Versi tersebut memenuhi peer dependencies; `pnpm peers check` tidak menemukan konflik. Node yang diuji: 24.11.1; gunakan Node >=22.12 untuk toolchain ini. Sanity 6 tidak dipilih karena dependency CLI-nya meminta TypeScript 6. Binary esbuild diizinkan secara spesifik di `pnpm-workspace.yaml`; izin build dependency lain dipertahankan.

Referensi resmi: [embedded Studio](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs), [client Next.js](https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs), [validasi schema](https://www.sanity.io/docs/studio/validation), [Portable Text React](https://github.com/portabletext/react-portabletext).

## Konfigurasi yang perlu diisi

1. Gunakan akun dan proyek Sanity yang benar milik pengguna/Putri. Cari **Project ID** dan **nama dataset yang benar-benar tersedia** di pengaturan proyek Sanity. Jangan memakai contoh atau nama dataset yang diasumsikan.
2. Salin `.env.example` menjadi `.env.local`, lalu isi `NEXT_PUBLIC_SANITY_PROJECT_ID` dan `NEXT_PUBLIC_SANITY_DATASET`. Keduanya identifier publik. `.env.local` diabaikan Git; `.env.example` boleh dilacak dan sengaja kosong.
3. Di pengaturan API proyek Sanity, izinkan CORS origin lokal yang benar (misalnya `http://localhost:3000` jika memakai port default). Embedded Studio memakai login Sanity, jadi aktifkan credentials untuk origin Studio tersebut. Jangan memakai wildcard. Jika port/origin berubah, gunakan origin yang benar.
4. Pastikan akun pengelola memiliki akses proyek/dataset di Sanity. Jalankan `pnpm install --frozen-lockfile`, lalu `pnpm dev` dan buka `/studio`. Restart development setelah mengubah env. Identifier NEXT_PUBLIC dibundel saat build: perubahan production membutuhkan build baru.

Tidak membutuhkan token pada tahap ini. Jangan mengisi token atau rahasia apa pun dalam NEXT_PUBLIC, schema, browser, atau file yang dilacak Git. Client query saat ini tanpa token, hanya cocok untuk pembacaan published dari dataset publik. Dataset privat membutuhkan adapter server berizin yang belum dibuat; jangan menjadikan data sensitif publik sebagai jalan pintas.

## Perilaku saat belum terkonfigurasi

- `/studio` dan subroute-nya menampilkan petunjuk setup, tanpa mencetak nilai env. Nilai kosong, malformed, atau placeholder tidak mengaktifkan Studio. Format yang benar saja belum membuktikan proyek/dataset dan aksesnya valid.
- Halaman publik masih **preview fixture yang eksplisit dan noindex**, bahkan setelah env diisi. Ini bukan fallback otomatis dari CMS, karena migrasi halaman belum dilakukan.
- `getContentSource()` di `src/sanity/source.ts` hanya mengizinkan pilihan fixture saat `NODE_ENV=development` dan env Sanity tidak lengkap. Production/test melempar error konfigurasi yang aman; client Sanity tidak membuat identifier rekaan. Kesalahan jaringan/otorisasi CMS tidak ditutupi dengan fixture.
- Build tanpa env tetap bisa memvalidasi aplikasi dan halaman petunjuk Studio. Itu bukan bukti situs siap rilis production berbasis CMS.

## Model, menu, dan pembacaan

Schema ada di `src/sanity/schemas/`, konfigurasi di `sanity.config.ts`. Menu: Tulisan, Aktivitas, Profil, Pengalaman, Pendidikan, Organisasi, Penghargaan/Publikasi, Kategori, Pengaturan, Draft Newsletter. Profil dan Pengaturan memakai ID singleton `profile` dan `siteSettings`; menu pembuatan/duplicate/delete singleton dibatasi. Pembatasan ini adalah kebijakan UI Studio, bukan pengganti otorisasi API Sanity.

Field wajib/validasi memblokir publish melalui Studio; draft tetap bisa disimpan meskipun belum lengkap. Slug post unik antarbahasa menggunakan validasi uniqueness Sanity untuk tipe `post`, lowercase kebab-case. Perubahan slug published harus dicatat manual pada `previousSlugs`; otomatisasi riwayat/redirect CMS belum dibuat. Referensi memakai strong references; cover opsional, alt wajib jika gambar diisi. `poemStanza.text` menyimpan baris asli dan satu object untuk satu bait. Teks bilingual diisi editorial ID/EN, tidak diterjemahkan otomatis.

`newsletterIssue` menyimpan rancangan editorial saja; aksi publish/delivery tidak ditawarkan di Studio. Tidak ada subscriber, consent/unsubscribe token, pesan kontak, atau email komentar. Data Instagram dalam model hanya field editorial tersembunyi untuk kesesuaian model; tidak ada fitur export atau publikasi sosial. Belum ada seed kategori. Setelah akun diverifikasi, kategori awal yang direncanakan adalah Politik & Kebijakan Publik, Ekonomi, Sastra.

`src/sanity/client.ts` adalah server-only, menggunakan API version tetap `2026-10-18`, perspective `published`, tanpa token/stega, dan `no-store`. `fetchPublished()` menerima nama query dan parameter bertipe. Proyeksi di `queries.ts` eksplisit, menyaring draft/version termasuk referensi yang belum terbit, dan tidak membaca newsletter/Instagram. Kontrak hasil TypeScript ditulis berdampingan dengan proyeksi, belum merupakan TypeGen yang diekstrak dari akun. Tidak ada endpoint publik baru, live query, cache invalidation, atau preview.

Renderer baru `src/sanity/portable-text.tsx` mendukung heading/paragraf/list/kutipan/marks, gambar dengan caption/kredit, dan bait puisi memakai kelas `.poem` yang sudah ada. Ia belum dipakai halaman publik. URL tautan diperiksa, teks di-escape React, gambar yang tidak ter-resolve menampilkan placeholder; gambar hanya diizinkan dari CDN Sanity proyek/dataset yang dikonfigurasi.

## Pemeriksaan dan batas verifikasi

```text
pnpm peers check
pnpm lint
pnpm exec tsc --noEmit
pnpm build
node tests/sanity-local.mjs
```

Tes lokal tidak menghubungi Content Lake. Ia mengompilasi sepuluh schema, menjalankan GROQ terhadap dokumen uji in-memory untuk memastikan draft/version dan field di luar proyeksi tidak bocor, serta memeriksa pemisahan baris/bait dan link tidak aman. Uji server/browser Studio tanpa env dijalankan terpisah saat implementasi. Login, CORS, upload, query dataset nyata, dan alur draft/publish baru dapat diuji setelah konfigurasi akun diisi. Jangan klaim koneksi berhasil hanya berdasarkan build.
