import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import PariwaraForm from './components/PariwaraForm';
import AnalysisResult from './components/AnalysisResult';
import StatInfographics from './components/StatInfographics';
import type { PariwaraFormData } from './types';

const WHATSAPP_CHECKLIST = `Yuk siapkan dulu sebelum isi Pariwara:

1️⃣ Nama usaha/brand kamu apa?
2️⃣ Produk ini apa & apa kelebihannya?
3️⃣ Tujuan promosi: nambah pelanggan / naikkan jualan / kenalin produk baru / habisin stok?
4️⃣ Target pembeli siapa (usia/kalangan)?
5️⃣ Jualan di mana (kota/marketplace)?

Catat jawabannya, nanti tinggal isi cepat di Pariwara! 🚀`;

type Screen = 'landing' | 'form' | 'result';

export default function App() {
  const [screen, setScreen]     = useState<Screen>('landing');
  const [formData, setFormData] = useState<PariwaraFormData | null>(null);

  const goTo = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStart  = () => goTo('form');
  const handleBack   = () => goTo('landing');
  const handleSubmit = (data: PariwaraFormData) => {
    setFormData(data);
    goTo('result');
  };
  const handleReset = () => {
    setFormData(null);
    goTo('landing');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header onLogoClick={handleReset} />

      <main className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-16 md:pb-24 space-y-4">
        <AnimatePresence mode="wait">

          {/* ═══ SCREEN 1 — Landing / marketing ═══ */}
          {screen === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="space-y-5 md:space-y-6"
            >
              {/* ── Hero banner ── */}
              <div className="card relative overflow-hidden">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px]"
                     style={{ background: 'linear-gradient(90deg, var(--sage), var(--amber), var(--text-muted))' }} />

                <div className="px-5 md:px-10 pt-8 md:pt-12 pb-6 md:pb-10 text-center">
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-display font-bold text-ink mb-3 md:mb-4 leading-tight">
                    Bikin Iklan yang Menarik, Tanpa Bingung ✨
                  </h2>
                  <p className="text-sm md:text-base text-muted leading-relaxed mb-5 md:mb-6 max-w-lg mx-auto">
                    Cukup ceritakan usahamu. <strong className="text-ink2">Pariwara</strong> bantu susun
                    target pelanggan, ide promosi, caption, sampai media promosi yang paling cocok — dalam hitungan menit.
                  </p>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(WHATSAPP_CHECKLIST)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm md:text-base font-semibold px-4 py-2 rounded-full border border-theme transition-all hover:opacity-75 mb-5 md:mb-6"
                    style={{ color: 'var(--sage-text)', background: 'var(--sage-light)', borderColor: 'var(--sage-light)' }}
                  >
                    📋 Siapkan Jawaban Dulu via WhatsApp
                  </a>

                  <div className="rounded-xl p-4 text-left text-xs md:text-sm leading-relaxed max-w-lg mx-auto"
                       style={{ background: 'var(--amber-light)', color: 'var(--text-ink2)' }}>
                    <strong style={{ color: 'var(--amber-text)' }}>Insight Pariwara:</strong>{' '}
                    Kuliner, Kriya & Fashion menguasai <strong>89,5%</strong> lapangan kerja ekraf.
                    Jadikan keaslian produk sebagai daya tarik utama iklanmu!
                  </div>
                </div>
              </div>

              {/* ── Contoh sukses: sebelum & sesudah ── */}
              <div className="card p-5 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs md:text-sm font-code font-bold uppercase tracking-wider text-muted">
                    Contoh Sebelum &amp; Sesudah
                  </p>
                  <span className="param-tag" style={{ background: 'var(--amber-light)', color: 'var(--amber-text)' }}>
                    🍲 Warung Bakso
                  </span>
                </div>

                {/* Sebelum */}
                <div className="rounded-xl p-4 border border-theme opacity-70" style={{ background: 'var(--bg-stone)' }}>
                  <p className="text-xs md:text-sm font-code font-bold uppercase tracking-wider text-muted mb-1.5">😐 Sebelum</p>
                  <p className="text-sm md:text-base text-ink2 italic">"Beli bakso yuk"</p>
                </div>

                {/* Panah transisi */}
                <div className="flex justify-center -my-1 relative z-10">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center border-4"
                       style={{ background: 'var(--sage-btn)', color: 'white', borderColor: 'var(--bg-card)' }}>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Sesudah */}
                <div className="rounded-xl p-4 pt-5 border-l-4 mt-1"
                     style={{ background: 'var(--sage-light)', borderLeftColor: 'var(--sage)' }}>
                  <p className="text-xs md:text-sm font-code font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--sage-text)' }}>
                    ✨ Sesudah pakai Pariwara
                  </p>
                  <p className="text-sm md:text-base text-ink2 italic leading-relaxed">
                    "Cuaca dingin paling pas ditemani semangkuk bakso hangat. Datang hari ini, beli 2 gratis es teh! 🍜🔥"
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="param-tag" style={{ background: 'var(--bg-card)', color: 'var(--sage-text)' }}>❄️ Ada suasana</span>
                    <span className="param-tag" style={{ background: 'var(--bg-card)', color: 'var(--sage-text)' }}>🎁 Ada promo</span>
                    <span className="param-tag" style={{ background: 'var(--bg-card)', color: 'var(--sage-text)' }}>📣 Ada ajakan jelas</span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-muted text-center mt-4">
                  Hasil serupa bisa kamu dapat untuk usahamu sendiri — dalam hitungan menit.
                </p>
              </div>

              {/* ── Data industri pendukung ── */}
              <StatInfographics />

              {/* ── CTA mulai ── */}
              <button type="button" onClick={handleStart} className="btn-primary w-full gap-1.5">
                Mulai Buat Iklan <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </motion.div>
          )}

          {/* ═══ SCREEN 2 — Form wizard ═══ */}
          {screen === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              <PariwaraForm onSubmit={handleSubmit} onBack={handleBack} />
            </motion.div>
          )}

          {/* ═══ SCREEN 3 — Hasil analisis ═══ */}
          {screen === 'result' && formData && (
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
