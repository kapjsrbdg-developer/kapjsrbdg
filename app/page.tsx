'use client';

import { useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    // Set timer untuk redirect setelah 2 detik
    const timer = setTimeout(() => {
      window.location.href = 'https://www.kapjsr.co.id';
    }, 2000);

    // Cleanup timer jika component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo */}
        <div className="mb-8 animate-bounce">
          <Image
            src="/logo.svg"
            alt="JSR Logo"
            width={200}
            height={100}
            className="h-20 w-auto"
            priority
          />
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-900"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-2 animate-pulse">
            Anda Sedang Diarahkan
          </h1>
          <p className="text-slate-600 text-lg">
            Mengarahkan ke website utama...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 bg-slate-200 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-900 to-green-600 rounded-full animate-loading-bar"></div>
        </div>

        {/* Fallback Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-2">
            Jika tidak dialihkan otomatis, klik link berikut:
          </p>
          <a
            href="https://www.kapjsr.co.id"
            className="text-blue-900 hover:text-blue-700 font-semibold underline transition-colors"
          >
            www.kapjsr.co.id
          </a>
        </div>
      </div>
    </div>
  );
}
