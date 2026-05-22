import { useState } from "react";
import type { PariwaraFormData, AIRecommendation } from "../types";

// In dev: netlify dev proxies /api/* → /.netlify/functions/*
// In prod: same path, Netlify handles routing via netlify.toml redirect
const ENDPOINT = (import.meta.env.VITE_API_URL ?? "") + "/api/analyze";

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState<string | null>(null);

  async function analyze(data: PariwaraFormData): Promise<AIRecommendation | null> {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(ENDPOINT, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName:         data.productName,
          productDetail:       data.productDetail,
          selectedMedia:       data.selectedMedia,
          selectedGenerations: data.selectedGenerations,
          locations:           data.locations,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }

      return json.recommendation as AIRecommendation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, error };
}
