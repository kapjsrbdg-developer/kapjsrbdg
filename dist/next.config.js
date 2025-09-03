"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nextConfig = {
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
exports.default = nextConfig;
