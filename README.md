# Portfolio — Rizky Baihakky

Website portfolio pribadi bertema **gelap dengan aksen emas**, dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework).

## Struktur Folder

```
web_Portfolio_Rizky/
├── index.html          # Seluruh konten halaman
├── css/style.css       # Tema, layout, animasi, responsive
├── js/main.js          # Navbar, animasi scroll, tab, form
└── assets/img/         # Tempat menaruh foto
    └── rizky.jpg       # ← taruh foto profil di sini
```

## Cara Menjalankan

Cukup buka `index.html` lewat browser (klik dua kali).
Kalau ingin lewat server lokal:

```bash
cd web_Portfolio_Rizky
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Foto Profil

Foto sudah terpasang di `assets/img/rizky.jpg`.

Untuk **mengganti** foto: timpa file `assets/img/rizky.jpg` dengan foto baru
(disarankan potret, rasio sekitar 3:4, minimal 600×800 px), lalu refresh halaman.
Kalau file yang belum ada, halaman otomatis menampilkan kotak placeholder.

Kalau nama filenya berbeda (misal `foto.png`), ubah baris ini di `index.html`:

```html
<img src="assets/img/rizky.jpg" alt="Foto Rizky Baihakky" id="profilePhoto" />
```

## Fitur

- **Home** — nama, role dengan efek mengetik, foto profil, tombol aksi
- **About** — ringkasan diri, data pribadi, kartu statistik dengan angka berjalan
- **Education** — Alumni Telkom University (2022 — 2026) dan 9 sertifikasi
- **Experience** — timeline dengan tab *Magang & Proyek* dan *Kepanitiaan*
- **Skills** — hard skill, bahasa, soft skill, serta tools & software
- **Project** — 4 kartu portofolio
- **Contact** — email, telepon, LinkedIn, dan lokasi (tanpa form)

## Animasi Pembuka

Saat halaman pertama dibuka, foto profil muncul besar di tengah layar (terasa dekat),
lalu menjauh dan mengecil ke posisinya di hero. Ukuran dan jaraknya dihitung dari
ukuran layar lewat JavaScript, jadi tetap pas di desktop maupun HP.

Diatur di `js/main.js` → bagian `8. ANIMASI PEMBUKA FOTO PROFIL`.
Untuk mengubah kecepatannya, ganti angka `1.5s` pada properti `transform` di bagian itu.

## Animasi Scroll

Setiap elemen muncul dengan transisi **geser dari kiri ke kanan** saat masuk layar.
Animasi diputar ulang setiap kali elemen keluar dan kembali masuk layar, jadi terasa
baik saat scroll ke bawah maupun ke atas.

Diatur di:
- `css/style.css` → bagian `ANIMASI REVEAL SAAT SCROLL`
- `js/main.js` → bagian `3. REVEAL ON SCROLL`

Untuk mengubah arah masuk sebuah elemen, ganti class `reveal-left` ↔ `reveal-right`
di `index.html`. Jeda animasi diatur lewat atribut `data-delay="200"` (dalam milidetik).

## Ganti Warna Tema

Semua warna ada di `css/style.css` bagian paling atas (`:root`):

```css
--bg:    #0a0a0c;   /* latar utama */
--gold:  #d4af37;   /* warna emas utama */
--text:  #ece9e3;   /* warna teks */
```

## Responsive

- Desktop (> 1024px): layout 2 kolom
- Tablet (≤ 1024px): kolom menyempit, skill jadi 1 kolom
- Mobile (≤ 860px): menu berubah jadi hamburger, hero jadi 1 kolom (foto di atas)
- HP kecil (≤ 620px & ≤ 380px): padding & ukuran font disesuaikan
