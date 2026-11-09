# Pemetaan Materi & Checklist Demonstrasi Responsi

Dokumen ini membantu menunjukkan keterkaitan fitur aplikasi COZZE Inventory dengan enam materi perkuliahan.

## 1. HTML Dasar & Semantik
- [ ] Tunjukkan struktur `header`, `aside`, `nav`, `main`, `section`, dan `footer`.
- [ ] Buka form tambah/edit untuk memperlihatkan `label`, `input`, `select`, dan `button`.
- [ ] Tunjukkan tabel dengan `table`, `thead`, `tbody`, `tr`, dan `td`.
- [ ] Jelaskan modal konfirmasi dan dialog form.

## 2. CSS Styling & Responsive
- [ ] Tunjukkan palet maroon, cream, dan aksen cokelat.
- [ ] Ubah ukuran browser menjadi desktop, tablet, kemudian mobile.
- [ ] Perlihatkan sidebar mobile, grid kartu statistik, dan tabel responsif.
- [ ] Tunjukkan hover pada tombol, navigasi, kartu, dan transisi modal.

## 3. Bootstrap CSS
- [ ] Tunjukkan import Bootstrap 5 pada `src/main.jsx`.
- [ ] Cari class `table-responsive`, `table`, `form-control`, `form-select`, `align-middle`, dan utility spacing.
- [ ] Jelaskan bahwa Bootstrap digunakan berdampingan dengan CSS khusus COZZE.

## 4. JavaScript Dasar
- [ ] Tunjukkan `initialInventory` sebagai array of objects.
- [ ] Jelaskan fungsi `getStockStatus()` dan percabangan `if`.
- [ ] Jelaskan proses `filter`, `map`, dan `reduce` untuk pencarian dan ringkasan.
- [ ] Tunjukkan `createCsv()` untuk membuat data ekspor.

## 5. DOM JavaScript & jQuery
- [ ] Tunjukkan `src/legacy/jqueryEffects.js`.
- [ ] Jelaskan selector `$('#cozze-toast')` dan event `.on('cozze:notice')`.
- [ ] Peragakan notifikasi saat menambah, mengedit, menghapus, atau mengubah stok.
- [ ] Jelaskan bahwa elemen toast berada di luar `#root` React agar manipulasi jQuery tidak mengubah DOM yang dikelola React.

## 6. React JS (React 19)
- [ ] Jelaskan pembagian komponen pada folder `src/components`.
- [ ] Tunjukkan `useState` untuk data, filter, modal, dan navigasi.
- [ ] Tunjukkan `useEffect` untuk penyimpanan localStorage.
- [ ] Tunjukkan `useMemo` untuk ringkasan, hasil pencarian, dan daftar stok perlu restock.
- [ ] Demonstrasikan Create, Read, Update, Delete.

## Alur demo saat responsi
1. Buka Overview dan jelaskan empat kartu ringkasan.
2. Buka Inventaris Barang, cari item berdasarkan nama atau SKU.
3. Terapkan filter kategori dan status.
4. Tambahkan barang baru dengan SKU unik.
5. Edit barang dan ubah batas minimum untuk memperlihatkan perubahan status stok.
6. Tambah/kurangi stok menggunakan tombol `+` dan `-`.
7. Hapus salah satu barang dan tunjukkan dialog konfirmasi.
8. Export CSV.
9. Refresh browser dan tunjukkan bahwa data masih ada pada browser tersebut.
10. Ubah lebar browser untuk memperlihatkan responsive layout.
