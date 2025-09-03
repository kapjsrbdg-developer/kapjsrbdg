"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = KaryawanPage;
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const ProfileImage_1 = __importDefault(require("../../components/ProfileImage"));
const karyawan_json_1 = __importDefault(require("../../data/karyawan.json"));
function KaryawanPage() {
    return (<div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 relative overflow-hidden">
      {/* Background Pattern with JSR Colors */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* JSR Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 hover:scale-105 transition-all duration-300 mb-6">
            <image_1.default src="/logo.svg" alt="JSR Logo" width={120} height={60} className="h-12 w-auto" priority/>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Tim Karyawan JSR
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Temui tim profesional kami yang berdedikasi tinggi dan berpengalaman di berbagai bidang teknologi
          </p>
        </div>

        {/* Employee Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {karyawan_json_1.default.map((karyawan, index) => {
            const education = Array.isArray(karyawan.education) ? karyawan.education : [];
            const certification = Array.isArray(karyawan.certification) ? karyawan.certification : [];
            return (<link_1.default key={karyawan.slug} href={`/profile/${karyawan.slug}`} className="group block animate-fade-in hover:scale-105 transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl p-6 h-full border-2 border-slate-200/50 hover:border-blue-900/30 transition-all duration-300">
                  {/* Employee Photo */}
                  <div className="w-20 h-20 relative rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl border-2 border-white ring-4 ring-blue-900/20">
                    <ProfileImage_1.default src={karyawan.foto || '/img/karyawan/placeholder.svg'} alt={`Foto ${karyawan.name}`} width={80} height={80} className="w-full h-full object-cover"/>
                  </div>
                  
                  {/* Info */}
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-800 transition-colors">
                      {karyawan.name}
                    </h2>
                    <p className="text-green-600 font-semibold mb-3">
                      {karyawan.title}
                    </p>
                    <p className="text-sm text-slate-600 mb-4">
                      ID: <span className="font-mono font-semibold text-blue-900">{karyawan.slug}</span>
                    </p>
                    
                    {/* Stats */}
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-blue-900">
                          {education.length}
                        </div>
                        <div className="text-slate-600">
                          Pendidikan
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">
                          {certification.length}
                        </div>
                        <div className="text-slate-600">
                          Sertifikat
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-blue-900 text-sm font-medium">
                      Klik untuk melihat profil lengkap →
                    </div>
                  </div>
                </div>
              </link_1.default>);
        })}
        </div>

        {/* Back to Home */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <link_1.default href="/" className="inline-flex items-center gap-2 bg-blue-900 text-white px-8 py-4 rounded-2xl hover:bg-blue-800 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl font-semibold border-2 border-blue-900/20 backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali ke Beranda
          </link_1.default>
        </div>
      </div>
    </div>);
}
exports.metadata = {
    title: 'Tim Karyawan | JSR',
    description: 'Temui tim profesional JSR yang berdedikasi tinggi dan berpengalaman di berbagai bidang teknologi.',
};
