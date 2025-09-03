import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for Netlify deployment
  trailingSlash: false,
  
  // Remove API routes rewrites since we're using NestJS now
  
  // Environment variables for NestJS backend
  env: {
    NESTJS_API_URL: process.env.NESTJS_API_URL || "http://localhost:3001",
  },
};

export default nextConfig;
