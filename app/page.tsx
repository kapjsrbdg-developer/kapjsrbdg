import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans relative min-h-screen overflow-hidden">
      <main className="relative z-20 flex flex-col gap-[24px] items-center w-full animate-fade-in pt-16">
        <div className="animate-bounce-in w-screen h-screen flex items-center justify-center absolute inset-0 z-10">
          <Image
            className="transition-all duration-500 w-full h-full max-w-none max-h-none object-contain"
            src="/home.svg"
            alt="Home"
            width={1920}
            height={1080}
            priority
            style={{ 
              width: '100vw', 
              height: '100vh', 
              maxWidth: 'none', 
              maxHeight: 'none' 
            }}
          />
        </div>

        {/* Navigation Menu */}
        {/* <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
          <Link
            href="/client-form"
            className="bg-blue-900 text-white px-6 py-3 rounded-2xl hover:bg-blue-800 transition-all duration-300 shadow-2xl hover:shadow-3xl font-semibold border-2 border-blue-900/20 backdrop-blur-sm hover:scale-105"
          >
            📝 Form Konsultasi
          </Link>
          <Link
            href="/karyawan"
            className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 transition-all duration-300 shadow-2xl hover:shadow-3xl font-semibold border-2 border-green-600/20 backdrop-blur-sm hover:scale-105"
          >
            👥 Tim Karyawan
          </Link>
          <Link
            href="/admin"
            className="bg-purple-600 text-white px-6 py-3 rounded-2xl hover:bg-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl font-semibold border-2 border-purple-600/20 backdrop-blur-sm hover:scale-105"
          >
            🔧 Admin Dashboard
          </Link>
        </div> */}

        {/* <div className="flex gap-4 items-center flex-col sm:flex-row animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>

        </div> */}
      </main>

    </div>
  );
}
