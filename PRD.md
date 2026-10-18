# PRD — Putri Wella Sibarani

Versi 1.0 · 18 Oktober 2026 · Status: brief disepakati; layout belum final.

## 1. Tujuan produk
Website personal profesional untuk Putri Wella Sibarani sebagai profesional sekaligus penulis. Mendukung personal branding, berbagi pemikiran, serta membuka relasi dan kolaborasi. Tulisan merupakan fokus beranda.

Pembaca: relasi profesional/rekan kerja, komunitas penulis/pencinta sastra, serta peminat isu sosial, politik, dan ekonomi.

Karakter: profesional dan kredibel, kreatif dan ekspresif, cerdas dan reflektif. Tidak menyerupai situs resmi instansi.

## 2. Keputusan tetap
- Nama: Putri Wella Sibarani.
- Gaya editorial dengan judul elegan; palette Midnight Azure (G).
- Font DM Serif Display untuk judul; DM Sans untuk isi dan UI.
- Tema terang dan gelap.
- Foto diri hanya pada halaman Tentang, bukan hero beranda.
- Pengalaman memuat ruang lingkup pekerjaan dan pencapaian tanpa nama instansi.
- Pendidikan, keahlian, organisasi/kegiatan, penghargaan/publikasi ditampilkan.
- Halaman utama mendukung Indonesia dan Inggris. Default Indonesia adalah asumsi implementasi awal.
- Bahasa artikel mengikuti naskah asli; tidak ada kewajiban terjemahan otomatis.
- Konten awal berupa draft/catatan yang sudah dimiliki Putri.
- Aktivitas berupa galeri foto dengan caption singkat.
- Pengelolaan konten diutamakan pada laptop, tetap responsif.

## 3. Struktur informasi
| Halaman | Konten dan perilaku |
| --- | --- |
| Beranda | Perkenalan singkat tanpa foto diri; tulisan pilihan; artikel terbaru; cuplikan aktivitas; ajakan newsletter |
| Tulisan | Daftar artikel, filter kategori/format, pagination; pencarian dapat ditambahkan setelah konten memadai |
| Detail tulisan | Judul, kategori, format, tanggal, bahasa, cover opsional, isi, bagikan, komentar, tulisan terkait |
| Tentang | Foto, bio, ruang lingkup kerja/pencapaian, pendidikan, keahlian, organisasi, penghargaan/publikasi |
| Aktivitas | Galeri dengan caption, tanggal opsional, lightbox yang dapat diakses keyboard |
| Kontak | Email, LinkedIn, Instagram, formulir nama/email/pesan |
| Privasi | Penjelasan pemrosesan data formulir, komentar, dan newsletter sesuai layanan yang dipilih |
| Studio | Dashboard Sanity pada /studio; akses pengelolaan memerlukan login |

Tidak menyediakan CV unduhan sebelum disetujui; opsi itu tidak dipilih pada brief.

## 4. Fitur konten
Kategori awal: Politik & Kebijakan Publik, Ekonomi, Sastra. Format: artikel panjang, catatan pendek, puisi. Kategori dan format adalah dimensi terpisah.

Alur penulis: login → buat/edit → autosave draft → preview → publish → situs memperbarui konten. Unpublish dan perubahan slug harus ditangani secara sengaja. Draft tidak masuk daftar publik, pencarian publik, sitemap, atau metadata publik.

Puisi mempertahankan pergantian baris dan bait. Artikel mendukung heading, kutipan, list, link, dan gambar dengan caption/alt text. Cover tidak wajib.

## 5. Fitur pembaca dan integrasi
### Komentar
Termasuk scope produk; provider belum dipilih. Rancangan awal: komentar berstatus pending sampai disetujui, tanpa lampiran dan tanpa HTML bebas. Identitas/login mengikuti kemampuan provider. Email dan data moderasi tidak boleh publik. Sebelum provider tersedia, sembunyikan form atau tampilkan status yang jujur; jangan tampilkan sukses palsu.

### Newsletter
Rangkuman berkala berisi beberapa tulisan, bukan email otomatis untuk setiap artikel. Frekuensi belum dipilih. Gunakan provider email khusus dengan konfirmasi pendaftaran, unsubscribe, suppression, dan daftar subscriber privat. Putri memilih artikel dan meninjau isi sebelum pengiriman. Jangan melakukan pengiriman massal dalam request web biasa. Penyimpanan subscriber bukan bagian dataset Sanity publik.

