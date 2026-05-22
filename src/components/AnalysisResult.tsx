import React, { useEffect, useState } from "react";
import {
  CheckCircle2, RefreshCw, BarChart2, MessageSquare,
  Store, Zap, Download, AlertTriangle,
} from "lucide-react";
import { motion } from "motion/react";
import { jsPDF } from "jspdf";
import type { PariwaraFormData, AIRecommendation } from "../types";
import { MEDIA_CATEGORIES, TARGET_GENERATIONS } from "../data/statistics";
import { useAnalyze } from "../hooks/useAnalyze";

interface Props {
  formData: PariwaraFormData;
  onReset:  () => void;
}

const LOGS = [
  "Mengunggah dan memproses parameter produk...",
  "Menganalisis identitas brand & pasar...",
  "Memetakan perilaku target demografi...",
  "Mengoptimasi efektivitas media pilihan...",
  "Claude merumuskan contoh copywriting...",
  "Menyusun strategi marketplace lokal...",
  "Menyiapkan laporan Pariwara...",
];

// Strip emoji dan karakter non-latin agar tidak hancur di jsPDF Helvetica
function cleanText(str: string): string {
  return str
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")   // emoji supplementary
    .replace(/[\u{2600}-\u{27BF}]/gu, "")       // misc symbols & dingbats
    .replace(/[\u{FE00}-\u{FEFF}]/gu, "")       // variation selectors
    .replace(/[^\x00-\x7E\u00C0-\u024F]/g, "")  // keep latin + latin extended
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function AnalysisResult({ formData, onReset }: Props) {
  const { analyze, loading, error } = useAnalyze();
  const [rec,    setRec   ] = useState<AIRecommendation | null>(null);
  const [logIdx, setLogIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setLogIdx(i => Math.min(i + 1, LOGS.length - 1)), 650);
    analyze(formData).then(result => {
      clearInterval(timer);
      setLogIdx(LOGS.length - 1);
      if (result) setRec(result);
    });
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── PDF Export ─────────────────────────────────────────────────
  const exportPDF = () => {
    if (!rec) return;

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const sage:  [number, number, number] = [107, 143, 113];
    const ink:   [number, number, number] = [30,  27,  24 ];
    const muted: [number, number, number] = [122, 112, 101];
    const light: [number, number, number] = [250, 248, 245];

    const W  = doc.internal.pageSize.getWidth();
    const PH = doc.internal.pageSize.getHeight();
    const M  = 15;
    const CW = W - M * 2;
    const BOTTOM_MARGIN = 20; // space reserved for footer
    let y = 20;

    // ── helpers ────────────────────────────────────────────────
    const stripe = () => {
      doc.setFillColor(...sage);
      doc.rect(0, 0, W, 4, "F");
    };

    const footer = (n: number, t: number) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.setDrawColor(220, 216, 210);
      doc.line(M, PH - 12, W - M, PH - 12);
      doc.text("Pariwara oleh Affandy Murad", M, PH - 7);
      doc.text(`Halaman ${n} dari ${t}`, W - M, PH - 7, { align: "right" });
    };

    // Ensure there's enough vertical space; add new page if not
    const ensureSpace = (needed: number) => {
      if (y + needed > PH - BOTTOM_MARGIN) {
        doc.addPage();
        stripe();
        y = 20;
      }
    };

    // Print wrapped text and return the new y position
    const printWrapped = (
      text: string,
      x: number,
      startY: number,
      maxWidth: number,
      lineHeight: number
    ): number => {
      const lines = doc.splitTextToSize(cleanText(text), maxWidth) as string[];
      lines.forEach((line: string) => {
        ensureSpace(lineHeight + 2);
        doc.text(line, x, startY);
        startY += lineHeight;
      });
      return startY;
    };

    // Section heading
    const sectionHeading = (label: string) => {
      ensureSpace(14);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...sage);
      doc.text(label, M, y);
      y += 8;
    };

    // ── COVER ──────────────────────────────────────────────────
    stripe();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...sage);
    doc.text("PARIWARA - ANALISIS STRATEGI IKLAN EKRAF", M, y);
    y += 10;

    doc.setFontSize(18);
    doc.setTextColor(...ink);
    const titleLines = doc.splitTextToSize(
      `Rekomendasi Kampanye untuk "${cleanText(formData.productName)}"`,
      CW
    ) as string[];
    doc.text(titleLines, M, y);
    y += titleLines.length * 8 + 4;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(
      `Tanggal: ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}`,
      M, y
    );
    y += 6;

    // Parameters box
    const paramLines = [
      `Media      : ${formData.selectedMedia.map(id => MEDIA_CATEGORIES.find(m => m.id === id)?.name ?? id).join(", ")}`,
      `Demografi  : ${formData.selectedGenerations.map(id => TARGET_GENERATIONS.find(g => g.id === id)?.name ?? id).join(", ")}`,
      `Lokasi     : ${formData.locations.join(", ") || "-"}`,
    ];
    const paramBoxH = paramLines.length * 5 + 10;
    doc.setFillColor(245, 242, 238);
    doc.rect(M, y, CW, paramBoxH, "F");
    doc.setFontSize(8.5);
    doc.setTextColor(...ink);
    paramLines.forEach((line, i) => {
      doc.text(cleanText(line), M + 4, y + 6 + i * 5);
    });
    y += paramBoxH + 8;

    doc.setDrawColor(220, 216, 210);
    doc.line(M, y, W - M, y);
    y += 10;

    // ── I. PLATFORMS ───────────────────────────────────────────
    sectionHeading("I. Rekomendasi Platform Pemasaran");

    rec.recommendedPlatforms.forEach((p, i) => {
      // Set each font BEFORE splitting so line counts are accurate
      doc.setFont("Helvetica", "bold"); doc.setFontSize(10);
      const nameLines = doc.splitTextToSize(cleanText(p.name), CW - 16) as string[];

      doc.setFont("Helvetica", "normal"); doc.setFontSize(8.5);
      const descLines = doc.splitTextToSize(cleanText(p.description), CW - 12) as string[];

      doc.setFont("Helvetica", "oblique"); doc.setFontSize(8);
      const reasLines = doc.splitTextToSize(`Alasan: ${cleanText(p.reasoning)}`, CW - 12) as string[];

      // Padding: 4 top + 4 gap-after-name + 3 gap-after-desc + 4 bottom
      const LINE_H_NAME = 5.5;
      const LINE_H_DESC = 4.5;
      const LINE_H_REAS = 4.2;
      const boxH =
        4 +
        nameLines.length * LINE_H_NAME +
        3 +
        descLines.length * LINE_H_DESC +
        3 +
        reasLines.length * LINE_H_REAS +
        4;

      ensureSpace(boxH + 4);

      // Draw box AFTER calculating correct height
      doc.setFillColor(...light);
      doc.rect(M, y, CW, boxH, "F");
      doc.setFillColor(...sage);
      doc.rect(M, y, 2, boxH, "F");

      // Number badge
      doc.setFillColor(...sage);
      doc.roundedRect(M + 4, y + 3, 6, 5, 1, 1, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(`${i + 1}`, M + 7, y + 7, { align: "center" });

      // Name
      let by = y + 4 + LINE_H_NAME * 0.8;
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...ink);
      nameLines.forEach((line: string) => { doc.text(line, M + 13, by); by += LINE_H_NAME; });

      // Description
      by += 1;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...muted);
      descLines.forEach((line: string) => { doc.text(line, M + 5, by); by += LINE_H_DESC; });

      // Reasoning
      by += 2;
      doc.setFont("Helvetica", "oblique");
      doc.setFontSize(8);
      doc.setTextColor(80, 120, 85);
      reasLines.forEach((line: string) => { doc.text(line, M + 5, by); by += LINE_H_REAS; });

      y += boxH + 4;
    });

    y += 4;

    // ── II. COPYWRITING ────────────────────────────────────────
    sectionHeading("II. Formula Copywriting Iklan");

    rec.copywritingStyles.forEach(c => {
      ensureSpace(10);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...ink);
      const titleLine = cleanText(c.title);
      doc.text(titleLine, M, y);
      y += 5;

      // Example box — dynamic height
      const exLines  = doc.splitTextToSize(cleanText(c.example), CW - 8) as string[];
      const exBoxH   = exLines.length * 4.5 + 8;
      ensureSpace(exBoxH + 2);
      doc.setFillColor(253, 252, 249);
      doc.rect(M, y, CW, exBoxH, "F");
      doc.setDrawColor(220, 216, 210);
      doc.rect(M, y, CW, exBoxH, "S");
      // Amber left accent
      doc.setFillColor(201, 138, 58);
      doc.rect(M, y, 2, exBoxH, "F");

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(...ink);
      let ey = y + 5;
      exLines.forEach((line: string) => { doc.text(line, M + 5, ey); ey += 4.5; });
      y += exBoxH + 3;

      // Tips
      const tipLines = doc.splitTextToSize(`Tips: ${cleanText(c.tips)}`, CW) as string[];
      ensureSpace(tipLines.length * 4 + 4);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      tipLines.forEach((line: string) => { doc.text(line, M, y); y += 4; });
      y += 6;
    });

    // ── III. STRATEGIES ────────────────────────────────────────
    sectionHeading("III. Strategi Saluran & Marketplace");

    rec.marketplaceStrategies.forEach(s => {
      ensureSpace(10);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...ink);
      doc.text(cleanText(s.title), M, y);
      y += 5;

      const detLines = doc.splitTextToSize(cleanText(s.details), CW) as string[];
      ensureSpace(detLines.length * 4.5 + 2);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...muted);
      detLines.forEach((line: string) => { doc.text(line, M, y); y += 4.5; });
      y += 2;

      s.actionItems.forEach(a => {
        const aLines = doc.splitTextToSize(cleanText(a), CW - 8) as string[];
        ensureSpace(aLines.length * 4 + 2);
        doc.setFillColor(...sage);
        doc.circle(M + 2, y + 1.5, 1, "F");
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(...ink);
        aLines.forEach((line: string, li: number) => {
          doc.text(line, li === 0 ? M + 6 : M + 6, y + (li === 0 ? 3 : 3 + li * 4));
        });
        y += aLines.length * 4 + 1;
      });
      y += 6;
    });

    // ── IV. QUICK WINS ─────────────────────────────────────────
    if (rec.quickWins?.length) {
      sectionHeading("IV. Quick Wins - Mulai Hari Ini!");

      rec.quickWins.forEach((w, i) => {
        const wLines = doc.splitTextToSize(`${i + 1}. ${cleanText(w)}`, CW - 4) as string[];
        const wBoxH  = wLines.length * 4.5 + 8;
        ensureSpace(wBoxH + 3);

        doc.setFillColor(234, 242, 235);
        doc.rect(M, y, CW, wBoxH, "F");

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...ink);
        let wy = y + 5;
        wLines.forEach((line: string) => { doc.text(line, M + 4, wy); wy += 4.5; });
        y += wBoxH + 3;
      });
    }

    // ── FOOTERS on all pages ───────────────────────────────────
    const total = doc.internal.pages.length - 1;
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      footer(i, total);
    }

    doc.save(`Laporan_Pariwara_${cleanText(formData.productName).replace(/\s+/g, "_")}.pdf`);
  };

  // ── Loading ────────────────────────────────────────────────────
  if (loading || (!rec && !error)) {
    return (
      <div className="card p-8 flex flex-col items-center">
        <div className="relative w-14 h-14 mb-5">
          <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "var(--bg-stone)" }} />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
            style={{ borderTopColor: "var(--sage)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: "var(--sage)" }}>
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-base font-display font-bold text-ink text-center">
          Merumuskan Strategi Pariwara...
        </h3>
        <p className="text-[10px] font-code text-muted mt-1 uppercase tracking-wider text-center">
          Claude Sonnet 4.6 sedang bekerja
        </p>
        <div className="w-full rounded-xl p-4 mt-5 space-y-2" style={{ background: "var(--bg-stone)" }}>
          {LOGS.map((log, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 transition-opacity ${i <= logIdx ? "opacity-100" : "opacity-20"}`}
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${i === logIdx && loading ? "animate-pulse" : ""}`}
                style={{ background: i < logIdx ? "var(--text-muted)" : i === logIdx ? "var(--sage)" : "var(--border)" }}
              />
              <span className="text-[10px] font-code" style={{ color: i <= logIdx ? "var(--text-ink2)" : "var(--text-muted)" }}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="card p-8 flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#FDF2F2", color: "#DC2626" }}>
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="text-center">
          <h3 className="font-display font-bold text-ink text-base mb-1">Analisis Gagal</h3>
          <p className="text-xs text-muted leading-relaxed max-w-xs">{error}</p>
        </div>
        <button onClick={onReset} className="btn-secondary w-auto px-8 gap-2">
          <RefreshCw className="w-4 h-4" /> Coba Lagi
        </button>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────────
  const mediaNames = formData.selectedMedia.map(id => MEDIA_CATEGORIES.find(m => m.id === id)?.name ?? id);
  const genNames   = formData.selectedGenerations.map(id => TARGET_GENERATIONS.find(g => g.id === id)?.name ?? id);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

      {/* Hero */}
      <div className="rounded-2xl p-4 flex items-center gap-3.5 text-white" style={{ background: "var(--sage)" }}>
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[9px] font-code uppercase tracking-widest opacity-75 mb-0.5">Analisis Selesai</p>
          <h3 className="text-sm font-display font-bold leading-snug">
            Strategi Iklan untuk "{formData.productName}" Siap! 🎉
          </h3>
        </div>
      </div>

      {/* Params */}
      <div className="card p-4">
        <p className="text-[9px] font-code font-bold text-muted uppercase tracking-wider mb-2">Parameter Analisis:</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="param-tag" style={{ background: "var(--sage-light)", color: "var(--sage-dark)" }}>🛍️ {formData.productName}</span>
          {mediaNames.map((m, i) => <span key={i} className="param-tag" style={{ background: "var(--bg-stone)", color: "var(--text-ink2)" }}>📺 {m}</span>)}
          {genNames.map((g, i)   => <span key={i} className="param-tag" style={{ background: "var(--bg-stone)", color: "var(--text-ink2)" }}>👥 {g}</span>)}
          {formData.locations.map((l, i) => <span key={i} className="param-tag" style={{ background: "var(--amber-light)", color: "var(--amber)" }}>📍 {l}</span>)}
        </div>
      </div>

      {/* I — Platforms */}
      <div className="card p-4">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-theme">
          <div className="mod-icon mod-icon-sage"><BarChart2 className="w-4 h-4" /></div>
          <h4 className="text-[10px] font-code font-bold text-ink2 uppercase tracking-wider">I. Platform & Saluran Iklan Terbaik</h4>
        </div>
        <div className="space-y-3">
          {rec?.recommendedPlatforms?.map((p, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "var(--bg-stone)" }}>
              <h5 className="text-xs font-display font-bold text-ink flex items-center gap-2 mb-1">
                <span
                  className="w-5 h-5 rounded-md text-white text-[10px] font-code font-bold flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--sage)" }}
                >{i + 1}</span>
                {p.name}
              </h5>
              <p className="text-[11px] text-ink2 leading-relaxed">{p.description}</p>
              <p className="text-[10px] italic mt-2 pt-2 border-t border-theme" style={{ color: "var(--sage)" }}>
                🎯 {p.reasoning}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* II — Copywriting */}
      <div className="card p-4">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-theme">
          <div className="mod-icon mod-icon-amber"><MessageSquare className="w-4 h-4" /></div>
          <h4 className="text-[10px] font-code font-bold text-ink2 uppercase tracking-wider">II. Contoh Copywriting Iklan</h4>
        </div>
        <div className="space-y-4">
          {rec?.copywritingStyles?.map((c, i) => (
            <div key={i}>
              <p className="text-[10px] font-code font-bold uppercase tracking-wide mb-2" style={{ color: "var(--amber)" }}>
                ⚡ {c.title}
              </p>
              <div
                className="rounded-xl p-3 text-xs text-ink2 italic leading-relaxed border-l-4"
                style={{ background: "var(--bg-stone)", borderLeftColor: "var(--amber)" }}
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

      {/* III — Marketplace */}
      <div className="card p-4">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-theme">
          <div className="mod-icon mod-icon-stone"><Store className="w-4 h-4" /></div>
          <h4 className="text-[10px] font-code font-bold text-ink2 uppercase tracking-wider">III. Strategi Saluran & Marketplace</h4>
        </div>
        <div className="space-y-4">
          {rec?.marketplaceStrategies?.map((s, i) => (
            <div key={i}>
              <h5 className="text-xs font-display font-bold text-ink mb-1">📌 {s.title}</h5>
              <p className="text-[11px] text-muted leading-relaxed mb-2">{s.details}</p>
              <ul className="space-y-1.5">
                {s.actionItems.map((a, j) => (
                  <li key={j} className="flex items-start gap-2 text-[10px] text-ink2 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--sage)" }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* IV — Quick Wins */}
      {(rec?.quickWins?.length ?? 0) > 0 && (
        <div className="card p-4" style={{ background: "var(--sage-light)", borderColor: "var(--sage)" }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="mod-icon" style={{ background: "var(--sage)", color: "white" }}>
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-[10px] font-code font-bold uppercase tracking-wider" style={{ color: "var(--sage-dark)" }}>
              IV. Quick Wins — Mulai Hari Ini!
            </h4>
          </div>
          <div className="space-y-2">
            {rec!.quickWins.map((w, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl p-2.5"
                style={{ background: "var(--bg-card)" }}
              >
                <span
                  className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: "var(--sage)" }}
                >{i + 1}</span>
                <p className="text-[11px] text-ink2 leading-relaxed">{w}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action bar */}
      <div
        className="card p-3.5 flex flex-col gap-2.5 sticky bottom-4"
        style={{ backdropFilter: "blur(12px)", background: "color-mix(in srgb, var(--bg-card) 92%, transparent)" }}
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
