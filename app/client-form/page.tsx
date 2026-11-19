'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { insertClientForm } from '../../lib/supabase';

// Format angka jadi Rupiah dengan pemisah ribuan titik, mis. "Rp 1.000.000.000"
const formatRupiah = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return 'Rp ' + digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

interface PersonalData {
  namaLengkap: string;
  nomorHP: string;
  email: string;
}

interface CompanyData {
  namaEntitas: string;
  jenisPerusahaan: string; // PT, CV, Koperasi, dst
  jenisPerusahaanLainnya: string; // teks jika jenis = Lainnya
  kedudukan: string; // Pusat | Cabang
  namaKantorPusat: string; // jika kedudukan = Cabang
  npwp: string; // opsional
  bidangUsaha: string; // kode industri
  bidangUsahaLainnya: string; // teks bebas jika industri mengandung "Lainnya"
  perbankanJenis: string; // Konvensional | Syariah, jika Perbankan
  alamatPerusahaan: string;
  toolsDigunakan: string; // Iya | Tidak
  toolsJenis: string; // nama tools jika Iya
  toolsLainnya: string; // teks jika tools = Lainnya
  tahunBuku: string;
  sudahSAK: string; // Sudah | Belum (hanya Jasa Asurans)
  sakJenis: string; // jenis SAK jika Sudah
  sakLainnya: string; // teks bebas jika SAK = Lainnya
  pernahDiaudit: boolean; // hanya Jasa Asurans
  namaKAPSebelumnya?: string;
  opiniKAPSebelumnya?: string;
  jumlahPendapatan: string; // input manual berformat Rp
  jumlahAset: string; // range
}

interface FormData {
  personalData: PersonalData;
  jumlahEntitas: number;
  jasaKategori: string; // Asurans | Lainnya
  jasaYangDibutuhkan: string[];
  jasaLainnyaText: string; // teks jika sub-jasa "Jasa Lainnya"
  tujuanAudit: string;
  tujuanAuditLainnya?: string;
  deskripsi: string; // sumber info (dropdown)
  deskripsiDetail: string; // teks jika Teman/Lainnya
  companies: CompanyData[];
}

const initialPersonalData: PersonalData = {
  namaLengkap: '',
  nomorHP: '',
  email: ''
};

const initialCompanyData: CompanyData = {
  namaEntitas: '',
  jenisPerusahaan: '',
  jenisPerusahaanLainnya: '',
  kedudukan: '',
  namaKantorPusat: '',
  npwp: '',
  bidangUsaha: '',
  bidangUsahaLainnya: '',
  perbankanJenis: '',
  alamatPerusahaan: '',
  toolsDigunakan: '',
  toolsJenis: '',
  toolsLainnya: '',
  tahunBuku: '',
  sudahSAK: '',
  sakJenis: '',
  sakLainnya: '',
  pernahDiaudit: false,
  namaKAPSebelumnya: '',
  opiniKAPSebelumnya: '',
  jumlahPendapatan: '',
  jumlahAset: ''
};

// Kategori jasa
const jasaAsuransOptions = [
  'Jasa Audit Laporan Keuangan',
  'Jasa Reviu Laporan Keuangan'
];

const jasaLainnyaOptions = [
  'Jasa Investigasi',
  'Jasa Agreed Upon Procedures (AUP)',
  'Jasa Kompilasi',
  'Jasa Konsultasi',
  'Jasa Audit SKAI',
  'Jasa Lainnya'
];

// Jenis badan usaha di Indonesia
const jenisPerusahaanOptions = [
  'PT (Perseroan Terbatas)',
  'PT Tbk (Perseroan Terbuka)',
  'CV (Commanditaire Vennootschap)',
  'Firma',
  'Koperasi',
  'Yayasan',
  'Perkumpulan',
  'BUMN (Persero)',
  'Perum',
  'BUMD',
  'UD (Usaha Dagang)',
  'Persekutuan Perdata',
  'Perorangan',
  'Lainnya'
];

const kedudukanOptions = ['Pusat', 'Cabang'];

// Software/ERP yang umum dipakai perusahaan
const toolsOptions = [
  'SAP',
  'Oracle NetSuite',
  'Microsoft Dynamics 365',
  'Odoo',
  'Accurate',
  'Zahir Accounting',
  'MYOB',
  'Jurnal by Mekari',
  'QuickBooks',
  'Xero',
  'Lainnya'
];

