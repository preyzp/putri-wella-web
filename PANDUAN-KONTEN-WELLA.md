# Panduan Konten Website Putri Wella Sibarani

Disusun 19 Oktober 2026 berdasarkan kode website dan pengaturan Studio yang ada saat ini. Panduan ini untuk Wella sebagai pengelola konten, bukan petunjuk teknis pengembangan.

**Mulai dari sini:** buat kategori → buat tulisan → periksa preview bila tersedia → Publish → periksa halaman publik.

Semua contoh di panduan adalah contoh cara mengisi, bukan riwayat, pendidikan, pekerjaan, pencapaian, atau pandangan Putri. Ganti teks dalam tanda `[ ... ]` dengan informasi yang benar dan sudah disetujui. Jangan menerbitkan contoh latihan sebagai fakta.

## 1. Membuka website dan masuk Studio

| Tujuan | Alamat |
| --- | --- |
| Website | [putriwella.web.id](https://putriwella.web.id) |
| Beranda Indonesia | [Halaman ID](https://putriwella.web.id/id) |
| Beranda English | [Halaman EN](https://putriwella.web.id/en) |
| Pengelolaan konten | [Sanity Studio](https://putriwella.web.id/studio) |
| Daftar tulisan | [Tulisan](https://putriwella.web.id/id/tulisan) |
| Profil | [Tentang](https://putriwella.web.id/id/tentang) |
| Galeri | [Aktivitas](https://putriwella.web.id/id/aktivitas) |
| Kontak publik | [Kontak](https://putriwella.web.id/id/kontak) |

1. Buka alamat Studio di atas.
2. Masuk menggunakan akun yang sudah diberi akses ke proyek website Putri. Gunakan metode masuk yang sesuai dengan akun tersebut; panduan ini tidak menetapkan penyedia login tertentu.
3. Jika tidak dapat membuka proyek atau tidak dapat mengedit, hubungi pengelola website untuk memeriksa akses akun.
4. Jangan membuat proyek baru untuk mengatasi masalah akses.

Alamat di atas adalah alamat situs yang dipakai implementasi. Ketersediaan situs online dan login akun Wella tidak diperiksa ulang saat penulisan panduan ini.

### Status fitur yang perlu diketahui

| Status | Artinya untuk Wella |
| --- | --- |
| Aktif pada implementasi publik | Tulisan, filter Kategori/Format, detail, puisi, gambar, Tentang, Aktivitas, Kontak, Pengaturan, UI ID/EN, serta tema terang/gelap sudah terhubung. Pembacaan konten publik pernah diverifikasi; tidak semua menu sudah memiliki konten nyata untuk diuji. |
| Preview draft sudah diimplementasikan, belum dipastikan pada Studio online | Alur preview dan keluar preview lulus pengujian lokal terkontrol. Catatan verifikasi terakhir belum membuktikan alur akun Studio dan draft cloud nyata. Jika belum bisa digunakan, minta pengelola menyiapkan akses preview. |
| Persiapan rilis utama | Label “Preview awal / Rancangan belum final” sudah dihapus dari publik. Halaman publik boleh diindeks dan memiliki sitemap; tampil di hasil pencarian tetap keputusan mesin pencari, bukan hasil otomatis setelah Publish. Banner Preview draft tetap khusus pratinjau privat. |
| Ditunda | Komentar, like, pengiriman newsletter, export/pengiriman Instagram, dan pilihan varian palette. Formulir kontak juga belum tersedia. Kolom editorial bukan bukti fitur tersebut aktif. |

## 2. Mengenal menu Studio dan tempat hasilnya muncul

Daftar **Konten** berisi menu berikut, sesuai urutannya. **Preview draft** adalah tool/tab tambahan, bukan jenis dokumen baru.

| Menu | Yang dikelola | Hasil pada website |
| --- | --- | --- |
| Tulisan | Artikel, catatan pendek, puisi | Beranda, daftar Tulisan, detail tulisan, dan tulisan terkait. |
| Aktivitas | Kegiatan beserta kumpulan foto | Galeri Aktivitas; judul kegiatan/tanggal dapat muncul pada tiap foto. Belum ada cuplikan aktivitas di beranda. |
| Profil | Nama lengkap, bio, foto diri, keahlian, ringkasan profesional | Halaman Tentang. Foto diri hanya ditempatkan di halaman ini. |
| Pengalaman | Ruang lingkup pekerjaan dan pencapaian yang disetujui | Bagian Ruang lingkup pekerjaan dan Pencapaian di Tentang. |
| Pendidikan | Pendidikan yang dapat dipublikasikan | Bagian Pendidikan di Tentang. |
| Organisasi | Organisasi dan peran | Bagian Organisasi di Tentang. |
| Penghargaan/Publikasi | Penghargaan atau publikasi nyata | Bagian Penghargaan & publikasi di Tentang. |
| Kategori | Kelompok topik tulisan | Label kategori tulisan dan pilihan filter Kategori. Belum ada halaman kategori tersendiri. |
| Pengaturan | Identitas situs, intro, pilihan tulisan, kontak, SEO | Header/footer, beranda, Kontak, dan informasi halaman untuk mesin pencari. Sebagian kolom belum dipakai; lihat bagian 11. |
| Draft Newsletter | Catatan rancangan editorial | Tidak tampil sebagai newsletter publik dan tidak mengirim email. |
| Preview draft | Pratinjau tulisan sebelum Publish | Halaman preview privat dengan banner; tidak mengganti URL publik. |

**Profil** dan **Pengaturan** masing-masing hanya satu dokumen utama. Buka menu yang sudah ada; tidak perlu membuat versi kedua. Aksi menggandakan dan menghapus kedua dokumen ini tidak disediakan oleh konfigurasi Studio saat ini.

Dokumen pada menu Pengaturan memakai judul tampilan **Pengaturan situs**. Daftar Tulisan di Studio menyediakan susunan **Tanggal terbaru**; urutan publik sendiri tetap mengikuti tanggal editorial, bukan pilihan tampilan daftar Studio.

## 3. Tabel kolom dan aturan pengisian

Nama pada kolom pertama mengikuti label schema Studio, termasuk label berbahasa Inggris. Tombol bawaan Studio dapat mengikuti bahasa antarmuka akun.

### Cara membaca status wajib

- **Wajib:** harus memenuhi validasi sebelum Publish; draft masih dapat disimpan saat belum lengkap.
- **Opsional:** boleh tidak diisi. Bila diisi, aturan format tetap berlaku.
- **Wajib bilingual:** kelompok wajib, dengan subkolom **Indonesia** dan **English** yang sama-sama diberi validasi wajib.
- **Opsional bilingual:** kelompok tidak wajib; jika digunakan, subkolom **Indonesia** dan **English** tetap memiliki validasi wajib. Jangan membuat kelompok setengah terisi lalu mengabaikan error Studio.
- **Peringatan:** saran editorial, berbeda dari error yang menghalangi Publish.

**Penting:** website mempunyai fallback Indonesia jika English kosong, tetapi schema kelompok teks bilingual saat ini masih mewajibkan kedua bahasa. Fallback tampilan bukan izin untuk melewati validasi Studio. Ini berbeda dari beberapa catatan lama yang menyebut English selalu opsional. Jika belum punya versi English yang benar, simpan draft atau minta bantuan editorial; jangan mengarang terjemahan atau kredensial agar validasi lolos. Kolom SEO ID/EN mempunyai aturan berbeda: subkolomnya opsional.

### Tulisan

| Label aktual | Fungsi dan tempat pemakaian | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Judul | Judul pada kartu, detail, dan judul halaman | Wajib; lebih dari 100 karakter memunculkan peringatan, bukan larangan mutlak | `[Judul naskah yang disetujui]` |
| Slug | Bagian akhir alamat tulisan | Wajib dan unik antartulisan, termasuk bahasa lain; huruf kecil/angka dipisah tanda hubung | `catatan-membaca-kota` |
| Bahasa naskah | Menandai bahasa asli, bukan menerjemahkan isi | Wajib; pilih **Indonesia** atau **English** | Indonesia untuk naskah Indonesia |
| Grup terjemahan (hanya jika naskah terjemahan tersedia) | Catatan pengelompokan versi terjemahan nyata | Opsional; belum mengaktifkan perpindahan terjemahan artikel di publik | `[Kode yang sama untuk dua naskah terjemahan yang benar-benar ada]` |
| Format | Menentukan jenis tulisan dan filter | Wajib: **Artikel panjang**, **Catatan pendek**, atau **Puisi** | Artikel panjang; di UI Indonesia publik ditulis “Artikel” |
| Kategori | Menghubungkan tulisan dengan topiknya | Wajib, minimal satu; pilihan tidak boleh duplikat | Pilih dokumen kategori Ekonomi yang sudah dibuat dan diterbitkan |
| Tag | Catatan kata kunci | Opsional, maksimal 20, tidak duplikat; belum ditampilkan sebagai daftar tag/filter publik | `kota`, `membaca` jika sesuai naskah |
| Ringkasan | Cuplikan di kartu dan detail; cadangan deskripsi halaman | Opsional; lebih dari 240 karakter memunculkan peringatan | `[Satu atau dua kalimat yang merangkum naskah]` |
| Cover (opsional) | Gambar pembuka detail dan sumber thumbnail beranda serta daftar Tulisan | Opsional; Teks alternatif wajib jika gambar dipilih | Gambar yang disetujui, beserta alt yang sesuai |
| Isi | Naskah utama | Wajib, minimal satu blok; tabel jenis blok ada di bawah | Paragraf, heading, kutipan, gambar, atau Bait puisi |
| Tanggal editorial pertama terbit | Tanggal tampil dan dasar urutan terbaru | Wajib, tanggal/jam; **bukan penjadwalan otomatis** | Pilih tanggal editorial sebenarnya |
| SEO | Kelompok informasi halaman | Opsional; aturan subkolom dijelaskan di tabel SEO | Isi Meta description yang akurat |
| Riwayat slug | Mencatat alamat lama | Opsional, tidak duplikat; tiap isian harus huruf kecil/angka dengan tanda hubung; **belum membuat redirect** | `judul-sebelumnya`, tanpa domain atau garis miring |
| Tulisan terkait | Memilih bacaan lanjutan | Opsional, tidak duplikat; publik menampilkan maksimal dua artikel published selain artikel itu sendiri | Pilih dua tulisan yang relevan |
| Catatan Instagram (data editorial saja) | Kolom editorial tersembunyi | Opsional dan tidak ditampilkan dalam editor normal; fitur belum aktif | Tidak perlu diisi |

Pemilihan slug otomatis memakai judul sebagai sumber, dengan pengaturan panjang 96 karakter. Jangan menganggap ini batas validasi panjang manual; yang wajib diperiksa adalah bentuk slug dan keunikannya. Jangan mengubah slug artikel lama hanya karena mengganti judul.

### Kategori

| Label aktual | Fungsi | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Judul | Nama kategori di label/filter | Wajib bilingual | Indonesia: `Ekonomi`; English: `Economics` |
| Slug | Identitas kategori | Wajib; unik untuk kategori; huruf kecil/angka dengan tanda hubung | `ekonomi` |
| Deskripsi | Penjelasan editorial kategori | Opsional bilingual; belum ditampilkan pada halaman publik | `[Cakupan topik kategori]` |
| Urutan | Mengurutkan pilihan kategori | Opsional; bilangan bulat minimal 0 | `0`, `10`, `20` untuk mengatur urutan |

### Profil

| Label aktual | Fungsi di Tentang | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Nama lengkap | Nama pada bagian Bio | Wajib | `Putri Wella Sibarani` |
| Bio singkat | Paragraf pengenal | Wajib bilingual | `[Bio singkat faktual yang disetujui, untuk masing-masing bahasa]` |
| Biografi | Naskah Bio lebih lengkap, menggunakan blok seperti Isi tulisan | Wajib bilingual | `[Biografi faktual tanpa nama instansi pekerjaan]` |
| Foto diri — hanya halaman Tentang | Portrait pada Tentang | Opsional; Teks alternatif wajib jika gambar dipilih | Foto Putri sendiri yang disetujui |
| Keahlian | Daftar keahlian | Opsional; setiap item memiliki Indonesia dan English wajib | `[Keahlian yang dapat dipertanggungjawabkan]` beserta padanan English |
| Ringkasan ruang lingkup profesional | Pengantar Ruang lingkup pekerjaan | Opsional bilingual | `[Ringkasan bidang kerja tanpa nama instansi]` |

Mengubah Nama lengkap di Profil tidak otomatis mengubah Nama situs di Pengaturan; keduanya kolom berbeda.

### Pengalaman

| Label aktual | Fungsi di Tentang | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Judul ruang lingkup | Judul entri pekerjaan dan kelompok pencapaian | Wajib bilingual | `[Ruang lingkup kerja yang benar-benar dilakukan]` |
| Deskripsi ruang lingkup | Penjelasan pekerjaan | Wajib bilingual | `[Uraian tugas yang diizinkan untuk dipublikasikan]` |
| Pencapaian yang disetujui | Daftar pada bagian Pencapaian | Opsional; tiap item bilingual wajib kedua bahasa | `[Hasil kerja nyata yang boleh diungkapkan]` |
| Label periode (opsional) | Teks periode | Opsional, teks bebas | `[Periode sebenarnya]` |
| Urutan | Mengurutkan entri | Opsional; bilangan bulat minimal 0 | `10` |

Tidak ada kolom nama instansi pekerjaan di menu ini. Jangan memasukkannya melalui judul, deskripsi, pencapaian, gambar, alt, caption, atau kolom lain sebagai jalan memutar.

### Pendidikan

| Label aktual | Fungsi di Tentang | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Kualifikasi | Judul pendidikan | Wajib bilingual | `[Kualifikasi resmi sesuai dokumen]` |
| Institusi pendidikan | Nama tempat pendidikan | Wajib | `[Nama institusi pendidikan sebenarnya]` |
| Bidang studi | Bidang pendidikan | Wajib bilingual | `[Bidang studi sebenarnya]` |
| Tahun mulai | Awal periode | Opsional; bilangan bulat 1900–2200 | `[Tahun mulai sebenarnya]` |
| Tahun selesai | Akhir periode | Opsional; bilangan bulat, tidak sebelum Tahun mulai bila diisi, maksimal 2200 | `[Tahun selesai sebenarnya]` |
| Deskripsi | Keterangan tambahan | Opsional bilingual | `[Keterangan faktual yang relevan]` |
| Urutan | Mengurutkan entri | Opsional; bilangan bulat minimal 0 | `10` |

Institusi pendidikan memang ditampilkan. Ini berbeda dari larangan menyebut instansi pekerjaan.

### Organisasi

| Label aktual | Fungsi di Tentang | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Nama organisasi | Judul entri | Wajib | `[Nama organisasi yang benar]` |
| Peran | Peran di organisasi | Wajib bilingual | `[Peran sebenarnya]` |
| Label periode (opsional) | Periode keterlibatan | Opsional | `[Periode sebenarnya]` |
| Deskripsi | Keterangan keterlibatan | Opsional bilingual | `[Aktivitas yang boleh dipublikasikan]` |
| URL publik (opsional) | Tautan “Lihat sumber” | Opsional; harus HTTPS | Alamat halaman organisasi yang relevan dan benar |
| Urutan | Mengurutkan entri | Opsional; bilangan bulat minimal 0 | `10` |

### Penghargaan/Publikasi

| Label aktual | Fungsi di Tentang | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Jenis | Membedakan data penghargaan dan publikasi | Wajib: **Penghargaan** atau **Publikasi**; tampilan publik saat ini digabung dalam satu bagian | Pilih sesuai bukti yang ada |
| Judul | Judul entri | Wajib bilingual | `[Nama penghargaan atau judul publikasi yang nyata]` |
| Pemberi/penerbit (opsional) | Nama pemberi/penerbit yang ditampilkan | Opsional | `[Pemberi/penerbit yang boleh disebut]` |
| Tanggal (opsional) | Tanggal penghargaan/publikasi | Opsional | Pilih tanggal sebenarnya |
| Ringkasan | Keterangan singkat | Opsional bilingual | `[Penjelasan faktual]` |
| URL publik (opsional) | Tautan “Lihat sumber” | Opsional; harus HTTPS | Halaman sumber yang benar |
| Urutan | Mengurutkan entri; tanggal terbaru menjadi pembeda setelahnya | Opsional; bilangan bulat minimal 0 | `10` |

### Aktivitas

| Label aktual | Fungsi di Aktivitas | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Judul | Nama kegiatan pada foto-fotonya | Wajib bilingual | `[Nama kegiatan yang benar-benar diikuti]` |
| Tanggal (opsional) | Tanggal kegiatan, bukan jadwal tayang | Opsional | Tanggal kegiatan sebenarnya |
| Foto dan caption | Kumpulan foto dalam satu kegiatan | Wajib, minimal satu; tiap item wajib memiliki berkas gambar | Foto yang disetujui, dengan Teks alternatif dan Caption singkat |
| Urutan | Mengurutkan kegiatan; tanggal terbaru menjadi pembeda setelahnya | Opsional; bilangan bulat minimal 0 | `10` |

Subkolom setiap item **Foto dan caption**:

| Label aktual | Fungsi | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Teks alternatif | Menjelaskan isi visual untuk aksesibilitas | Wajib bilingual | `[Deskripsi hal penting yang benar-benar terlihat pada foto]` |
| Caption singkat | Keterangan terlihat di bawah foto | Wajib bilingual | `[Konteks foto yang boleh dipublikasikan]` |
| Kredit foto | Menyebut sumber/pemilik foto | Opsional | `[Nama pemilik foto sesuai izin]` |

### Pengaturan

| Label aktual | Fungsi sebenarnya | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Nama situs | Nama di header/footer dan bagian judul halaman | Wajib | `Putri Wella Sibarani` |
| Perkenalan | Paragraf pendek di beranda; bukan judul besar hero | Wajib bilingual | `[Perkenalan singkat yang disetujui]` dalam dua bahasa |
| Label navigasi | Kolom tersedia, tetapi label menu publik masih memakai teks tetap website | Kelompok opsional; jika digunakan, subkelompok `home`, `writing`, `about`, `activities`, `contact` memakai aturan wajib bilingual | Tidak perlu diisi untuk mengganti navigasi saat ini |
| Email publik yang disetujui | Alamat email pada Kontak | Opsional; alamat email valid, satu alamat saja | `putriwella97@gmail.com`, tanpa awalan `mailto:` |
| LinkedIn | Tautan LinkedIn pada Kontak | Opsional; validasi Studio HTTPS; publik juga membatasi ke domain LinkedIn yang benar | `https://www.linkedin.com/in/putriwella97/` |
| Instagram | Tautan Instagram pada Kontak, bukan fitur export | Opsional; validasi Studio HTTPS; publik juga membatasi ke domain Instagram yang benar | `https://www.instagram.com/wellasibarani/` |
| SEO default | Kelompok SEO Indonesia/English | Opsional; subkolom SEO juga opsional | Isi Meta description yang tepat pada Indonesia dan bila tersedia English |
| Tulisan pilihan | Menentukan tulisan unggulan beranda | Opsional; maksimal tiga pilihan berbeda, tetapi layout saat ini hanya menampilkan satu yang valid/published | Letakkan tulisan yang paling diutamakan di awal |
| Pengantar newsletter | Catatan editorial; belum ada section newsletter publik | Opsional bilingual | Tidak perlu diisi sampai fitur disepakati |
| Catatan pandangan pribadi untuk ditinjau | Catatan editorial; belum dipasang pada halaman publik | Opsional bilingual | `[Teks yang benar-benar telah ditinjau]`, bila diperlukan |

### Draft Newsletter — rancangan saja

| Label aktual | Fungsi | Wajib/aturan schema | Contoh pengisian |
| --- | --- | --- | --- |
| Judul | Judul rancangan | Wajib | `[Judul rangkuman editorial]` |
| Pengantar | Pembuka rancangan | Wajib | `[Pengantar yang akan ditinjau]` |
| Bahasa naskah | Bahasa rancangan | Wajib: Indonesia atau English | Indonesia |
| Tulisan untuk ditinjau | Referensi tulisan untuk rangkuman | Wajib, minimal satu, tidak duplikat | Pilih tulisan yang relevan |
| Teks penutup | Penutup rancangan | Opsional | `[Penutup untuk ditinjau]` |

Aturan wajib di tabel ini adalah validasi isi, **bukan tanda bahwa pengiriman aktif**. Aksi yang dipertahankan untuk dokumen ini hanya hapus dan buang perubahan; aksi Publish tidak ditawarkan. Draft tersimpan tidak dikirim ke siapa pun. Jangan menyimpan daftar pelanggan atau alamat penerima di menu ini.

### Subkolom gambar editorial dan SEO

Gambar editorial dipakai pada Cover, gambar dalam Isi, Foto diri, serta OG image.

| Label aktual | Fungsi | Wajib/aturan | Contoh pengisian |
| --- | --- | --- | --- |
| Teks alternatif | Deskripsi visual satu bahasa | Wajib jika gambar sudah dipilih | `[Objek/kejadian penting yang terlihat]`, bukan nama berkas |
| Caption | Keterangan yang terlihat di detail/Tentang | Opsional | `[Konteks gambar yang disetujui]` |
| Kredit gambar | Sumber/pemilik gambar | Opsional | `[Pemilik gambar sesuai izin]` |
| Crop/hotspot pada kontrol gambar | Mengatur potongan dan bagian penting gambar; bukan kolom unggahan thumbnail tambahan | Opsional | Arahkan bagian penting gambar ke area fokus |

| Label aktual dalam SEO / SEO default | Wajib/aturan | Pemakaian saat ini dan contoh |
| --- | --- | --- |
| Indonesia / English pada SEO default | Keduanya kelompok opsional | Memisahkan metadata menurut UI. Ini bukan aturan wajib bilingual teks biasa. |
| Meta title | Opsional | SEO Tulisan mengganti judul metadata artikel, tanpa mengganti judul naskah yang dibaca. SEO default mengganti judul metadata beranda; halaman lainnya tetap memakai nama halaman dan Nama situs. Jika kosong, ada judul cadangan yang sesuai. |
| Meta description | Opsional | Dipakai. Contoh: `[Deskripsi singkat dan akurat tentang naskah atau situs]`. |
| OG image (opsional) | Opsional; mengikuti aturan gambar editorial bila diisi | Gambar cadangan untuk berbagi. Pada artikel, Cover lebih diprioritaskan, lalu OG image artikel, lalu OG image default Indonesia. Halaman utama lain memakai OG image default sesuai bahasa dengan fallback Indonesia. Tanpa gambar yang valid, website tidak membuat gambar acak. |

Kolom Instagram tersembunyi juga memuat **Judul pendek**, **Caption manual**, **Gambar opsional**, dan **Format rancangan** (`portrait`/`story`). Semuanya opsional dan belum mengaktifkan export maupun publikasi Instagram. Tidak perlu mencari cara membuka kolom tersembunyi tersebut.

## 4. Membuat kategori dan memilih kategori/format tulisan

1. Buka **Kategori**, lalu gunakan kontrol pembuatan dokumen baru.
2. Isi **Judul → Indonesia** dan **English**. Contoh nama topik: Ekonomi / Economics. Pilih nama yang sesuai dengan isi nyata situs.
3. Isi **Slug**, misalnya `ekonomi`. Slug kategori mengambil Judul Indonesia sebagai sumber bila memakai pembuat slug bawaan.
4. Isi **Deskripsi** hanya bila diperlukan; kelompok ini mengikuti aturan bilingual di bagian 3.
5. Isi **Urutan** bila ingin mengatur posisi pilihan, lalu Publish kategori.
6. Buka **Tulisan**, pilih kategorinya pada **Kategori**. Pilih minimal satu; kategori bukan teks bebas atau Tag.
7. Pilih **Format** sesuai bentuk naskah, bukan panjang judul. Kategori menyatakan topik; Format menyatakan jenis tulisan.

Publik hanya menampilkan kategori yang published. Referensi kategori yang belum terbit tidak menjamin labelnya muncul. Urutan pilihan kategori mengikuti Urutan yang lebih kecil dahulu, kemudian Judul Indonesia. Tidak ada kategori bawaan yang perlu diasumsikan sudah tersedia.

## 5. Membuat artikel, catatan pendek, dan puisi

### Artikel panjang atau catatan pendek

1. Buka **Tulisan** dan buat dokumen baru.
2. Isi **Judul**, **Slug**, **Bahasa naskah**, **Format**, dan **Kategori**.
3. Isi **Ringkasan** bila diperlukan. Ini membantu pembaca mengenali isi tanpa membuka detail.
4. Isi **Isi** menggunakan blok yang tersedia: **Paragraf**, **Heading 2**, **Heading 3**, **Heading 4**, **Kutipan**, daftar **Bullet** atau **Nomor**, serta teks **Tebal**, **Miring**, dan **Tautan**.
5. Pada **Tautan → URL**, isi alamat yang benar. Website mendukung tautan web, email, atau path internal yang aman; jangan menempelkan kode atau skrip sebagai alamat.
6. Tambahkan **Gambar editorial** di antara blok jika diperlukan. Gambar dalam Isi berbeda dari Cover.
7. Pilih **Tanggal editorial pertama terbit** yang benar. Tanggal di masa depan tidak menunda tayang setelah Publish.
8. Tinjau SEO dan Tulisan terkait bila diperlukan, tunggu penyimpanan selesai, lalu ikuti preview/checklist sebelum Publish.

Tidak ada batas jumlah kata khusus yang membedakan Artikel panjang dan Catatan pendek. Keduanya memakai editor Isi yang sama. Pilih berdasarkan keputusan editorial.

### Puisi: satu blok untuk satu bait

1. Pilih **Format → Puisi**.
2. Pada **Isi**, tambahkan blok **Bait puisi**.
3. Isi **Bait (baris dipertahankan)**. Pindah baris di dalam kolom ini untuk setiap larik.
4. Tambahkan blok **Bait puisi** berikutnya untuk bait berikutnya. Urutan blok adalah urutan bait di website.
5. Periksa baris dan jarak bait di preview, termasuk pada layar ponsel. Baris yang terlalu panjang tetap dapat membungkus mengikuti lebar layar.

Contoh bentuk latihan, bukan naskah Putri:

```text
[baris pertama bait satu]
[baris kedua bait satu]
```

Blok Bait puisi kedua:

```text
[baris pertama bait dua]
[baris kedua bait dua]
```

Memilih Format Puisi **tidak otomatis mengubah paragraf biasa menjadi bait**. Gunakan blok Bait puisi untuk mempertahankan susunan larik.

## 6. Cover, gambar isi, alt, caption, dan potongan gambar

| Hal yang diatur | Yang terjadi di website |
| --- | --- |
| Cover tulisan | Tampil sebagai gambar pembuka pada detail; menjadi thumbnail tiap item Tulisan terbaru di beranda dan daftar Semua Tulisan secara otomatis. Tidak perlu unggahan thumbnail kedua. |
| Thumbnail beranda dan daftar Tulisan | Rasio 16:10. Urutannya Kategori → Thumbnail → Judul → Ringkasan jika ada → Metadata. Gambar dan judul membuka artikel. Caption cover tidak ditampilkan di thumbnail. Filter tetap bekerja dan satu hasil tetap selebar satu kolom pada layar besar. |
| Cover kosong | Bidang warna netral sesuai tema pada thumbnail; tidak diganti foto acak. |
| Tulisan unggulan | Layout unggulan saat ini tidak menampilkan cover. Cover bukan pengatur gambar hero besar. |
| Gambar editorial dalam Isi | Muncul pada posisi bloknya di detail dan preview, dengan alt/caption/kredit yang diisi. |
| Foto diri | Portrait 4:5 di Tentang saja. Jangan mengunggah foto orang lain sebagai Putri. Jangan menempatkan portrait ke Cover dengan harapan pembatasan lokasi foto akan berlaku otomatis. |
| Foto Aktivitas | Potongan 16:10 pada galeri, dengan caption/kredit serta judul/tanggal kegiatan bila ada. Tidak ada lightbox khusus. |

**Teks alternatif** membantu orang memahami gambar ketika memakai pembaca layar atau gambar tidak terlihat. Jelaskan isi visual yang penting. **Caption** adalah keterangan yang sengaja dibaca semua pengunjung di bawah gambar; dapat memberi konteks yang tidak terlihat. **Kredit** menyatakan pemilik/sumber. Jangan menyalin judul artikel ke semua alt tanpa memeriksa gambarnya.

1. Pilih gambar yang boleh dipublikasikan.
2. Lengkapi Teks alternatif. Untuk galeri, lengkapi kedua bahasa dan Caption singkat sesuai validasi.
3. Isi caption/kredit yang sesuai dan tidak mengandung nama instansi pekerjaan.
4. Atur crop/hotspot bila perlu. Crop membatasi area potongan, hotspot menandai bagian yang ingin dipertahankan saat gambar dipotong.
5. Periksa hasil pada thumbnail dan pada detail secara terpisah.

Crop/hotspot saat ini digunakan oleh **thumbnail beranda dan daftar Tulisan, portrait Tentang, dan galeri Aktivitas**. Renderer **cover detail dan gambar dalam Isi masih menampilkan gambar sumber tanpa menerapkan crop/hotspot Studio**. Karena itu, jangan menjanjikan bahwa potongan thumbnail akan persis sama di detail/preview artikel.

Foto portrait/galeri tanpa gambar yang dapat dibaca atau tanpa alt yang terisi dapat disembunyikan. Thumbnail juga dapat menjadi placeholder jika cover tidak dapat dipakai. Memilih gambar saja belum cukup; isi keterangannya dan periksa hasil.

## 7. Draft, autosave, Publish, Unpublish, dan Delete

| Keadaan/aksi | Arti dan konsekuensi |
| --- | --- |
| Draft | Naskah kerja. Belum terlihat di halaman publik. Artikel baru yang hanya draft menghasilkan halaman tidak ditemukan bila URL publik dibuka. |
| Autosave | Studio menyimpan perubahan draft selama bekerja dan koneksi mendukung. Tunggu indikator penyimpanan selesai; jangan menganggap menutup tab atau mengetik otomatis berarti Publish. |
| Publish | Menjadikan versi yang lolos validasi sebagai versi publik. Tanggal editorial bukan jadwal; Publish dapat menayangkan naskah segera. |
| Mengedit artikel published | Perubahan tersimpan sebagai draft. Pengunjung tetap melihat versi published sebelumnya sampai Publish lagi. Preview dapat menampilkan perubahan draft. |
| Unpublish | Menarik versi published dari publik. Dokumen dapat tetap dikerjakan sebagai draft. Tulisan hilang dari daftar/pilihan publik dan detailnya menjadi tidak ditemukan setelah dimuat ulang. |
| Delete | Menghapus dokumen, berbeda dari sekadar menarik tayangan. Jangan mengandalkan pemulihan sekali klik; simpan salinan naskah penting sebelum menghapus. |
| Buang perubahan draft | Membuang perubahan yang belum published; bukan cara menghapus versi published yang masih tayang. Pastikan membaca konfirmasi Studio. |

### Menerbitkan atau memperbarui

1. Periksa draft dan selesaikan error validasi. Bedakan peringatan panjang Judul/Ringkasan dari error wajib.
2. Tunggu penyimpanan selesai dan periksa preview bila tersedia.
3. Pilih **Publish** pada dokumen yang ingin diterbitkan.
4. Buka halaman publik dan muat ulang. Website membaca konten published pada permintaan berikutnya; tab yang sudah terbuka tidak dijanjikan berubah sendiri.
5. Untuk perubahan lanjutan, ulangi langkah tersebut. Perubahan draft tidak otomatis mengganti versi publik.

### Menarik atau menghapus

1. Buka dokumen yang benar dan pastikan judulnya.
2. Pilih **Unpublish** jika hanya ingin menarik tayangan; pilih **Delete** bila benar-benar ingin menghapus dokumen. Baca konfirmasi yang muncul. Letak aksi bawaan dapat berbeda menurut status dokumen dan bahasa Studio.
3. Jika Studio menolak karena dokumen dipakai dokumen lain, periksa referensi seperti Kategori, Tulisan pilihan, atau Tulisan terkait. Rapikan referensi yang relevan; jangan memaksa penghapusan tanpa memahami akibatnya.
4. Muat ulang daftar dan URL detail publik untuk memeriksa hasil.

Untuk menarik sementara, Unpublish biasanya lebih sesuai daripada Delete. Profil dan Pengaturan tidak menawarkan Delete/duplikasi lewat Studio; jika Pengaturan di-Unpublish, copy/kontak default website kembali berlaku. Untuk Draft Newsletter, jangan mencari Publish: yang tersedia hanya pengelolaan draft, buang perubahan, dan hapus.

## 8. Membuka dan keluar dari preview draft

**Status verifikasi:** fitur sudah diimplementasikan dan diuji terkontrol. Alur akun Studio online dan pembacaan draft nyata belum dipastikan pada pemeriksaan terakhir. Jika muncul pesan bahwa preview belum dikonfigurasi, hubungi pengelola website; Wella tidak perlu mengubah pengaturan teknis sendiri.

1. Di Studio, buka **Tulisan** lalu pilih dokumennya.
2. Pastikan **Slug** sudah terisi dan perubahan selesai disimpan. Tulisan tidak harus pernah Published. Draft yang belum lengkap tetap bisa dipratinjau; judul kosong dapat tampil sebagai **Tulisan tanpa judul**, bukan berarti naskah siap Publish.
3. Cari area lokasi pemakaian dokumen di bagian atas editor. **Teks tautan lokasinya memakai Judul tulisan**, bukan selalu tombol bertuliskan “Preview draft”. Jika judul kosong, teks cadangannya “Preview draft”. Buka lokasi tersebut untuk menuju tool **Preview draft**.
4. Tool/tab **Preview draft** juga tersedia sebagai tool Studio. Jika pertama kali terbuka halaman petunjuk, kembali pilih lokasi tulisan yang mempunyai slug.
5. Pastikan tampilan website memiliki banner **Preview draft** dan tombol **Keluar preview**. Halaman ini menampilkan perubahan draft judul, ringkasan, cover, isi/gambar/caption, kategori, serta puisi.
6. Setelah mengedit lagi, tunggu autosave lalu muat ulang preview. Tidak perlu mengharapkan semua ketikan diperbarui secara langsung tanpa muat ulang.
7. Selesai memeriksa, tekan **Keluar preview**. Jika versi published dengan slug tersebut tersedia, tujuan keluar adalah detail publiknya. Jika draft-only, slug berbeda dari versi published, atau versi publik tidak dapat diperiksa, tujuannya daftar Tulisan.

Preview memakai alamat khusus yang berbeda dari detail publik. **Jangan membagikan alamat preview sebagai alamat artikel.** Membuka URL biasa atau menambahkan `?preview=true` tidak memberi akses draft. Sesi preview dibatasi sekitar satu jam; bila berakhir, buka kembali melalui Studio. Menutup tab tidak selalu sama dengan menekan Keluar preview.

Halaman publik tetap menunjukkan versi published walaupun Wella sedang mempunyai sesi preview. Preview bukan pratinjau draft seluruh website: beranda, Pengaturan, Profil, Aktivitas, dan daftar publik tidak berubah menjadi draft. Preview artikel juga tidak menampilkan tombol salin tautan draft atau daftar tulisan terkait draft.

## 9. Bahasa Indonesia/English dan fallback

1. Tombol **ID/EN** mengganti bahasa antarmuka halaman utama, bukan menerjemahkan naskah artikel.
2. Satu dokumen Tulisan berisi satu bahasa naskah. Pilih Bahasa naskah sesuai isi yang sebenarnya.
3. Detail seluruh artikel memakai alamat utama `/id/tulisan/slug`, termasuk artikel English. Alamat alias `/en/tulisan/slug` diarahkan ke alamat utama yang sama; itu bukan terjemahan.
4. Grup terjemahan hanya catatan saat ini. Jangan menggandakan artikel seolah-olah sudah diterjemahkan, atau menganggap tombol ID/EN akan mencari pasangan terjemahannya.
5. Untuk teks bilingual Profil, riwayat, Aktivitas, Kategori, dan Perkenalan: halaman EN memakai English yang terisi; jika kosong, mencoba Indonesia. Halaman ID memakai Indonesia, tidak otomatis mengganti dengan English jika Indonesia kosong.
6. Biografi yang versi English-nya kosong/tidak berisi konten yang dapat ditampilkan memakai versi Indonesia. Gambar/caption galeri juga menggunakan fallback Indonesia.
7. Deskripsi SEO default EN kosong menggunakan deskripsi Indonesia; bila tetap kosong, website memakai deskripsi default halaman.

Ingat perbedaan **aturan penyimpanan/publish** dan **fallback tampilan**: schema kelompok teks masih meminta kedua bahasa seperti bagian 3. Konten lama yang belum lengkap dapat tetap mempunyai fallback di website, tetapi pengeditan/penerbitannya mungkin meminta penyelesaian kolom English. Jangan menyalin teks sembarang hanya untuk menghilangkan error.

## 10. Memperbarui Tentang dan Aktivitas

### Profil dan foto

1. Buka dokumen utama **Profil**.
2. Perbarui Nama lengkap, Bio singkat, Biografi, dan Keahlian sesuai fakta yang disetujui.
3. Ganti **Foto diri — hanya halaman Tentang** dengan foto Putri yang sah; lengkapi Teks alternatif, serta caption/kredit jika perlu.
4. Periksa potongan portrait. Foto ini tidak otomatis dipakai di beranda, header, kartu tulisan, atau sebagai penulis bergambar.
5. Publish Profil, lalu periksa Tentang ID dan EN. Tidak ada preview draft khusus Profil pada fitur sekarang.

### Riwayat dan pencapaian

1. Tambahkan atau perbarui dokumen **Pengalaman**, **Pendidikan**, **Organisasi**, atau **Penghargaan/Publikasi** yang sesuai.
2. Gunakan informasi yang dapat dibuktikan. Jangan mengisi penghargaan atau gelar contoh agar halaman tampak penuh.
3. Pada Pengalaman, tulis ruang lingkup dan pencapaian **tanpa nama instansi pekerjaan**. Larangan juga berlaku untuk alt, caption, metadata, dan kolom lain. Isian teks tetap perlu diperiksa manusia; tidak ada penyaring otomatis nama instansi yang dijanjikan.
4. Isi **Urutan** secara konsisten bila ingin mengatur susunannya: angka kecil tampil lebih dahulu. Pada Penghargaan/Publikasi, tanggal terbaru menjadi pembeda setelah urutan.
5. Publish setiap dokumen yang diubah; menerbitkan Profil saja tidak menerbitkan dokumen Pengalaman/Pendidikan lainnya.
6. Periksa Tentang setelah dimuat ulang. Bagian opsional yang kosong disembunyikan, bukan diganti kredensial contoh. Jika seluruh profil/riwayat kosong, ada pesan bahwa informasi profil belum tersedia.

### Aktivitas dan galeri

1. Buat satu dokumen **Aktivitas** untuk satu kegiatan.
2. Isi Judul dua bahasa dan Tanggal bila tersedia.
3. Tambahkan satu atau lebih item **Foto dan caption**, berkas gambar, Teks alternatif, Caption singkat dua bahasa, serta Kredit foto bila perlu.
4. Atur urutan foto di dalam kegiatan. Foto ditampilkan sesuai urutan tersebut; kegiatan mengikuti Urutan lalu tanggal terbaru.
5. Atur crop/hotspot untuk menjaga bagian penting dalam potongan galeri.
6. Publish Aktivitas, lalu periksa halaman Aktivitas. Judul kegiatan dan tanggal dapat berulang di bawah foto-fotonya; ini sesuai tampilan sekarang.

Galeri yang belum mempunyai foto yang dapat ditampilkan mempunyai keadaan kosong. Kegagalan mengambil konten mempunyai pesan berbeda; jangan langsung menyimpulkan data terhapus. Belum ada lightbox, unggahan Instagram, atau cuplikan galeri otomatis di beranda.

## 11. Pengaturan website dan fallback

1. Buka dokumen utama **Pengaturan**.
2. Ganti **Nama situs** untuk nama di header/footer dan bagian nama situs pada judul halaman. Ini tidak mengganti Judul tulisan atau kalimat judul besar hero.
3. Isi **Perkenalan** untuk paragraf pengantar beranda, bukan seluruh teks/menu halaman.
4. Atur **Tulisan pilihan** bila ingin memilih unggulan. Meski boleh menyimpan tiga referensi, beranda hanya menampilkan **satu artikel published pertama yang tersedia**. Jika tidak ada pilihan valid, beranda memakai artikel published terbaru.
5. Perbarui kontak publik dengan alamat yang memang disetujui. Gunakan email polos, URL LinkedIn HTTPS, dan URL Instagram HTTPS.
6. Isi **SEO default → Indonesia/English → Meta description** bila diperlukan. Publish Pengaturan dan periksa beranda/Kontak ID serta EN.

| Kondisi | Hasil yang berlaku |
| --- | --- |
| Pengaturan belum published/tidak tersedia | Nama situs dan copy default yang sudah ada tetap dipakai. Masalah koneksi Pengaturan juga memakai fallback aman. Ini tidak berarti blog/profil yang gagal dimuat diganti contoh. |
| Nama situs kosong | Kembali ke Putri Wella Sibarani. |
| Perkenalan EN kosong | Mencoba Perkenalan Indonesia, lalu copy pengantar default jika keduanya kosong. |
| Tulisan pilihan kosong, draft, dihapus, atau tidak tersedia | Mencari pilihan published berikutnya; bila tidak ada, memakai artikel published terbaru. Jika semua tulisan kosong, tampil keadaan kosong. |
| Email/LinkedIn/Instagram kosong atau tidak valid | Memakai kontak aktual cadangan di bawah; mengosongkan kolom **tidak menghapus saluran kontak** dari website. |
| Label navigasi diisi | Menu publik tetap memakai label website yang sudah ada; kolom ini belum terhubung. |
| Pengantar newsletter / Catatan pandangan pribadi untuk ditinjau diisi | Belum tampil sebagai section publik atau mengaktifkan layanan apa pun. |

Kontak cadangan yang sudah disetujui:

- Email: **putriwella97@gmail.com**.
- LinkedIn: **https://www.linkedin.com/in/putriwella97/**.
- Instagram: **https://www.instagram.com/wellasibarani/**.

Website menolak URL sosial dengan domain yang tidak sesuai, protokol selain HTTPS, kredensial pada alamat, atau port yang tidak sesuai; bagian pelacakan setelah tanda tanya dan bagian setelah tanda pagar dibuang. Studio dapat menerima URL HTTPS yang belum tentu dipakai website jika domainnya salah. Jika ingin benar-benar meniadakan suatu saluran kontak, bicarakan dengan pengelola, bukan hanya mengosongkan kolom.

### Batas SEO saat ini

Deskripsi artikel dipilih berurutan: **SEO tulisan → Meta description**, lalu **Ringkasan**, lalu deskripsi SEO default Indonesia, lalu copy default. **SEO tulisan → Meta title** dapat mengganti judul metadata artikel; jika kosong, dipakai Judul tulisan dan Nama situs. **SEO default → Meta title** dipakai pada beranda, sedangkan halaman lain memakai nama halaman dan Nama situs. Judul metadata tidak mengganti judul naskah yang tampil di halaman.

Gambar berbagi artikel memakai **Cover**, lalu **SEO tulisan → OG image (opsional)**, lalu **SEO default Indonesia → OG image (opsional)** bila pilihan sebelumnya tidak tersedia. Halaman utama lainnya memakai gambar SEO default sesuai UI, dengan fallback Indonesia. Perubahan metadata tidak menjamin kartu media sosial langsung berubah karena layanan luar dapat menyimpan tampilan lama.

Website kini mengizinkan pengindeksan halaman publik. [Sitemap](https://putriwella.web.id/sitemap.xml) berisi halaman utama ID/EN dan URL utama artikel published, bukan Studio, preview, atau alias terjemahan. Artikel baru masuk setelah Publish ketika sitemap diminta lagi; Unpublish menariknya dari sitemap. Tanggal perubahan memakai data yang tersedia, bukan tanggal yang dibuat-buat setiap kali dibuka. Jika sumber konten gagal, sitemap menampilkan kegagalan layanan alih-alih berpura-pura sukses dengan semua artikel hilang. Wella tidak perlu menyunting sitemap sendiri.

Studio dan preview tetap meminta agar tidak diindeks; pembatasan akses preview tetap berlaku. Favicon, yaitu ikon kecil tab browser, masih ikon “N” bawaan Next.js. Tidak ada gambar OG default buatan baru. Ikon/gambar identitas resmi perlu disepakati terpisah; jangan menganggap gambar contoh sebagai identitas Putri.

### Materi yang masih perlu diputuskan untuk rilis

Pembacaan published terakhir pada 19 Oktober 2026 menemukan satu artikel dan Profil dengan portrait. Pengaturan belum published, Keahlian kosong, dan belum ada Aktivitas, Pengalaman, Pendidikan, Organisasi, atau Penghargaan/Publikasi published. Tidak terdeteksi kata penanda tes/contoh pada judul/ringkasan artikel itu, tetapi fakta, izin, dan kelayakan naskah tetap perlu ditinjau Wella.

1. Isi dan Publish Pengaturan bila ingin mengganti copy/kontak/SEO default melalui Studio, termasuk gambar OG default yang disetujui bila diperlukan.
2. Lengkapi bagian Tentang dan Aktivitas hanya jika ada data/foto nyata yang ingin ditampilkan. Bagian kosong tidak perlu dipenuhi kredensial atau gambar contoh.
3. Periksa naskah dan gambar sebelum dibagikan. Materi latihan yang tersimpan terpisah dari konten publik tetap contoh; jangan mempublikasikannya sebagai karya atau pengalaman nyata Putri.

Inventaris ini adalah catatan waktu pemeriksaan, bukan daftar yang selalu mutakhir. Setelah Wella mengisi konten, periksa lagi hasil website. Fitur komentar, like, newsletter, export Instagram, dan palette tambahan tetap tertunda.

## 12. Mengubah slug setelah Publish

**Redirect dari slug lama belum didukung.** Mengisi **Riwayat slug** hanya mencatat riwayat; website belum membaca daftar itu untuk mengarahkan pengunjung.

1. Pertahankan slug lama bila tidak ada alasan penting menggantinya. Mengubah Judul tidak perlu disertai perubahan Slug.
2. Jika perlu mengganti, catat slug lama pada **Riwayat slug** sebelum mengedit Slug.
3. Periksa bahwa slug baru valid dan belum dipakai tulisan lain, lalu preview dan Publish perubahan.
4. Buka URL baru dan periksa hasilnya. URL lama akan menjadi tidak ditemukan bila tidak ada artikel published lain dengan slug itu; jangan menganggap URL lama aman dibagikan.
5. Perbarui tautan yang pernah dibagikan dan hubungi pengelola bila pengalihan alamat lama diperlukan. Ini memerlukan pekerjaan lanjutan, bukan kolom tambahan yang bisa diaktifkan Wella sendiri.

Saat penggantian masih draft, versi published masih memakai slug lama. Preview dapat mengikuti slug baru. Setelah keluar preview slug baru, tujuan dapat berupa daftar karena versi publik dengan slug itu belum ada. Pengalihan alias EN ke ID untuk **slug yang sama** sudah ada; itu berbeda dari redirect **slug lama ke slug baru**.

## 13. Checklist dan pemecahan masalah

### Sebelum Publish

1. Pastikan ini dokumen yang dimaksud dan bukan contoh latihan.
2. Baca ulang judul, ringkasan, bahasa naskah, format, kategori, dan isi.
3. Pastikan kategori yang akan muncul sudah published.
4. Lengkapi kolom wajib, termasuk kedua subkolom kelompok bilingual yang digunakan. Baca pesan error; peringatan panjang judul/ringkasan dapat ditinjau secara editorial.
5. Periksa fakta, izin gambar, kredit, dan tidak adanya nama instansi pekerjaan. Foto diri hanya untuk Tentang.
6. Periksa setiap alt/caption dan crop yang memang didukung tempat tampilnya.
7. Untuk puisi, periksa blok Bait puisi, urutan bait, dan barisnya.
8. Periksa tanggal editorial. Jangan memakai tanggal masa depan dengan harapan naskah akan dijadwalkan.
9. Pertahankan slug lama untuk artikel yang sudah dibagikan, kecuali perubahan benar-benar diperlukan.
10. Tunggu autosave selesai. Gunakan preview artikel bila sudah dapat diakses, lalu Publish.

### Sesudah Publish

1. Muat ulang beranda, daftar Tulisan, dan detail sesuai perubahan yang dibuat.
2. Periksa urutan terbaru berdasarkan tanggal editorial, thumbnail, judul, ringkasan, dan kategori.
3. Periksa filter Kategori dan Format. Tombol reset mengembalikan pilihan ke Semua/All; kombinasi tanpa hasil memang menampilkan keadaan kosong.
4. Periksa detail pada ponsel dan layar lebih besar; cek tautan, gambar, caption, dan puisi.
5. Periksa ID dan EN untuk konten bilingual. Artikel tetap dalam bahasa naskahnya.
6. Keluar preview sebelum memeriksa versi publik, atau gunakan jendela pengunjung biasa. Jangan membagikan URL preview.
7. Untuk perubahan Tentang/Aktivitas/Pengaturan, periksa halaman terkait; Publish sebuah dokumen tidak otomatis menerbitkan semua dokumen lain.

### Jika ada masalah

| Yang terlihat | Pemeriksaan yang dapat dilakukan Wella |
| --- | --- |
| Tidak bisa login/mengedit | Pastikan akun yang dipakai memang diberi akses; minta pengelola memeriksa keanggotaan dan izin. |
| Publish tertahan walau teks Indonesia terisi | Buka kelompok bilingual dan periksa English, referensi, serta error validasi lainnya. Fallback di website tidak membatalkan aturan schema. |
| Perubahan sudah tersimpan tetapi publik masih lama | Autosave menyimpan draft, bukan Publish. Publish versi terbaru lalu muat ulang halaman yang benar. |
| Artikel baru tidak ditemukan | Pastikan sudah Publish dan URL memakai slug saat ini. Draft-only memang tidak dapat dibuka melalui URL publik. |
| Artikel muncul paling atas padahal bukan yang baru | Periksa Tanggal editorial pertama terbit. Urutan terbaru mengikuti tanggal tersebut; tanggal masa depan bukan penjadwalan. |
| Kategori tidak muncul | Pastikan kategori published dan dipilih pada Tulisan. Mengisi Tag tidak sama dengan memilih Kategori. |
| Tulisan unggulan berbeda dari pilihan | Pastikan referensinya masih published. Website melewati pilihan yang tidak tersedia lalu memakai fallback terbaru. |
| Hanya dua tulisan terkait yang tampak | Batas tampilan memang dua, tanpa artikel itu sendiri. Jika tidak ada pilihan valid, website mencari tulisan published lain, mengutamakan kategori serupa lalu tanggal terbaru. |
| Crop berubah di thumbnail tetapi tidak di detail | Sesuai batas renderer sekarang: crop/hotspot dipakai thumbnail, portrait, galeri; belum diterapkan pada gambar detail/Isi. |
| Thumbnail berupa bidang warna | Periksa Cover artikel, berkas gambar, dan Teks alternatif. Placeholder memang dipakai bila cover kosong/tidak dapat digunakan. |
| Foto profil/galeri hilang | Periksa apakah dokumen published, berkas dapat dipakai, dan alt terisi. Alt/caption galeri memiliki kolom dua bahasa. |
| Preview menampilkan petunjuk setup | Akses preview belum siap; hubungi pengelola. Jangan mencoba mengaktifkannya dengan mengubah alamat publik. |
| Preview tidak ditemukan atau sesi berakhir | Periksa slug dan autosave, lalu buka lagi dari lokasi tulisan di tool Preview draft Studio. |
| Preview masih memperlihatkan isi lama | Tunggu autosave, lalu muat ulang preview. Pastikan dokumen dan slug yang dibuka benar. |
| Preview judulnya “Tulisan tanpa judul” | Ini cadangan untuk draft belum lengkap. Lengkapi Judul sebelum Publish. |
| Keluar preview kembali ke daftar | Dapat terjadi untuk draft-only, slug baru yang belum published, atau saat versi publik tidak dapat diperiksa. Ini tidak berarti draft dihapus. |
| Tautan lama rusak setelah slug diganti | Riwayat slug belum mengaktifkan redirect; perbarui tautan dan hubungi pengelola. |
| Kontak lama tetap muncul setelah kolom dikosongkan | Kolom kosong memakai kontak aktual cadangan. Pengosongan bukan cara menghapus saluran. |
| Meta title/OG image belum tampak saat dibagikan | Pastikan dokumen sudah Publish. Meta title artikel berbeda dari Judul naskah; judul default Pengaturan hanya mengganti metadata beranda. Cover artikel mengalahkan OG image cadangan. Layanan luar bisa menyimpan kartu lama; hasil indeks/kartu tidak dijamin langsung berubah. |
| Bagian Tentang tidak tampak | Bagian opsional kosong disembunyikan. Periksa masing-masing dokumen riwayat sudah published, bukan hanya Profil. |
| Konten kosong vs gagal dimuat | Pesan belum ada konten berbeda dari pesan gagal memuat. Muat ulang; jika tetap gagal, laporkan halaman dan pesan kepada pengelola. Jangan menghapus dokumen untuk mencoba memperbaiki koneksi. |
| Tidak bisa Delete/Unpublish | Periksa referensi dan hak akses. Profil/Pengaturan memang tidak menawarkan Delete; Draft Newsletter tidak menawarkan Publish. |
| Mencari komentar, like, newsletter terkirim, export Instagram, atau palette lain | Fitur-fitur tersebut ditunda. Tidak ada tombol tersembunyi yang perlu diaktifkan lewat kolom konten. |

Saat melapor, kirim alamat halaman, nama dokumen, waktu kejadian, status draft/published, dan tangkapan layar yang tidak memuat informasi pribadi. Tidak perlu mengirim informasi akses akun.

## 14. Memakai panduan ini bersama ChatGPT

Unggah file panduan ini, lalu gunakan prompt pembuka berikut:

> Saya Putri Wella Sibarani dan sedang mengelola konten website saya. Baca panduan yang saya unggah dan jadikan batas kemampuan website saat ini. Bantu saya langkah demi langkah dengan bahasa sederhana. Bedakan kolom wajib, peringatan, fitur aktif, preview yang belum dipastikan online, dan fitur tertunda. Jangan mengarang riwayat, pendidikan, pencapaian, nama instansi pekerjaan, label tombol, atau kemampuan otomatis. Jangan menganggap Anda sudah login, mengubah Studio, atau menerbitkan apa pun. Jika ada informasi yang belum cukup, tanyakan kepada saya. Mulai dengan menanyakan konten apa yang ingin saya buat atau perbarui.

Contoh pertanyaan lanjutan:

1. “Saya ingin membuat catatan pendek berbahasa Indonesia. Bantu cek kolom yang perlu saya isi sebelum Publish.”
2. “Ini puisi saya. Bantu membaginya menjadi blok Bait puisi tanpa mengubah larik atau kata-katanya.”
3. “Ini deskripsi foto yang saya miliki. Bantu membedakan alt dan caption; tanyakan dulu bila ada detail gambar yang belum jelas.”
4. “Saya mendapat error English wajib. Jelaskan perbedaan validasi Studio dan fallback tampilan, lalu bantu menyiapkan terjemahan yang akan saya tinjau.”
5. “Saya ingin memperbarui pengalaman tanpa menyebut instansi pekerjaan. Tinjau teks saya dan jangan menambahkan pencapaian baru.”
6. “Saya ingin memeriksa preview sebelum Publish. Pandu saya menemukan lokasi tulisan dan Keluar preview sesuai panduan.”
7. “Judul artikel saya berubah. Apakah saya perlu mengganti slug? Jelaskan risikonya berdasarkan fitur yang benar-benar ada.”
8. “Periksa draft saya memakai checklist di panduan. Jangan menerbitkan atau menjanjikan perubahan pada website.”

ChatGPT dapat membantu menyiapkan dan memeriksa teks. Wella tetap meninjau fakta, hak penggunaan gambar, dan hasil terjemahan, lalu melakukan tindakan di Studio sendiri. Panduan ini bukan bukti ChatGPT mempunyai akses ke akun atau konten Studio terbaru.

### Dasar panduan dan batas pemeriksaan

Label/validasi dicocokkan dengan schema dokumen dan kolom bersama; menu/tombol dengan struktur dan konfigurasi Studio; hasil publik dengan pembacaan konten, komponen halaman, renderer gambar/puisi, serta alur preview yang ada. Pada pembaruan rilis ini, sitemap/robots/metadata diuji dengan respons konten lokal terkontrol, dan inventaris published cloud dibaca tanpa perubahan. Tidak dilakukan login online atau pembuatan/pengubahan konten cloud. Tampilan tombol bawaan Studio dan kemampuan akun nyata tetap perlu dilihat saat Wella masuk. Verifikasi belum mencakup konten nyata untuk semua jenis dokumen dan belum memastikan preview draft Studio cloud.
