import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for Netlify deployment
  trailingSlash: false,
  output: 'standalone',
  
  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Environment variables
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  },
};

export default nextConfig;
