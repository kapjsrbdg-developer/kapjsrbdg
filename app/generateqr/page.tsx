'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  checkAuth,
  clearUserSession,
  generateValidationCode,
  insertReportValidation,
  getAllReportValidations,
  uploadReportFile,
  type ReportValidation,
} from '../../lib/supabase';
import AdminLogin from '../../components/AdminLogin';

interface FormState {
  namaKap: string;
  namaKlien: string;
  periodeAwal: string;
  periodeAkhir: string;
  noLaporan: string;
  tanggalTerbit: string;
  apPenanggungJawab: string; // pilihan dropdown
  apLainnya: string; // input manual saat pilih "Lainnya"
}

// AP penanggung jawab yang tersedia di dropdown
const AP_OPTIONS = ['Dr. H. Sony Devano, SE., SH., Ak., M.Ak., CA., BKP., CACP., CPA.', 'Nurmala Arifin, SE., SH., Ak., M.Ak., CA., BKP., CACP., CPA., CTA.', 'Lainnya'] as const;

const DEFAULT_KAP = 'KAP Jojo Sunarjo & Rekan Cabang Bandung';

// Batas upload PDF: 2 MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const emptyForm: FormState = {
  namaKap: DEFAULT_KAP,
  namaKlien: '',
  periodeAwal: '',
  periodeAkhir: '',
  noLaporan: '',
  tanggalTerbit: '',
  apPenanggungJawab: '',
  apLainnya: '',
};

interface GenerateResult {
  kode: string;
  url: string;
  qrDataUrl: string;
  report: {
    namaKap: string;
    namaKlien: string;
    periodeAwal: string;
    periodeAkhir: string;
    noLaporan: string;
    tanggalTerbit: string;
    apPenanggungJawab: string;
  };
}

// Format "YYYY-MM-DD" -> "1 Januari 2025"
const formatTanggal = (value: string): string => {
  if (!value) return '-';
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const QR_SIZE = 600;

// Buat QR (PNG data URL) dengan logo JSR di tengahnya.
// Aman dipindai karena error correction level "H" mentoleransi ~30% area
// tertutup, sementara logo di sini hanya menutup sekitar 6%.
const buildQrDataUrl = async (url: string): Promise<string> => {
  const canvas = document.createElement('canvas');

  await QRCode.toCanvas(canvas, url, {
    width: QR_SIZE,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#1e3a8a', light: '#ffffff' },
  });

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/png');

  // Muat logo. Pakai window.Image karena `Image` di file ini adalah
  // komponen next/image.
  const logo = await new Promise<HTMLImageElement | null>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = '/logo.svg';
  });

  // Kalau logo gagal dimuat, kembalikan QR polos (tetap berfungsi).
  if (logo) {
    const size = canvas.width;
    const ratio = (logo.naturalWidth || 1640) / (logo.naturalHeight || 924);
    const logoW = size * 0.26;
    const logoH = logoW / ratio;
    const pad = size * 0.02;
    const boxW = logoW + pad * 2;
    const boxH = logoH + pad * 2;
    const boxX = (size - boxW) / 2;
    const boxY = (size - boxH) / 2;

    // Alas putih di belakang logo supaya kontras dan modul QR tidak tercampur
    ctx.fillStyle = '#ffffff';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, size * 0.02);
      ctx.fill();
    } else {
      ctx.fillRect(boxX, boxY, boxW, boxH);
    }

    ctx.drawImage(logo, boxX + pad, boxY + pad, logoW, logoH);
  }

  return canvas.toDataURL('image/png');
};

