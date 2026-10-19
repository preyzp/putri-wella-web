# Setup Sanity lokal

Blog, Tentang, Aktivitas, dan Pengaturan situs membaca konten published Sanity; preview draft artikel tersedia melalui Studio yang terautentikasi. Halaman publik kini boleh diindeks; Studio dan preview draft tetap noindex. Tidak ada seed, pembuatan proyek cloud, webhook, atau integrasi interaksi.

## Paket dan kompatibilitas

Next.js 16.4.2, React/React DOM 19.3.0, TypeScript 5.9.3, dan pnpm 12.11.2 dipertahankan. Paket dipin: `next-sanity` 13.3.4, `sanity` 5.29.0, `@sanity/client` 7.26.2, `@portabletext/react` 7.0.1, `@portabletext/types` 4.0.2, dan `styled-components` 6.1.19. Versi tersebut memenuhi peer dependencies; `pnpm peers check` tidak menemukan konflik. Node yang diuji: 24.11.1; gunakan Node >=22.12 untuk toolchain ini. Sanity 6 tidak dipilih karena dependency CLI-nya meminta TypeScript 6. Binary esbuild diizinkan secara spesifik di `pnpm-workspace.yaml`; izin build dependency lain dipertahankan.

Referensi resmi: [embedded Studio](https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs), [client Next.js](https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs), [validasi schema](https://www.sanity.io/docs/studio/validation), [Portable Text React](https://github.com/portabletext/react-portabletext).

## Konfigurasi yang perlu diisi

1. Gunakan akun dan proyek Sanity yang benar milik pengguna/Putri. Cari **Project ID** dan **nama dataset yang benar-benar tersedia** di pengaturan proyek Sanity. Jangan memakai contoh atau nama dataset yang diasumsikan.
2. Salin `.env.example` menjadi `.env.local`, lalu isi `NEXT_PUBLIC_SANITY_PROJECT_ID` dan `NEXT_PUBLIC_SANITY_DATASET`. Keduanya identifier publik. `.env.local` diabaikan Git; `.env.example` boleh dilacak dan sengaja kosong.
3. Di pengaturan API proyek Sanity, izinkan CORS origin lokal yang benar (misalnya `http://localhost:3000` jika memakai port default). Embedded Studio memakai login Sanity, jadi aktifkan credentials untuk origin Studio tersebut. Jangan memakai wildcard. Jika port/origin berubah, gunakan origin yang benar.
4. Pastikan akun pengelola memiliki akses proyek/dataset di Sanity. Jalankan `pnpm install --frozen-lockfile`, lalu `pnpm dev` dan buka `/studio`. Restart development setelah mengubah env. Identifier NEXT_PUBLIC dibundel saat build: perubahan production membutuhkan build baru.

Pembacaan publik tetap tanpa token. Preview draft memerlukan token pembaca server seperti panduan di bawah. Jangan mengisi token atau rahasia apa pun dalam NEXT_PUBLIC, schema, browser, atau file yang dilacak Git. Dataset privat untuk website publik membutuhkan adapter berizin terpisah; jangan menjadikan data sensitif publik sebagai jalan pintas.

`SITE_URL=https://putriwella.web.id` menetapkan origin metadataBase/canonical publik, termasuk URL artikel utama `/id/tulisan/[slug]`. Isi di environment deployment dan `.env.local`; bila belum diisi, default memakai origin resmi yang sama. Tidak ada variabel URL situs kedua. URL harus absolut HTTP(S), tanpa kredensial; path/query diabaikan karena konfigurasi ini adalah origin. Metadata publik mengizinkan index/follow; preview draft tetap noindex.

Domain utama sekarang `https://putriwella.web.id`; untuk development, origin localhost dengan port yang digunakan tetap berlaku. Preview Studio memakai path relatif pada origin Studio yang sedang dibuka, sehingga tidak dipaksa ke domain produksi ketika bekerja lokal. Pastikan CORS credentials Sanity mengizinkan origin baru secara spesifik di samping localhost yang digunakan; panduan ini tidak mengubah pengaturan akun cloud. Sitemap tersedia di /sitemap.xml dan robots.txt mencantumkannya. Keduanya memakai SITE_URL.

## Preview draft artikel dari Studio

Menggunakan Next.js 16.4.2 Draft Mode async, Sanity 5.29 Presentation Tool, next-sanity 13.3.4 dan validator resmi `@sanity/preview-url-secret` 4.1.5 (sebelumnya transitif, kini dependency langsung). Rujukan: [Draft Mode Next.js](https://nextjs.org/docs/app/api-reference/functions/draft-mode), [validasi preview Sanity](https://www.sanity.io/docs/visual-editing/implementing-draft-mode), [Presentation Tool](https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool), [izin token](https://www.sanity.io/docs/content-lake/roles-concepts).

1. Di proyek Sanity yang benar, buka **Manage → API → Tokens → Add API token**. Buat token terpisah untuk server preview, dengan role **Viewer (read-only)**; tidak perlu Editor atau Administrator. Token harus dapat membaca draft artikel/kategori/aset dan dokumen `sanity.previewUrlSecret` untuk validasi. Jika memakai custom permissions yang sudah tersedia pada akun, batasi read ke dataset yang dipakai dan tipe tersebut; preview ini tidak membutuhkan izin write. Jangan menambah layanan/plan hanya untuk custom role.
2. Simpan nilainya hanya pada `SANITY_API_READ_TOKEN` di `.env.local`. Jangan salin ke NEXT_PUBLIC, URL, Studio config, screenshot, atau Git. Restart server lokal. Token ini bukan secret URL sementara Studio, dan tidak pernah dikirim ke browser.
3. Pada Vercel, isi variabel bernama sama pada environment Production/Preview yang memang akan dipakai, kemudian redeploy agar environment tersedia. Gunakan identifier dataset yang benar dan `SITE_URL` publik yang sudah disepakati; tidak ada variabel URL preview kedua. Studio embedded dan frontend preview menggunakan origin deployment yang sama, termasuk saat lokal.
4. Tambahkan CORS origin Studio yang tepat di Sanity, credentials aktif: origin localhost beserta port sebenarnya dan origin deployment yang digunakan. Jangan wildcard. Akun Wella harus login Studio dan mempunyai izin mengedit draft. Akun Studio (bukan token Viewer server) membuat secret preview sementara melalui mekanisme resmi Presentation Tool; itu bagian handshake, bukan dokumen artikel baru. Jangan publish atau seed dokumen secret sendiri.
5. Di Studio → Tulisan, buka tulisan dan isi slug. Lokasi **Preview draft** di bagian atas editor membuka Presentation Tool; tool **Preview draft** juga tersedia di navigasi Studio. Jika pertama membuka halaman panduan, pilih tulisan/lokasi tersebut. Artikel draft-only dapat dibuka setelah autosave, tanpa Publish. Preview memakai `/id/preview/tulisan/[slug]`; URL publik `/id/tulisan/[slug]` tetap published-only.
6. Preview menampilkan judul, ringkasan, cover, kategori dan isi dengan renderer artikel yang sama (termasuk gambar/caption serta baris/bait puisi). Simpan perubahan di Studio dan muat ulang preview untuk melihat hasil terbaru. Bridge resmi next-sanity hanya di preview menjaga koneksi/navigasi Presentation; tidak ada live query subscription, token browser, stega, atau editor field kustom. Daftar/related publik tidak dijadikan draft preview.
7. Banner **Preview draft → Keluar preview** mengirim POST same-origin, menghapus cookie Draft Mode dan mengarahkan ke detail published bila tersedia; draft-only kembali ke daftar Tulisan. Menutup tab saja tidak selalu menghapus sesi; cookie dibatasi satu jam. Jangan membagikan URL handshake. Share access Presentation dinonaktifkan.

Enable endpoint memvalidasi secret sementara Studio dengan API Sanity sebelum mengaktifkan cookie HttpOnly. Parameter slug atau `?preview=true` tidak mengaktifkan preview. Redirect hanya menerima path `/id/preview/tulisan` atau satu slug di bawahnya; URL eksternal, traversal, query dan separator tersandi ditolak. API read token hanya server-side. Halaman preview/header respons menggunakan private/no-store, noindex/nofollow/noarchive dan referrer same-origin (endpoint enable memakai no-referrer); metadata preview generik tidak berisi judul draft. Pembacaan draft dipisah dari client/query published. Navigasi normal, metadata publik dan thumbnail tetap published meski cookie preview aktif. Sitemap hanya membaca published, tidak menyertakan preview, API, Studio, draft atau alias EN artikel.

Token kosong/placeholder: endpoint memberi 503 dengan petunjuk setup; halaman preview menampilkan setup aman, halaman publik tetap berfungsi. Izin/koneksi salah: pesan error generik tanpa output SDK/environment. Validator dan proyeksi diuji lewat respons API lokal dengan `node tests/preview-states.mjs` (tidak membuat konten cloud). `node tests/preview-cloud.mjs` hanya membaca jika token tersedia; tidak membuat secret Studio untuk menguji handshake cloud.

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

`src/sanity/client.ts` adalah server-only, menggunakan API version tetap `2026-10-18`, perspective `published`, tanpa token/stega, `useCdn: false`, dan `no-store`. `fetchPublished()` menerima nama query dan parameter bertipe. Proyeksi di `queries.ts` eksplisit, menyaring draft/version termasuk referensi yang belum terbit, dan tidak membaca newsletter/Instagram. Kontrak hasil TypeScript ditulis berdampingan dengan proyeksi, belum merupakan TypeGen yang diekstrak dari akun. Blog beranda/listing/detail memakai connection() dan Suspense untuk request-time data. Tidak ada live query atau cache invalidation. Preview draft memakai client/query terpisah seperti bagian preview di atas.

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

## SEO rilis utama

`src/app/sitemap.ts` memakai connection() dan query published/no-store pada setiap request. URL berasal dari SITE_URL; sepuluh halaman utama canonical ID/EN ditambah artikel utama ID. lastModified memakai _updatedAt published, dengan publishedAt sebagai cadangan artikel; tanggal tidak diisi bila tidak tersedia. Error Sanity melempar error generik sehingga respons sitemap gagal (500), bukan 200 berisi sitemap kehilangan seluruh artikel. Artikel baru/diubah/ditarik terlihat pada permintaan berikutnya tanpa build ulang.

`src/app/robots.ts` mengizinkan halaman publik dan mengecualikan Studio, API, serta preview ID/EN. Robots.txt bukan autentikasi; metadata noindex Studio/preview dan validasi akses draft tetap dipertahankan. Label rancangan publik dihapus tanpa mengubah banner Preview draft. Metadata judul/deskripsi bersumber konten published. Meta title tulisan dipakai pada detail; Meta title default pada beranda. OG artikel mengutamakan cover, lalu OG image artikel, lalu OG default ID; halaman utama memakai OG default sesuai locale/fallback ID. Gambar diverifikasi terhadap CDN project/dataset terkonfigurasi. Tidak membuat gambar default atau identitas baru. Favicon masih ikon N bawaan Next.js; OG default perlu aset yang disetujui jika ingin diisi.

Pemeriksaan terfokus: `node tests/release-seo.mjs` memakai respons API lokal terkontrol tanpa mutasi; `node tests/release-cloud.mjs` hanya melaporkan inventaris published nyata secara read-only tanpa token/isi dokumen/secret. Hasil aktual dan batas cloud dicatat di HANDOFF.md.
