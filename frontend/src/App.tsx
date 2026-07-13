import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import Header from './components/Header';
import PariwaraForm from './components/PariwaraForm';
import AnalysisResult from './components/AnalysisResult';
import type { PariwaraFormData } from './types';

const WHATSAPP_CHECKLIST = `Yuk siapkan dulu sebelum isi Pariwara:

1️⃣ Nama usaha/brand kamu apa?
2️⃣ Produk ini apa & apa kelebihannya?
3️⃣ Tujuan promosi: nambah pelanggan / naikkan jualan / kenalin produk baru / habisin stok?
4️⃣ Target pembeli siapa (usia/kalangan)?
5️⃣ Jualan di mana (kota/marketplace)?

Catat jawabannya, nanti tinggal isi cepat di Pariwara! 🚀`;

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
              {/* ── Hero banner ── */}
              <div className="card relative overflow-hidden">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px]"
                     style={{ background: 'linear-gradient(90deg, var(--sage), var(--amber), var(--text-muted))' }} />

                {/* Always-visible hero content */}
                <div className="px-4 pt-5 pb-4 text-center">
                  <h2 className="text-lg font-display font-bold text-ink mb-2">
                    Bikin Iklan yang Menarik, Tanpa Bingung ✨
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    Cukup ceritakan usahamu. <strong className="text-ink2">Pariwara</strong> bantu susun
                    target pelanggan, ide promosi, caption, sampai media promosi yang paling cocok — dalam hitungan menit.
                  </p>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(WHATSAPP_CHECKLIST)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full border border-theme transition-all hover:opacity-75 mb-3"
                    style={{ color: 'var(--sage-text)', background: 'var(--sage-light)', borderColor: 'var(--sage-light)' }}
                  >
                    📋 Siapkan Jawaban Dulu via WhatsApp
                  </a>

                  {/* Insight Pariwara — always visible */}
                  <div className="rounded-xl p-3 text-left text-xs leading-relaxed"
                       style={{ background: 'var(--amber-light)', color: 'var(--text-ink2)' }}>
                    <strong style={{ color: 'var(--amber-text)' }}>Insight Pariwara:</strong>{' '}
                    Kuliner, Kriya & Fashion menguasai <strong>89,5%</strong> lapangan kerja ekraf.
                    Jadikan keaslian produk sebagai daya tarik utama iklanmu!
                  </div>
                </div>
              </div>

              {/* ── Contoh sukses: sebelum & sesudah ── */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-code font-bold uppercase tracking-wider text-muted">
                    Contoh Sebelum &amp; Sesudah
                  </p>
                  <span className="param-tag" style={{ background: 'var(--amber-light)', color: 'var(--amber-text)' }}>
                    🍲 Warung Bakso
                  </span>
                </div>

                {/* Sebelum */}
                <div className="rounded-xl p-3 border border-theme opacity-70" style={{ background: 'var(--bg-stone)' }}>
                  <p className="text-xs font-code font-bold uppercase tracking-wider text-muted mb-1">😐 Sebelum</p>
                  <p className="text-sm text-ink2 italic">"Beli bakso yuk"</p>
                </div>

                {/* Panah transisi */}
                <div className="flex justify-center -my-1 relative z-10">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center border-4"
                       style={{ background: 'var(--sage-btn)', color: 'white', borderColor: 'var(--bg-card)' }}>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Sesudah */}
                <div className="rounded-xl p-3 pt-4 border-l-4"
                     style={{ background: 'var(--sage-light)', borderLeftColor: 'var(--sage)' }}>
                  <p className="text-xs font-code font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--sage-text)' }}>
                    ✨ Sesudah pakai Pariwara
                  </p>
                  <p className="text-sm text-ink2 italic leading-relaxed">
                    "Cuaca dingin paling pas ditemani semangkuk bakso hangat. Datang hari ini, beli 2 gratis es teh! 🍜🔥"
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="param-tag" style={{ background: 'var(--bg-card)', color: 'var(--sage-text)' }}>❄️ Ada suasana</span>
                    <span className="param-tag" style={{ background: 'var(--bg-card)', color: 'var(--sage-text)' }}>🎁 Ada promo</span>
                    <span className="param-tag" style={{ background: 'var(--bg-card)', color: 'var(--sage-text)' }}>📣 Ada ajakan jelas</span>
                  </div>
                </div>

                <p className="text-xs text-muted text-center mt-3">
                  Hasil serupa bisa kamu dapat untuk usahamu sendiri — dalam hitungan menit.
                </p>
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
