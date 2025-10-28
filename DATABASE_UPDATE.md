# Update Database: Tambah Kolom Tujuan Audit & Deskripsi

## ⚠️ Penting: Update Database Supabase

Setelah menambahkan field "Tujuan Audit" dan "Darimana Anda mengetahui KAP JSR" ke form, Anda perlu menambahkan kolom-kolom baru di tabel `client_forms` di Supabase.

## Langkah-Langkah Update

### 1. Buka Supabase Dashboard
- Login ke https://supabase.com
- Pilih project Anda
- Klik **SQL Editor** di sidebar kiri

### 2. Jalankan Query SQL Berikut

Copy dan paste query ini ke SQL Editor, lalu klik **Run**:

```sql
-- Tambah kolom tujuan_audit
ALTER TABLE client_forms 
ADD COLUMN IF NOT EXISTS tujuan_audit TEXT;

-- Tambah kolom tujuan_audit_lainnya (optional, untuk pilihan "Lainnya")
ALTER TABLE client_forms 
ADD COLUMN IF NOT EXISTS tujuan_audit_lainnya TEXT;

-- Kolom deskripsi sudah ada di database, tidak perlu ditambahkan lagi
-- Jika belum ada, jalankan query berikut:
-- ALTER TABLE client_forms 
-- ADD COLUMN IF NOT EXISTS deskripsi TEXT;

-- Verifikasi kolom sudah ditambahkan
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'client_forms'
ORDER BY ordinal_position;
```

### 3. Verifikasi Kolom Berhasil Ditambahkan

Setelah menjalankan query, Anda akan melihat daftar semua kolom di tabel `client_forms`, termasuk:
- `tujuan_audit` (TEXT)
- `tujuan_audit_lainnya` (TEXT)
- `deskripsi` (TEXT) ← Sudah ada sebelumnya

## Struktur Tabel Lengkap

Setelah update, tabel `client_forms` akan memiliki struktur:

```
client_forms
├── id (uuid, primary key)
├── nama_lengkap (text)
├── nomor_hp (text)
├── email (text)
├── jumlah_entitas (integer)
├── jasa_yang_dibutuhkan (text, JSON array)
├── tujuan_audit (text) ← BARU
├── tujuan_audit_lainnya (text) ← BARU
├── deskripsi (text) ← Digunakan untuk "Darimana mengetahui KAP JSR"
├── companies (text, JSON array)
├── created_at (timestamp)
└── updated_at (timestamp)
```

## Nilai Field Baru

### Tujuan Audit
Field `tujuan_audit` akan berisi salah satu dari:
- **Perbankan**
- **Tender**
- **Peraturan BI/OJK**
- **Perpajakan**
- **Internal**
- **Lainnya** (jika dipilih, detail akan tersimpan di `tujuan_audit_lainnya`)

### Deskripsi
Field `deskripsi` sekarang digunakan untuk menyimpan jawaban dari:
**"Darimana Anda mengetahui KAP JSR?"**

Contoh jawaban:
- "Referensi dari teman"
- "Pencarian Google"
- "Media sosial Instagram"
- "Rekomendasi dari bank"
- dll.

## Catatan

- Kolom `tujuan_audit` adalah **wajib** (required) di form, tapi di database nullable untuk data lama
- Kolom `tujuan_audit_lainnya` adalah **optional**, hanya terisi jika user memilih "Lainnya"
- Kolom `deskripsi` adalah **optional** di form, user bisa mengosongkan
- Data submission yang sudah ada sebelumnya akan memiliki nilai NULL untuk kolom `tujuan_audit` dan `tujuan_audit_lainnya`

---

**Status:** ✅ Update selesai di code, tinggal jalankan SQL query di Supabase Dashboard (hanya untuk tujuan_audit)

