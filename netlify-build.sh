#!/bin/bash

# Netlify Build Script for Prisma + Next.js
echo "Starting Netlify build process..."

# Install dependencies
npm install

# Generate Prisma Client
echo "Generating Prisma client..."
npx prisma generate

# Build Next.js application
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"
