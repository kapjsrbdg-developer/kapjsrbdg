#!/bin/bash

# Build script untuk Netlify dengan Prisma setup
echo "🚀 Starting Netlify build with Prisma..."

# Ensure database directory exists
mkdir -p prisma

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate

# Push database schema (create tables if they don't exist)
echo "🗄️  Setting up database..."
npx prisma db push --accept-data-loss

# Build Next.js app
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