export default function GenerateQrPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Upload PDF laporan (wajib)
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Riwayat QR (dashboard admin)
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ReportValidation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    setIsAuthenticated(!!checkAuth());
    setCheckingAuth(false);

    // Cek ulang saat halaman dipulihkan dari bfcache (tombol Back browser),
    // supaya tampilan tidak "kembali login" padahal sudah logout.
    const handlePageShow = () => {
      if (!checkAuth()) {
        setIsAuthenticated(false);
        setResult(null);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const picked = e.target.files?.[0] ?? null;

    if (!picked) {
      setFile(null);
      return;
    }

    const isPdf =
      picked.type === 'application/pdf' ||
      picked.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setError('File harus berformat PDF.');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (picked.size > MAX_FILE_SIZE) {
      setError(
        `Ukuran file ${(picked.size / 1024 / 1024).toFixed(2)} MB melebihi batas 2 MB.`,
      );
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setFile(picked);
  };

  const buildBaseUrl = (): string => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl.replace(/\/$/, '');
    if (typeof window !== 'undefined') return window.location.origin;
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Tentukan AP final (dari dropdown atau input manual)
    const apFinal =
      form.apPenanggungJawab === 'Lainnya'
        ? form.apLainnya.trim()
        : form.apPenanggungJawab;

    if (!apFinal) {
      setError('Silakan pilih atau isi AP penanggung jawab.');
      return;
    }

    if (form.periodeAkhir < form.periodeAwal) {
      setError('Periode akhir tidak boleh sebelum periode awal.');
      return;
    }

    if (!file) {
      setError('Silakan pilih dokumen PDF laporan.');
      return;
    }

    setSubmitting(true);
    try {
      const reportData = {
        namaKap: form.namaKap.trim(),
        namaKlien: form.namaKlien.trim(),
        periodeAwal: form.periodeAwal,
        periodeAkhir: form.periodeAkhir,
        noLaporan: form.noLaporan.trim(),
        tanggalTerbit: form.tanggalTerbit,
        apPenanggungJawab: apFinal,
      };

      // Buat kode unik, upload PDF, lalu simpan record.
      // Upload didahulukan supaya kalau gagal, tidak ada record menggantung.
      let kode = generateValidationCode();
      let uploadRes = await uploadReportFile(kode, file);
      if (uploadRes.error) {
        setError(uploadRes.error);
        return;
      }

      let insertRes = await insertReportValidation({
        kode,
        ...reportData,
        filePath: uploadRes.path,
      });

      // Retry kalau kode kebetulan bentrok (sangat jarang).
      let attempts = 0;
      while (insertRes.error === 'DUPLICATE_CODE' && attempts < 5) {
        kode = generateValidationCode();
        uploadRes = await uploadReportFile(kode, file);
        if (uploadRes.error) {
          setError(uploadRes.error);
          return;
        }
        insertRes = await insertReportValidation({
          kode,
          ...reportData,
          filePath: uploadRes.path,
        });
        attempts += 1;
      }

      if (insertRes.error) {
        setError(
          insertRes.error === 'DUPLICATE_CODE'
            ? 'Gagal membuat kode unik. Silakan coba lagi.'
            : insertRes.error,
        );
        return;
      }

      const url = `${buildBaseUrl()}/validasi/${kode}`;
      const qrDataUrl = await buildQrDataUrl(url);

      setResult({ kode, url, qrDataUrl, report: reportData });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.qrDataUrl;
    link.download = `QR-${result.kode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // abaikan jika clipboard tidak tersedia
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setResult(null);
    setError('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadHistory = async () => {
    setShowHistory(true);
    setResult(null);
    setHistoryLoading(true);
    setHistoryError('');
    const { data, error } = await getAllReportValidations();
    if (error) setHistoryError(error);
    setHistory(data || []);
    setHistoryLoading(false);
  };

  // Tampilkan (bentuk ulang) QR dari sebuah record riwayat.
  const showQrFromHistory = async (rec: ReportValidation) => {
    const url = `${buildBaseUrl()}/validasi/${rec.kode}`;
    const qrDataUrl = await buildQrDataUrl(url);
    setResult({
      kode: rec.kode,
      url,
      qrDataUrl,
      report: {
        namaKap: rec.nama_kap,
        namaKlien: rec.nama_klien,
        periodeAwal: rec.periode_awal,
        periodeAkhir: rec.periode_akhir,
        noLaporan: rec.no_laporan,
        tanggalTerbit: rec.tanggal_terbit,
        apPenanggungJawab: rec.ap_penanggung_jawab,
      },
    });
    setShowHistory(false);
  };

  const handleLogout = () => {
    clearUserSession();
    setIsAuthenticated(false);
    setShowHistory(false);
    setHistory([]);
    handleReset();
  };

  // Cek autentikasi
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

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const inputClass =
    'w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="w-16"></div>
            <div className="inline-flex items-center justify-center p-4 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50">
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
              className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 text-sm font-medium w-16"
            >
              Logout
            </button>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Generate QR Validasi</h1>
          <p className="text-slate-600">
            Buat QR code untuk verifikasi keaslian dokumen KAP JSR
          </p>
        </div>

        {/* Nav: Buat QR / Riwayat */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setShowHistory(false)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              !showHistory ? 'bg-blue-900 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            Buat QR
          </button>
          <button
            onClick={loadHistory}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              showHistory ? 'bg-blue-900 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
          >
            Riwayat QR
          </button>
        </div>

        {showHistory ? (
          /* ===== RIWAYAT QR ===== */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 p-6 md:p-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Riwayat QR</h2>
            {historyLoading ? (
              <div className="text-center py-8 text-slate-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-3"></div>
                Memuat...
              </div>
            ) : historyError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                ❌ {historyError}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-slate-500">Belum ada QR yang dibuat.</div>
            ) : (
              <div className="space-y-3">
                {history.map((rec) => (
                  <div
                    key={rec.kode}
                    className="flex items-center justify-between gap-4 border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{rec.nama_klien}</div>
                      <div className="text-sm text-slate-500 truncate">{rec.no_laporan}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        <span className="font-mono text-blue-900">{rec.kode}</span>
                        {rec.created_at ? ` · ${formatTanggal(rec.created_at.slice(0, 10))}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => showQrFromHistory(rec)}
                      className="shrink-0 bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Lihat QR
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !result ? (
          /* ===== FORM ===== */
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 p-6 md:p-8 space-y-5"
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                ❌ {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama KAP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.namaKap}
                onChange={handleChange('namaKap')}
                required
                disabled={submitting}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Klien <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.namaKlien}
                onChange={handleChange('namaKlien')}
                required
                disabled={submitting}
                placeholder="Contoh: PT Contoh Sejahtera"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Periode Awal <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.periodeAwal}
                  onChange={handleChange('periodeAwal')}
                  required
                  disabled={submitting}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Periode Akhir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.periodeAkhir}
                  onChange={handleChange('periodeAkhir')}
                  required
                  disabled={submitting}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                No Laporan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.noLaporan}
                onChange={handleChange('noLaporan')}
                required
                disabled={submitting}
                placeholder="Contoh: 001/LAI/JSR/VII/2026"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Terbit Laporan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.tanggalTerbit}
                onChange={handleChange('tanggalTerbit')}
                required
                disabled={submitting}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                AP Penanggung Jawab <span className="text-red-500">*</span>
              </label>
              <select
                value={form.apPenanggungJawab}
                onChange={handleChange('apPenanggungJawab')}
                required
                disabled={submitting}
                className={`${inputClass} bg-white`}
              >
                <option value="" disabled>
                  -- Pilih AP --
                </option>
                {AP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {form.apPenanggungJawab === 'Lainnya' && (
                <input
                  type="text"
                  value={form.apLainnya}
                  onChange={handleChange('apLainnya')}
                  required
                  disabled={submitting}
                  placeholder="Tulis nama AP penanggung jawab"
                  className={`${inputClass} mt-3`}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dokumen Laporan (PDF) <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                required
                disabled={submitting}
                className="w-full text-sm text-slate-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-900 file:text-white hover:file:bg-blue-800 file:cursor-pointer border border-slate-300 rounded-lg p-2"
              />
              <p className="text-xs text-slate-500 mt-1">
                Hanya file PDF, maksimal 2 MB.
              </p>
              {file && (
                <p className="text-xs text-green-700 mt-1 font-medium">
                  ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-900 to-green-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-800 hover:to-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Membuat QR...
                </>
              ) : (
                'Buat QR Code'
              )}
            </button>
          </form>
        ) : (
          /* ===== HASIL ===== */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                ✅ QR Code berhasil dibuat
              </div>
            </div>

            {/* QR Preview */}
            <div className="flex justify-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.qrDataUrl}
                alt={`QR Code ${result.kode}`}
                className="w-64 h-64 rounded-xl border-4 border-white shadow-2xl bg-white"
              />
            </div>

            {/* Kode & Data */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <ResultRow label="Kode Validasi" value={result.kode} mono />
              <ResultRow label="Nama KAP" value={result.report.namaKap} />
              <ResultRow label="Nama Klien" value={result.report.namaKlien} />
              <ResultRow
                label="Periode"
                value={`${formatTanggal(result.report.periodeAwal)} – ${formatTanggal(result.report.periodeAkhir)}`}
              />
              <ResultRow label="No Laporan" value={result.report.noLaporan} />
              <ResultRow label="Tanggal Terbit" value={formatTanggal(result.report.tanggalTerbit)} />
              <ResultRow label="AP Penanggung Jawab" value={result.report.apPenanggungJawab} />
            </div>

            {/* Link validasi */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Link Validasi
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={result.url}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white font-mono"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  {copied ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR (PNG)
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-blue-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-800 transition-all duration-200"
              >
                Buat QR Baru
              </button>
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

function ResultRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span
        className={`font-medium text-slate-900 text-right break-words ${
          mono ? 'font-mono text-blue-900' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}
