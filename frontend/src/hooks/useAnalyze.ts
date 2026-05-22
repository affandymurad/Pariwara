import { useState } from 'react';
import type { PariwaraFormData, AIRecommendation } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function analyze(formData: PariwaraFormData): Promise<AIRecommendation | null> {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName:         formData.productName,
          productDetail:       formData.productDetail,
          productUrl:          formData.productUrl,
          selectedMedia:       formData.selectedMedia,
          selectedGenerations: formData.selectedGenerations,
          locations:           formData.locations,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      return data.recommendation as AIRecommendation;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, error };
}
