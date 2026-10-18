# AGENTS — Panduan implementasi website Putri

## Baca sebelum bekerja
Urutan: PRD.md → DESIGN.md → CONTENT_MODEL.md → task aktif. Instruksi pengguna terbaru mengatasi dokumen. Dokumen ini adalah starter tanpa repository aplikasi; jangan menganggap fitur telah dibangun.

## Tujuan
Bangun website Putri Wella Sibarani yang berfokus pada tulisan, dengan identitas profesional sekaligus penulis. Stack disepakati: Next.js App Router, TypeScript, Tailwind CSS, Sanity, Vercel. Tidak perlu membangun CMS/autentikasi admin sendiri.

## Aturan kerja
- Kerjakan satu task terfokus setiap iterasi. Hindari audit besar, refactor tidak terkait, atau mengganti desain yang sudah disepakati.
- Periksa package.json, lockfile, struktur dan instruksi repository sebelum mengedit. Pertahankan pekerjaan yang sudah ada.
- Jika belum ada aplikasi, gunakan versi stabil kompatibel saat inisialisasi dan catat versi nyata. Jangan memakai nomor versi yang belum diverifikasi atau memaksa latest pada repo yang sudah berjalan.
- Pilih satu package manager berdasarkan lockfile. pnpm menjadi pilihan awal jika repo baru; jangan membuat lockfile ganda.
- Jangan menambah fitur/layanan berbayar, AI, analytics, atau dependency besar tanpa kebutuhan konkret. Provider newsletter/komentar/kontak belum dipilih.
- Gunakan dokumentasi resmi versi terpasang untuk API framework/Sanity. Jangan menyalin contoh lama tanpa verifikasi.
- Tidak perlu subagent atau pekerjaan paralel lintas agent untuk starter ini.

## Keputusan desain yang harus dipertahankan
Font DM Serif Display 400 dan DM Sans. Palette G Midnight Azure sesuai DESIGN.md. Light/dark, halaman utama ID/EN, artikel bahasa asli. Hero tidak memakai portrait. Nama instansi pekerjaan tidak boleh muncul dalam halaman, fixture, metadata, image caption/alt, maupun export social.

Layout beranda belum final. Implementasi awal dapat memakai susunan usulan hanya sebagai preview yang diberi status rancangan; jangan mengklaim telah disetujui.

## Arsitektur awal yang disarankan
```text
src/app/[locale]/             # id/en, halaman publik utama
src/app/[locale]/tulisan/     # listing/detail; URL strategy konsisten
src/app/studio/[[...tool]]/   # embedded Sanity Studio
src/app/api/                 # revalidation, draft mode, form integrations
src/components/              # UI, editorial, layout
src/lib/                     # locale, metadata, validation, adapters
src/sanity/                  # schemas, client, queries, presentation
src/fixtures/                # dummy terpusat untuk tahap frontend
```
Struktur ini usulan, adaptasikan dengan repo. Tetapkan kebijakan canonical/locale untuk artikel satu bahasa sebelum membuat URL duplikat. /studio tidak di bawah locale.

## CMS dan integrasi
- Gunakan lifecycle draft/published Sanity, jangan menambah status redundan.
- Data subscriber/pesan kontak/email komentar tidak disimpan dalam dataset publik.
- Token draft preview, webhook dan provider hanya server-side; variabel NEXT_PUBLIC hanya untuk data yang boleh publik.
- Berikan .env.example berupa placeholder; jangan menulis secret ke source, log, PR, atau output.
- Public API hanya membaca published dan field yang diproyeksikan. Preview harus terautentikasi dan tidak ter-cache publik.
- Studio menggunakan auth Sanity. Jangan menganggap URL tersembunyi melindungi akses.
- Sinkron publish/unpublish/delete dengan cache; tidak perlu deploy ulang per artikel.
- Komentar dimoderasi; newsletter rangkuman ditinjau sebelum dikirim; publish artikel tidak otomatis memicu email/IG.
- Jangan membuat form aktif dengan keberhasilan palsu saat backend belum tersambung. Gunakan adapter/mock yang jelas hanya pada development.

## Task implementasi berurutan
### 01 — Fondasi dan desain preview
Scaffold jika diperlukan; tokens, fonts, responsive shell, theme dan locale. Fixture nonfaktual berlabel dummy. Tiga alternatif komposisi beranda untuk dipilih; tidak perlu CMS hidup pada tahap ini.

### 02 — Halaman publik
Setelah layout dipilih: homepage, listing/detail artikel, poem renderer, Tentang, Aktivitas, Kontak; semua states dan navigasi nyata. Jangan menambah detail biografi yang tidak tersedia.

### 03 — Sanity
Schema sesuai model, Studio /studio, published queries, protected preview, validation, cache invalidation dan .env.example. Seed kategori; konten dummy tidak dipublish sebagai fakta.

### 04 — Konten dan SEO
Masukkan naskah/aset yang disetujui; metadata/canonical, sitemap, robots, OG, structured data sesuai konten nyata. Verifikasi tidak ada nama instansi pekerjaan atau foto diri di beranda.

### 05 — Distribusi dan interaksi
Bantuan Instagram (manual copy/export), kemudian provider komentar, kontak dan newsletter yang sudah dipilih. Jangan mengarang konfigurasi akun, tarif, atau provider key. Selama menunggu akun, selesaikan adapter dan UI yang dapat direview, laporkan blocker secara spesifik.

### 06 — Deployment dan handoff
Vercel, environment per production/preview, Sanity CORS origins spesifik, webhook URL benar, domain jika tersedia. Jangan membuat akun/deploy project lain jika proyek yang benar sudah ada. Panduan penggunaan Putri: login, draft, preview, publish, unpublish, galeri dan export IG. Akun proyek/domain idealnya berada dalam kepemilikan yang disepakati pengguna/Putri.

## Validasi sesuai perubahan
- Jalankan lint/typecheck/build yang memang tersedia; baca scripts package.json, jangan mengarang perintah.
- Meaningful tests: puisi mempertahankan baris; draft tidak bocor; webhook invalid ditolak; unpublished detail 404; subscriber tidak publik; subscribe/unsubscribe adapter bila dibangun.
- UI check pada 360/768/1440 px, kedua tema, keyboard, judul panjang, tanpa gambar, daftar kosong, form gagal.
- Verifikasi export Instagram saat font/gambar telah termuat, judul panjang tidak terpotong, clipboard failure ditangani.
- Jangan menulis test trivial yang menyalin implementasi. Jangan mengulang seluruh suite tanpa perubahan/temuan yang membenarkannya.

## Definition of done tiap task
Perubahan sesuai scope; checks relevan lulus atau kendala dilaporkan; tidak ada secrets/dummy tak berlabel; tidak merusak fitur lama. Ringkasan akhir: hasil, file utama, validasi, batasan tersisa dan satu task berikutnya. Jangan menyatakan integrasi berhasil tanpa bukti uji.

## Handoff dan biaya
Saat berhenti, catat pekerjaan selesai, pekerjaan berikutnya, keputusan baru dan blocker pada ringkasan singkat. Harga/kuota provider diverifikasi saat diperlukan; Free bukan jaminan tanpa batas. Vercel/Sanity dipilih sebagai rencana, bukan bukti akun atau deployment telah tersedia.
