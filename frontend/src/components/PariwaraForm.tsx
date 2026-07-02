import React, { useState, useRef } from 'react';
import {
  Upload, X, Plus, ChevronRight, ChevronLeft, Sparkles, Check,
  Smartphone, Globe, BookOpen, Tv, Users,
  Gamepad2, Flame, Laptop, Briefcase, HeartHandshake, Link,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { PariwaraFormData } from '../types';
import { MEDIA_CATEGORIES, TARGET_GENERATIONS, LOCATION_PRESETS } from '../data/statistics';

const mediaIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone, Globe, BookOpen, Tv, Users,
};
const genIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Gamepad2, Flame, Laptop, Briefcase, HeartHandshake,
};

interface Props {
  onSubmit: (data: PariwaraFormData) => void;
}

const STEPS = [
  { id: 1, label: 'Produk'    },
  { id: 2, label: 'Media'     },
  { id: 3, label: 'Demografi' },
  { id: 4, label: 'Lokasi'    },
];

const EMPTY_FORM: PariwaraFormData = {
  productName:         '',
  productDetail:       '',
  productUrls:          [],
  photos:              [],
  selectedMedia:       [],
  selectedGenerations: [],
  locations:           [],
};

export default function PariwaraForm({ onSubmit }: Props) {
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState<PariwaraFormData>(EMPTY_FORM);
  const [linkInput, setLinkInput] = useState('');
  const [links, setLinks]         = useState<string[]>([]);
  const [chipInput, setChipInput] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // sync links[] → form.productUrl
  const syncLinks = (next: string[]) => {
    setLinks(next);
    setForm(p => ({ ...p, productUrl: next.join(', ') }));
  };

  const addLink = (val = linkInput.trim()) => {
    if (val && !links.includes(val)) {
      syncLinks([...links, val]);
      setLinkInput('');
    }
  };
  const removeLink = (val: string) => syncLinks(links.filter(x => x !== val));

  // ── Validation ───────────────────────────────────────────────
  const isStepValid = (s = step) => {
    if (s === 1) return form.productName.trim().length > 0;
    if (s === 2) return form.selectedMedia.length > 0;
    if (s === 3) return form.selectedGenerations.length > 0;
    if (s === 4) return form.locations.length > 0;
    return false;
  };

  const goNext = () => {
    if (!isStepValid()) return;
    if (step < 4) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else onSubmit(form);
  };
  const goBack = () => {
    if (step > 1) { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  // ── Photo handlers ───────────────────────────────────────────
  const handleFiles = (files: FileList) => {
    const newPhotos = Array.from(files).map(f => ({
      id:   Math.random().toString(36).substr(2, 8),
      url:  URL.createObjectURL(f),
      name: f.name,
    }));
    setForm(p => ({ ...p, photos: [...p.photos, ...newPhotos] }));
  };
  const removePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setForm(p => ({ ...p, photos: p.photos.filter(x => x.id !== id) }));
  };

  // ── Toggle helpers ───────────────────────────────────────────
  const toggle = (key: 'selectedMedia' | 'selectedGenerations', id: string) =>
    setForm(p => {
      const list = p[key];
      return { ...p, [key]: list.includes(id) ? list.filter(x => x !== id) : [...list, id] };
    });

  // ── Chip helpers ─────────────────────────────────────────────
  const addChip = (val = chipInput.trim()) => {
    if (val && !form.locations.includes(val)) {
      setForm(p => ({ ...p, locations: [...p.locations, val] }));
      setChipInput('');
    }
  };
  const removeChip = (val: string) =>
    setForm(p => ({ ...p, locations: p.locations.filter(x => x !== val) }));

  return (
    <div className="w-full">
      {/* ── Progress bar ── */}
      <div className="card mb-0 rounded-b-none border-b-0 px-4 pt-4 pb-3"
           style={{ background: 'var(--bg-stone)' }}>
        <div className="flex items-start justify-between mb-3 relative">
          <div className="absolute top-[13px] left-0 right-0 h-0.5"
               style={{ background: 'var(--border)', zIndex: 0 }} />
          {STEPS.map(s => {
            const done   = s.id < step;
            const active = s.id === step;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1 flex-1 relative z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  done   ? 'text-white border-transparent' :
                  active ? 'text-white shadow-lg border-transparent' :
                           'border-theme bg-card text-muted'
                }`} style={{
                  background: done ? 'var(--text-muted)' : active ? 'var(--sage)' : undefined,
                  boxShadow:  active ? '0 0 0 4px var(--sage-light)' : undefined,
                }}>
                  {done ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className={`text-xs font-code font-bold text-center uppercase tracking-wide ${active ? 'text-ink' : 'text-muted'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="card rounded-t-none px-4 pt-5 pb-5">
        <AnimatePresence mode="wait">

          {/* ═══ STEP 1 — Produk ═══ */}
          {step === 1 && (
            <motion.div key="s1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }} className="space-y-4">

              <div>
                <h3 className="text-base font-display font-bold text-ink">Detail Produk Kamu</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Ceritakan produkmu — semakin lengkap info yang kamu berikan, semakin tajam rekomendasi iklannya! 🎯
                </p>
              </div>

              {/* Product name */}
              <div>
                <label className="field-label">
                  Nama Produk / Brand <span style={{ color: 'var(--amber)' }}>*</span>
                </label>
                <input
                  className="text-field"
                  type="text"
                  placeholder="Contoh: Preset Foto Aesthetic, Gamis Az-Zahra..."
                  value={form.productName}
                  onChange={e => setForm(p => ({ ...p, productName: e.target.value }))}
                />
                <p className="text-xs text-muted mt-1">Nama brand, nama produk, atau keduanya.</p>
              </div>

              {/* Multi-link chip input */}
              <div>
                <label className="field-label">
                  Link Produk <span className="font-normal text-muted">(Opsional)</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                         style={{ color: 'var(--sage)' }}>
                      <Link className="w-3.5 h-3.5" />
                    </div>
                    <input
                      className="text-field w-full"
                      style={{ paddingLeft: '2rem' }}
                      type="url"
                      placeholder="https://shopee.co.id/... atau wa.me/628..."
                      value={linkInput}
                      onChange={e => setLinkInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } }}
                    />
                  </div>
                  <button type="button" onClick={() => addLink()}
                    className="w-11 flex items-center justify-center rounded-xl text-white flex-shrink-0 transition-all hover:opacity-80"
                    style={{ background: 'var(--text-ink2)' }}>
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl min-h-[48px] items-center border border-theme"
                     style={{ background: 'var(--bg-stone)' }}>
                  {links.length === 0 ? (
                    <span className="text-sm text-muted">Belum ada link. Tambahkan minimal 1 atau lewati.</span>
                  ) : links.map((url, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-theme max-w-full"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-ink)' }}>
                      <Link className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--sage)' }} />
                      <span className="truncate max-w-[180px]">{url}</span>
                      <button type="button" onClick={() => removeLink(url)}
                        className="text-muted hover:text-ink transition-colors flex-shrink-0">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Deskripsi + USP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="field-label" style={{ marginBottom: 0 }}>
                    Deskripsi & Kelebihan Produk <span className="font-normal text-muted">(Opsional tapi direkomendasikan)</span>
                  </label>
                  <span
                    className="text-xs font-code flex-shrink-0 ml-2"
                    style={{ color: form.productDetail.length >= 450 ? 'var(--amber)' : 'var(--text-muted)' }}
                  >
                    {form.productDetail.length}/500
                  </span>
                </div>
                <textarea
                  className="text-field"
                  rows={5}
                  maxLength={500}
                  placeholder={`Ceritakan:\n• Produk ini apa dan terbuat dari apa?\n• Apa yang bikin produkmu beda / unggul?\n• Harga kisaran berapa?\n• Siapa yang paling cocok beli produk ini?`}
                  value={form.productDetail}
                  onChange={e => setForm(p => ({ ...p, productDetail: e.target.value.slice(0, 500) }))}
                />
                <p className="text-xs text-muted mt-1">Maksimal 500 karakter agar analisis lebih cepat.</p>
              </div>

              {/* Photo upload */}
              <div>
                <label className="field-label">
                  Foto Produk <span className="font-normal text-muted">(Opsional)</span>
                </label>
                <div
                  className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors"
                  style={{ borderColor: dragActive ? 'var(--sage)' : 'var(--border)', background: dragActive ? 'var(--sage-light)' : undefined }}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
                >
                  <Upload className="w-5 h-5 mx-auto mb-1.5" style={{ color: 'var(--sage)' }} />
                  <p className="text-sm font-semibold text-ink2">Klik atau drag foto produk di sini</p>
                  <p className="text-xs text-muted mt-0.5">JPG, PNG, WEBP (maks. 5 foto)</p>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={e => { if (e.target.files) handleFiles(e.target.files); }} />
                </div>
                {form.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.photos.map(ph => (
                      <div key={ph.id} className="relative w-16 h-16 rounded-xl overflow-hidden border border-theme flex-shrink-0">
                        <img src={ph.url} alt={ph.name} className="w-full h-full object-cover" />
                        <button type="button" onClick={e => removePhoto(ph.id, e)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ background: 'rgba(0,0,0,0.55)' }}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 2 — Media ═══ */}
          {step === 2 && (
            <motion.div key="s2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }} className="space-y-4">
              <div>
                <h3 className="text-base font-display font-bold text-ink">Mau iklan di mana?</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Pilih saluran media yang akan kamu gunakan. Bisa lebih dari satu.
                </p>
              </div>
              <div className="space-y-2">
                {MEDIA_CATEGORIES.map(m => {
                  const Icon = mediaIcons[m.icon] || Globe;
                  const sel  = form.selectedMedia.includes(m.id);
                  return (
                    <button key={m.id} type="button" onClick={() => toggle('selectedMedia', m.id)}
                      className={`choice-card w-full text-left ${sel ? 'selected' : ''}`}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                           style={{ background: sel ? 'var(--sage)' : 'var(--bg-card)', color: sel ? 'white' : 'var(--text-muted)' }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-ink">{m.name}</div>
                        <div className="text-xs text-muted mt-0.5 leading-snug">{m.description}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${sel ? 'text-white' : 'border-theme bg-card'}`}
                           style={{ background: sel ? 'var(--sage)' : undefined, borderColor: sel ? 'var(--sage)' : undefined }}>
                        {sel && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 3 — Generasi ═══ */}
          {step === 3 && (
            <motion.div key="s3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }} className="space-y-4">
              <div>
                <h3 className="text-base font-display font-bold text-ink">Siapa target pembelimu?</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Pilih kelompok usia yang paling mungkin membeli produkmu. Bisa lebih dari satu.
                </p>
              </div>
              <div className="space-y-2">
                {TARGET_GENERATIONS.map(g => {
                  const Icon = genIcons[g.icon] || Flame;
                  const sel  = form.selectedGenerations.includes(g.id);
                  return (
                    <button key={g.id} type="button" onClick={() => toggle('selectedGenerations', g.id)}
                      className={`choice-card w-full text-left ${sel ? 'selected' : ''}`}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                           style={{ background: sel ? 'var(--sage)' : 'var(--bg-card)', color: sel ? 'white' : 'var(--text-muted)' }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-bold text-ink">{g.name}</span>
                          <span className="text-xs font-code px-1.5 py-0.5 rounded-md border border-theme"
                                style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                            {g.span}
                          </span>
                        </div>
                        <p className="text-xs text-muted leading-snug">{g.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${sel ? 'text-white' : 'border-theme bg-card'}`}
                           style={{ background: sel ? 'var(--sage)' : undefined, borderColor: sel ? 'var(--sage)' : undefined }}>
                        {sel && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 4 — Lokasi ═══ */}
          {step === 4 && (
            <motion.div key="s4"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }} className="space-y-4">
              <div>
                <h3 className="text-base font-display font-bold text-ink">Jualan di mana?</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Tambahkan kota, provinsi, atau marketplace. Strategi akan disesuaikan dengan area pilihanmu.
                </p>
              </div>
              <div>
                <label className="field-label">
                  Lokasi / Marketplace <span style={{ color: 'var(--amber)' }}>*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="text-field flex-1"
                    type="text"
                    placeholder="Contoh: Jakarta, Shopee, Toko Fisik..."
                    value={chipInput}
                    onChange={e => setChipInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChip(); } }}
                  />
                  <button type="button" onClick={() => addChip()}
                    className="w-11 flex items-center justify-center rounded-xl text-white flex-shrink-0 transition-all hover:opacity-80"
                    style={{ background: 'var(--text-ink2)' }}>
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl min-h-[48px] items-center mb-3 border border-theme"
                     style={{ background: 'var(--bg-stone)' }}>
                  {form.locations.length === 0 ? (
                    <span className="text-sm text-muted">Belum ada lokasi. Tambahkan minimal 1.</span>
                  ) : form.locations.map((loc, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-theme"
                          style={{ background: 'var(--bg-card)', color: 'var(--text-ink)' }}>
                      {loc}
                      <button type="button" onClick={() => removeChip(loc)} className="text-muted hover:text-ink transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs font-code font-bold text-muted uppercase tracking-wider mb-1.5">Pilihan Cepat:</p>
                <div className="flex flex-wrap gap-1.5">
                  {LOCATION_PRESETS.map(p => {
                    const added = form.locations.includes(p);
                    return (
                      <button key={p} type="button" disabled={added} onClick={() => addChip(p)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-all ${
                          added ? 'opacity-35 cursor-not-allowed' : 'hover:border-sage cursor-pointer'}`}
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: added ? 'var(--text-muted)' : 'var(--text-ink2)' }}>
                        {added ? `✓ ${p}` : `+ ${p}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Footer navigation ── */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-theme">
          <button type="button" onClick={goBack}
            className={`btn-secondary flex-none px-4 gap-1.5 ${step === 1 ? 'invisible pointer-events-none' : ''}`}
            style={{ width: 'auto' }}>
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          <button type="button" onClick={goNext} disabled={!isStepValid()} className="btn-primary flex-1 gap-1.5">
            {step === 4 ? (
              <><Sparkles className="w-4 h-4" /> Analisa Sekarang</>
            ) : (
              <>Lanjut <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
