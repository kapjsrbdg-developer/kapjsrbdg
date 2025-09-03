# Production Database Setup

## Issue dengan SQLite di Netlify
SQLite file-based database akan hilang setiap kali deploy ulang di Netlify karena sifat serverless.

## Solusi Production

### Option 1: TursoDB (Recommended for SQLite compatibility)
1. Daftar di https://turso.tech/
2. Buat database baru
3. Update DATABASE_URL di Netlify environment variables:
   ```
   DATABASE_URL="libsql://your-database-url.turso.io?authToken=your-auth-token"
   ```

### Option 2: PlanetScale MySQL (Free tier)
1. Daftar di https://planetscale.com/
2. Buat database baru
3. Update prisma/schema.prisma:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

### Option 3: Supabase PostgreSQL (Free tier)
1. Daftar di https://supabase.com/
2. Buat project baru
3. Update prisma/schema.prisma:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

## Environment Variables untuk Netlify
Set di Netlify Dashboard > Site Settings > Environment Variables:
- `DATABASE_URL`: URL database production Anda
- `NODE_ENV`: "production"

## Testing Deployment
1. Commit dan push ke repository
2. Check Netlify build logs untuk errors
3. Test form submission di site live
4. Check database melalui admin dashboard atau direct query
