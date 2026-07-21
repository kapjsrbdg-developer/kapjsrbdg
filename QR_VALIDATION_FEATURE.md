# Fitur Validasi Dokumen via QR Code

Sistem untuk memverifikasi keaslian dokumen yang diterbitkan KAP JSR menggunakan
QR code. Admin membuat QR dari data report, QR ditempel di dokumen, dan siapa pun
yang memindainya bisa memastikan dokumen itu asli.

## Alur

1. **Admin** membuka `/generateqr` (halaman rahasia, tidak ada di menu) lalu login.
2. Isi form: **Nama KAP, Nama Klien, Periode Awal, Periode Akhir, No Laporan,
   Tanggal Terbit Laporan, AP Penanggung Jawab** (dropdown: Sony Devano / Nurmala
   Arifin / Lainnya + isian manual).
3. Sistem membuat **kode unik** (mis. `JSR-7K4M9QXP`), menyimpannya ke database,
   lalu men-generate **QR code** yang bisa di-**download** (PNG).
4. QR berisi URL: `https://kapjsrbdg.co.id/validasi/<kodeUnik>`.
5. **Pemindai QR** diarahkan ke `/validasi/<kodeUnik>` yang menampilkan data report
   sebagai bukti keaslian dokumen. Kalau kode tidak terdaftar → tampil "Dokumen
   Tidak Ditemukan".

## File yang Terlibat

| File | Fungsi |
|------|--------|
| `app/generateqr/page.tsx` | Form + generate & download QR (diproteksi login admin) |
| `app/validasi/[kode]/page.tsx` | Halaman verifikasi publik (server component) |
| `lib/supabase.ts` | `generateValidationCode`, `insertReportValidation`, `getReportValidationByKode` |
| `report-validations-setup.sql` | Skrip SQL tabel + fungsi lookup aman |

## ⚠️ WAJIB: Jalankan SQL di Supabase

Sebelum fitur bisa dipakai, jalankan isi **`report-validations-setup.sql`** di
Supabase Dashboard → SQL Editor. Skrip ini membuat:

- Tabel `report_validations`
- Policy RLS: **INSERT diizinkan**, **SELECT publik ditutup**
- Fungsi `get_report_validation(p_kode)` (`SECURITY DEFINER`) untuk baca 1 record

## Keamanan

- **Halaman generate diproteksi login admin** (memakai komponen `AdminLogin` yang
  sudah ada) supaya orang asing tidak bisa membuat QR "valid" palsu.
- **Tabel tidak bisa dibaca publik.** Halaman validasi hanya mengambil data lewat
  fungsi database per-kode, jadi daftar report & nama klien tidak bisa di-scrape
  massal lewat API.
- **Kode unik non-guessable** (8 karakter acak dari `crypto`, tanpa karakter
  ambigu), sehingga sulit ditebak.

## Konfigurasi Domain QR (opsional tapi disarankan)

QR memakai `NEXT_PUBLIC_SITE_URL` bila di-set; jika tidak, memakai origin browser
saat generate. Agar QR selalu menunjuk ke domain produksi meski dibuat dari mana
pun, set di Netlify Environment Variables:

```
NEXT_PUBLIC_SITE_URL=https://kapjsrbdg.co.id
```

## Catatan

- Data validasi bersifat permanen; belum ada fitur hapus/edit dari UI. Kalau perlu
  koreksi, ubah langsung lewat Supabase Dashboard.
- QR memakai error correction level "H" agar tetap terbaca walau sedikit tertutup
  logo/stempel.
