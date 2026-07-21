'use client';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  // #toolbar=0 menyembunyikan tombol download & print pada viewer PDF bawaan
  // browser. Didukung Chrome/Edge; Firefox dan Safari bisa mengabaikannya.
  // Catatan: ini menyulitkan, bukan mencegah mutlak — file yang bisa
  // ditampilkan pasti sudah terkirim ke perangkat pengunjung.
  const src = `${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        src={src}
        title="Dokumen Laporan"
        className="w-full h-[70vh] min-h-[400px] border-0"
      />
    </div>
  );
}
