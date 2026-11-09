# COZZE Inventory Dashboard

Dashboard admin inventaris bahan baku dan perlengkapan coffee shop COZZE. Proyek ini dibuat untuk Responsi 1 Pemrograman Fullstack dengan studi kasus **Dashboard Manajemen Inventaris Barang Gudang**.

## Teknologi

- Vite
- React 19
- Bootstrap 5
- JavaScript ES6+
- jQuery 3
- CSS responsif
- Lucide React (ikon)

## Fitur

1. Ringkasan total jenis barang, barang yang perlu restock, stok habis, dan estimasi nilai persediaan.
2. Tabel inventaris dengan SKU, nama barang, kategori, stok, satuan, batas minimum, status, harga beli, dan harga jual.
3. CRUD lengkap: tambah, lihat, edit, dan hapus barang.
4. Status stok otomatis:
   - **Aman**: stok berada di atas batas minimum.
   - **Menipis**: stok lebih dari 0 dan sama dengan/di bawah batas minimum.
   - **Habis**: stok 0 atau kurang.
5. **Halaman Hasil Pencarian Khusus (Dedicated Search Results Page)**:
   - Pencarian global pada Topbar yang dapat diakses dengan tombol Enter atau klik ikon cari untuk langsung membuka halaman hasil pencarian lengkap.
   - Dukungan shortcut keyboard `⌘ K` (atau `Ctrl + K`) untuk fokus cepat ke input pencarian, serta tombol hapus (`✕`) untuk reset pencarian.
   - Pencarian cerdas berbasis teks (nama, SKU, kategori, supplier) dan sinonim operasional coffee shop (misal kata kunci *"susu"* otomatis mendeteksi produk susu, kategori *Dairy & Non-Dairy*, dan *Oat Milk*).
   - Kartu informasi komprehensif setiap produk:
     - Rincian stok fisik, batas minimum, dan bar indikator kesehatan stok.
     - Kontrol stepper cepat untuk menambah atau mengurangi stok (+1 dan -1).
     - Kalkulasi finansial detail: harga beli modal, harga jual, margin keuntungan (Rp dan %), serta total nilai aset stok.
     - Informasi supplier dan tanggal pembaruan terakhir.
     - Rekomendasi tindakan operasional untuk barista atau pengelola gudang.
     - Akses cepat untuk mengedit atau menghapus data barang.
   - Ringkasan statistik pencarian (total SKU cocok, akumulasi unit, total nilai persediaan, dan status stok).
   - Banner peringatan dini restock jika ada barang pencarian yang habis atau menipis.
   - Rekomendasi barang terkait dari kategori serupa.
   - Tampilan *empty state* interaktif dengan saran kata kunci populer dan tombol tambah barang langsung.
6. Filter berdasarkan kategori dan status stok pada tabel inventaris.
7. Tombol penyesuaian stok cepat (+1 dan -1) pada tabel maupun kartu pencarian.
8. Ekspor data inventaris ke CSV.
9. Data tersimpan pada `localStorage` browser, tanpa database SQL atau backend.
10. Tampilan responsif untuk desktop, tablet, dan perangkat mobile.

## Cara menjalankan di macOS

Pastikan Node.js dan npm sudah terpasang. Ekstrak ZIP, buka Terminal, pindah ke folder proyek (ganti `/path/to/cozze-inventory` dengan lokasi folder hasil ekstrak), lalu jalankan:

```bash
cd /path/to/cozze-inventory
npm install
npm run dev
```

Terminal akan menampilkan alamat lokal, umumnya `http://localhost:5173`. Buka alamat tersebut di browser.

Untuk membuat versi produksi:

```bash
npm run build
npm run preview
```

## Struktur proyek

```text
cozze-inventory/
├── public/
│   └── cozze-mark.svg
├── src/
│   ├── components/
│   │   ├── ConfirmDeleteModal.jsx
│   │   ├── InventoryTable.jsx
│   │   ├── ProductModal.jsx
│   │   ├── SearchResults.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   └── Topbar.jsx
│   ├── data/
│   │   └── initialInventory.js
│   ├── legacy/
│   │   └── jqueryEffects.js
│   ├── utils/
│   │   ├── inventory.js
│   │   └── notify.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── vite.config.js
├── .gitignore
├── package.json
└── README.md
```

## Pemetaan materi praktikum ke implementasi

| Materi | Implementasi dalam proyek |
|---|---|
| HTML Dasar & Semantik | `index.html`, elemen `header`, `main`, `aside`, `nav`, `section`, `form`, `label`, `input`, `table`, `thead`, `tbody`, `button`, `article`, `kbd`, serta modal dengan role dialog. |
| CSS Styling & Responsive | `src/styles.css`: variabel warna maroon-cream, layout dashboard, styling kartu informasi produk pencarian, bar rasio stok, grid finansial, hover, transisi, animasi, dan media query untuk tablet/mobile. |
| Bootstrap CSS | Import Bootstrap 5 pada `main.jsx`; penggunaan utility dan komponen seperti `table`, `table-responsive`, `btn`, `form-control`, `form-select`, `align-middle`, `row`, `g-3`, dan `mb-0`. |
| JavaScript Dasar | Variabel, `const`/`let`, array of objects (`initialInventory`), fungsi pencarian cerdas (`searchInventoryItems`), sinonim kata kunci operasional, `map`, `filter`, `reduce`, operator kondisi `if/else`, template literal, dan pengolahan CSV. |
| DOM JavaScript & jQuery | `src/legacy/jqueryEffects.js`: selector `$('#cozze-toast')`, event `.on('cozze:notice')`, manipulasi class/text, serta efek `.fadeIn()`, `.delay()`, `.fadeOut()`. Elemen notifikasi diletakkan di luar root React agar tidak bentrok dengan Virtual DOM. |
| React JS (React 19) | Komponen `App`, `Sidebar`, `Topbar`, `SearchResults`, `StatCard`, `InventoryTable`, `ProductModal`, `ConfirmDeleteModal`; hooks `useState`, `useEffect`, `useMemo`, `useRef`; routing halaman internal (`activePage`), manajemen state pencarian, dan CRUD reaktif. |

## Catatan data

Data awal pada dashboard merupakan **data contoh/dummy untuk demonstrasi responsi**, bukan data stok aktual COZZE. Silakan sesuaikan nama barang, SKU, supplier, batas minimum, dan harga dengan kondisi operasional yang sebenarnya. Data yang diubah tersimpan pada browser yang sama melalui `localStorage`.

## Catatan integrasi jQuery dan React

jQuery tidak digunakan untuk mengubah tabel atau elemen yang dikendalikan React. jQuery hanya mengelola notifikasi `#cozze-toast`, yang berada di luar `#root`. Event dari React dikirim melalui `CustomEvent` pada `window`. Pemisahan ini mendemonstrasikan jQuery sekaligus menghindari konflik manipulasi DOM dengan Virtual DOM React.
