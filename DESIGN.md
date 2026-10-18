# DESIGN — Putri Wella Sibarani

Versi 1.0 · 18 Oktober 2026. Pilihan warna dan font final; komposisi halaman masih usulan.

## 1. Prinsip
Editorial, elegan, reflektif. Tulisan mendominasi, ruang kosong lapang, garis pemisah tipis. Hindari pola dashboard, dekorasi berlebihan, serta card berbingkai untuk setiap elemen. Foto diri hanya pada Tentang. Gambar artikel merupakan pendukung, bukan kewajiban.

## 2. Warna
### Palette terpilih G — Midnight Azure
| Nama | Hex | Peran |
| --- | --- | --- |
| Midnight navy | #152343 | Teks utama/judul mode terang |
| Azure blue | #2457B2 | Link, aksi utama mode terang |
| Pale blue | #D6E4FF | Highlight/surface lembut |
| Light background | #F6F8FC | Background terang |
| Dark background | #0D172C | Background gelap |
| Light text | #E4EDFF | Teks mode gelap |

### Token semantik awal
| Token | Terang | Gelap |
| --- | --- | --- |
| background | #F6F8FC | #0D172C |
| surface | #FFFFFF | #152343 |
| foreground | #152343 | #E4EDFF |
| muted-foreground | #52617A | #B3C2DE |
| primary | #2457B2 | #A9C5FF |
| primary-foreground | #FFFFFF | #0D172C |
| subtle | #D6E4FF | #1B3159 |
| border | #D4DCEB | #33445F |
| focus | #2457B2 | #A9C5FF |

Token tambahan adalah usulan implementasi, bukan perubahan palette. Ukur kontras kombinasi aktual: teks normal minimal 4.5:1, teks besar/UI relevan minimal 3:1. Jangan memakai azure gelap sebagai teks kecil di background gelap. Status error/success memakai teks dan ikon, tidak warna saja.

## 3. Tipografi
DM Serif Display regular 400: display, judul halaman/artikel, kutipan utama. Tidak mensimulasikan bold pada font ini.
DM Sans 400/500/600/700: isi artikel, menu, metadata, form dan tombol. Self-host font melalui mekanisme framework saat produksi.

| Role | Desktop | Mobile | Line height |
| --- | --- | --- | --- |
| Hero/title utama | 64 px | 40 px | 1.08–1.15 |
| Judul artikel | 52 px | 36 px | 1.15 |
| Heading section | 36 px | 28 px | 1.2 |
| Judul item | 28 px | 24 px | 1.25 |
| Isi artikel | 18 px | 17 px | 1.75 |
| UI/body | 16 px | 16 px | 1.5 |
| Metadata | 14 px | 14 px | 1.5 |

Gunakan clamp untuk transisi fluid. Artikel selebar 65–72 karakter (sekitar 720 px), paragraf rata kiri, tidak justified. Jeda paragraf 1.25–1.5 em. Puisi mempertahankan baris/bait, menggunakan wrap pada baris sangat panjang agar tidak overflow; tidak dikonversi menjadi paragraf biasa. Hindari uppercase pada judul panjang.

## 4. Layout dan spacing
Grid dasar 4 px; skala 4/8/12/16/24/32/48/64/96. Container halaman max 1200 px. Padding horizontal 20 px mobile, 32 px tablet, 48 px desktop. Section gap 64–96 px desktop, 40–56 px mobile. Breakpoint awal 640/768/1024/1280 px.

List artikel: 3 kolom desktop bila ruang cukup, 2 tablet, 1 mobile; item teks tanpa gambar tetap punya hierarki yang setara. Radius kecil 6–12 px; gambar tidak seluruhnya harus berbentuk card. Shadow sangat terbatas.

## 5. Navigasi
Nama Putri sebagai identitas teks; menu Beranda/Tulisan/Tentang/Aktivitas/Kontak. Kontrol ID/EN dan tema dengan nama aksesibel. Mobile memakai menu yang dapat dibuka/ditutup, fokus terkelola, Escape menutup, area sentuh minimal 44 px. Skip link menuju konten. Indikator halaman aktif tidak bergantung warna saja.

## 6. Wireframe awal, belum disetujui
### Beranda
Header → intro singkat tanpa portrait → satu tulisan unggulan dengan cover opsional → daftar tulisan terbaru → cuplikan aktivitas → newsletter → footer. Konten utama berupa tulisan, bukan hero tinggi penuh layar. Sebelum coding final, sajikan tiga variasi komposisi dengan font/palette yang sama.

### Tulisan/detail
Filter kategori dan format; item memuat judul, excerpt, tanggal, bahasa, kategori. Detail: metadata → judul → excerpt opsional → cover opsional → isi → share → penulis singkat tanpa foto → terkait → komentar. Daftar isi hanya untuk artikel panjang yang memiliki beberapa heading, tidak pada puisi pendek.

### Tentang
Portrait dan bio → ruang lingkup kerja/pencapaian → pendidikan/keahlian → organisasi → penghargaan/publikasi. Jangan menampilkan nama instansi, logo instansi, atau riwayat fiktif.

### Aktivitas/kontak
Galeri konsisten dengan caption selalu tersedia. Lightbox mendukung next/previous/close dan keyboard. Form kontak memiliki label terlihat, bantuan error per field, state submitting/success/error.

## 7. Komponen
Button primary/secondary/text; link underline dalam artikel; category/format label; article list/card; pagination; filter; theme/language control; input/textarea; newsletter block; comment list/form/moderation notice; image/caption; quote; empty/error state; toast untuk salin tautan.

Definisikan default/hover/focus/disabled/loading. Tidak menampilkan komentar palsu atau jumlah pembaca buatan. Newsletter memiliki penjelasan rangkuman berkala dan tautan privasi.

## 8. Motion dan aksesibilitas
Transisi 150–250 ms; tidak ada parallax/autoplay yang mengganggu membaca. Hormati prefers-reduced-motion. Focus ring 2 px dengan offset, target sentuh 44 px. Semantik heading terurut, alt bermakna, caption terpisah dari alt. Tema mengikuti preferensi sistem pada kunjungan pertama dan pilihan eksplisit disimpan.

## 9. Asset dan template Instagram
Cover artikel disarankan 1600×1000, gunakan crop hotspot dan hindari teks tertanam. Portrait halaman Tentang rasio 4:5. Gambar responsif dan lazy-load kecuali aset prioritas.

Template Instagram awal 1080×1350 dan 1080×1920: navy/azure, judul DM Serif Display, metadata DM Sans, nama Putri dan alamat situs. Safe area luas; judul panjang harus mengecil dalam batas yang ditetapkan atau meminta versi pendek. Preview tidak boleh memotong kata; export menunggu font/aset selesai dimuat. Ukuran ini adalah output desain, bukan klaim batas API Instagram.
