import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronUp, TrendingUp, Users, Database, Award, Utensils, Hammer, Shirt, Sparkles as SparklesIcon } from 'lucide-react';
import Header from './components/Header';
import PariwaraForm from './components/PariwaraForm';
import AnalysisResult from './components/AnalysisResult';
import type { PariwaraFormData } from './types';
import { NATIONAL_STATS_2024, CREATIVE_SUBSECTORS } from './data/statistics';

const subsectorConfig: Record<string, {
  icon: React.ReactNode;
  color: string;
  lightBg: string;
}> = {
  Utensils: { icon: <Utensils className="w-3.5 h-3.5" />, color: 'var(--amber)',     lightBg: 'var(--amber-light)' },
  Hammer:   { icon: <Hammer   className="w-3.5 h-3.5" />, color: 'var(--text-muted)', lightBg: 'var(--bg-stone)'   },
  Shirt:    { icon: <Shirt    className="w-3.5 h-3.5" />, color: 'var(--sage)',       lightBg: 'var(--sage-light)'  },
  Sparkles: { icon: <SparklesIcon className="w-3.5 h-3.5" />, color: 'var(--text-ink2)', lightBg: 'var(--bg-stone)' },
};

export default function App() {
  const [formData, setFormData]   = useState<PariwaraFormData | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);

  const handleSubmit = (data: PariwaraFormData) => {
    setFormData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setFormData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />

      <main className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-5 pb-16 space-y-4">
        <AnimatePresence mode="wait">
          {!formData ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              {/* ── Hero banner + collapsible Ekraf stats ── */}
              <div className="card relative overflow-hidden">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px]"
                     style={{ background: 'linear-gradient(90deg, var(--sage), var(--amber), var(--text-muted))' }} />

                {/* Always-visible hero content */}
                <div className="px-4 pt-5 pb-4 text-center">
                  <h2 className="text-lg font-display font-bold text-ink mb-2">
                    Bingung iklan produkmu harus mulai dari mana? 🤔
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    <strong className="text-ink2">Pariwara</strong> bantu kamu bikin strategi iklan yang tepat sasaran —
                    cocok untuk pelaku Ekraf Indonesia. Isi 4 langkah, langsung dapat panduan lengkap:{' '}
                    platform terbaik, cara nulis iklan, hingga strategi jualan di marketplace.
                  </p>

                  {/* Stats teaser row — always visible */}
                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div className="rounded-xl p-3 text-left relative overflow-hidden"
                         style={{ background: 'var(--sage-light)' }}>
                      <div className="absolute -right-2 -bottom-2 text-4xl opacity-15 select-none">👥</div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Users className="w-3 h-3" style={{ color: 'var(--sage)' }} />
                        <span className="text-xs font-code font-bold uppercase tracking-wider" style={{ color: 'var(--sage)' }}>Tenaga Kerja</span>
                      </div>
                      <div className="font-display font-bold leading-none" style={{ fontSize: '1.35rem', color: 'var(--sage-dark)' }}>
                        24,3<span className="text-xs font-sans ml-1" style={{ color: 'var(--sage)' }}>Juta</span>
                      </div>
                    </div>

                    <div className="rounded-xl p-3 text-left relative overflow-hidden"
                         style={{ background: 'var(--amber-light)' }}>
                      <div className="absolute -right-2 -bottom-2 text-4xl opacity-15 select-none">💰</div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Database className="w-3 h-3" style={{ color: 'var(--amber)' }} />
                        <span className="text-xs font-code font-bold uppercase tracking-wider" style={{ color: 'var(--amber)' }}>PDB Ekraf</span>
                      </div>
                      <div className="font-display font-bold leading-none mb-1" style={{ fontSize: '1rem', color: 'var(--amber)' }}>
                        Rp 1.413T
                      </div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                           style={{ background: 'var(--amber)', color: 'white' }}>
                        <Award className="w-2.5 h-2.5" />7,8% PDB
                      </div>
                    </div>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => setStatsOpen(v => !v)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full border border-theme transition-all hover:opacity-75"
                    style={{ color: 'var(--text-muted)', background: 'var(--bg-stone)' }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {statsOpen ? 'Sembunyikan data Ekraf' : 'Lihat data Ekraf 2024'}
                    {statsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Collapsible subsektor detail */}
                <AnimatePresence>
                  {statsOpen && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-theme space-y-3"
                           style={{ background: 'var(--bg-stone)' }}>
                        <p className="text-sm font-display font-bold text-ink pt-3">
                          Distribusi per Subsektor — produkmu masuk mana?
                        </p>

                        <div className="space-y-2">
                          {CREATIVE_SUBSECTORS.map((sub, i) => {
                            const cfg = subsectorConfig[sub.icon];
                            return (
                              <div key={i} className="rounded-xl overflow-hidden border border-theme bg-card">
                                <div className="flex items-center gap-3 px-3 pt-3 pb-2">
                                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                       style={{ background: cfg.lightBg, color: cfg.color }}>
                                    {cfg.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-sm font-bold text-ink truncate">{sub.name}</span>
                                      <span className="text-sm font-code font-bold flex-shrink-0"
                                            style={{ color: cfg.color }}>{sub.percentage}%</span>
                                    </div>
                                    <span className="text-xs text-muted">{sub.workers}M tenaga kerja</span>
                                  </div>
                                </div>
                                <div className="h-1.5 w-full" style={{ background: 'var(--border)' }}>
                                  <div className="h-full rounded-full transition-all duration-500"
                                       style={{ width: `${sub.percentage}%`, background: cfg.color }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="rounded-xl p-3 text-xs leading-relaxed"
                             style={{ background: 'var(--amber-light)', color: 'var(--text-ink2)' }}>
                          <strong style={{ color: 'var(--amber)' }}>Insight Pariwara:</strong>{' '}
                          Kuliner, Kriya & Fashion menguasai <strong>89,5%</strong> lapangan kerja ekraf.
                          Jadikan keaslian produk sebagai daya tarik utama iklanmu!
                        </div>

                        <p className="text-xs font-code text-muted text-center">
                          Sumber: {NATIONAL_STATS_2024.source} · {NATIONAL_STATS_2024.year}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <PariwaraForm onSubmit={handleSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <AnalysisResult formData={formData} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="text-center text-xs font-code text-muted uppercase tracking-widest py-5">
        Pariwara oleh Affandy Murad © 2026 · All rights reserved
      </footer>
    </div>
  );
}
