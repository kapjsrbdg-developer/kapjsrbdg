-- Temporary fix: Disable RLS untuk testing
-- HANYA untuk development/testing, JANGAN untuk production!

-- Disable RLS sementara
ALTER TABLE client_forms DISABLE ROW LEVEL SECURITY;

-- INGAT: Enable kembali setelah testing selesai dengan:
-- ALTER TABLE client_forms ENABLE ROW LEVEL SECURITY;
