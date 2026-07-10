import { useState } from 'react';
import type { PariwaraFormData, AIRecommendation } from '../types';

// Lokal: VITE_API_URL=http://localhost:3001 → fetch ke Express
// Netlify: VITE_API_URL tidak di-set → path relatif → Netlify Function
const API_BASE = import.meta.env.VITE_API_URL ?? '';

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState<string | null>(null);

  async function analyze(formData: PariwaraFormData, signal?: AbortSignal): Promise<AIRecommendation | null> {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          productName:         formData.productName,
          productDetail:       formData.productDetail,
          productUrls:         formData.productUrls,
          selectedMedia:       formData.selectedMedia,
          selectedGenerations: formData.selectedGenerations,
          locations:           formData.locations,
        }),
      });

      // Guard: kalau response bukan JSON (misal HTML 404 dari Netlify),
      // tangkap di sini sebelum .json() throw error yang membingungkan
      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error(`non-json response, status ${res.status}`);
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      return data.recommendation as AIRecommendation;
    } catch (err) {
      // Dibatalkan pengguna sendiri (tombol Batal) — bukan kegagalan, jangan tampilkan error.
      if (err instanceof DOMException && err.name === 'AbortError') {
        return null;
      }
      // Detail teknis hanya untuk console — pengguna cukup lihat pesan yang ramah.
      console.error('[Pariwara] Gagal menganalisis:', err);
      setError('Analisis gagal diproses. Coba lagi dalam beberapa saat, ya — kalau masih gagal, cek koneksi internet kamu.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, error };
}
