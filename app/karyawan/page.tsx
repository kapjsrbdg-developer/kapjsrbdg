import Link from 'next/link';
import karyawanData from '../../data/karyawan.json';

interface Karyawan {
  slug: string;
  name: string;
  title: string;
  education: any[];
  certification: any[];
  instagram: string;
}

export default function KaryawanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Tim Karyawan JSR
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Temui tim profesional kami yang berdedikasi tinggi dan berpengalaman di berbagai bidang teknologi
          </p>
        </div>

        {/* Employee Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {karyawanData.map((karyawan: any, index: number) => {
            const education = Array.isArray(karyawan.education) ? karyawan.education : [];
            const certification = Array.isArray(karyawan.certification) ? karyawan.certification : [];
            return (
              <Link
                key={karyawan.slug}
                href={`/profile/${karyawan.slug}`}
                className="group block animate-fade-in hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl p-6 h-full border-2 border-transparent hover:border-blue-500 transition-all duration-300">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {karyawan.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  
                  {/* Info */}
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {karyawan.name}
                    </h2>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
                      {karyawan.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      ID: <span className="font-mono font-semibold">{karyawan.slug}</span>
                    </p>
                    
                    {/* Stats */}
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {education.length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Pendidikan
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {certification.length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Sertifikat
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Klik untuk melihat profil lengkap →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back to Home */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Tim Karyawan | JSR',
  description: 'Temui tim profesional JSR yang berdedikasi tinggi dan berpengalaman di berbagai bidang teknologi.',
};
