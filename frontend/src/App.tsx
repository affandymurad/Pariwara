import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import StatInfographics from './components/StatInfographics';
import PariwaraForm from './components/PariwaraForm';
import AnalysisResult from './components/AnalysisResult';
import type { PariwaraFormData } from './types';

export default function App() {
  const [formData, setFormData] = useState<PariwaraFormData | null>(null);

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

      <main className="max-w-md mx-auto px-4 py-5 pb-16 space-y-4">
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
              {/* Hero banner */}
              <div className="card p-4 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 right-0 h-[3px]"
                     style={{ background: 'linear-gradient(90deg, var(--sage), var(--amber), var(--text-muted))' }} />
                <h2 className="text-[15px] font-display font-bold text-ink mb-2">
                  Bingung iklan produkmu harus mulai dari mana? 🤔
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-ink2">Pariwara</strong> bantu kamu bikin strategi iklan yang tepat sasaran —
                  cocok untuk pelaku Ekraf Indonesia. Isi 4 langkah, langsung dapat panduan lengkap:{' '}
                  platform terbaik, cara nulis iklan, hingga strategi jualan di marketplace.
                </p>
              </div>

              <StatInfographics />
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

      <footer className="text-center text-[9px] font-code text-muted uppercase tracking-widest py-5">
        Pariwara oleh Affandy Murad © 2026 · All rights reserved
      </footer>
    </div>
  );
}
