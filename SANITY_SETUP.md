# Setup Sanity lokal

Blog, Tentang, Aktivitas, dan Pengaturan situs kini membaca konten published Sanity. Website masih preview rancangan/noindex. Tidak ada seed, pembuatan proyek cloud, preview draft, webhook, atau integrasi interaksi.

## Paket dan kompatibilitas

Next.js 16.4.2, React/React DOM 19.3.0, TypeScript 5.9.3, dan pnpm 12.11.2 dipertahankan. Paket dipin: `next-sanity` 13.3.4, `sanity` 5.29.0, `@sanity/client` 7.26.2, `@portabletext/react` 7.0.1, `@portabletext/types` 4.0.2, dan `styled-components` 6.1.19. Versi tersebut memenuhi peer dependencies; `pnpm peers check` tidak menemukan konflik. Node yang diuji: 24.11.1; gunakan Node >=22.12 untuk toolchain ini. Sanity 6 tidak dipilih karena dependency CLI-nya meminta TypeScript 6. Binary esbuild diizinkan secara spesifik di `pnpm-workspace.yaml`; izin build dependency lain dipertahankan.

Referensi resmi: [embedded Studio](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs), [client Next.js](https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs), [validasi schema](https://www.sanity.io/docs/studio/validation), [Portable Text React](https://github.com/portabletext/react-portabletext).

## Konfigurasi yang perlu diisi

1. Gunakan akun dan proyek Sanity yang benar milik pengguna/Putri. Cari **Project ID** dan **nama dataset yang benar-benar tersedia** di pengaturan proyek Sanity. Jangan memakai contoh atau nama dataset yang diasumsikan.
2. Salin `.env.example` menjadi `.env.local`, lalu isi `NEXT_PUBLIC_SANITY_PROJECT_ID` dan `NEXT_PUBLIC_SANITY_DATASET`. Keduanya identifier publik. `.env.local` diabaikan Git; `.env.example` boleh dilacak dan sengaja kosong.
3. Di pengaturan API proyek Sanity, izinkan CORS origin lokal yang benar (misalnya `http://localhost:3000` jika memakai port default). Embedded Studio memakai login Sanity, jadi aktifkan credentials untuk origin Studio tersebut. Jangan memakai wildcard. Jika port/origin berubah, gunakan origin yang benar.
4. Pastikan akun pengelola memiliki akses proyek/dataset di Sanity. Jalankan `pnpm install --frozen-lockfile`, lalu `pnpm dev` dan buka `/studio`. Restart development setelah mengubah env. Identifier NEXT_PUBLIC dibundel saat build: perubahan production membutuhkan build baru.

Tidak membutuhkan token pada tahap ini. Jangan mengisi token atau rahasia apa pun dalam NEXT_PUBLIC, schema, browser, atau file yang dilacak Git. Client query saat ini tanpa token, hanya cocok untuk pembacaan published dari dataset publik. Dataset privat membutuhkan adapter server berizin yang belum dibuat; jangan menjadikan data sensitif publik sebagai jalan pintas.

`SITE_URL=https://putriwellasibarani.vercel.app` menetapkan origin metadataBase/canonical publik, termasuk URL artikel utama `/id/tulisan/[slug]`. Isi di environment deployment dan `.env.local`; bila belum diisi, default memakai origin resmi yang sama. Tidak ada variabel URL situs kedua. URL harus absolut HTTP(S), tanpa kredensial; path/query diabaikan karena konfigurasi ini adalah origin. Tidak mengubah robots/noindex preview.

Pengaturan published memakai singleton `siteSettings`: nama situs untuk header/footer/judul metadata, perkenalan beranda, deskripsi SEO default, serta email/LinkedIn/Instagram. Field EN kosong memakai ID. Kontak kosong atau tidak valid memakai konfigurasi kontak aktual terpusat; email harus alamat tunggal tanpa header, social link hanya HTTPS pada domain LinkedIn/Instagram yang sesuai, tanpa kredensial. Nama situs/copy default tetap dipakai bila Pengaturan kosong atau koneksi gagal; server hanya mencatat pesan generik tanpa error SDK/environment. Tidak ada fallback dummy untuk blog/profil/aktivitas. Query tetap published/no-store, dengan deduplikasi React hanya dalam request.

Tulisan pilihan beranda tetap memakai referensi artikel published yang masih tersedia, lalu artikel published terbaru jika tidak ada pilihan valid. UI menampilkan satu tulisan unggulan sesuai layout yang ada. Label navigasi tetap dictionary. Belum ada section newsletter sehingga `newsletterIntro` belum dirender; tidak ada form atau pengiriman email baru. Schema tidak diubah.

## Perilaku saat belum terkonfigurasi

- `/studio` dan subroute-nya menampilkan petunjuk setup, tanpa mencetak nilai env. Nilai kosong, malformed, atau placeholder tidak mengaktifkan Studio. Format yang benar saja belum membuktikan proyek/dataset dan aksesnya valid.
- Blog, Tentang, dan Aktivitas membutuhkan konfigurasi Sanity dan membaca published pada setiap request. Dataset kosong menampilkan empty state; kegagalan konfigurasi/koneksi menampilkan error aman. Halaman tersebut tidak memakai fallback dummy, termasuk pada development. Section profil opsional yang kosong tidak ditampilkan; field bilingual EN kosong memakai ID tanpa membuat terjemahan otomatis.
- `getContentSource()` di `src/sanity/source.ts` hanya mengizinkan pilihan fixture saat `NODE_ENV=development` dan env Sanity tidak lengkap. Production/test melempar error konfigurasi yang aman; client Sanity tidak membuat identifier rekaan. Kesalahan jaringan/otorisasi CMS tidak ditutupi dengan fixture.
- Build tanpa env tetap bisa memvalidasi aplikasi dan halaman petunjuk Studio. Itu bukan bukti situs siap rilis production berbasis CMS.

## Model, menu, dan pembacaan

Schema ada di `src/sanity/schemas/`, konfigurasi di `sanity.config.ts`. Menu: Tulisan, Aktivitas, Profil, Pengalaman, Pendidikan, Organisasi, Penghargaan/Publikasi, Kategori, Pengaturan, Draft Newsletter. Profil dan Pengaturan memakai ID singleton `profile` dan `siteSettings`; menu pembuatan/duplicate/delete singleton dibatasi. Pembatasan ini adalah kebijakan UI Studio, bukan pengganti otorisasi API Sanity.

Field wajib/validasi memblokir publish melalui Studio; draft tetap bisa disimpan meskipun belum lengkap. Slug post unik antarbahasa menggunakan validasi uniqueness Sanity untuk tipe `post`, lowercase kebab-case. Perubahan slug published harus dicatat manual pada `previousSlugs`; otomatisasi riwayat/redirect CMS belum dibuat. Referensi memakai strong references; cover opsional, alt wajib jika gambar diisi. `poemStanza.text` menyimpan baris asli dan satu object untuk satu bait. Teks bilingual diisi editorial ID/EN, tidak diterjemahkan otomatis.

`newsletterIssue` menyimpan rancangan editorial saja; aksi publish/delivery tidak ditawarkan di Studio. Tidak ada subscriber, consent/unsubscribe token, pesan kontak, atau email komentar. Data Instagram dalam model hanya field editorial tersembunyi untuk kesesuaian model; tidak ada fitur export atau publikasi sosial. Belum ada seed kategori. Setelah akun diverifikasi, kategori awal yang direncanakan adalah Politik & Kebijakan Publik, Ekonomi, Sastra.

`src/sanity/client.ts` adalah server-only, menggunakan API version tetap `2026-10-18`, perspective `published`, tanpa token/stega, `useCdn: false`, dan `no-store`. `fetchPublished()` menerima nama query dan parameter bertipe. Proyeksi di `queries.ts` eksplisit, menyaring draft/version termasuk referensi yang belum terbit, dan tidak membaca newsletter/Instagram. Kontrak hasil TypeScript ditulis berdampingan dengan proyeksi, belum merupakan TypeGen yang diekstrak dari akun. Blog beranda/listing/detail memakai connection() dan Suspense untuk request-time data. Tidak ada live query, cache invalidation, atau preview.

Renderer `src/sanity/portable-text.tsx` kini dipakai detail publik, mendukung heading/paragraf/list/kutipan/marks, gambar dengan caption/kredit, dan bait puisi memakai kelas `.poem` yang sudah ada. URL tautan diperiksa, teks di-escape React, gambar yang tidak ter-resolve menampilkan placeholder; next/image hanya mengizinkan CDN Sanity proyek/dataset yang dikonfigurasi.

## Pemeriksaan dan batas verifikasi

```text
pnpm peers check
pnpm lint
pnpm exec tsc --noEmit
pnpm build
node tests/sanity-local.mjs
```

Tes lokal tidak menghubungi Content Lake. Ia mengompilasi sepuluh schema, menjalankan GROQ terhadap dokumen uji in-memory untuk memastikan draft/version dan field di luar proyeksi tidak bocor, serta memeriksa pemisahan baris/bait dan link tidak aman. Uji Studio tanpa env hanya berlaku untuk build tanpa env.

Setelah konfigurasi akun tersedia, `node tests/blog-cloud.mjs` memverifikasi pembacaan published nyata tanpa token/mutasi dan menyimpan snapshot publik pada folder cache yang diabaikan Git. Jalankan setelah sanity-local.mjs. Browser blog dapat diuji memakai `CHECK_ONLY=blog` lalu `node tests/public-pages.mjs`. `node tests/blog-states.mjs` menguji empty/error/404, draft, dan perubahan request berikutnya melalui respons API terkontrol pada proses uji, tanpa mengubah dataset. Lihat HANDOFF.md untuk hasil cloud dan mock yang dibedakan secara eksplisit. Login, otorisasi pengelola, CORS, upload, dan mutasi draft/publish cloud belum diuji oleh task pembacaan publik.
