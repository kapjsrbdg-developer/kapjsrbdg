import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProfileImage from '../../../components/ProfileImage';
import karyawanData from '../../../data/karyawan.json';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface Karyawan {
  slug: string;
  name: string;
  title: string;
  foto: string;
  education: Education[];
  certification: Certification[];
  instagram: string;
}

interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  
  // Cari karyawan berdasarkan slug
  const karyawan = karyawanData.find(
    (employee) => employee.slug === slug
  ) as Karyawan | undefined;

  // Jika karyawan tidak ditemukan, tampilkan 404
  if (!karyawan) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Photo */}
            <div className="w-48 h-48 relative rounded-full overflow-hidden shadow-xl border-4 border-white dark:border-gray-700">
              <ProfileImage
                src={karyawan.foto || '/img/karyawan/placeholder.svg'}
                alt={`Foto ${karyawan.name}`}
                width={192}
                height={192}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {karyawan.name}
              </h1>
              <p className="text-xl text-blue-600 dark:text-blue-400 mb-4 font-semibold">
                {karyawan.title}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Kode Karyawan: <span className="font-mono font-bold text-gray-900 dark:text-white">{karyawan.slug}</span>
              </p>
              
              {/* Instagram Link */}
              <a
                href={`https://instagram.com/${karyawan.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                {karyawan.instagram}
              </a>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              Pendidikan
            </h2>
            <div className="space-y-4">
              {karyawan.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              Sertifikasi
            </h2>
            <div className="space-y-4">
              {karyawan.certification.map((cert, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {cert.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {cert.issuer}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    {cert.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        {/* <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Home
          </a>
        </div> */}
      </div>
    </div>
  );
}

// Generate static params for all employees
export async function generateStaticParams() {
  return karyawanData.map((employee) => ({
    slug: employee.slug,
  }));
}

// Generate metadata for each employee page
export async function generateMetadata({ params }: ProfilePageProps) {
  const { slug } = await params;
  const karyawan = karyawanData.find((employee) => employee.slug === slug);

  if (!karyawan) {
    return {
      title: 'Karyawan Tidak Ditemukan',
      description: 'Halaman karyawan yang Anda cari tidak ditemukan.'
    };
  }

  return {
    title: `${karyawan.name} - ${karyawan.title} | JSR Profile`,
    description: `Profil lengkap ${karyawan.name}, ${karyawan.title} di JSR. Lihat riwayat pendidikan dan sertifikasi profesional.`,
  };
}
