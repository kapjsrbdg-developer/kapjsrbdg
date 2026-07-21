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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_validations_kode ON report_validations(kode);

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
  SELECT * FROM report_validations WHERE kode = p_kode LIMIT 1;
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
  SELECT * FROM report_validations ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION list_report_validations() TO anon, authenticated;

-- 5. (Opsional) Verifikasi
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'report_validations' ORDER BY ordinal_position;
