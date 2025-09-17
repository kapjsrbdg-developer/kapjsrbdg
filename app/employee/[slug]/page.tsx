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

interface EmployeePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EmployeePage({ params }: EmployeePageProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 relative overflow-hidden">
      {/* Background Pattern with JSR Colors */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* JSR Logo */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 hover:scale-105 transition-all duration-300">
            <Image
              src="/logo.svg"
              alt="JSR Logo"
              width={120}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </div>
          <div className="mt-4">
            <p className="text-slate-600">KAP Jojo Sunarjo & Rekan Cabang Bandung</p>
          </div>
        </div>

        {/* Header Profile */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in border border-slate-200/50">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Photo */}
            <div className="w-48 h-48 relative rounded-full overflow-hidden shadow-2xl border-4 border-white ring-4 ring-blue-900/20">
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
              <h1 className="text-4xl font-bold text-blue-900 mb-2">
                {karyawan.name}
              </h1>
              <p className="text-xl text-green-600 mb-4 font-semibold">
                {karyawan.title}
              </p>
              {/* <p className="text-lg text-slate-600 mb-4">
                Kode Karyawan: <span className="font-mono font-bold text-blue-900">{karyawan.slug}</span>
              </p> */}
              
              {/* Instagram Link */}
              {/* <a
                href={`https://instagram.com/${karyawan.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                {karyawan.instagram}
              </a> */}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 animate-fade-in border border-slate-200/50" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              Pendidikan
            </h2>
            <div className="space-y-4">
              {karyawan.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-blue-900 pl-4 py-3 bg-blue-50/50 rounded-r-lg backdrop-blur-sm">
                  <h3 className="font-semibold text-blue-900 text-lg">
                    {edu.degree}
                  </h3>
                  <p className="text-slate-600 font-medium">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-blue-700 font-semibold">
                    {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 animate-fade-in border border-slate-200/50" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              Sertifikasi
            </h2>
            <div className="space-y-4">
              {karyawan.certification.map((cert, index) => (
                <div key={index} className="border-l-4 border-green-600 pl-4 py-3 bg-green-50/50 rounded-r-lg backdrop-blur-sm">
                  <h3 className="font-semibold text-green-800 text-lg">
                    {cert.name}
                  </h3>
                  <p className="text-slate-600 font-medium">
                    {cert.issuer}
                  </p>
                  <p className="text-sm text-green-700 font-semibold">
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
export async function generateMetadata({ params }: EmployeePageProps) {
  const { slug } = await params;
  const karyawan = karyawanData.find((employee) => employee.slug === slug);

  if (!karyawan) {
    return {
      title: 'Karyawan Tidak Ditemukan',
      description: 'Halaman karyawan yang Anda cari tidak ditemukan.'
    };
  }

  return {
    title: `${karyawan.name} - ${karyawan.title} | JSR Employee`,
    description: `Profil lengkap ${karyawan.name}, ${karyawan.title} di JSR. Lihat riwayat pendidikan dan sertifikasi profesional.`,
  };
}
