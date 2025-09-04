-- SQL Query untuk membuat table client_forms di Supabase
-- Jalankan query ini di SQL Editor Supabase Dashboard

-- 1. Create client_forms table
CREATE TABLE client_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_lengkap VARCHAR(255) NOT NULL,
  nomor_hp VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  jumlah_entitas INTEGER NOT NULL,
  jasa_yang_dibutuhkan TEXT NOT NULL, -- JSON string of selected services
  companies TEXT NOT NULL, -- JSON string of company data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX idx_client_forms_email ON client_forms(email);
CREATE INDEX idx_client_forms_created_at ON client_forms(created_at);
CREATE INDEX idx_client_forms_nama_lengkap ON client_forms(nama_lengkap);

-- 3. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Create trigger for updated_at
CREATE TRIGGER update_client_forms_updated_at
  BEFORE UPDATE ON client_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Row Level Security (RLS) - Optional tapi direkomendasikan
ALTER TABLE client_forms ENABLE ROW LEVEL SECURITY;

-- 6. Create policies untuk akses data
-- Policy untuk insert (anyone can insert)
CREATE POLICY "Anyone can insert client forms" 
ON client_forms FOR INSERT 
WITH CHECK (true);

-- Policy untuk select (only authenticated users can read)
CREATE POLICY "Authenticated users can view client forms" 
ON client_forms FOR SELECT 
TO authenticated 
USING (true);

-- Policy untuk update (only authenticated users can update)
CREATE POLICY "Authenticated users can update client forms" 
ON client_forms FOR UPDATE 
TO authenticated 
USING (true);

-- 7. Insert sample data (optional)
INSERT INTO client_forms (
  nama_lengkap, 
  nomor_hp, 
  email, 
  jumlah_entitas, 
  jasa_yang_dibutuhkan, 
  companies
) VALUES (
  'John Doe',
  '081234567890',
  'john.doe@example.com',
  1,
  '["Jasa Audit Laporan Keuangan"]',
  '[{"namaEntitas":"PT. Contoh Perusahaan","bidangUsaha":"Teknologi","alamatPerusahaan":"Jakarta","tahunBuku":"2024","pernahDiaudit":false,"jumlahPendapatan":"1000000000","jumlahAset":"500000000"}]'
);
