-- Fix RLS Policy untuk allow public insert
-- Jalankan di Supabase SQL Editor

-- 1. Drop existing policies (jika ada)
DROP POLICY IF EXISTS "Anyone can insert client forms" ON client_forms;
DROP POLICY IF EXISTS "Authenticated users can view client forms" ON client_forms;
DROP POLICY IF EXISTS "Authenticated users can update client forms" ON client_forms;

-- 2. Create new policy untuk public insert (anyone can insert without authentication)
CREATE POLICY "Enable insert for anyone" 
ON client_forms FOR INSERT 
WITH CHECK (true);

-- 3. Policy untuk select (bisa diakses siapa saja untuk demo, atau hanya authenticated)
CREATE POLICY "Enable read for anyone" 
ON client_forms FOR SELECT 
USING (true);

-- Alternative: Jika ingin hanya authenticated yang bisa read
-- CREATE POLICY "Enable read for authenticated users only" 
-- ON client_forms FOR SELECT 
-- TO authenticated 
-- USING (true);

-- 4. Policy untuk update (hanya authenticated)
CREATE POLICY "Enable update for authenticated users only" 
ON client_forms FOR UPDATE 
TO authenticated 
USING (true);

-- 5. Verify RLS is enabled
ALTER TABLE client_forms ENABLE ROW LEVEL SECURITY;
