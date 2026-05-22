import type { Context } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";

interface AnalyzeBody {
  productName:          string;
  productDetail?:       string;
  productUrls?:         string[];
  selectedMedia?:       string[];
  selectedGenerations?: string[];
  locations?:           string[];
}

const MEDIA_LABELS: Record<string, string> = {
  socmed:      "Media Sosial (Instagram, TikTok, Facebook, WhatsApp)",
  digital_ads: "Iklan Digital & Web (Google Ads, SEO, Portal Berita)",
  print_media: "Media Cetak & Offline (Brosur, Billboard, Banner)",
  broadcast:   "Video & Penyiaran (YouTube, TikTok Video, TV, Radio)",
  community:   "Komunitas & Event Lokal (Bazaar, Influencer lokal, Word of Mouth)",
};

const GEN_LABELS: Record<string, string> = {
  gen_alpha: "Gen Alpha (lahir 2010+) — digital-native, konten video & gaming",
  gen_z:     "Gen Z (1997–2009) — autentisitas, TikTok/Instagram, FOMO-driven",
  gen_y:     "Milenial Gen Y (1981–1996) — riset online, storytelling, review-driven",
  gen_x:     "Gen X (1965–1980) — fungsionalitas, Facebook & WhatsApp, loyalitas merek",
  boomers:   "Baby Boomers (1946–1964) — layanan personal, teks jelas, Grup WA & FB",
};

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: Request, _ctx: Context) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: CORS });

  let body: AnalyzeBody;
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON body" }, { status: 400, headers: CORS }); }

  const {
    productName,
    productDetail,
    productUrls         = [],
    selectedMedia       = [],
    selectedGenerations = [],
    locations           = [],
  } = body;

  if (!productName?.trim()) return Response.json({ error: "productName wajib diisi." }, { status: 400, headers: CORS });

  const mediaTxt = selectedMedia.map(id => `  - ${MEDIA_LABELS[id] ?? id}`).join("\n") || "  - (tidak dipilih)";
  const genTxt   = selectedGenerations.map(id => `  - ${GEN_LABELS[id] ?? id}`).join("\n") || "  - (tidak dipilih)";
  const locTxt   = locations.join(", ") || "(tidak ditentukan)";
  const urlTxt   = productUrls.length ? productUrls.join(", ") : "(tidak disertakan)";
  const firstUrl = productUrls[0] ?? "";

  const prompt = `Kamu adalah konsultan periklanan senior spesialis Ekonomi Kreatif Indonesia (Ekraf).
Tugasmu: buat rekomendasi strategi iklan yang sangat spesifik, actionable, dan berbasis data.

---
PROFIL PRODUK:
- Nama Produk/Brand: ${productName}
- Deskripsi & Keunggulan: ${productDetail?.trim() || "(tidak diisi)"}
- Link Produk (marketplace/website/WA): ${urlTxt}

PARAMETER KAMPANYE:
- Saluran Media:
${mediaTxt}
- Target Demografi:
${genTxt}
- Area & Platform Pemasaran: ${locTxt}
---

INSTRUKSI OUTPUT:
Balas HANYA JSON valid, tanpa markdown backtick, tanpa teks lain di luar JSON.

{
  "recommendedPlatforms": [
    {
      "name": "string (maks 50 karakter)",
      "description": "string (1-2 kalimat, apa & kenapa cocok)",
      "reasoning": "string (alasan strategis berdasarkan demografi & media, 1 kalimat)",
      "icon": "string (salah satu: Flame|Laptop|Globe|Users|BookOpen|Tv|Smartphone)"
    }
  ],
  "copywritingStyles": [
    {
      "title": "string (nama gaya & target, maks 60 karakter)",
      "example": "string (contoh teks iklan NYATA untuk ${productName}, pakai emoji, langsung bisa dipakai${firstUrl ? `, sertakan link ${firstUrl} sebagai CTA` : ''})",
      "tips": "string (1-2 tip praktis)"
    }
  ],
  "marketplaceStrategies": [
    {
      "title": "string (judul strategi, maks 60 karakter)",
      "details": "string (penjelasan strategi yang spesifik untuk saluran terkait dari daftar: ${locTxt} — bisa marketplace, platform sosmed, kota, atau saluran lain, 2-3 kalimat)",
      "actionItems": ["string (aksi konkret 1)", "string (aksi konkret 2)", "string (aksi konkret 3)"]
    }
  ],
  "quickWins": [
    "string (aksi konkret yang bisa dilakukan hari ini atau minggu ini)"
  ]
}

KETENTUAN:
- recommendedPlatforms: 3-4 item sesuai media & generasi dipilih
- copywritingStyles: 1 gaya per generasi dipilih (maks 3)
- marketplaceStrategies: 2-3 strategi, masing-masing fokus pada satu saluran dari daftar (${locTxt})
- quickWins: tepat 3 item, sangat actionable
- Bahasa Indonesia natural, mudah dipahami UMKM
- Contoh copywriting HARUS sebut nama "${productName}" secara eksplisit
- Jika link produk tersedia, sertakan dalam contoh copywriting sebagai CTA
- Jangan output apapun di luar JSON`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 4096,
      messages:   [{ role: "user", content: prompt }],
    });

    const rawText = message.content.filter(b => b.type === "text").map(b => b.text).join("");
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    let recommendation;
    try {
      recommendation = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw length:", rawText.length, "| Preview:", rawText.slice(0, 400));
      return Response.json({ error: "AI menghasilkan format tidak valid. Coba lagi." }, { status: 500, headers: CORS });
    }

    return Response.json({ success: true, recommendation }, { headers: CORS });

  } catch (err: unknown) {
    const msg    = err instanceof Error ? err.message : "Server error";
    const status = (err as { status?: number })?.status ?? 500;
    console.error("Anthropic error:", msg);
    return Response.json({ error: msg }, { status, headers: CORS });
  }
}

export const config = { path: "/api/analyze" };
