import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Halaman Tidak Ditemukan | KAP JSR',
  description: 'Halaman yang Anda cari tidak ditemukan.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 relative overflow-hidden flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
        {/* Logo */}
        <div className="inline-flex items-center justify-center p-4 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 mb-10">
          <Image
            src="/logo.svg"
            alt="JSR Logo"
            width={120}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </div>

        {/* 404 */}
        <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-900 to-green-600 bg-clip-text text-transparent mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
          Halaman Tidak Ditemukan
        </h2>

        <p className="text-slate-600 text-base md:text-lg max-w-md mb-10">
          Maaf, halaman yang Anda cari tidak tersedia atau alamatnya salah.
          Silakan periksa kembali tautannya.
        </p>

        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-2xl hover:bg-blue-800 transition-all duration-300 hover:scale-105 shadow-2xl font-semibold border-2 border-blue-900/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
