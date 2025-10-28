'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { insertClientForm } from '../../lib/supabase';

// Helper function to format number with commas
const formatNumberWithCommas = (value: string): string => {
  // Remove all non-digit characters except decimal point
  const numericValue = value.replace(/[^\d]/g, '');
  
  // Add commas every three digits
  if (numericValue.length > 0) {
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
};

// Helper function to remove commas from formatted number
const removeCommas = (value: string): string => {
  return value.replace(/,/g, '');
};

interface PersonalData {
  namaLengkap: string;
  nomorHP: string;
  email: string;
}

interface CompanyData {
  namaEntitas: string;
  bidangUsaha: string;
  alamatPerusahaan: string;
  tahunBuku: string;
  pernahDiaudit: boolean;
  namaKAPSebelumnya?: string;
  opiniKAPSebelumnya?: string;
  jumlahPendapatan: string;
  jumlahAset: string;
}

interface FormData {
  personalData: PersonalData;
  jumlahEntitas: number;
  jasaYangDibutuhkan: string[];
  tujuanAudit: string;
  tujuanAuditLainnya?: string;
  deskripsi: string;
  companies: CompanyData[];
}

const initialPersonalData: PersonalData = {
  namaLengkap: '',
  nomorHP: '',
  email: ''
};

const initialCompanyData: CompanyData = {
  namaEntitas: '',
  bidangUsaha: '',
  alamatPerusahaan: '',
  tahunBuku: '',
  pernahDiaudit: false,
  namaKAPSebelumnya: '',
  opiniKAPSebelumnya: '',
  jumlahPendapatan: '',
  jumlahAset: ''
};

const jasaOptions = [
  'Jasa Audit Laporan Keuangan',
  'Jasa Agreed Upon Procedures (AUP)',
  'Jasa Accounting Advisory',
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
    jasaYangDibutuhkan: [],
    tujuanAudit: '',
    tujuanAuditLainnya: '',
    deskripsi: '',
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

  const handleJasaChange = (jasa: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      jasaYangDibutuhkan: checked 
        ? [...prev.jasaYangDibutuhkan, jasa]
        : prev.jasaYangDibutuhkan.filter(j => j !== jasa)
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
      
      if (!personalData.namaLengkap || !personalData.nomorHP || !personalData.email) {
        setSubmitMessage('❌ Mohon lengkapi semua data diri yang wajib diisi.');
        return;
      }

      if (jasaYangDibutuhkan.length === 0) {
        setSubmitMessage('❌ Mohon pilih minimal satu jasa yang dibutuhkan.');
        return;
      }

      if (!formData.tujuanAudit) {
        setSubmitMessage('❌ Mohon pilih tujuan audit.');
        return;
      }

      if (formData.tujuanAudit === 'Lainnya' && !formData.tujuanAuditLainnya?.trim()) {
        setSubmitMessage('❌ Mohon isi tujuan audit lainnya.');
        return;
      }

      // Validate each company data
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        if (!company.namaEntitas || !company.bidangUsaha || !company.alamatPerusahaan || 
            !company.tahunBuku || !company.jumlahPendapatan || !company.jumlahAset) {
          setSubmitMessage(`❌ Mohon lengkapi semua data wajib untuk Perusahaan ${i + 1}.`);
          return;
        }
      }

      // Submit to Supabase
      const { error } = await insertClientForm(formData);

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
            jasaYangDibutuhkan: [],
            tujuanAudit: '',
            tujuanAuditLainnya: '',
            deskripsi: '',
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

                {/* Jasa yang Dibutuhkan */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Jasa yang dibutuhkan (bisa lebih dari 1) *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {jasaOptions.map(jasa => (
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
                </div>

                {/* Tujuan Audit */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tujuan Audit *
                  </label>
                  <select
                    value={formData.tujuanAudit}
                    onChange={(e) => handleTujuanAuditChange(e.target.value)}
                    className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                  >
                    <option value="">Pilih tujuan audit</option>
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
                      placeholder="Sebutkan tujuan audit lainnya"
                    />
                  )}
                </div>

                {/* Deskripsi - Darimana Anda mengetahui KAP JSR */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Darimana Anda mengetahui KAP JSR?
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                    className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 min-h-[80px]"
                    placeholder="Contoh: Referensi dari teman, pencarian Google, media sosial, dll."
                    rows={3}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    (Opsional) Bantu kami memahami lebih baik bagaimana Anda menemukan KAP JSR
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
                          Bidang Usaha / Gambaran Umum *
                        </label>
                        <input
                          type="text"
                          value={company.bidangUsaha}
                          onChange={(e) => handleCompanyDataChange(index, 'bidangUsaha', e.target.value)}
                          className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                          placeholder="Bidang usaha perusahaan"
                        />
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

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tahun Buku yang akan Diaudit *
                        </label>
                        <input
                          type="text"
                          value={company.tahunBuku}
                          onChange={(e) => handleCompanyDataChange(index, 'tahunBuku', e.target.value)}
                          className="w-full text-slate-500 px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20"
                          placeholder="2024"
                        />
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

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Jumlah Pendapatan/Penjualan Tahun Audit *
                        </label>
                        <select
                          value={company.jumlahPendapatan}
                          onChange={(e) => handleCompanyDataChange(index, 'jumlahPendapatan', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900/20 bg-white text-slate-900 font-medium"
                        >
                          <option value="">Pilih Range Pendapatan</option>
                          <option value="< 1 milyar">&lt; 1 milyar</option>
                          <option value="1 - 10 milyar">1 - 10 milyar</option>
                          <option value="10 - 50 milyar">10 - 50 milyar</option>
                          <option value="50 - 100 milyar">50 - 100 milyar</option>
                          <option value="100 - 500 milyar">100 - 500 milyar</option>
                          <option value="500 milyar - 1 trilyun">500 milyar - 1 trilyun</option>
                          <option value="> 1 trilyun">&gt; 1 trilyun</option>
                        </select>
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
