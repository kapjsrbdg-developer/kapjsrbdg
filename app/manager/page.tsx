'use client';

import Image from 'next/image';
import Link from 'next/link';
import ProfileImage from '../../components/ProfileImage';
import karyawanData from '../../data/karyawan.json';

type KaryawanData = {
  slug: string;
  name: string;
  title: string;
  foto: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certification: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  instagram?: string;
};

export default function ManagerPage() {
  // Filter untuk mendapatkan data JSR-007 dan JSR-008
  const managers = karyawanData.filter(
    (karyawan: KaryawanData) => karyawan.slug === 'JSR-007' || karyawan.slug === 'JSR-008'
  );

  if (managers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-600">Data Manager Tidak Ditemukan</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            
            <div className="inline-flex items-center justify-center p-6 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 hover:scale-105 transition-all duration-300 mb-6">
              <Image
                src="/logo.svg"
                alt="JSR Logo"
                width={120}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </div>
            
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Manager</h1>
            <p className="text-slate-600 text-lg">KAP JSR Cabang Bandung</p>
          </div>

          {/* Manager Profiles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {managers.map((manager: KaryawanData) => (
              <div 
                key={manager.slug}
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden hover:scale-105 transition-all duration-300"
              >
                {/* Manager Header */}
                <div className="bg-gradient-to-br from-blue-900 to-green-600 p-8 text-center text-white">
                  <div className="w-40 h-40 mx-auto mb-6 relative">
                    <ProfileImage
                      src={manager.foto}
                      alt={manager.name}
                      width={160}
                      height={160}
                      className="w-full h-full rounded-full border-4 border-white shadow-2xl object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{manager.name}</h2>
                  <p className="text-blue-100 text-lg font-medium">{manager.title}</p>
                  {/* <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mt-4 inline-block">
                    <span className="text-sm font-medium">{manager.slug}</span>
                  </div> */}
                </div>

                {/* Manager Content */}
                <div className="p-8 space-y-8">
                  {/* Education Section */}
                  {manager.education && manager.education.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                        Pendidikan
                      </h3>
                      <div className="space-y-3">
                        {manager.education
                          .filter(edu => edu.degree && edu.degree.trim() !== '')
                          .map((edu, index) => (
                            <div 
                              key={index}
                              className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-blue-900 hover:bg-blue-100/80 transition-colors"
                            >
                              <div className="font-semibold text-blue-900">{edu.degree}</div>
                              <div className="text-slate-600 text-sm mt-1">{edu.institution}</div>
                              {edu.year && (
                                <div className="text-slate-500 text-xs mt-1">{edu.year}</div>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  {/* Certification Section */}
                  {manager.certification && manager.certification.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                        Sertifikasi
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {manager.certification
                          .filter(cert => cert.name && cert.name.trim() !== '')
                          .map((cert, index) => (
                            <div 
                              key={index}
                              className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-green-600 hover:bg-green-100/80 transition-colors"
                            >
                              <div className="font-semibold text-green-600">{cert.name}</div>
                              {cert.issuer && (
                                <div className="text-slate-600 text-sm mt-1">{cert.issuer}</div>
                              )}
                              {cert.year && (
                                <div className="text-slate-500 text-xs mt-1">{cert.year}</div>
                              )}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  {/* Social Media
                  {manager.instagram && (
                    <div>
                      <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                        📱 Social Media
                      </h3>
                      <div className="bg-purple-50/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-purple-600">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-600 font-semibold">Instagram:</span>
                          <a 
                            href={`https://instagram.com/${manager.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-700 hover:text-purple-800 transition-colors"
                          >
                            {manager.instagram}
                          </a>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* Individual Profile Link */}
                  {/* <div className="pt-4 border-t border-slate-200">
                    <Link 
                      href={`/employee/${manager.slug}`}
                      className="block w-full bg-gradient-to-r from-blue-900 to-green-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Lihat Profil Lengkap →
                    </Link>
                  </div> */}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Footer */}
          <div className="text-center mt-12">
            <div className="space-y-4">
              <p className="text-slate-600">Link lainnya</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/employee/JSR-001"
                  className="bg-white/90 backdrop-blur-sm text-green-600 px-6 py-3 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium border border-green-600/20"
                >
                  👤 Lead Partner
                </Link>
                <Link
                  href="/employee/JSR-002"
                  className="bg-white/90 backdrop-blur-sm text-green-600 px-6 py-3 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium border border-green-600/20"
                >
                  👤 Partner
                </Link>
                <Link
                  href="/info"
                  className="bg-white/90 backdrop-blur-sm text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium border border-purple-600/20"
                >
                  🔗 Quick Links
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}