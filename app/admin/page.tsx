'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

interface ClientFormData {
  id: string;
  namaLengkap: string;
  nomorHP: string;
  email: string;
  jumlahEntitas: number;
  jasaYangDibutuhkan: string[];
  companies: CompanyData[];
  createdAt: string;
}

export default function AdminPage() {
  const [forms, setForms] = useState<ClientFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<ClientFormData | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/client-form');
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 hover:scale-105 transition-all duration-300 mb-6">
            <Image
              src="/logo.svg"
              alt="JSR Logo"
              width={120}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Data Form Konsultasi Klien</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="text-3xl font-bold text-blue-900">{forms.length}</div>
            <div className="text-slate-600">Total Submissions</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="text-3xl font-bold text-green-600">
              {forms.reduce((sum, form) => sum + form.jumlahEntitas, 0)}
            </div>
            <div className="text-slate-600">Total Entitas</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="text-3xl font-bold text-purple-600">
              {forms.filter(form => new Date(form.createdAt).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-slate-600">Hari Ini</div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-blue-900">Daftar Form Konsultasi</h2>
          </div>
          
          {forms.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              Belum ada form yang disubmit
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Klien
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Entitas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Jasa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {forms.map((form) => (
                    <tr key={form.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{form.namaLengkap}</div>
                        <div className="text-sm text-gray-500">{form.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{form.nomorHP}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {form.jumlahEntitas} entitas
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {form.jasaYangDibutuhkan.slice(0, 2).map((jasa, index) => (
                            <div key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block mr-1 mb-1">
                              {jasa}
                            </div>
                          ))}
                          {form.jasaYangDibutuhkan.length > 2 && (
                            <div className="text-xs text-slate-500">+{form.jasaYangDibutuhkan.length - 2} lainnya</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(form.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedForm(form)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Detail */}
        {selectedForm && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedForm(null)}
          >
            <div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-blue-900">Detail Form Konsultasi</h3>
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Personal Data */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Data Diri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                    <div>
                      <label className="text-sm text-slate-600">Nama Lengkap</label>
                      <div className="font-medium text-slate-900">{selectedForm.namaLengkap}</div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Nomor HP</label>
                      <div className="font-medium text-slate-900">{selectedForm.nomorHP}</div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Email</label>
                      <div className="font-medium text-slate-900">{selectedForm.email}</div>
                    </div>
                  </div>
                </div>

                {/* Business Requirements */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Kebutuhan Bisnis</h4>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                    <div>
                      <label className="text-sm text-slate-600">Jumlah Entitas</label>
                      <div className="font-medium text-slate-900">{selectedForm.jumlahEntitas}</div>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Jasa yang Dibutuhkan</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedForm.jasaYangDibutuhkan.map((jasa, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {jasa}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Companies */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Detail Perusahaan</h4>
                  <div className="space-y-4">
                    {selectedForm.companies.map((company, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-4">
                        <h5 className="font-medium text-green-600 mb-3">Perusahaan {index + 1}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="text-slate-600">Nama Entitas</label>
                            <div className="font-medium text-slate-900">{company.namaEntitas}</div>
                          </div>
                          <div>
                            <label className="text-slate-600">Bidang Usaha</label>
                            <div className="font-medium text-slate-900">{company.bidangUsaha}</div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-slate-600">Alamat</label>
                            <div className="font-medium text-slate-900">{company.alamatPerusahaan}</div>
                          </div>
                          <div>
                            <label className="text-slate-600">Tahun Buku</label>
                            <div className="font-medium text-slate-900">{company.tahunBuku}</div>
                          </div>
                          <div>
                            <label className="text-slate-600">Pernah Diaudit</label>
                            <div className="font-medium text-slate-900">{company.pernahDiaudit ? 'Ya' : 'Tidak'}</div>
                          </div>
                          {company.pernahDiaudit && (
                            <>
                              <div>
                                <label className="text-slate-600">KAP Sebelumnya</label>
                                <div className="font-medium text-slate-900">{company.namaKAPSebelumnya}</div>
                              </div>
                              <div>
                                <label className="text-slate-600">Opini Sebelumnya</label>
                                <div className="font-medium text-slate-900">{company.opiniKAPSebelumnya}</div>
                              </div>
                            </>
                          )}
                          <div>
                            <label className="text-slate-600">Pendapatan</label>
                            <div className="font-medium text-slate-900">Rp {company.jumlahPendapatan ? parseInt(company.jumlahPendapatan).toLocaleString('id-ID') : '-'}</div>
                          </div>
                          <div>
                            <label className="text-slate-600">Aset</label>
                            <div className="font-medium text-slate-900">Rp {company.jumlahAset ? parseInt(company.jumlahAset).toLocaleString('id-ID') : '-'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-900 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
