import React, { useState } from "react";
import { TrendingUp, Users, Database, ChevronDown, ChevronUp, Utensils, Hammer, Shirt, Sparkles } from "lucide-react";
import { NATIONAL_STATS_2024, CREATIVE_SUBSECTORS } from "../data/statistics";

const SUB_ICONS: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-3.5 h-3.5" style={{ color: "var(--amber)" }} />,
  Hammer:   <Hammer   className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />,
  Shirt:    <Shirt    className="w-3.5 h-3.5" style={{ color: "var(--sage)" }} />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--text-ink2)" }} />,
};

export default function StatInfographics() {
  const [open, setOpen] = useState(false);

  return (
    <div className="card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="mod-icon mod-icon-sage">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-display font-bold text-ink leading-tight">
              Ekraf Indonesia {NATIONAL_STATS_2024.year}
            </h2>
            <p className="text-[10px] text-muted">Sumber: {NATIONAL_STATS_2024.source}</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-theme transition-colors hover:bg-stone"
          style={{ color: "var(--text-muted)" }}
        >
          {open ? "Tutup" : "Detail"}
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Insight callout */}
      <div className="rounded-xl p-3 mb-3" style={{ background: "var(--sage-light)" }}>
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--sage-dark)" }}>
          💡 <strong>Tahukah kamu?</strong> Ekraf Indonesia menyerap{" "}
          <strong>24,3 juta tenaga kerja</strong> — lebih besar dari total penduduk Australia!
          Produkmu bagian dari industri senilai{" "}
          <strong>Rp {NATIONAL_STATS_2024.gdpContribution} triliun</strong>.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2.5 mb-1">
        <div className="rounded-xl p-3" style={{ background: "var(--bg-stone)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Users className="w-3.5 h-3.5" style={{ color: "var(--sage)" }} />
            <span className="text-[9px] font-code font-bold uppercase tracking-wider" style={{ color: "var(--sage)" }}>
              Tenaga Kerja
            </span>
          </div>
          <div className="font-display text-2xl font-bold text-ink leading-none">
            {NATIONAL_STATS_2024.totalWorkers}
          </div>
          <div className="text-[10px] text-muted mt-1">Juta Orang</div>
        </div>

        <div className="rounded-xl p-3" style={{ background: "var(--bg-stone)" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Database className="w-3.5 h-3.5" style={{ color: "var(--amber)" }} />
            <span className="text-[9px] font-code font-bold uppercase tracking-wider" style={{ color: "var(--amber)" }}>
              PDB Nasional
            </span>
          </div>
          <div className="font-display text-xl font-bold text-ink leading-none">
            Rp {NATIONAL_STATS_2024.gdpContribution}T
          </div>
          <div className="text-[10px] text-muted mt-1">
            = {NATIONAL_STATS_2024.gdpPercentage}% dari PDB
          </div>
        </div>
      </div>

      {/* Expandable subsectors */}
      {open && (
        <div className="mt-3 pt-3 border-t border-theme space-y-2.5 fade-up">
          <p className="text-[11px] font-bold text-ink2 font-display">
            Distribusi per subsektor — di mana posisi produkmu?
          </p>

          {CREATIVE_SUBSECTORS.map((sub, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "var(--bg-stone)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {SUB_ICONS[sub.icon]}
                  <span className="text-[11px] font-semibold text-ink2">{sub.name}</span>
                </div>
                <span className="text-[11px] font-code font-bold text-ink">{sub.percentage}%</span>
              </div>
              <div className="progress-track mb-1.5">
                <div
                  className="progress-fill"
                  style={{ width: `${sub.percentage}%`, background: sub.barColor }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] text-muted">Kontribusi subsektor</span>
                <span className="text-[9px] font-semibold text-ink2">{sub.workers}M tenaga kerja</span>
              </div>
            </div>
          ))}

          <div
            className="rounded-xl p-3 text-[10px] leading-relaxed"
            style={{ background: "var(--amber-light)", color: "var(--text-ink2)" }}
          >
            <strong style={{ color: "var(--amber)" }}>Insight Pariwara:</strong> Kuliner, Kriya &
            Fashion mendominasi 89,5% lapangan kerja ekraf. Audiens lokal paling mudah connect
            dengan keaslian produk dari subsektor ini — jadikan itu kekuatan utama iklanmu!
          </div>
        </div>
      )}
    </div>
  );
}
