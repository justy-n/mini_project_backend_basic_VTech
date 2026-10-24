# SISTEM MANAJEMEN DATABASE PERPUSTAKAAN

Program ini memungkinkan pengguna berinteraksi dengan sebuah basis data
perpustakaan yang terdiri atas data buku dan transaksi peminjaman melalui 
fitur CRUD (Create, Read, Update, Delete). Program juga dilengkapi dengan 
fitur penyimpanan data sebagai file JSON dan validasi input secara keseluruhan.

# FITUR
- Menampilkan semua entri buku tersedia dalam perpustakaan.
- Menampilkan semua entri peminjaman dalam perpustakaan.
- Menampilkan entri buku berdasarkan kode atau rentang tahun terbit.
- Menampilkan entri peminjaman berdasarkan kode atau rentang tanggal peminjaman/pengembalian.
- Memperbarui detail entri buku dan peminjaman berdasarkan kode.
- Memperbarui jumlah stok buku secara otomatis ketika peminjaman dilakukan.
- Menyimpan seluruh entri buku dan peminjaman masing-masing dalam file buku.json dan peminjaman.json.
- Memuat seluruh entri buku dan peminjaman dari file buku.json dan peminjaman.json saat program dijalankan.

# CARA MENJALANKAN
- Pastikan Node.js sudah terinstal.
- Buka terminal dan arahkan ke folder proyek.
- Ubah package.json agar menggunakan module (jika belum).
- Jalankan program dengan perintah _node main.js_

# FORMAT DATA 
- Setiap detail entri buku disimpan dalam bentuk object dalam sebuah array.
  {
      id_buku : "IK001",
      judul   : "Algoritma dan Pemograman Umum",
      penulis : "Rinaldi Munir",
      kategori: "Ilmu Komputer",
      tahun_terbit : "2018",
      stok    : 0
  }
- Setiap detail entri peminjaman juga disimpan dalam bentuk object dalam sebuah array.
{
      id_peminjaman: "001",
      id_buku      : "IK001",
      nama_peminjam: "Raina Salena",
      tanggal_pinjam: "2026-10-18",
      tanggal_kembali: null
}

# STRUKTUR PROYEK
- Folder "data"    : berisi file buku.js dan peminjaman.js
- buku.js          :   berisi array data entri buku awal
- peminjaman.js    : berisi array data entri peminjaman awal
- main.js          : program utama interaktif (CLI)
- package.js       : konfigurasi Node.js untuk proyek
- buku.json        : file penyimpanan data entri buku (otomatis dibuat)
- peminjaman.json  : file penyimpanan data entri peminjaman (otomatis dibuat)
- README.md        : deskripsi proyek

# INSTRUKSI PENGGUNAAN
1. Pilih menu 1-4 sesuai operasi yang diinginkan.
2. Pilih submenu sesuai pengaturan operasi yang diingikan.
3. Pilih 5 untuk keluar dari program.

# REQUIREMENTS
- Node.js v24.21.0
- Terminal/Command Prompt

# AUTHOR
- Nama       : Justin Nathanael Irana
- Tema Proyek: Sistem Manajemen Basis Data Perpustakaan
- Kelas      : Trial Study Club Backend Basic KSM Veterantech 2026
- Mentor     : Nadia Jasmine Aulia
