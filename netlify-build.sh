#!/bin/bash

# Netlify Build Script untuk Next.js + Supabase
echo "🚀 Starting Netlify build process..."

# Set default Supabase environment variables jika belum ada
export NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-"https://tyorydcmacaqmdgfclas.supabase.co"}
export NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-"sb_publishable_Kk0Flz-zLGxh1_t2uqFn8w_tDbngWwY"}

echo "✅ Environment variables configured"
echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building Next.js application..."
npm run build

echo "🎉 Build completed successfully!"