// Sumber informasi klien mengenal KAP JSR
const sumberInfoOptions = [
  'Teman/Kolega',
  'Pencarian Google / Internet',
  'Media Sosial (Instagram/LinkedIn/dll)',
  'Website KAP JSR',
  'Rekomendasi Bank',
  'Acara/Seminar',
  'Klien Lama',
  'Lainnya'
];

// Kode Industri Pengguna Jasa (dari Excel KAP JSR)
const bidangUsahaOptions = [
  '01 Pertanian, perkebunan, kehutanan, peternakan, kelautan dan perikanan',
  '02 Pertambangan dan Energi',
  '03 Properti dan Konstruksi',
  '04 Industri Pengolahan/Manufaktur',
  '05 Perdagangan dan Jasa',
  '06 Informasi, Komunikasi dan Transportasi',
  '07 Sektor Keuangan - Perbankan',
  '08 Sektor Keuangan - Asuransi dan Dana Pensiun',
  '09 Sektor Keuangan - Lainnya',
  '10 Industri Lainnya',
  '11 Pemerintahan, Badan Internasional dan Organisasi Non Profit',
  '12 Non Industri/Perorangan'
];

const sakOptions = [
  'SAK',
  'SAK ETAP',
  'SAK EMKM',
  'SAK Syariah',
  'SAP',
  'SAKI',
  'SAK EP',
  'Lainnya'
];

const tujuanAuditOptions = [
  'Perbankan',
  'Tender',
  'Peraturan BI/OJK',
  'Perpajakan',
  'Internal',
  'Lainnya'
];

