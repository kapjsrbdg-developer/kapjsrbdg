import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for Netlify deployment
  trailingSlash: false,
  
  // Environment variables for Supabase
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Image configuration for Netlify
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
