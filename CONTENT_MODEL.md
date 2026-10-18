# CONTENT MODEL — Sanity

Versi 1.0 · 18 Oktober 2026. Spesifikasi rancangan; belum berupa schema yang diimplementasikan.

## 1. Konvensi
- Singleton: siteSettings dan profile. Collection: post, category, activity, experience, education, organization, recognition, newsletterIssue.
- Teks halaman utama yang perlu bilingual memakai objek {id, en}. Kedua bahasa diisi editorial, bukan otomatis.
- post memakai satu bahasa per dokumen (language: id/en). translationGroup opsional untuk pasangan terjemahan yang benar-benar tersedia. Jangan menggandakan otomatis semua artikel.
- Slug artikel unik global, lowercase kebab-case. Perubahan slug published menyimpan riwayat redirect.
- Sanity _id/_createdAt/_updatedAt serta draft/published adalah metadata sistem. Jangan menambah boolean published yang menduplikasi lifecycle bawaan.
- Validasi publish memeriksa field wajib dan referensi. Admin dapat menyimpan draft yang belum lengkap.

## 2. siteSettings — singleton
| Field | Tipe | Aturan |
| --- | --- | --- |
| siteName | string | Putri Wella Sibarani |
| introduction | localized text | Intro singkat beranda, tanpa foto |
| navigationLabels | localized object | Label halaman utama |
| publicEmail | string | Hanya alamat yang disetujui untuk publik |
| linkedInUrl / instagramUrl | url | Validasi HTTPS |
| defaultSeo | localized object | Title/description; OG image opsional |
| featuredPosts | references[] | Rekomendasi maksimal 3; frontend hanya mengambil published |
| newsletterIntro | localized text | Rangkuman berkala; jangan menjanjikan frekuensi belum disepakati |
| personalViewsNote | localized text | Teks pandangan pribadi untuk ditinjau Putri |

Domain berasal dari konfigurasi deployment yang telah ditentukan. Token/provider key bukan field CMS.

## 3. profile — singleton
fullName (string), shortBio (localized text), biography (localized rich text), portrait (image + required alt), skills (localized strings), optional professionalSummary (localized text).

Portrait hanya dirender di Tentang. Jangan memakai portrait otomatis pada article author badge, header, homepage, maupun OG homepage. Tidak ada field nama instansi. Semua konten profil memakai fakta yang disediakan Putri.

## 4. post — collection
| Field | Tipe | Aturan |
| --- | --- | --- |
| title | string | Wajib; batas lunak 100 karakter |
| slug | slug | Wajib unik; preview URL konsisten |
| language | enum | id atau en; wajib |
| translationGroup | string | Opsional; hubungkan terjemahan manual |
| format | enum | article, short-note, poem |
| categories | category references[] | Minimal 1 saat publish |
| tags | strings[] | Opsional, jumlah wajar |
| excerpt | text | Ringkasan opsional, disarankan ≤240 karakter |
| cover | image object | Opsional; alt wajib jika bermakna, caption/credit opsional |
| body | Portable Text[] | Wajib; konfigurasi di bagian berikut |
| publishedAt | datetime | Tanggal editorial pertama terbit, bukan jadwal publish |
| seo | object | Meta title/description dan OG image opsional |
| previousSlugs | strings[] | Redirect setelah perubahan URL |
| relatedPosts | references[] | Opsional; hanya published terlihat publik |
| instagram | object | socialTitle, caption, imageOverride, exportFormat |

Jangan memaknai tanggal masa depan sebagai penjadwalan otomatis. Scheduled publishing bukan fitur awal. Estimasi waktu baca dihitung dari teks, bukan wajib diisi.

### Portable Text
Block normal/h2/h3/h4/blockquote; marks strong/emphasis/link; list bullet/number. Link eksternal divalidasi, tidak mengizinkan javascript URL. Image block memiliki alt/caption/credit dan hotspot. Hindari HTML mentah.

Blok poemStanza khusus menyimpan text multiline. Render dengan white-space: pre-wrap dan word wrapping; kosong antarblok mewakili bait. Ini menghindari hilangnya baris puisi saat normalisasi rich text. Embed hanya ditambahkan jika ada kebutuhan dan daftar host yang disetujui.

### Instagram object dan tindakan Studio
socialTitle (string pendek), caption (text manual), imageOverride (image opsional), exportFormat (portrait/story). Tombol memakai slug published untuk link; draft diberi label belum terbit dan tidak dibagikan sebagai URL publik.

Generate template menggunakan renderer frontend/Studio yang dikustomisasi, bukan field gambar ajaib dari Sanity. Tidak memakai AI/API publishing. Tangani judul panjang, font gagal, image cross-origin, clipboard gagal; sediakan pesan error dan retry. Jangan menyimpan screenshot preview sebagai konten artikel tanpa keperluan.

## 5. category
title {id,en}, slug unik, description {id,en}, sortOrder opsional. Seed: Politik & Kebijakan Publik; Ekonomi; Sastra. Format tulisan tetap terpisah dari kategori.

## 6. activity
title {id,en}, date opsional, photos[] berisi image/alt/caption {id,en}/credit, sortOrder opsional. Caption singkat adalah kebutuhan utama; tidak perlu memaksa artikel panjang. Jangan mengunggah foto sensitif atau materi kerja yang belum disetujui.

## 7. Riwayat dan kredensial
### experience
scopeTitle {id,en}, scopeDescription {id,en}, achievements {id,en}[], periodLabel opsional, sortOrder. Tidak memiliki employer/agencyName/logo. Contoh fixture berlabel dummy, tidak mengarang nama jabatan resmi. Penggunaan tanggal/periode ditinjau Putri.

### education
qualification {id,en}, institution, fieldOfStudy {id,en}, startYear/endYear opsional, description opsional. Nama institusi pendidikan tidak sama dengan larangan nama instansi pekerjaan; tetap pakai data yang disetujui.

### organization
name, role {id,en}, periodLabel opsional, description {id,en}, publicUrl opsional.

### recognition
kind award/publication, title {id,en}, issuer opsional, date opsional, summary {id,en}, publicUrl opsional. Jangan menambahkan penghargaan fiktif.

## 8. newsletterIssue — konten editorial saja
title, introduction, language, selectedPosts[], footerText. Rancangan draft rangkuman untuk ditinjau. Tidak menyimpan subscriber, token unsubscribe, atau daftar penerima. Status pengiriman/receipt provider berada pada sistem privat dengan idempotency key. Publish dokumen tidak otomatis mengirim email.

## 9. Data di luar dataset publik
| Data | Penyimpanan/perilaku |
| --- | --- |
| Subscriber + consent + unsubscribe | Provider newsletter privat |
| Email/nama komentar + pending moderation | Provider komentar privat; publik hanya field yang disetujui |
| Pesan kontak | Provider form/email privat |
| Token preview/revalidation/API | Environment server-only |

## 10. Query, preview, dan lifecycle
- Public queries menggunakan perspektif published yang didukung SDK terpasang dan projection field eksplisit. Jangan mengirim seluruh objek CMS ke browser.
- Preview memakai Draft Mode + autentikasi/validasi token server-side; cache terpisah dari publik, noindex.
- Webhook publish/update/delete/unpublish diverifikasi secret sebelum invalidasi cache; tangani duplikasi event dengan aman.
- Unpublish/delete menginvalidasi daftar, detail, sitemap dan metadata; detail mengembalikan 404 bila tak published.
- Referensi unpublished/dihapus tidak menimbulkan crash. Tanggal ditampilkan konsisten dengan locale.
- Export/backup konten secara berkala; uji pemulihan sebelum migrasi schema besar.
