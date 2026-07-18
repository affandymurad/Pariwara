import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2, RefreshCw, BarChart2, MessageSquare, Store,
  Zap, Download, AlertTriangle, Copy, Check,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { PariwaraFormData, AIRecommendation } from '../types';
import { MEDIA_CATEGORIES, TARGET_GENERATIONS } from '../data/statistics';
import { useAnalyze } from '../hooks/useAnalyze';
import { PARIWARA_DRAFT_KEY } from './PariwaraForm';
import { pdf } from '@react-pdf/renderer';
import PariwaraPDFDocument from '../pdf/PariwaraPDFDocument';

interface Props {
  formData: PariwaraFormData;
  onReset:  () => void;
}

const LOGS = [
  'Mengunggah dan memproses parameter produk...',
  'Menganalisis identitas brand & pasar...',
  'Memetakan perilaku target pembeli...',
  'Mengoptimasi efektivitas media pilihan...',
  'Merumuskan contoh copywriting...',
  'Menyusun strategi marketplace lokal...',
  'Menyiapkan laporan Pariwara...',
];

export default function AnalysisResult({ formData, onReset }: Props) {
  const { analyze, loading, error } = useAnalyze();
  const [rec, setRec] = useState<AIRecommendation | null>(null);
  const [logIdx, setLogIdx] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const [takingLong, setTakingLong] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const copyCaption = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(i => (i === idx ? null : i)), 2000);
    } catch { /* clipboard tidak tersedia, abaikan */ }
  };

  // Call backend on mount
  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const logTimer = setInterval(() => {
      setLogIdx(i => Math.min(i + 1, LOGS.length - 1));
    }, 650);

    // Kalau lebih dari 8 detik, kasih tahu pengguna bahwa ini normal —
    // biar tidak dikira aplikasinya macet.
    const longWaitTimer = setTimeout(() => setTakingLong(true), 8000);

    analyze(formData, controller.signal).then(result => {
      clearInterval(logTimer);
      clearTimeout(longWaitTimer);
      setLogIdx(LOGS.length - 1);
      if (result) setRec(result);
    });

    return () => {
      clearInterval(logTimer);
      clearTimeout(longWaitTimer);
      controller.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelAnalysis = () => {
    abortRef.current?.abort();
    onReset();
  };

  const mediaNames = formData.selectedMedia.map(
    id => MEDIA_CATEGORIES.find(m => m.id === id)?.name ?? id,
  );

  const genNames = formData.selectedGenerations.map(
    id => TARGET_GENERATIONS.find(g => g.id === id)?.name ?? id,
  );

  // ── PDF export ────────────────────────────────────────────────
  // Built as a real PDF document (@react-pdf/renderer) instead of screenshotting
  // the on-screen DOM — text stays sharp and the Yoga flexbox layout engine
  // paginates automatically without ever cutting a card in half.
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    if (!rec) return;
    setExporting(true);
    try {
      const blob = await pdf(
        <PariwaraPDFDocument formData={formData} rec={rec} mediaNames={mediaNames} genNames={genNames} />,
      ).toBlob();

      const safeName = formData.productName
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .trim();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_Pariwara_${safeName || 'Analisis'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
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

        <p className="text-xs font-code text-muted mt-1 uppercase tracking-wider text-center">
          Biasanya selesai dalam beberapa detik
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
                className="text-xs font-code"
                style={{
                  color: i <= logIdx ? 'var(--text-ink2)' : 'var(--text-muted)',
                }}
              >
                {log}
              </span>
            </div>
          ))}
        </div>

        {takingLong && (
          <p className="text-xs text-center mt-4 leading-relaxed" style={{ color: 'var(--amber-text)' }}>
            Masih diproses, kadang butuh waktu sedikit lebih lama dari biasanya. Mohon tunggu ya.
          </p>
        )}

        <button type="button" onClick={cancelAnalysis} className="text-xs text-muted mt-4 hover:text-ink transition-colors underline">
          Batal, kembali ke form
        </button>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="card p-6 flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)' }}
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-white p-4"
    >
      {/* Hero */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3.5 text-white"
        style={{ background: 'var(--sage-btn)' }}
      >
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div>
          <p className="text-xs font-code uppercase tracking-widest opacity-75 mb-0.5">
            Analisis Selesai
          </p>
          <h3 className="text-sm font-display font-bold leading-snug">
            Strategi Iklan untuk "{formData.productName}" Siap! 🎉
          </h3>
        </div>
      </div>

      {/* Params summary */}
      <div className="card p-4">
        <p className="text-xs font-code font-bold text-muted uppercase tracking-wider mb-2">
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
              style={{ background: 'var(--amber-light)', color: 'var(--amber-text)' }}
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

          <h4 className="text-xs font-code font-bold text-ink2 uppercase tracking-wider">
            I. Platform & Saluran Iklan Terbaik
          </h4>
        </div>

        <div className="space-y-3">
          {rec?.recommendedPlatforms?.map((p, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: 'var(--bg-stone)' }}>
              <h5 className="text-xs font-display font-bold text-ink flex items-center gap-2 mb-1">
                <span
                  className="w-5 h-5 rounded-md text-white text-xs font-code font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--sage-btn)' }}
                >
                  {i + 1}
                </span>
                {p.name}
              </h5>

              <p className="text-sm text-ink2 leading-relaxed">
                {p.description}
              </p>

              <p
                className="text-xs italic mt-2 pt-2 border-t border-theme"
                style={{ color: 'var(--sage-text)' }}
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

          <h4 className="text-xs font-code font-bold text-ink2 uppercase tracking-wider">
            II. Contoh Caption Iklan
          </h4>
        </div>

        <div className="space-y-4">
          {rec?.copywritingStyles?.map((c, i) => (
            <div key={i}>
              <p
                className="text-xs font-code font-bold uppercase tracking-wide mb-2"
                style={{ color: 'var(--amber-text)' }}
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

              <button
                type="button"
                onClick={() => copyCaption(c.example, i)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-full border border-theme transition-all hover:opacity-75"
                style={{ background: 'var(--bg-card)', color: 'var(--text-ink2)' }}
              >
                {copiedIdx === i ? (
                  <><Check className="w-3 h-3" style={{ color: 'var(--sage)' }} /> Tersalin!</>
                ) : (
                  <><Copy className="w-3 h-3" /> Salin Caption</>
                )}
              </button>

              <p className="text-xs text-muted mt-2 leading-relaxed">
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

          <h4 className="text-xs font-code font-bold text-ink2 uppercase tracking-wider">
            III. Strategi Kelola Marketplace
          </h4>
        </div>

        <div className="space-y-4">
          {rec?.marketplaceStrategies?.map((s, i) => (
            <div key={i}>
              <h5 className="text-xs font-display font-bold text-ink mb-1">
                📌 {s.title}
              </h5>

              <p className="text-sm text-muted leading-relaxed mb-2">
                {s.details}
              </p>

              <ul className="space-y-1.5">
                {s.actionItems.map((a, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-xs text-ink2 font-medium"
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
              style={{ background: 'var(--sage-btn)', color: 'white' }}
            >
              <Zap className="w-4 h-4" />
            </div>

            <h4
              className="text-xs font-code font-bold uppercase tracking-wider"
              style={{ color: 'var(--sage-dark)' }}
            >
              IV. Aksi Cepat — Mulai Hari Ini!
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
                  className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: 'var(--sage-btn)' }}
                >
                  {i + 1}
                </span>

                <p className="text-sm text-ink2 leading-relaxed">
                  {w}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action bar */}
      <div
        className="card p-3.5 flex flex-col gap-2.5 sticky bottom-4"
        style={{
          backdropFilter: 'blur(12px)',
          background: 'color-mix(in srgb, var(--bg-card) 92%, transparent)',
        }}
      >
        <button onClick={exportPDF} disabled={exporting} className="btn-primary h-14 text-sm gap-2">
          {exporting
            ? <>Menyiapkan PDF...</>
            : <><Download className="w-5 h-5" /> Download Laporan PDF</>}
        </button>

        <button onClick={() => setConfirmReset(true)} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" /> Buat Analisis Baru
        </button>

        <p className="text-center text-xs font-code text-muted uppercase tracking-widest">
          Pariwara oleh Affandy Murad
        </p>
      </div>

      {/* Confirm-before-reset dialog — mencegah hasil kehapus karena salah pencet */}
      {confirmReset && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="card p-5 max-w-xs w-full text-center space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <h4 className="font-display font-bold text-ink text-base">Mulai Analisis Baru?</h4>
            <p className="text-sm text-muted leading-relaxed">
              Strategi yang sedang tampil akan hilang. Download dulu PDF-nya kalau belum, ya.
            </p>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setConfirmReset(false)} className="btn-secondary flex-1">
                Batal
              </button>
              <button
                onClick={() => { localStorage.removeItem(PARIWARA_DRAFT_KEY); onReset(); }}
                className="btn-primary flex-1"
              >
                Ya, Mulai Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
