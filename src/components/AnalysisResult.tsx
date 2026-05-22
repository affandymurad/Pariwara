import React, { useEffect, useState } from 'react';
import {
  CheckCircle2, RefreshCw, BarChart2, MessageSquare, Store,
  Zap, Download, AlertTriangle,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { PariwaraFormData, AIRecommendation } from '../types';
import { MEDIA_CATEGORIES, TARGET_GENERATIONS } from '../data/statistics';
import { useAnalyze } from '../hooks/useAnalyze';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
  formData: PariwaraFormData;
  onReset:  () => void;
}

const LOGS = [
  'Mengunggah dan memproses parameter produk...',
  'Menganalisis identitas brand & pasar...',
  'Memetakan perilaku target demografi...',
  'Mengoptimasi efektivitas media pilihan...',
  'Claude sedang merumuskan copywriting...',
  'Menyusun strategi marketplace lokal...',
  'Menyiapkan laporan Pariwara...',
];

export default function AnalysisResult({ formData, onReset }: Props) {
  const { analyze, loading, error } = useAnalyze();
  const [rec, setRec] = useState<AIRecommendation | null>(null);
  const [logIdx, setLogIdx] = useState(0);

  // Call backend on mount
  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogIdx(i => Math.min(i + 1, LOGS.length - 1));
    }, 650);

    analyze(formData).then(result => {
      clearInterval(logTimer);
      setLogIdx(LOGS.length - 1);
      if (result) setRec(result);
    });

    return () => clearInterval(logTimer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── PDF export ────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!rec) return;

    const source = document.getElementById('pariwara-pdf-content');
    if (!source) return;

    const actionBar = document.getElementById('pariwara-action-bar');
    const previousActionBarDisplay = actionBar?.style.display;

    try {
      if (actionBar) actionBar.style.display = 'none';

      await document.fonts?.ready;

      const canvas = await html2canvas(source, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: source.scrollWidth,
        windowHeight: source.scrollHeight,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const imgWidth = usableWidth;
      const pxPerMm = canvas.width / imgWidth;
      const pageCanvasHeightPx = Math.floor(usableHeight * pxPerMm);

      let renderedHeightPx = 0;
      let pageIndex = 0;

      while (renderedHeightPx < canvas.height) {
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');

        const sliceHeightPx = Math.min(
          pageCanvasHeightPx,
          canvas.height - renderedHeightPx,
        );

        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeightPx;

        pageCtx?.drawImage(
          canvas,
          0,
          renderedHeightPx,
          canvas.width,
          sliceHeightPx,
          0,
          0,
          canvas.width,
          sliceHeightPx,
        );

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const pageImgHeight = sliceHeightPx / pxPerMm;

        if (pageIndex > 0) pdf.addPage();

        pdf.addImage(
          pageImgData,
          'JPEG',
          margin,
          margin,
          imgWidth,
          pageImgHeight,
        );

        renderedHeightPx += sliceHeightPx;
        pageIndex += 1;
      }

      const safeName = formData.productName
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .trim();

      pdf.save(`Laporan_Pariwara_${safeName || 'Analisis'}.pdf`);
    } finally {
      if (actionBar) actionBar.style.display = previousActionBarDisplay ?? '';
    }
  };

  // ── Loading state ─────────────────────────────────────────────
  if (loading || (!rec && !error)) {
    return (
      <div className="card p-8 flex flex-col items-center">
        <div className="relative w-14 h-14 mb-5">
          <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: 'var(--bg-stone)' }} />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
            style={{ borderTopColor: 'var(--sage)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: 'var(--sage)' }}>
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <h3 className="text-base font-display font-bold text-ink text-center">
          Merumuskan Strategi Pariwara...
        </h3>

        <p className="text-[10px] font-code text-muted mt-1 uppercase tracking-wider text-center">
          Claude Sonnet 4.6 sedang bekerja
        </p>

        <div className="w-full rounded-xl p-4 mt-5 space-y-2" style={{ background: 'var(--bg-stone)' }}>
          {LOGS.map((log, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 transition-opacity ${i <= logIdx ? 'opacity-100' : 'opacity-20'}`}
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  i === logIdx && loading ? 'animate-pulse' : ''
                }`}
                style={{
                  background:
                    i < logIdx
                      ? 'var(--text-muted)'
                      : i === logIdx
                        ? 'var(--sage)'
                        : 'var(--border)',
                }}
              />
              <span
                className="text-[10px] font-code"
                style={{
                  color: i <= logIdx ? 'var(--text-ink2)' : 'var(--text-muted)',
                }}
              >
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="card p-6 flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: '#FDF2F2', color: '#DC2626' }}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center">
          <h3 className="font-display font-bold text-ink text-base">Analisis Gagal</h3>
          <p className="text-xs text-muted mt-1">{error}</p>
        </div>

        <button onClick={onReset} className="btn-secondary w-auto px-6">
          <RefreshCw className="w-4 h-4" /> Coba Lagi
        </button>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────
  const mediaNames = formData.selectedMedia.map(
    id => MEDIA_CATEGORIES.find(m => m.id === id)?.name ?? id,
  );

  const genNames = formData.selectedGenerations.map(
    id => TARGET_GENERATIONS.find(g => g.id === id)?.name ?? id,
  );

  return (
    <motion.div
      id="pariwara-pdf-content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-white p-4"
    >
      {/* Hero */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3.5 text-white"
        style={{ background: 'var(--sage)' }}
      >
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div>
          <p className="text-[9px] font-code uppercase tracking-widest opacity-75 mb-0.5">
            Analisis Selesai
          </p>
          <h3 className="text-sm font-display font-bold leading-snug">
            Strategi Iklan untuk "{formData.productName}" Siap! 🎉
          </h3>
        </div>
      </div>

      {/* Params summary */}
      <div className="card p-4">
        <p className="text-[9px] font-code font-bold text-muted uppercase tracking-wider mb-2">
          Parameter Analisis:
        </p>

        <div className="flex flex-wrap gap-1.5">
          <span
            className="param-tag"
            style={{ background: 'var(--sage-light)', color: 'var(--sage-dark)' }}
          >
            🛍️ {formData.productName}
          </span>

          {mediaNames.map((m, i) => (
            <span
              key={i}
              className="param-tag"
              style={{ background: 'var(--bg-stone)', color: 'var(--text-ink2)' }}
            >
              📺 {m}
            </span>
          ))}

          {genNames.map((g, i) => (
            <span
              key={i}
              className="param-tag"
              style={{ background: 'var(--bg-stone)', color: 'var(--text-ink2)' }}
            >
              👥 {g}
            </span>
          ))}

          {formData.locations.map((l, i) => (
            <span
              key={i}
              className="param-tag"
              style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}
            >
              📍 {l}
            </span>
          ))}
        </div>
      </div>

      {/* Module I — Platforms */}
      <div className="card p-4">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-theme">
          <div className="module-icon module-icon-sage">
            <BarChart2 className="w-4 h-4" />
          </div>

          <h4 className="text-[10px] font-code font-bold text-ink2 uppercase tracking-wider">
            I. Platform & Saluran Iklan Terbaik
          </h4>
        </div>

        <div className="space-y-3">
          {rec?.recommendedPlatforms?.map((p, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: 'var(--bg-stone)' }}>
              <h5 className="text-xs font-display font-bold text-ink flex items-center gap-2 mb-1">
                <span
                  className="w-5 h-5 rounded-md text-white text-[10px] font-code font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--sage)' }}
                >
                  {i + 1}
                </span>
                {p.name}
              </h5>

              <p className="text-[11px] text-ink2 leading-relaxed">
                {p.description}
              </p>

              <p
                className="text-[10px] italic mt-2 pt-2 border-t border-theme"
                style={{ color: 'var(--sage)' }}
              >
                🎯 {p.reasoning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Module II — Copywriting */}
      <div className="card p-4">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-theme">
          <div className="module-icon module-icon-amber">
            <MessageSquare className="w-4 h-4" />
          </div>

          <h4 className="text-[10px] font-code font-bold text-ink2 uppercase tracking-wider">
            II. Contoh Copywriting Iklan
          </h4>
        </div>

        <div className="space-y-4">
          {rec?.copywritingStyles?.map((c, i) => (
            <div key={i}>
              <p
                className="text-[10px] font-code font-bold uppercase tracking-wide mb-2"
                style={{ color: 'var(--amber)' }}
              >
                ⚡ {c.title}
              </p>

              <div
                className="rounded-xl p-3 text-xs text-ink2 italic leading-relaxed border-l-4 whitespace-pre-line"
                style={{
                  background: 'var(--bg-stone)',
                  borderLeftColor: 'var(--amber)',
                }}
              >
                {c.example}
              </div>

              <p className="text-[10px] text-muted mt-2 leading-relaxed">
                💡 <strong>Tips:</strong> {c.tips}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Module III — Marketplace */}
      <div className="card p-4">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-theme">
          <div
            className="module-icon"
            style={{ background: 'var(--bg-stone)', color: 'var(--text-muted)' }}
          >
            <Store className="w-4 h-4" />
          </div>

          <h4 className="text-[10px] font-code font-bold text-ink2 uppercase tracking-wider">
            III. Strategi Kelola Marketplace
          </h4>
        </div>

        <div className="space-y-4">
          {rec?.marketplaceStrategies?.map((s, i) => (
            <div key={i}>
              <h5 className="text-xs font-display font-bold text-ink mb-1">
                📌 {s.title}
              </h5>

              <p className="text-[11px] text-muted leading-relaxed mb-2">
                {s.details}
              </p>

              <ul className="space-y-1.5">
                {s.actionItems.map((a, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-[10px] text-ink2 font-medium"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: 'var(--sage)' }}
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Module IV — Quick Wins */}
      {(rec?.quickWins?.length ?? 0) > 0 && (
        <div
          className="card p-4"
          style={{ background: 'var(--sage-light)', borderColor: 'var(--sage)' }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="module-icon"
              style={{ background: 'var(--sage)', color: 'white' }}
            >
              <Zap className="w-4 h-4" />
            </div>

            <h4
              className="text-[10px] font-code font-bold uppercase tracking-wider"
              style={{ color: 'var(--sage-dark)' }}
            >
              IV. Quick Wins — Mulai Hari Ini!
            </h4>
          </div>

          <div className="space-y-2">
            {(rec?.quickWins ?? []).map((w, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl p-2.5"
                style={{ background: 'var(--bg-card)' }}
              >
                <span
                  className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: 'var(--sage)' }}
                >
                  {i + 1}
                </span>

                <p className="text-[11px] text-ink2 leading-relaxed">
                  {w}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action bar */}
      <div
        id="pariwara-action-bar"
        className="card p-3.5 flex flex-col gap-2.5 sticky bottom-4"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'color-mix(in srgb, var(--bg-card) 92%, transparent)',
        }}
      >
        <button onClick={exportPDF} className="btn-primary h-14 text-sm gap-2">
          <Download className="w-5 h-5" /> Download Laporan PDF
        </button>

        <button onClick={onReset} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" /> Buat Analisis Baru
        </button>

        <p className="text-center text-[9px] font-code text-muted uppercase tracking-widest">
          Pariwara oleh Affandy Murad
        </p>
      </div>
    </motion.div>
  );
}
