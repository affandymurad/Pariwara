import React, { useState } from 'react';
import { TrendingUp, Users, Database, ChevronDown, ChevronUp, Utensils, Hammer, Shirt, Sparkles, Award } from 'lucide-react';
import { NATIONAL_STATS_2024, CREATIVE_SUBSECTORS } from '../data/statistics';

const subsectorConfig: Record<string, {
  icon: React.ReactNode;
  color: string;
  lightBg: string;
  emoji: string;
}> = {
  Utensils: {
    icon:    <Utensils className="w-4 h-4" />,
    color:   'var(--amber)',
    lightBg: 'var(--amber-light)',
    emoji:   '🍜',
  },
  Hammer: {
    icon:    <Hammer className="w-4 h-4" />,
    color:   'var(--text-muted)',
    lightBg: 'var(--bg-stone)',
    emoji:   '🪡',
  },
  Shirt: {
    icon:    <Shirt className="w-4 h-4" />,
    color:   'var(--sage)',
    lightBg: 'var(--sage-light)',
    emoji:   '👗',
  },
  Sparkles: {
    icon:    <Sparkles className="w-4 h-4" />,
    color:   'var(--text-ink2)',
    lightBg: 'var(--bg-stone)',
    emoji:   '🎨',
  },
};

export default function StatInfographics() {
  const [open, setOpen] = useState(false);

  return (
    <div className="card overflow-hidden">
      {/* Accent bar top */}
      <div className="h-[3px]" style={{
        background: 'linear-gradient(90deg, var(--amber) 0%, var(--sage) 50%, var(--text-muted) 100%)',
      }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="module-icon module-icon-amber">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-ink leading-tight">
                Ekraf Indonesia {NATIONAL_STATS_2024.year}
              </h2>
              <p className="text-xs text-muted">Sumber: {NATIONAL_STATS_2024.source}</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-full border border-theme transition-colors hover:bg-stone"
            style={{ color: 'var(--text-muted)' }}
          >
            {open ? 'Tutup' : 'Detail'}
            {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Hero numbers — big visual impact */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Workers card */}
          <div className="relative rounded-2xl p-4 overflow-hidden"
               style={{ background: 'var(--sage-light)' }}>
            <div className="absolute -right-3 -bottom-3 text-5xl opacity-20 select-none">👥</div>
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5" style={{ color: 'var(--sage)' }} />
                <span className="text-xs font-code font-bold uppercase tracking-wider"
                      style={{ color: 'var(--sage-text)' }}>Tenaga Kerja</span>
              </div>
              <div className="font-display font-bold leading-none mb-1"
                   style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--sage-dark)' }}>
                24,3<span className="text-base font-sans ml-1" style={{ color: 'var(--sage-text)' }}>Juta</span>
              </div>
              <p className="text-xs leading-snug" style={{ color: 'var(--sage-dark)', opacity: 0.75 }}>
                Lebih besar dari populasi Australia
              </p>
            </div>
          </div>

          {/* GDP card */}
          <div className="relative rounded-2xl p-4 overflow-hidden"
               style={{ background: 'var(--amber-light)' }}>
            <div className="absolute -right-3 -bottom-3 text-5xl opacity-20 select-none">💰</div>
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-2">
                <Database className="w-3.5 h-3.5" style={{ color: 'var(--amber)' }} />
                <span className="text-xs font-code font-bold uppercase tracking-wider"
                      style={{ color: 'var(--amber-text)' }}>PDB Nasional</span>
              </div>
              <div className="font-display font-bold leading-none mb-1"
                   style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: 'var(--amber-text)' }}>
                Rp 1.413T
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                   style={{ background: 'var(--amber)', color: 'var(--amber-contrast)' }}>
                <Award className="w-3 h-3" />
                7,8% dari PDB
              </div>
            </div>
          </div>
        </div>

        {/* Insight callout — refined */}
        <div className="rounded-xl px-3.5 py-2.5 flex items-start gap-2.5"
             style={{ background: 'var(--bg-stone)', border: '1px solid var(--border)' }}>
          <span className="text-base leading-none mt-0.5">💡</span>
          <p className="text-sm leading-relaxed text-ink2">
            Produkmu adalah bagian dari ekosistem senilai{' '}
            <strong className="text-ink">Rp 1.413 triliun</strong>.
            Iklan yang tepat bisa membuka peluang ke{' '}
            <strong className="text-ink">24,3 juta</strong> tenaga kerja dan konsumennya.
          </p>
        </div>
      </div>

      {/* Expandable subsector detail */}
      {open && (
        <div className="border-t border-theme px-4 pt-4 pb-5 space-y-3"
             style={{ background: 'var(--bg-stone)', animation: 'fadeIn 0.2s ease' }}>

          <p className="text-sm font-display font-bold text-ink">
            Distribusi Subsektor Ekraf — produkmu masuk mana?
          </p>

          <div className="space-y-2.5">
            {CREATIVE_SUBSECTORS.map((sub, i) => {
              const cfg = subsectorConfig[sub.icon];
              return (
                <div key={i} className="rounded-xl overflow-hidden border border-theme bg-card">
                  {/* Row header */}
                  <div className="flex items-center gap-3 px-3 pt-3 pb-2">
                    {/* Icon badge */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ background: cfg.lightBg, color: cfg.color }}>
                      {cfg.icon}
                    </div>

                    {/* Name + workers */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-ink truncate">{sub.name}</span>
                        <span className="text-sm font-code font-bold flex-shrink-0"
                              style={{ color: cfg.color }}>
                          {sub.percentage}%
                        </span>
                      </div>
                      <span className="text-xs text-muted">{sub.workers}M tenaga kerja</span>
                    </div>
                  </div>

                  {/* Progress bar — full-width, accent colour */}
                  <div className="h-1.5 w-full" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                         style={{ width: `${sub.percentage}%`, background: cfg.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom insight */}
          <div className="rounded-xl p-3 text-xs leading-relaxed"
               style={{ background: 'var(--amber-light)', color: 'var(--text-ink2)' }}>
            <strong style={{ color: 'var(--amber-text)' }}>Insight Pariwara:</strong>{' '}
            Kuliner, Kriya & Fashion menguasai <strong>89,5%</strong> lapangan kerja ekraf.
            Audiens lokal paling mudah <em>connect</em> dengan produk dari subsektor ini —
            jadikan keaslian produk sebagai daya tarik utama iklanmu!
          </div>
        </div>
      )}
    </div>
  );
}
