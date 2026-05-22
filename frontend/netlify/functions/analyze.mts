import type { Context } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";

// ─── Types ────────────────────────────────────────────────────
interface AnalyzeBody {
  productName:          string;
  productDetail?:       string;
  productUrls?:         string[];
  selectedMedia?:       string[];
  selectedGenerations?: string[];
  locations?:           string[];
}

// ─── Label maps ───────────────────────────────────────────────
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

// ─── CORS headers ─────────────────────────────────────────────
const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ─── Handler ──────────────────────────────────────────────────
export default async function handler(req: Request, _ctx: Context) {
  // Pre-flight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: CORS });
  }

  // Parse body
  let body: AnalyzeBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400, headers: CORS });
  }

  const {
    productName,
    productDetail,
    productUrls         = [],
    selectedMedia       = [],
    selectedGenerations = [],
    locations           = [],
  } = body;

  if (!productName?.trim()) {
    return Response.json({ error: "productName wajib diisi." }, { status: 400, headers: CORS });
  }

  // Truncate productDetail to keep prompt short → faster response, less token usage
  const detailTrunc = (productDetail?.trim() || "(tidak diisi)").slice(0, 500);
  const urlTxt      = productUrls.length ? productUrls.slice(0, 2).join(", ") : "";

  const mediaTxt = selectedMedia.map(id => MEDIA_LABELS[id] ?? id).join(", ") || "tidak dipilih";
  const genTxt   = selectedGenerations.map(id => GEN_LABELS[id] ?? id).join(", ") || "tidak dipilih";
  const locTxt   = locations.slice(0, 5).join(", ") || "tidak ditentukan";

  const prompt = `Konsultan iklan Ekraf Indonesia. Buat strategi iklan singkat dan actionable.

PRODUK: ${productName}
DETAIL: ${detailTrunc}${urlTxt ? `\nLINK: ${urlTxt}` : ""}
MEDIA: ${mediaTxt}
DEMOGRAFI: ${genTxt}
LOKASI/PLATFORM: ${locTxt}

Balas HANYA JSON valid, tanpa backtick, tanpa teks lain.

{"recommendedPlatforms":[{"name":"string(maks40kar)","description":"string(1kalimat)","reasoning":"string(1kalimat)","icon":"Flame|Laptop|Globe|Users|BookOpen|Tv|Smartphone"}],"copywritingStyles":[{"title":"string(maks50kar)","example":"string(teks iklan ${productName}, emoji, maks150kar${urlTxt ? `, CTA: ${urlTxt.split(",")[0].trim()}` : ""})","tips":"string(1tip)"}],"marketplaceStrategies":[{"title":"string(maks50kar)","details":"string(1-2kalimat, spesifik ${locTxt})","actionItems":["string","string"]}],"quickWins":["string","string","string"]}

KETENTUAN:
- recommendedPlatforms: maks 3 item
- copywritingStyles: maks 2 item (prioritas generasi utama)
- marketplaceStrategies: maks 2 item
- quickWins: tepat 3 item
- Bahasa Indonesia ringkas
- Sebutkan "${productName}" di contoh copywriting
- Jangan output apapun di luar JSON`;

  // Call Claude
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 2800,
      messages:   [{ role: "user", content: prompt }],
    });

    const rawText = message.content
      .filter(b => b.type === "text")
      .map(b => b.text)
      .join("");

    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    let recommendation;
    try {
      recommendation = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw length:", rawText.length, "| Preview:", rawText.slice(0, 400));
      return Response.json(
        { error: "AI menghasilkan format tidak valid. Coba lagi." },
        { status: 500, headers: CORS }
      );
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
