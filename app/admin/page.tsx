'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllClientForms, ClientFormData as SupabaseClientFormData, checkAuth, clearUserSession } from '../../lib/supabase';
import AdminLogin from '../../components/AdminLogin';
import * as XLSX from 'xlsx';

export default function AdminPage() {
  const [forms, setForms] = useState<SupabaseClientFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<SupabaseClientFormData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const userData = checkAuth();
    if (userData) {
      setIsAuthenticated(true);
      fetchForms();
    }
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchForms();
  };

  const handleLogout = () => {
    clearUserSession();
    setIsAuthenticated(false);
    setForms([]);
    setSelectedForm(null);
  };

  const fetchForms = async () => {
    try {
      const { data, error } = await getAllClientForms();
      
      if (error) {
        setError(error);
      } else {
        setForms(data || []);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
      console.error('Error fetching forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const exportToExcel = () => {
    try {
      // Define interface for company data
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

      // Prepare data for Excel export
      const excelData = forms.map((form, index) => {
        const jasaArray = JSON.parse(form.jasa_yang_dibutuhkan || '[]') as string[];
        const companiesArray = JSON.parse(form.companies || '[]') as CompanyData[];
        
        // Base data with Record type to allow dynamic keys
        const baseData: Record<string, string | number> = {
          'No': index + 1,
          'Nama Lengkap': form.nama_lengkap,
          'Email': form.email,
          'Nomor HP': form.nomor_hp,
          'Jumlah Entitas': form.jumlah_entitas,
          'Jasa yang Dibutuhkan': jasaArray.join(', '),
          'Tujuan Audit': form.tujuan_audit === 'Lainnya' 
            ? `Lainnya (${form.tujuan_audit_lainnya || '-'})` 
            : form.tujuan_audit || '-',
          'Tanggal Submit': form.created_at ? formatDate(form.created_at) : '-'
        };

        // Add company details
        companiesArray.forEach((company: CompanyData, companyIndex: number) => {
          const prefix = companiesArray.length > 1 ? ` (Perusahaan ${companyIndex + 1})` : '';
          baseData[`Nama Entitas${prefix}`] = company.namaEntitas || '-';
          baseData[`Bidang Usaha${prefix}`] = company.bidangUsaha || '-';
          baseData[`Alamat${prefix}`] = company.alamatPerusahaan || '-';
          baseData[`Tahun Buku${prefix}`] = company.tahunBuku || '-';
          baseData[`Pernah Diaudit${prefix}`] = company.pernahDiaudit ? 'Ya' : 'Tidak';
          if (company.pernahDiaudit) {
            baseData[`KAP Sebelumnya${prefix}`] = company.namaKAPSebelumnya || '-';
            baseData[`Opini Sebelumnya${prefix}`] = company.opiniKAPSebelumnya || '-';
          }
          baseData[`Pendapatan${prefix}`] = company.jumlahPendapatan || '-';
          baseData[`Aset${prefix}`] = company.jumlahAset || '-';
        });

        return baseData;
      });

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Auto-width for columns
      const colWidths = Object.keys(excelData[0] || {}).map(key => ({
        wch: Math.max(
          key.length,
          Math.max(...excelData.map(row => String(row[key] || '').length))
        )
      }));
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Data Konsultasi');

      // Generate filename with current date
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
      const filename = `Data_Konsultasi_JSR_${dateStr}_${timeStr}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Terjadi kesalahan saat mengexport data. Silakan coba lagi.');
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

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
          <div className="flex justify-between items-center mb-6">
            <div></div>
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
            <button
              onClick={handleLogout}
              className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 text-sm font-medium"
            >
              Logout
            </button>
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
              {forms.reduce((sum, form) => sum + form.jumlah_entitas, 0)}
            </div>
            <div className="text-slate-600">Total Entitas</div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200/50">
            <div className="text-3xl font-bold text-purple-600">
              {forms.filter(form => form.created_at && new Date(form.created_at).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-slate-600">Hari Ini</div>
          </div>
        </div>

        {/* Export Button */}
        {forms.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={exportToExcel}
              className="bg-green-600/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg border border-green-500/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export ke Excel
            </button>
          </div>
        )}

        {/* Forms List */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-blue-900">Daftar Form Konsultasi</h2>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="p-6">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                ❌ {error}
              </div>
            </div>
          )}
          
          {forms.length === 0 && !error ? (
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
                  {forms.map((form) => {
                    const jasaArray = JSON.parse(form.jasa_yang_dibutuhkan || '[]');
                    
                    return (
                      <tr key={form.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{form.nama_lengkap}</div>
                          <div className="text-sm text-gray-500">{form.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{form.nomor_hp}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {form.jumlah_entitas} entitas
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {jasaArray.slice(0, 2).map((jasa: string, index: number) => (
                              <div key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block mr-1 mb-1">
                                {jasa}
                              </div>
                            ))}
                            {jasaArray.length > 2 && (
                              <div className="text-xs text-slate-500">+{jasaArray.length - 2} lainnya</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {form.created_at ? formatDate(form.created_at) : '-'}
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
                    );
                  })}
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
                {(() => {
                  const jasaArray = JSON.parse(selectedForm.jasa_yang_dibutuhkan || '[]');
                  const companiesArray = JSON.parse(selectedForm.companies || '[]');
                  
                  return (
                    <>
                      {/* Personal Data */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Data Diri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                          <div>
                            <label className="text-sm text-slate-600">Nama Lengkap</label>
                            <div className="font-medium text-slate-900">{selectedForm.nama_lengkap}</div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-600">Nomor HP</label>
                            <div className="font-medium text-slate-900">{selectedForm.nomor_hp}</div>
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
                            <div className="font-medium text-slate-900">{selectedForm.jumlah_entitas}</div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-600">Jasa yang Dibutuhkan</label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {jasaArray.map((jasa: string, index: number) => (
                                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {jasa}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-600">Tujuan Audit</label>
                            <div className="font-medium text-slate-900">
                              {selectedForm.tujuan_audit === 'Lainnya' 
                                ? `${selectedForm.tujuan_audit} (${selectedForm.tujuan_audit_lainnya || '-'})` 
                                : selectedForm.tujuan_audit || '-'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Companies */}
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-3">Detail Perusahaan</h4>
                        <div className="space-y-4">
                          {companiesArray.map((company: {
                            namaEntitas: string;
                            bidangUsaha: string;
                            alamatPerusahaan: string;
                            tahunBuku: string;
                            pernahDiaudit: boolean;
                            namaKAPSebelumnya?: string;
                            opiniKAPSebelumnya?: string;
                            jumlahPendapatan: string;
                            jumlahAset: string;
                          }, index: number) => (
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
                                  <div className="font-medium text-slate-900">{company.jumlahPendapatan || '-'}</div>
                                </div>
                                <div>
                                  <label className="text-slate-600">Aset</label>
                                  <div className="font-medium text-slate-900">{company.jumlahAset || '-'}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
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
