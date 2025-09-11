'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function InfoPage() {
  const handlePDFClick = () => {
    // Link Google Drive akan diisi nanti
    const googleDriveLink = "https://drive.google.com/file/d/1SsNUnys3U7hcBJ09XowKU6vqzfUacQHU/view"; // Akan diisi dengan link PDF dari Google Drive
    
    if (googleDriveLink) {
      window.open(googleDriveLink, '_blank');
    } else {
      alert('📄 Link PDF akan segera tersedia. Silakan hubungi admin untuk informasi lebih lanjut.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Logo and Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-6 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 hover:scale-105 transition-all duration-300 mb-6">
            <Image
              src="/logo.svg"
              alt="JSR Logo"
              width={150}
              height={75}
              className="h-16 w-auto"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Jojo Sunarjo & Rekan Cabang Bandung</h1>
          <p className="text-slate-600 text-lg">Quick Access Links</p>
        </div>

        {/* Link Tree Buttons */}
        <div className="w-full max-w-md space-y-4">
          {/* Button 1: Client Form */}
          <Link
            href="/client-form"
            className="group block w-full"
          >
            <div className="bg-white/95 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">Form Konsultasi</h3>
                    <p className="text-slate-600 text-sm">Ajukan kebutuhan audit & konsultasi</p>
                  </div>
                </div>
                <div className="text-blue-900 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </div>
            </div>
          </Link>

          {/* Button 2: Website Utama */}
          <a
            href="https://www.kapjsr.co.id"
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full"
          >
            <div className="bg-white/95 backdrop-blur-sm border-2 border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-green-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-600 text-lg">Website Utama</h3>
                    <p className="text-slate-600 text-sm">Kunjungi kapjsr.co.id</p>
                  </div>
                </div>
                <div className="text-green-600 group-hover:translate-x-1 transition-transform duration-300">
                  ↗
                </div>
              </div>
            </div>
          </a>

          {/* Button 3: XLNC.org */}
          <a
            href="https://www.xlnc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full"
          >
            <div className="bg-white/95 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-purple-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-600 text-lg">XLNC Network</h3>
                    <p className="text-slate-600 text-sm">Visit xlnc.org</p>
                  </div>
                </div>
                <div className="text-purple-600 group-hover:translate-x-1 transition-transform duration-300">
                  ↗
                </div>
              </div>
            </div>
          </a>

          {/* Button 4: PDF Document */}
          <button
            onClick={handlePDFClick}
            className="group block w-full text-left"
          >
            <div className="bg-white/95 backdrop-blur-sm border-2 border-orange-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-orange-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📄</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-500 text-lg">Company Profile</h3>
                    <p className="text-slate-600 text-sm">Download PDF brochure</p>
                  </div>
                </div>
                <div className="text-orange-500 group-hover:translate-x-1 transition-transform duration-300">
                  ↗
                </div>
              </div>
            </div>
          </button>

          {/* Button 5: Lead Partner */}
          <Link
            href="/employee/JSR-001"
            className="group block w-full"
          >
            <div className="bg-white/95 backdrop-blur-sm border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-600 text-lg">Lead Partner</h3>
                    <p className="text-slate-600 text-sm">Meet our lead partner</p>
                  </div>
                </div>
                <div className="text-indigo-600 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </div>
            </div>
          </Link>

          {/* Button 6: Partner */}
          <Link
            href="/employee/JSR-002"
            className="group block w-full"
          >
            <div className="bg-white/95 backdrop-blur-sm border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-600 text-lg">Partner</h3>
                    <p className="text-slate-600 text-sm">Meet our partner</p>
                  </div>
                </div>
                <div className="text-indigo-600 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </div>
            </div>
          </Link>

          {/* Button 6: Partner */}
          <Link
            href="/employee/JSR-008"
            className="group block w-full"
          >
            <div className="bg-white/95 backdrop-blur-sm border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-indigo-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-600 text-lg">Manager</h3>
                    <p className="text-slate-600 text-sm">Meet our manager</p>
                  </div>
                </div>
                <div className="text-indigo-600 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-900 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        {/* Social Media or Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Jojo Sunarjo & Rekan Cabang Bandung - Professional Audit & Consulting Services
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-slate-400 text-xs">
              📧 Email: info@kapjsrbdg.co.id
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
