-- ============================================================
-- Fitur Validasi Dokumen via QR Code
-- Tabel report_validations + fungsi lookup aman.
-- Jalankan query ini di SQL Editor Supabase Dashboard.
-- ============================================================

-- 1. Buat tabel
CREATE TABLE IF NOT EXISTS report_validations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode TEXT NOT NULL UNIQUE,            -- kode unik yang ada di QR (mis. "JSR-7K4M9QXP")
  nama_kap TEXT NOT NULL,
  nama_klien TEXT NOT NULL,
  periode_awal DATE NOT NULL,
  periode_akhir DATE NOT NULL,
  no_laporan TEXT NOT NULL,
  tanggal_terbit DATE NOT NULL,
  ap_penanggung_jawab TEXT NOT NULL,    -- nama AP (dropdown atau input manual "Lainnya")
  file_path TEXT,                       -- path PDF di storage (nullable utk data lama)
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE, -- soft delete: cukup set TRUE
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_validations_kode ON report_validations(kode);

-- Kalau tabel SUDAH ada sebelumnya, tambahkan kolom baru:
ALTER TABLE report_validations ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE report_validations
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Aktifkan RLS: izinkan INSERT (dari aplikasi), TUTUP SELECT publik.
ALTER TABLE report_validations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for anyone" ON report_validations;
CREATE POLICY "Enable insert for anyone"
ON report_validations FOR INSERT
WITH CHECK (true);

-- (Sengaja TIDAK ada policy SELECT => anon/publik tidak bisa membaca tabel
--  secara langsung, sehingga daftar report & nama klien tidak bisa di-scrape.)

-- 3. Fungsi lookup aman: hanya mengembalikan 1 baris sesuai kode.
--    SECURITY DEFINER => berjalan sebagai owner sehingga bisa membaca tabel
--    meski RLS menutup SELECT untuk publik.
CREATE OR REPLACE FUNCTION get_report_validation(p_kode TEXT)
RETURNS SETOF report_validations
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM report_validations
  WHERE kode = p_kode AND is_deleted = FALSE
  LIMIT 1;
$$;

-- Izinkan aplikasi (anon key) dan user login memanggil fungsi ini.
GRANT EXECUTE ON FUNCTION get_report_validation(TEXT) TO anon, authenticated;

-- 4. Fungsi daftar semua QR (untuk dashboard admin "Riwayat QR" di /generateqr).
--    Catatan: sama seperti tabel client_forms, daftar ini bisa diambil lewat
--    anon key (proteksi di level tampilan/login aplikasi, bukan server).
CREATE OR REPLACE FUNCTION list_report_validations()
RETURNS SETOF report_validations
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM report_validations
  WHERE is_deleted = FALSE
  ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION list_report_validations() TO anon, authenticated;

-- 4b. Fungsi update record (untuk tombol Edit di Riwayat QR).
--     `kode` TIDAK ikut diubah, sehingga link/QR yang sudah terlanjur
--     ditempel di dokumen tetap valid.
--     p_file_path NULL berarti "jangan ubah file yang sudah ada".
CREATE OR REPLACE FUNCTION update_report_validation(
  p_kode TEXT,
  p_nama_kap TEXT,
  p_nama_klien TEXT,
  p_periode_awal DATE,
  p_periode_akhir DATE,
  p_no_laporan TEXT,
  p_tanggal_terbit DATE,
  p_ap_penanggung_jawab TEXT,
  p_file_path TEXT
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE report_validations
  SET nama_kap = p_nama_kap,
      nama_klien = p_nama_klien,
      periode_awal = p_periode_awal,
      periode_akhir = p_periode_akhir,
      no_laporan = p_no_laporan,
      tanggal_terbit = p_tanggal_terbit,
      ap_penanggung_jawab = p_ap_penanggung_jawab,
      file_path = COALESCE(p_file_path, file_path)
  WHERE kode = p_kode;
$$;

GRANT EXECUTE ON FUNCTION update_report_validation(
  TEXT, TEXT, TEXT, DATE, DATE, TEXT, DATE, TEXT, TEXT
) TO anon, authenticated;

-- 5. Storage bucket untuk file PDF laporan.
--    Bucket dibuat PUBLIC supaya halaman validasi bisa menampilkan PDF-nya.
--    CATATAN: karena publik, siapa pun yang tahu URL file bisa mengunduhnya.
--    Tombol download di viewer disembunyikan, tapi itu bukan proteksi mutlak.
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-files', 'report-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Izinkan upload dari aplikasi (anon key), sejalan dengan pola tabel lain.
DROP POLICY IF EXISTS "Upload report files" ON storage.objects;
CREATE POLICY "Upload report files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'report-files');

DROP POLICY IF EXISTS "Read report files" ON storage.objects;
CREATE POLICY "Read report files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'report-files');

-- 6. (Opsional) Verifikasi
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'report_validations' ORDER BY ordinal_position;
