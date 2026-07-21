import Image from 'next/image';
import { getReportValidationByKode } from '../../../lib/supabase';

// Data validasi dibuat saat runtime, jadi halaman ini selalu dinamis.
export const dynamic = 'force-dynamic';

interface ValidasiPageProps {
  params: Promise<{ kode: string }>;
}

export async function generateMetadata({ params }: ValidasiPageProps) {
  const { kode } = await params;
  return {
    title: `Validasi Dokumen ${kode} | KAP JSR`,
    description:
      'Halaman verifikasi keaslian dokumen KAP Jojo Sunarjo & Rekan Cabang Bandung.',
  };
}

// Format "YYYY-MM-DD" -> "1 Januari 2025"
const formatTanggal = (value?: string) => {
  if (!value) return '-';
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default async function ValidasiPage({ params }: ValidasiPageProps) {
  const { kode } = await params;
  const { data: report } = await getReportValidationByKode(kode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-br from-green-600 to-green-500 rounded-full blur-3xl transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-900 via-blue-800 to-green-600 rounded-full blur-3xl transform translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10 max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
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
          <p className="text-slate-600 mt-3">
            KAP Jojo Sunarjo &amp; Rekan Cabang Bandung
          </p>
        </div>

        {report ? (
          /* ===== DOKUMEN VALID ===== */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
            {/* Status header */}
            <div className="bg-gradient-to-r from-blue-900 to-green-600 p-8 text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-1">Dokumen Terverifikasi</h1>
              <p className="text-blue-100 text-sm">
                Dokumen ini benar diterbitkan oleh KAP JSR
              </p>
            </div>

            {/* Detail */}
            <div className="p-6 md:p-8 space-y-4">
              <DetailRow label="Kode Validasi" value={report.kode} mono />
              <DetailRow label="Nama KAP" value={report.nama_kap} />
              <DetailRow label="Nama Klien" value={report.nama_klien} />
              <DetailRow
                label="Periode"
                value={`${formatTanggal(report.periode_awal)} – ${formatTanggal(report.periode_akhir)}`}
              />
              <DetailRow label="No Laporan" value={report.no_laporan} />
              <DetailRow label="Tanggal Terbit Laporan" value={formatTanggal(report.tanggal_terbit)} />
              <DetailRow label="AP Penanggung Jawab" value={report.ap_penanggung_jawab} />

              <div className="pt-4 mt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Jika data di atas sesuai dengan dokumen fisik yang Anda pegang,
                  maka dokumen tersebut asli dan diterbitkan oleh KAP Jojo Sunarjo
                  &amp; Rekan Cabang Bandung. Bila terdapat ketidaksesuaian, silakan
                  hubungi kantor kami.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ===== DOKUMEN TIDAK DITEMUKAN ===== */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-1">Dokumen Tidak Ditemukan</h1>
              <p className="text-red-100 text-sm">
                Kode validasi tidak terdaftar
              </p>
            </div>
            <div className="p-6 md:p-8">
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-slate-500 mb-1">Kode yang dicari</p>
                <p className="font-mono font-semibold text-slate-800 break-all">{kode}</p>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kode ini tidak ada di sistem kami. Pastikan Anda memindai QR code
                dengan benar. Jika Anda yakin dokumen ini seharusnya asli, mohon
                hubungi KAP JSR untuk konfirmasi lebih lanjut.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="https://www.kapjsr.co.id"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-900 transition-colors text-sm"
          >
            Kunjungi website resmi KAP JSR →
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span
        className={`text-sm font-semibold text-slate-900 sm:text-right break-words ${
          mono ? 'font-mono text-blue-900' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}