export default function ClientFormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [formData, setFormData] = useState<FormData>({
    personalData: initialPersonalData,
    jumlahEntitas: 1,
    jasaKategori: '',
    jasaYangDibutuhkan: [],
    jasaLainnyaText: '',
    tujuanAudit: '',
    tujuanAuditLainnya: '',
    deskripsi: '',
    deskripsiDetail: '',
    companies: [initialCompanyData]
  });

  const handlePersonalDataChange = (field: keyof PersonalData, value: string) => {
    // Clear validation error untuk field yang sedang diubah
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    setFormData(prev => ({
      ...prev,
      personalData: {
        ...prev.personalData,
        [field]: value
      }
    }));
  };

  const handleJumlahEntitasChange = (jumlah: number) => {
    const companies = Array(jumlah).fill(null).map((_, index) => 
      formData.companies[index] || { ...initialCompanyData }
    );
    
    setFormData(prev => ({
      ...prev,
      jumlahEntitas: jumlah,
      companies
    }));
  };

  const handleJasaKategoriChange = (kategori: string) => {
    // Ganti kategori -> reset sub-jasa yang sudah dipilih
    setFormData(prev => ({
      ...prev,
      jasaKategori: kategori,
      jasaYangDibutuhkan: [],
      jasaLainnyaText: ''
    }));
  };

  const handleJasaChange = (jasa: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      jasaYangDibutuhkan: checked
        ? [...prev.jasaYangDibutuhkan, jasa]
        : prev.jasaYangDibutuhkan.filter(j => j !== jasa),
      // kalau "Jasa Lainnya" di-uncheck, kosongkan teksnya
      jasaLainnyaText: jasa === 'Jasa Lainnya' && !checked ? '' : prev.jasaLainnyaText
    }));
  };

  const handleTujuanAuditChange = (tujuan: string) => {
    setFormData(prev => ({
      ...prev,
      tujuanAudit: tujuan,
      tujuanAuditLainnya: tujuan === 'Lainnya' ? prev.tujuanAuditLainnya : ''
    }));
  };

  const handleCompanyDataChange = (companyIndex: number, field: keyof CompanyData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.map((company, index) => 
        index === companyIndex 
          ? { ...company, [field]: value }
          : company
      )
    }));
  };

  const nextStep = () => {
    // Reset validation errors
    setValidationErrors({});
    
    // Validasi untuk step 1 - pastikan data diri sudah diisi
    if (currentStep === 1) {
      const { namaLengkap, nomorHP, email } = formData.personalData;
      const errors: {[key: string]: string} = {};
      
      if (!namaLengkap.trim()) {
        errors.namaLengkap = 'Nama Lengkap wajib diisi';
      }
      
      if (!nomorHP.trim()) {
        errors.nomorHP = 'Nomor HP wajib diisi';
      } else {
        // Validasi nomor HP (minimal 10 digit)
        const phoneRegex = /^[0-9]{10,15}$/;
        const cleanPhone = nomorHP.replace(/\D/g, ''); // Hapus karakter non-digit
        if (!phoneRegex.test(cleanPhone)) {
          errors.nomorHP = 'Nomor HP harus berisi 10-15 digit angka';
        }
      }
      
      if (!email.trim()) {
        errors.email = 'Email wajib diisi';
      } else {
        // Validasi format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.email = 'Format email tidak valid';
        }
      }
      
      // Jika ada error, tampilkan dan jangan lanjut
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        // Scroll ke field pertama yang error
        const firstErrorField = Object.keys(errors)[0];
        const element = document.querySelector(`input[name="${firstErrorField}"], input[placeholder*="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Helper untuk mengecek apakah data diri sudah valid
  const isPersonalDataValid = () => {
    const { namaLengkap, nomorHP, email } = formData.personalData;
    
    if (!namaLengkap.trim() || !nomorHP.trim() || !email.trim()) {
      return false;
    }
    
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Validasi nomor HP
    const phoneRegex = /^[0-9]{10,15}$/;
    const cleanPhone = nomorHP.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Validate required fields
      const { personalData, jasaYangDibutuhkan, companies } = formData;
      const isAsurans = formData.jasaKategori === 'Asurans';

      if (!personalData.namaLengkap || !personalData.nomorHP || !personalData.email) {
        setSubmitMessage('❌ Mohon lengkapi semua data diri yang wajib diisi.');
        return;
      }

      if (!formData.jasaKategori) {
        setSubmitMessage('❌ Mohon pilih kategori jasa (Asurans / Lainnya).');
        return;
      }

      if (jasaYangDibutuhkan.length === 0) {
        setSubmitMessage('❌ Mohon pilih minimal satu jasa yang dibutuhkan.');
        return;
      }

      if (jasaYangDibutuhkan.includes('Jasa Lainnya') && !formData.jasaLainnyaText.trim()) {
        setSubmitMessage('❌ Mohon sebutkan jasa lainnya yang dibutuhkan.');
        return;
      }

      if (!formData.tujuanAudit) {
        setSubmitMessage('❌ Mohon pilih tujuan penggunaan jasa.');
        return;
      }

      if (formData.tujuanAudit === 'Lainnya' && !formData.tujuanAuditLainnya?.trim()) {
        setSubmitMessage('❌ Mohon isi tujuan penggunaan jasa lainnya.');
        return;
      }

      if (formData.deskripsi &&
          (formData.deskripsi === 'Teman/Kolega' || formData.deskripsi === 'Lainnya') &&
          !formData.deskripsiDetail.trim()) {
        setSubmitMessage(
          formData.deskripsi === 'Teman/Kolega'
            ? '❌ Mohon sebutkan nama teman/kolega yang merekomendasikan.'
            : '❌ Mohon sebutkan dari mana Anda mengetahui KAP JSR.'
        );
        return;
      }

      // Validate each company data
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        const label = `Perusahaan ${i + 1}`;

        if (!company.jenisPerusahaan || !company.kedudukan || !company.namaEntitas ||
            !company.bidangUsaha || !company.alamatPerusahaan || !company.tahunBuku ||
            !company.toolsDigunakan || !company.jumlahPendapatan || !company.jumlahAset) {
          setSubmitMessage(`❌ Mohon lengkapi semua data wajib untuk ${label}.`);
          return;
        }

        // Jenis perusahaan "Lainnya" wajib diisi teks
        if (company.jenisPerusahaan === 'Lainnya' && !company.jenisPerusahaanLainnya.trim()) {
          setSubmitMessage(`❌ Mohon sebutkan jenis perusahaan untuk ${label}.`);
          return;
        }

        // Kedudukan "Cabang" wajib isi nama kantor pusat
        if (company.kedudukan === 'Cabang' && !company.namaKantorPusat.trim()) {
          setSubmitMessage(`❌ Mohon sebutkan nama kantor pusat untuk ${label}.`);
          return;
        }

        // Bidang usaha "Lainnya" wajib diisi teks
        if (company.bidangUsaha.includes('Lainnya') && !company.bidangUsahaLainnya.trim()) {
          setSubmitMessage(`❌ Mohon sebutkan bidang usaha untuk ${label}.`);
          return;
        }

        // Perbankan wajib pilih Konvensional/Syariah
        if (company.bidangUsaha.includes('Perbankan') && !company.perbankanJenis) {
          setSubmitMessage(`❌ Mohon pilih jenis perbankan (Konvensional/Syariah) untuk ${label}.`);
          return;
        }

        // Tools: jika Iya wajib pilih jenis, dan "Lainnya" wajib teks
        if (company.toolsDigunakan === 'Iya' && !company.toolsJenis) {
          setSubmitMessage(`❌ Mohon pilih tools yang digunakan untuk ${label}.`);
          return;
        }

        if (company.toolsDigunakan === 'Iya' && company.toolsJenis === 'Lainnya' && !company.toolsLainnya.trim()) {
          setSubmitMessage(`❌ Mohon sebutkan tools yang digunakan untuk ${label}.`);
          return;
        }

        // Field SAK & riwayat audit hanya wajib untuk Jasa Asurans
        if (isAsurans) {
          if (!company.sudahSAK) {
            setSubmitMessage(`❌ Mohon pilih status penggunaan SAK untuk ${label}.`);
            return;
          }

          if (company.sudahSAK === 'Sudah' && !company.sakJenis) {
            setSubmitMessage(`❌ Mohon pilih jenis SAK untuk ${label}.`);
            return;
          }

          if (company.sakJenis === 'Lainnya' && !company.sakLainnya.trim()) {
            setSubmitMessage(`❌ Mohon sebutkan jenis SAK untuk ${label}.`);
            return;
          }
        }
      }

      // Susun data: ganti "Jasa Lainnya" dengan teksnya, dan gabung detail sumber info.
      // Field perusahaan baru otomatis ikut tersimpan (seluruh objek companies di-JSON-kan).
      const submitData = {
        ...formData,
        jasaYangDibutuhkan: formData.jasaYangDibutuhkan.map(j =>
          j === 'Jasa Lainnya' && formData.jasaLainnyaText.trim()
            ? `Jasa Lainnya: ${formData.jasaLainnyaText.trim()}`
            : j
        ),
        deskripsi:
          (formData.deskripsi === 'Teman/Kolega' || formData.deskripsi === 'Lainnya') &&
          formData.deskripsiDetail.trim()
            ? `${formData.deskripsi} (${formData.deskripsiDetail.trim()})`
            : formData.deskripsi,
      };

      // Submit to Supabase
      const { error } = await insertClientForm(submitData);

      if (error) {
        setSubmitMessage(`❌ Error: ${error}`);
        console.error('Supabase error:', error);
      } else {
        setSubmitMessage('✅ Form berhasil dikirim dan disimpan ke database! Terima kasih atas kepercayaan Anda kepada KAP JSR Cabang Bandung.');
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            personalData: initialPersonalData,
            jumlahEntitas: 1,
            jasaKategori: '',
            jasaYangDibutuhkan: [],
            jasaLainnyaText: '',
            tujuanAudit: '',
            tujuanAuditLainnya: '',
            deskripsi: '',
            deskripsiDetail: '',
            companies: [initialCompanyData]
          });
          setCurrentStep(1);
          setSubmitMessage('');
        }, 4000);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitMessage('❌ Terjadi kesalahan saat mengirim form. Silakan coba lagi atau hubungi admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 relative overflow-hidden">
      {/* Background Pattern with JSR Colors */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        {/* JSR Logo */}
        <div className="text-center mb-8 animate-fade-in">
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
            <h1 className="text-3xl font-bold text-blue-900 mb-1">Form Konsultasi Klien</h1>
            <p className="text-slate-600">KAP JSR Cabang Bandung</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-900' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-900 text-white' : 'bg-slate-300 text-slate-600'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Data Diri</span>
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-900' : 'bg-slate-300'} rounded`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-900' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-900 text-white' : 'bg-slate-300 text-slate-600'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Kebutuhan</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-200/50">
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Data Diri</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.personalData.namaLengkap}
                    onChange={(e) => handlePersonalDataChange('namaLengkap', e.target.value)}
                    className={`w-full text-slate-500 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      validationErrors.namaLengkap 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20'
                    }`}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                  {validationErrors.namaLengkap && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {validationErrors.namaLengkap}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nomor HP (WhatsApp Available) *
                  </label>
                  <input
                    type="tel"
                    name="nomorHP"
                    value={formData.personalData.nomorHP}
                    onChange={(e) => handlePersonalDataChange('nomorHP', e.target.value)}
                    className={`w-full text-slate-500 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      validationErrors.nomorHP 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20'
                    }`}
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                  {validationErrors.nomorHP && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {validationErrors.nomorHP}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.personalData.email}
                    onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                    className={`w-full text-slate-500 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      validationErrors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50' 
                        : 'border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20'
                    }`}
                    placeholder="nama@email.com"
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Penjelasan Kebutuhan</h2>
              
              <div className="space-y-8">
                {/* Jumlah Entitas */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Jumlah Entitas yang akan diaudit atau membutuhkan jasa *
                  </label>
                  <select
                    value={formData.jumlahEntitas}
                    onChange={(e) => handleJumlahEntitasChange(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-all duration-200 bg-white text-slate-900 font-medium"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                    <option value={11}>10+</option>
                  </select>
                </div>

                {/* Kategori Jasa */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Kategori Jasa *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Asurans', 'Lainnya'].map((kat) => (
                      <label
                        key={kat}
                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${
                          formData.jasaKategori === kat
                            ? 'border-blue-900 bg-blue-50'
                            : 'border-slate-200 hover:border-blue-900/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="jasaKategori"
                          checked={formData.jasaKategori === kat}
                          onChange={() => handleJasaKategoriChange(kat)}
                          className="mr-3 h-4 w-4 text-blue-900 focus:ring-blue-900"
                        />
                        <span className="text-slate-700 font-medium">
                          {kat === 'Asurans' ? 'Jasa Asurans' : 'Jasa Lainnya'}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Sub-jasa sesuai kategori */}
                  {formData.jasaKategori && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Pilih jasa (bisa lebih dari 1) *
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {(formData.jasaKategori === 'Asurans' ? jasaAsuransOptions : jasaLainnyaOptions).map((jasa) => (
                          <label key={jasa} className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-blue-900/30 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.jasaYangDibutuhkan.includes(jasa)}
                              onChange={(e) => handleJasaChange(jasa, e.target.checked)}
                              className="mr-3 h-4 w-4 text-blue-900 focus:ring-blue-900 border-slate-300 rounded"
                            />
                            <span className="text-slate-700">{jasa}</span>
                          </label>
                        ))}
                      </div>

                      {/* Teks jika "Jasa Lainnya" dipilih */}
                      {formData.jasaYangDibutuhkan.includes('Jasa Lainnya') && (
                        <input
                          type="text"
                          value={formData.jasaLainnyaText}
                          onChange={(e) => setFormData(prev => ({ ...prev, jasaLainnyaText: e.target.value }))}
                          className="mt-3 w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                          placeholder="Sebutkan jasa lainnya yang dibutuhkan"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Tujuan Penggunaan Jasa */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tujuan Penggunaan Jasa *
                  </label>
                  <select
                    value={formData.tujuanAudit}
                    onChange={(e) => handleTujuanAuditChange(e.target.value)}
                    className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                  >
                    <option value="">Pilih tujuan penggunaan jasa</option>
                    {tujuanAuditOptions.map(tujuan => (
                      <option key={tujuan} value={tujuan}>{tujuan}</option>
                    ))}
                  </select>

                  {formData.tujuanAudit === 'Lainnya' && (
                    <input
                      type="text"
                      value={formData.tujuanAuditLainnya || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, tujuanAuditLainnya: e.target.value }))}
                      className="mt-3 w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                      placeholder="Sebutkan tujuan penggunaan jasa lainnya"
                    />
                  )}
                </div>

                {/* Sumber info - Darimana Anda mengetahui KAP JSR */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Darimana Anda mengetahui KAP JSR?
                  </label>
                  <select
                    value={formData.deskripsi}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value, deskripsiDetail: '' }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                  >
                    <option value="">Pilih sumber informasi</option>
                    {sumberInfoOptions.map((sumber) => (
                      <option key={sumber} value={sumber}>{sumber}</option>
                    ))}
                  </select>

                  {(formData.deskripsi === 'Teman/Kolega' || formData.deskripsi === 'Lainnya') && (
                    <input
                      type="text"
                      value={formData.deskripsiDetail}
                      onChange={(e) => setFormData(prev => ({ ...prev, deskripsiDetail: e.target.value }))}
                      className="mt-3 w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                      placeholder={formData.deskripsi === 'Teman/Kolega' ? 'Nama teman/kolega yang merekomendasikan' : 'Sebutkan sumbernya'}
                    />
                  )}

                  <p className="mt-1 text-xs text-slate-500">
                    (Opsional) Bantu kami memahami bagaimana Anda menemukan KAP JSR
                  </p>
                </div>

                {/* Company Details */}
                {formData.companies.map((company, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-green-600 mb-4">
                      Perusahaan {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Jenis Perusahaan *
                        </label>
                        <select
                          value={company.jenisPerusahaan}
                          onChange={(e) => handleCompanyDataChange(index, 'jenisPerusahaan', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                        >
                          <option value="">Pilih jenis perusahaan</option>
                          {jenisPerusahaanOptions.map((jenis) => (
                            <option key={jenis} value={jenis}>{jenis}</option>
                          ))}
                        </select>
                        {company.jenisPerusahaan === 'Lainnya' && (
                          <input
                            type="text"
                            value={company.jenisPerusahaanLainnya}
                            onChange={(e) => handleCompanyDataChange(index, 'jenisPerusahaanLainnya', e.target.value)}
                            className="mt-3 w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                            placeholder="Sebutkan jenis perusahaan"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Kedudukan Perusahaan *
                        </label>
                        <select
                          value={company.kedudukan}
                          onChange={(e) => handleCompanyDataChange(index, 'kedudukan', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                        >
                          <option value="">Pilih kedudukan</option>
                          {kedudukanOptions.map((ked) => (
                            <option key={ked} value={ked}>{ked}</option>
                          ))}
                        </select>
                        {company.kedudukan === 'Cabang' && (
                          <input
                            type="text"
                            value={company.namaKantorPusat}
                            onChange={(e) => handleCompanyDataChange(index, 'namaKantorPusat', e.target.value)}
                            className="mt-3 w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                            placeholder="Nama kantor pusat"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nama Entitas *
                        </label>
                        <input
                          type="text"
                          value={company.namaEntitas}
                          onChange={(e) => handleCompanyDataChange(index, 'namaEntitas', e.target.value)}
                          className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                          placeholder="PT. Nama Perusahaan"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nomor NPWP <span className="font-normal text-slate-400">(opsional)</span>
                        </label>
                        <input
                          type="text"
                          value={company.npwp}
                          onChange={(e) => handleCompanyDataChange(index, 'npwp', e.target.value)}
                          className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                          placeholder="Nomor NPWP perusahaan"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Bidang Usaha / Gambaran Umum *
                        </label>
                        <select
                          value={company.bidangUsaha}
                          onChange={(e) => handleCompanyDataChange(index, 'bidangUsaha', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                        >
                          <option value="">Pilih bidang usaha</option>
                          {bidangUsahaOptions.map((bidang) => (
                            <option key={bidang} value={bidang}>{bidang}</option>
                          ))}
                        </select>

                        {/* Input teks jika industri mengandung "Lainnya" (kode 09 & 10) */}
                        {company.bidangUsaha.includes('Lainnya') && (
                          <input
                            type="text"
                            value={company.bidangUsahaLainnya}
                            onChange={(e) => handleCompanyDataChange(index, 'bidangUsahaLainnya', e.target.value)}
                            className="mt-3 w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                            placeholder="Sebutkan bidang usaha"
                          />
                        )}

                        {/* Pilihan Konvensional/Syariah jika Perbankan (kode 07) */}
                        {company.bidangUsaha.includes('Perbankan') && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Jenis Perbankan *
                            </label>
                            <div className="flex space-x-4">
                              <label className="flex items-center text-slate-900 font-medium">
                                <input
                                  type="radio"
                                  name={`perbankanJenis-${index}`}
                                  checked={company.perbankanJenis === 'Konvensional'}
                                  onChange={() => handleCompanyDataChange(index, 'perbankanJenis', 'Konvensional')}
                                  className="mr-2 h-4 w-4 text-blue-900 focus:ring-blue-900"
                                />
                                Konvensional
                              </label>
                              <label className="flex items-center text-slate-900 font-medium">
                                <input
                                  type="radio"
                                  name={`perbankanJenis-${index}`}
                                  checked={company.perbankanJenis === 'Syariah'}
                                  onChange={() => handleCompanyDataChange(index, 'perbankanJenis', 'Syariah')}
                                  className="mr-2 h-4 w-4 text-blue-900 focus:ring-blue-900"
                                />
                                Syariah
                              </label>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Alamat Perusahaan *
                        </label>
                        <textarea
                          value={company.alamatPerusahaan}
                          onChange={(e) => handleCompanyDataChange(index, 'alamatPerusahaan', e.target.value)}
                          className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                          rows={2}
                          placeholder="Alamat lengkap perusahaan"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Apakah perusahaan menggunakan Tools/Software? *
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center text-slate-900 font-medium">
                            <input
                              type="radio"
                              name={`toolsDigunakan-${index}`}
                              checked={company.toolsDigunakan === 'Iya'}
                              onChange={() => handleCompanyDataChange(index, 'toolsDigunakan', 'Iya')}
                              className="mr-2 h-4 w-4 text-blue-900 focus:ring-blue-900"
                            />
                            Iya
                          </label>
                          <label className="flex items-center text-slate-900 font-medium">
                            <input
                              type="radio"
                              name={`toolsDigunakan-${index}`}
                              checked={company.toolsDigunakan === 'Tidak'}
                              onChange={() => handleCompanyDataChange(index, 'toolsDigunakan', 'Tidak')}
                              className="mr-2 h-4 w-4 text-blue-900 focus:ring-blue-900"
                            />
                            Tidak
                          </label>
                        </div>

                        {company.toolsDigunakan === 'Iya' && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Tools/Software yang digunakan *
                            </label>
                            <select
                              value={company.toolsJenis}
                              onChange={(e) => handleCompanyDataChange(index, 'toolsJenis', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                            >
                              <option value="">Pilih tools/software</option>
                              {toolsOptions.map((tool) => (
                                <option key={tool} value={tool}>{tool}</option>
                              ))}
                            </select>

                            {company.toolsJenis === 'Lainnya' && (
                              <input
                                type="text"
                                value={company.toolsLainnya}
                                onChange={(e) => handleCompanyDataChange(index, 'toolsLainnya', e.target.value)}
                                className="mt-3 w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                                placeholder="Sebutkan tools/software yang digunakan"
                              />
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tahun Buku *
                        </label>
                        <input
                          type="text"
                          value={company.tahunBuku}
                          onChange={(e) => handleCompanyDataChange(index, 'tahunBuku', e.target.value)}
                          className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                          placeholder="2024"
                        />
                      </div>

                      {formData.jasaKategori === 'Asurans' && (
                      <>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Sudah menggunakan SAK? *
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center text-slate-900 font-medium">
                            <input
                              type="radio"
                              name={`sudahSAK-${index}`}
                              checked={company.sudahSAK === 'Sudah'}
                              onChange={() => handleCompanyDataChange(index, 'sudahSAK', 'Sudah')}
                              className="mr-2 h-4 w-4 text-blue-900 focus:ring-blue-900"
                            />
                            Sudah
                          </label>
                          <label className="flex items-center text-slate-900 font-medium">
                            <input
                              type="radio"
                              name={`sudahSAK-${index}`}
                              checked={company.sudahSAK === 'Belum'}
                              onChange={() => handleCompanyDataChange(index, 'sudahSAK', 'Belum')}
                              className="mr-2 h-4 w-4 text-blue-900 focus:ring-blue-900"
                            />
                            Belum
                          </label>
                        </div>

                        {company.sudahSAK === 'Sudah' && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Jenis SAK *
                            </label>
                            <select
                              value={company.sakJenis}
                              onChange={(e) => handleCompanyDataChange(index, 'sakJenis', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                            >
                              <option value="">Pilih jenis SAK</option>
                              {sakOptions.map((sak) => (
                                <option key={sak} value={sak}>{sak}</option>
                              ))}
                            </select>

                            {company.sakJenis === 'Lainnya' && (
                              <input
                                type="text"
                                value={company.sakLainnya}
                                onChange={(e) => handleCompanyDataChange(index, 'sakLainnya', e.target.value)}
                                className="mt-3 w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                                placeholder="Sebutkan standar akuntansi yang digunakan"
                              />
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Apakah sebelumnya pernah diaudit? *
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center text-slate-900 font-medium">
                            <input
                              type="radio"
                              name={`pernahDiaudit-${index}`}
                              checked={company.pernahDiaudit === true}
                              onChange={() => handleCompanyDataChange(index, 'pernahDiaudit', true)}
                              className="mr-2 h-4 w-4 text-blue-900 focus:ring-blue-900"
                            />
                            Ya
                          </label>
                          <label className="flex items-center text-slate-900 font-medium">
                            <input
                              type="radio"
                              name={`pernahDiaudit-${index}`}
                              checked={company.pernahDiaudit === false}
                              onChange={() => handleCompanyDataChange(index, 'pernahDiaudit', false)}
                              className="mr-2 h-4 w-4 text-blue-900 focus:ring-blue-900"
                            />
                            Tidak
                          </label>
                        </div>
                      </div>

                      {company.pernahDiaudit && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Nama KAP Sebelumnya
                            </label>
                            <input
                              type="text"
                              value={company.namaKAPSebelumnya || ''}
                              onChange={(e) => handleCompanyDataChange(index, 'namaKAPSebelumnya', e.target.value)}
                              className="w-full px-3 py-2 text-slate-500 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                              placeholder="Nama KAP"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Opini KAP Sebelumnya
                            </label>
                            <select
                              value={company.opiniKAPSebelumnya || ''}
                              onChange={(e) => handleCompanyDataChange(index, 'opiniKAPSebelumnya', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                            >
                              <option value="">Pilih Opini</option>
                              <option value="Wajar Tanpa Pengecualian">Wajar Tanpa Pengecualian</option>
                              <option value="Wajar Dengan Pengecualian">Wajar Dengan Pengecualian</option>
                              <option value="Tidak Wajar">Tidak Wajar</option>
                              <option value="Menolak Memberikan Opini">Menolak Memberikan Opini</option>
                            </select>
                          </div>
                        </>
                      )}
                      </>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Jumlah Pendapatan/Penjualan *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={company.jumlahPendapatan}
                          onChange={(e) => handleCompanyDataChange(index, 'jumlahPendapatan', formatRupiah(e.target.value))}
                          className="w-full text-slate-900 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                          placeholder="Rp 0"
                        />
                        <p className="mt-1 text-xs text-slate-500">Ketik angka saja, pemisah ribuan otomatis.</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Jumlah Aset *
                        </label>
                        <select
                          value={company.jumlahAset}
                          onChange={(e) => handleCompanyDataChange(index, 'jumlahAset', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                        >
                          <option value="">Pilih Range Aset</option>
                          <option value="< 1 milyar">&lt; 1 milyar</option>
                          <option value="1 - 10 milyar">1 - 10 milyar</option>
                          <option value="10 - 50 milyar">10 - 50 milyar</option>
                          <option value="50 - 100 milyar">50 - 100 milyar</option>
                          <option value="100 - 500 milyar">100 - 500 milyar</option>
                          <option value="500 milyar - 1 trilyun">500 milyar - 1 trilyun</option>
                          <option value="> 1 trilyun">&gt; 1 trilyun</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Message */}
          {submitMessage && (
            <div className={`p-4 rounded-xl ${submitMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitMessage}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-slate-200">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
                disabled={isSubmitting}
              >
                ← Sebelumnya
              </button>
            )}
            
            <div className="ml-auto">
              {currentStep < 2 ? (
                <div className="relative">
                  <button
                    onClick={nextStep}
                    disabled={isSubmitting || !isPersonalDataValid()}
                    className={`px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${
                      isPersonalDataValid()
                        ? 'bg-blue-900 text-white hover:bg-blue-800'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                    title={!isPersonalDataValid() ? 'Mohon lengkapi semua data diri yang wajib diisi' : ''}
                  >
                    Selanjutnya →
                  </button>
                  {!isPersonalDataValid() && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-slate-500 whitespace-nowrap">
                      Lengkapi data diri terlebih dahulu
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Mengirim...' : '📤 Kirim Form'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/info"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-900 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
