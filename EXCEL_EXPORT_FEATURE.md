# Fitur Export Excel - Admin Dashboard

## Deskripsi
Fitur export Excel telah ditambahkan ke admin dashboard untuk memungkinkan admin mengunduh semua data form konsultasi klien dalam format Excel (.xlsx).

## Cara Penggunaan

1. **Login ke Admin Dashboard**
   - Akses halaman `/admin`
   - Masukkan kredensial admin yang valid

2. **Export Data**
   - Setelah login berhasil, tombol "Export ke Excel" akan muncul di bagian atas tabel data
   - Tombol hanya muncul jika ada data yang tersedia
   - Klik tombol untuk mengunduh file Excel

## Format File Excel

### Nama File
- Format: `Data_Konsultasi_JSR_YYYY-MM-DD_HH-MM-SS.xlsx`
- Contoh: `Data_Konsultasi_JSR_2025-09-11_14-30-45.xlsx`

### Struktur Data Excel

#### Kolom Utama:
- **No**: Nomor urut
- **Nama Lengkap**: Nama lengkap klien
- **Email**: Alamat email klien
- **Nomor HP**: Nomor telepon klien
- **Jumlah Entitas**: Jumlah perusahaan yang dimiliki
- **Jasa yang Dibutuhkan**: Daftar jasa yang dipilih (dipisah koma)
- **Tanggal Submit**: Tanggal pengajuan form

#### Kolom Detail Perusahaan:
Untuk setiap perusahaan yang dimiliki klien, akan ditambahkan kolom:
- **Nama Entitas**: Nama perusahaan
- **Bidang Usaha**: Sektor bisnis perusahaan
- **Alamat**: Alamat lengkap perusahaan
- **Tahun Buku**: Periode tahun buku
- **Pernah Diaudit**: Status audit sebelumnya (Ya/Tidak)
- **KAP Sebelumnya**: Nama KAP sebelumnya (jika pernah diaudit)
- **Opini Sebelumnya**: Opini audit sebelumnya (jika pernah diaudit)
- **Pendapatan**: Jumlah pendapatan (format Rupiah)
- **Aset**: Jumlah aset (format Rupiah)

### Catatan Multiple Perusahaan
Jika klien memiliki lebih dari 1 perusahaan, kolom akan diberi suffix:
- Contoh: "Nama Entitas (Perusahaan 1)", "Nama Entitas (Perusahaan 2)", dst.

## Fitur Tambahan

1. **Auto Column Width**: Lebar kolom otomatis menyesuaikan dengan isi data
2. **Format Mata Uang**: Pendapatan dan aset ditampilkan dalam format Rupiah
3. **Error Handling**: Menampilkan alert jika terjadi kesalahan saat export
4. **Responsive Design**: Tombol export mengikuti desain responsif halaman

## Dependencies
- **xlsx**: Library untuk membuat file Excel
- **@types/node**: Type definitions untuk Node.js

## Instalasi Dependencies
```bash
npm install xlsx
npm install @types/node --save-dev
```

## Technical Implementation

### Key Functions:
- `exportToExcel()`: Fungsi utama untuk export data
- Data transformation dengan TypeScript interfaces yang proper
- Format tanggal menggunakan locale Indonesia
- Dynamic column generation berdasarkan jumlah perusahaan

### Error Handling:
- Try-catch untuk menangani error saat proses export
- Alert notification untuk user feedback
- Console logging untuk debugging

## Browser Compatibility
- Mendukung semua browser modern (Chrome, Firefox, Safari, Edge)
- Menggunakan JavaScript modern dengan fallback
- File akan diunduh otomatis setelah proses selesai

## Security Notes
- Fitur ini hanya tersedia untuk admin yang sudah terautentikasi
- Data sensitif tetap terlindungi dengan system authentication
- Export dilakukan di client-side tanpa transfer data tambahan ke server
