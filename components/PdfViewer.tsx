'use client';

import { useEffect, useRef, useState } from 'react';

interface PdfViewerProps {
  url: string;
}

/**
 * Menampilkan PDF dengan merender tiap halaman menjadi gambar di <canvas>.
 *
 * Alasannya: kalau PDF ditampilkan lewat <iframe>, menu klik kanan berasal dari
 * viewer bawaan browser di dokumen lintas-domain, sehingga tidak bisa kita
 * nonaktifkan. Dengan canvas, semuanya ada di dokumen kita sendiri sehingga
 * klik kanan bisa diblokir dan browser tidak punya file PDF untuk "Save as".
 *
 * Catatan jujur: ini mempersulit, bukan mencegah mutlak. File tetap terkirim ke
 * browser dan masih bisa diambil lewat DevTools atau di-screenshot.
 */
export default function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pdfDoc: any = null;

    const render = async () => {
      setLoading(true);
      setError('');

      try {
        const pdfjsLib = await import('pdfjs-dist');
        // Worker disalin ke folder public agar path-nya pasti tersedia saat runtime.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        // pdf.js v6 mewajibkan objek parameter, bukan string
        pdfDoc = await pdfjsLib.getDocument({ url }).promise;
        if (cancelled) return;

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = '';

        const containerWidth = container.clientWidth || 600;
        // Batasi 2x supaya tajam di layar HiDPI tanpa boros memori
        const quality = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (cancelled) return;

          const page = await pdfDoc.getPage(pageNum);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = (containerWidth / baseViewport.width) * quality;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.className =
            'block w-full rounded-lg shadow-sm mb-3 select-none pointer-events-none';
          canvas.draggable = false;

          container.appendChild(canvas);

          // pdf.js v6: parameter utamanya `canvas`
          await page.render({ canvas, viewport }).promise;

          // Hilangkan spinner begitu halaman pertama tampil
          if (pageNum === 1 && !cancelled) setLoading(false);
        }

        if (!cancelled) setLoading(false);
      } catch (err) {
        console.error('Gagal merender PDF:', err);
        if (!cancelled) {
          setError('Dokumen gagal dimuat.');
          setLoading(false);
        }
      }
    };

    render();

    return () => {
      cancelled = true;
      if (pdfDoc) pdfDoc.destroy?.();
    };
  }, [url]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className="relative rounded-xl border border-slate-200 bg-slate-100 p-3 select-none"
    >
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-3"></div>
          <span className="text-sm">Memuat dokumen...</span>
        </div>
      )}

      {error && (
        <div className="py-10 text-center text-sm text-red-600">{error}</div>
      )}

      <div
        ref={containerRef}
        className="max-h-[75vh] overflow-y-auto overscroll-contain"
      />
    </div>
  );
}
