// Nonfactual design fixtures, including illustrative dates. Never publish as Putri's writing.
export type SampleImage = { src: string; alt: string; caption: string };
export type ContentBlock =
    | { type: 'heading'; level: 2 | 3 | 4; text: string }
    | { type: 'paragraph' | 'quote' | 'poemStanza'; text: string }
    | { type: 'list'; ordered: boolean; items: string[] }
    | { type: 'image'; image: SampleImage };
export type SamplePost = {
    id: string;
    title: string;
    excerpt: string;
    category: 'economy' | 'policy' | 'literature';
    format: 'article' | 'noteFormat' | 'poem';
    language: 'id';
    isDummy: true;
    date: string;
    cover?: SampleImage;
    body: ContentBlock[];
};
const summaries: Omit<SamplePost, 'date' | 'cover' | 'body'>[] = [
    { id: 'ekonomi', title: 'Melihat ekonomi dari hal-hal yang dekat', excerpt: 'Di antara harga di pasar dan pilihan sehari-hari, ada cerita tentang cara kita memahami kesejahteraan. Sebuah contoh pengantar untuk membaca ekonomi dari kehidupan yang paling dekat.', category: 'economy', format: 'article', language: 'id', isDummy: true },
    { id: 'ruang-publik', title: 'Untuk siapa ruang publik dirancang?', excerpt: 'Catatan contoh tentang mendengar kebutuhan yang beragam sebelum merumuskan kebijakan bersama.', category: 'policy', format: 'noteFormat', language: 'id', isDummy: true },
    { id: 'jeda', title: 'Di antara dua jeda', excerpt: 'pagi menyisakan cahaya\ndi tepi meja\n\nkata-kata menunggu\nruang untuk pulang', category: 'literature', format: 'poem', language: 'id', isDummy: true },
    { id: 'pilihan', title: 'Pilihan kecil dan percakapan tentang nilai', excerpt: 'Sebuah catatan contoh tentang apa yang kita pertimbangkan ketika memilih, menyimpan, dan berbagi.', category: 'economy', format: 'noteFormat', language: 'id', isDummy: true }
];

export const samplePosts: SamplePost[] = summaries.map((post, index) => ({
    ...post,
    date: `2026-10-${String(12 - index).padStart(2, '0')}`,
    cover: index === 0 ? {
        src: '/fixtures/ruang.svg', alt: 'Ilustrasi geometris lingkaran dan garis dalam warna biru.',
        caption: 'Ilustrasi dummy — bukan dokumentasi peristiwa nyata.',
    } : undefined,
    body: post.format === 'poem'
        ? post.excerpt.split('\n\n').map(text => ({ type: 'poemStanza' as const, text }))
        : [
            { type: 'paragraph', text: post.excerpt },
            { type: 'heading', level: 2, text: 'Memulai dari pertanyaan' },
            { type: 'paragraph', text: 'Naskah contoh ini memperlihatkan ritme membaca sebuah tulisan. Pertanyaan kecil dapat menjadi awal untuk mengamati hubungan antara pilihan pribadi dan kehidupan bersama.' },
            { type: 'quote', text: 'Sebuah gagasan membutuhkan ruang untuk dipertanyakan, bukan hanya untuk disimpulkan. — Kutipan contoh.' },
            { type: 'heading', level: 3, text: 'Hal-hal yang dapat diamati' },
            { type: 'list', ordered: false, items: ['Pengalaman sehari-hari yang sering terlewat.', 'Sudut pandang yang berbeda dalam percakapan.', 'Pertanyaan yang belum menemukan jawaban.'] },
            ...(index === 0 ? [{ type: 'image' as const, image: { src: '/fixtures/catatan.svg', alt: 'Ilustrasi lembar catatan dengan garis-garis biru.', caption: 'Gambar isi contoh — ilustrasi catatan, bukan dokumen pribadi.' } }] : []),
            { type: 'heading', level: 2, text: 'Menyusun catatan berikutnya' },
            { type: 'list', ordered: true, items: ['Catat pertanyaan awal.', 'Bandingkan beberapa perspektif.', 'Tinjau kembali kesimpulan.'] },
            { type: 'paragraph', text: 'Bagian penutup ini adalah placeholder editorial. Seluruh isi dan tanggal pada halaman ini bersifat dummy dan tidak mewakili tulisan atau pandangan Putri.' },
        ],
}));

export const categories = ['economy', 'policy', 'literature'] as const;
export const formats = ['article', 'noteFormat', 'poem'] as const;
export function postHref(post: Pick<SamplePost, 'id'>) { return `/id/tulisan/${post.id}`; }
export function getPost(slug: string) { return samplePosts.find(post => post.id === slug); }
