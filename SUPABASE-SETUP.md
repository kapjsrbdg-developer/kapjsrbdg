# Setup Supabase untuk Form Client JSR

## 📋 Langkah-langkah Setup:

### 1. Buat Project Supabase
1. Kunjungi [https://app.supabase.com](https://app.supabase.com)
2. Login atau daftar akun baru
3. Klik "New Project"
4. Isi nama project: `kapjsrbdg`
5. Set password database yang kuat
6. Pilih region terdekat (Singapore/Jakarta)
7. Klik "Create new project"

### 2. Setup Database Table
1. Di dashboard Supabase, buka **SQL Editor**
2. Copy paste semua kode dari file `supabase-setup.sql`
3. Klik **RUN** untuk menjalankan query
4. Pastikan table `client_forms` sudah terbuat di **Table Editor**

### 3. Ambil Credentials
1. Di dashboard Supabase, buka **Settings** > **API**
2. Copy **Project URL** 
3. Copy **anon/public key**

### 4. Setup Environment Variables
1. Buka file `.env.local`
2. Replace nilai berikut:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Test Koneksi
1. Jalankan aplikasi: `npm run dev`
2. Buka [http://localhost:3000/client-form](http://localhost:3000/client-form)
3. Isi dan submit form untuk test
4. Cek di [http://localhost:3000/admin](http://localhost:3000/admin) untuk melihat data

### 6. Verifikasi di Supabase
1. Buka **Table Editor** > **client_forms**
2. Data form yang disubmit harus muncul disini

## 🔒 Security Notes:

- **RLS (Row Level Security)** sudah diaktifkan
- **Public insert** diizinkan untuk form submission
- **Authenticated read** diperlukan untuk admin access
- Untuk production, pertimbangkan menambah autentikasi admin

## 🛠 Troubleshooting:

### Error "Cannot find Supabase URL/Key":
- Pastikan file `.env.local` sudah dibuat
- Restart development server setelah update env

### Error "Failed to insert":
- Cek policy RLS di Supabase
- Pastikan table structure sudah benar

### Admin page tidak menampilkan data:
- Implement autentikasi untuk role authenticated
- Atau ubah policy select menjadi public temporary

## 🚀 Production Deployment:

1. **Netlify/Vercel**: Add environment variables di dashboard
2. **Environment**: Set `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Database**: Production database sudah tersedia di Supabase

## 📊 Monitoring:

- Monitor usage di **Settings** > **Usage**  
- Setup alerts untuk resource limits
- Backup database regularly di **Settings** > **Database**