### Formulir kontak
Kirim melalui layanan email/form server-side, dengan validasi, honeypot/rate limit dan status berhasil/gagal yang nyata. Provider dan email penerima belum ditentukan.

### Bantuan Instagram
Kustomisasi Studio: judul pendek, caption terpisah, preview template, salin caption, salin link, unduh gambar. Awal: satu cover portrait 1080×1350 dan Story 1080×1920 (ukuran rancangan, verifikasi kebutuhan platform sebelum rilis). Judul/foto dapat diambil dari artikel. Caption ditulis atau diedit manual. Tidak memerlukan AI berbayar, tidak auto-post, tidak mengambil kredensial Instagram. Carousel dan API publishing ditunda.

## 6. Teknologi dan arsitektur yang direncanakan
Next.js App Router + TypeScript + Tailwind CSS; Sanity Studio dan Content Lake; Vercel untuk frontend dan /studio; GitHub untuk kode. Pilih versi stabil yang kompatibel saat inisialisasi, bukan nomor versi dari percakapan lama.

Konten dan aset disimpan di Sanity; tidak perlu MongoDB untuk blog. Komentar, kontak, newsletter memakai layanan terpisah yang dipilih kemudian. Secret hanya server-side. Cache/revalidation memastikan publish terlihat tanpa push GitHub; target awal pembaruan maksimal 60 detik setelah proses invalidasi normal berhasil.

Jangan menaruh informasi sensitif, subscriber, pesan kontak, atau email komentar pada dataset publik. URL /studio sendiri bukan batas keamanan; otorisasi Sanity tetap wajib.

## 7. Tahapan
1. Desain: pilih alternatif beranda, kemudian halaman artikel dan mobile. Jangan menganggap wireframe awal sebagai final.
2. Fondasi: frontend dengan fixture dummy terpusat, tema, bahasa, halaman utama, artikel/puisi.
3. CMS: schemas, query, autentikasi Studio, draft preview, publish/revalidation.
4. Editorial: migrasi draft Putri, galeri, profil tanpa nama instansi, SEO.
5. Distribusi: bantuan Instagram, komentar, kontak dan newsletter nyata.
6. Rilis: verifikasi konten, akses, integrasi dan deployment Vercel.

Tahap 2–3 dapat direview sebagai preview. Rilis lengkap mencakup fitur interaksi yang diminta; fitur tertunda harus dinyatakan jelas.

## 8. Kriteria penerimaan
- Semua halaman responsif tanpa overflow pada lebar 360–1440 px; navigasi dan fokus keyboard bekerja.
- Tema tersimpan tanpa flash mencolok; kontras dan ukuran teks nyaman.
- ID/EN bekerja pada halaman utama tanpa tautan mati; artikel tidak diklaim telah diterjemahkan bila belum ada terjemahan.
- Foto diri tidak muncul di beranda dan nama instansi tidak muncul di data publik/metadata/alt text.
- Artikel panjang dan puisi terbaca dengan format benar; keadaan kosong/loading/error tersedia.
- Putri dapat mengedit dan publish tanpa Git; draft tetap terlindungi; unpublish menghapus tampilan publik setelah revalidasi.
- Komentar pending tidak tampil publik; subscribe/unsubscribe dan formulir kontak diverifikasi end-to-end sebelum diaktifkan.
- Cover Instagram terunduh dengan font/gambar utuh, tanpa teks terpotong; caption/link dapat disalin.
- Metadata, canonical, sitemap dan robots memakai domain aktual; dummy tidak ikut rilis.

## 9. Input yang masih dibutuhkan
Layout final; foto dan biografi; pengalaman/pencapaian yang diizinkan; data pendidikan/organisasi/publikasi; artikel awal; kontak aktual; domain; frekuensi newsletter; provider komentar/email; anggaran operasional. Jangan mengarang riwayat atau pencapaian.

## 10. Referensi teknis
Verifikasi ulang paket dan batas layanan saat implementasi: https://www.sanity.io/pricing · https://www.sanity.io/docs/nextjs · https://vercel.com/docs/plans
Kuota/harga tidak dijadikan kontrak tetap dalam dokumen ini.
