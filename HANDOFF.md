# Fondasi dan halaman publik preview — 18 Oktober 2026

Task 01 dan halaman publik task 02 selesai sesuai scope pengguna. Beranda tetap satu preview, belum merupakan persetujuan layout final. Task 02 dilanjutkan atas instruksi pengguna tanpa menunggu keputusan layout.

- Mempertahankan Next.js 16.4.2, React 19.3.0, Tailwind CSS 4.3.3, TypeScript 5.9.3, pnpm 12.11.2. Tidak ada dependency baru.
- Jalankan `pnpm dev`; pemeriksaan: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`.
- `/` redirect ke `/id`; `/en` menggunakan dictionary Inggris. Layout locale menetapkan atribut HTML lang. Artikel contoh tetap berbahasa Indonesia.
- Token semantik Midnight Azure berada di `src/app/globals.css`, terhubung ke Tailwind v4. DM Serif Display 400 dan DM Sans memakai next/font dan disajikan lokal setelah build. Build pertama memerlukan akses Google Fonts.
- Tema Sistem/Terang/Gelap: mengikuti sistem sebelum ada pilihan, tersimpan di localStorage dengan key `putri-theme`, inisialisasi sebelum paint, fallback CSS saat JavaScript tidak tersedia, tetap berfungsi ketika penyimpanan diblokir.
- Menu mobile memindahkan fokus ke navigasi saat dibuka, Escape menutup dan mengembalikan fokus. Skip link dan fokus terlihat tersedia. Navigasi kini menuju Beranda, Tulisan, Tentang, Aktivitas, dan Kontak; indikator aktif mengikuti halaman. Pemilih bahasa mempertahankan bagian halaman; pada detail artikel menuju listing bahasa tujuan karena naskah belum memiliki terjemahan.
- Fixture terpusat di `src/fixtures/posts.ts` dan `src/fixtures/pages.ts`, berlabel dummy. Tanggal artikel adalah tanggal contoh yang ditandai pada detail. Tidak ada riwayat, pencapaian, foto diri, atau identitas instansi rekaan. Puisi mempertahankan baris dan bait. Semua halaman preview tetap noindex.

## Halaman publik dan keputusan URL

- `/id/tulisan` dan `/en/tulisan`: daftar dengan filter kategori + format, jumlah hasil yang diumumkan melalui status aksesibel, hasil kosong, dan reset. Tidak ada pagination untuk empat fixture.
- URL utama artikel mengikuti bahasa naskah: `/id/tulisan/ekonomi`, `/id/tulisan/ruang-publik`, `/id/tulisan/jeda`, `/id/tulisan/pilihan`. Kedua listing dan beranda mengarah ke URL ini. Alias `/en/tulisan/[slug]` redirect 308 ke ID, tanpa membuat terjemahan palsu.
- Detail mendukung judul, metadata kategori/format/tanggal/bahasa, ringkasan, cover opsional, heading h2/h3/h4, paragraf, kutipan, list terurut/tidak terurut, gambar + alt/caption, dan bait puisi. Ada tulisan terkait serta salin tautan dengan feedback berhasil/gagal dan retry.
- Canonical detail berupa path origin-relative ke URL utama. Domain produksi belum tersedia; sebelum rilis, tetapkan domain yang disetujui dan canonical absolut. Salin tautan memakai origin aktual browser dan path utama, tanpa query/hash.
- `src/proxy.ts` mengecek slug fixture sebelum streaming: slug tidak dikenal di ID/EN di-rewrite ke halaman 404 bawaan dengan HTTP 404. `notFound()` pada detail tetap menjadi pemeriksaan cadangan. Ini diperlukan karena notFound yang terlambat pada streaming bisa menghasilkan HTTP 200. Saat integrasi CMS nanti, pemeriksaan ini harus mengikuti keberadaan konten published, bukan fixture.
- `/[locale]/tentang`: tujuh bagian profil dengan placeholder berlabel; hanya halaman ini memiliki slot portrait. Tidak ada foto orang lain atau kredensial rekaan.
- `/[locale]/aktivitas`: tiga ilustrasi SVG lokal dengan alt dan caption bilingual yang jelas sebagai contoh, bukan dokumentasi kegiatan Putri. Tidak memakai lightbox atau kontrol zoom palsu.
- `/[locale]/kontak`: status informasi belum tersedia dan placeholder email/LinkedIn/Instagram, tanpa alamat rekaan, tautan akun, atau form pengiriman.
- `src/lib/public-copy.ts` memusatkan teks UI halaman baru; shell, kartu tulisan, renderer isi, filter, dan kontrol salin berada di `src/components`. Font, palette, tema, dan komposisi utama beranda dipertahankan.

## Validasi fondasi sebelumnya

Lint, TypeScript, dan production build lulus. Edge headless pada build produksi memverifikasi ID/EN × light/dark × lebar 360/768/1440 px: tidak ada overflow horizontal. Pemeriksaan juga lulus untuk redirect default, atribut lang, tema mengikuti sistem dan tersimpan setelah reload, fokus menu/Escape, judul panjang, serta whitespace puisi. Skrip pemeriksaan sementara sudah dihapus; tidak menambah test dependency.

## Validasi halaman publik

Lint, TypeScript, dan build produksi lulus. Pemeriksaan browser Edge headless memverifikasi:

- Filter masing-masing kategori/format, kombinasi, hasil kosong, reset, dan tujuan link pada listing ID/EN.
- Keempat detail tersedia, alias EN redirect 308, serta slug asing pada kedua locale menghasilkan HTTP 404.
- Isi heading/kutipan/list/gambar/tanggal, canonical, tulisan terkait, detail tanpa cover, dan baris/bait puisi sesuai fixture.
- Clipboard berhasil menulis dan dibaca kembali dari browser; penolakan clipboard disimulasikan untuk memastikan pesan gagal dan tombol coba lagi tersedia.
- Listing, Tentang, Aktivitas, Kontak pada ID/EN serta detail artikel dan puisi di 360/768/1440 px, kedua tema: tidak ada overflow horizontal. Kontak tidak memiliki form atau tautan email/telepon aktif.
- Menu dibuka dengan Enter, fokus berpindah ke navigasi, Tab berpindah antarlink dengan ring fokus, Escape mengembalikan fokus, serta filter kategori diubah menggunakan ArrowDown. Layout halaman baru tetap diterapkan saat reduced motion aktif.
- Screenshot mobile listing tema gelap ditinjau secara visual. Pemeriksaan fondasi yang tidak terdampak tidak diulang.

Ulangi browser checks bila mengubah halaman terkait: `pnpm build`, lalu `node tests/public-pages.mjs`. Tidak membutuhkan dependency tambahan. Default memakai Edge Windows; atur `BROWSER_BIN` untuk executable Chromium lain. Test menjalankan server pada port 3191 dan debugging browser pada 9291 dengan profil sementara terpisah. `CHECK_ONLY=keyboard` membatasi pengujian ke keyboard. Browser/server lokal mungkin membutuhkan izin sesuai sandbox.

## Batasan dan berikutnya

Seluruh naskah, tanggal, gambar, dan data profil masih fixture/placeholder; perlu konten dan persetujuan Putri sebelum rilis. Layout belum final. Integrasi Sanity, komentar, newsletter, kontak backend, dan Instagram belum dibangun sesuai scope. Locale asing masih memakai perilaku notFound Next.js dari fondasi; HTTP 404 tegas sudah diverifikasi khusus slug artikel pada ID/EN.

Task berikutnya: review halaman publik dan konten/placeholder bersama pengguna; setelah disetujui, lanjutkan task 03 Sanity. Tidak ada blocker implementasi halaman publik dengan fixture.
