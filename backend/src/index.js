import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Label maps ───────────────────────────────────────────────
const MEDIA_LABELS = {
  socmed:      'Media Sosial (Instagram, TikTok, Facebook, WhatsApp)',
  digital_ads: 'Iklan Digital & Web (Google Ads, SEO, Portal Berita)',
  print_media: 'Media Cetak & Offline (Brosur, Billboard, Banner)',
  broadcast:   'Video & Penyiaran (YouTube, TikTok Video, TV, Radio)',
  community:   'Komunitas & Event Lokal (Bazaar, Influencer lokal, Word of Mouth)',
};

const GEN_LABELS = {
  gen_alpha: 'Gen Alpha (lahir 2010+) — digital-native, konten video & gaming',
  gen_z:     'Gen Z (1997–2009) — autentisitas, TikTok/Instagram, FOMO-driven',
  gen_y:     'Milenial Gen Y (1981–1996) — riset online, storytelling, review-driven',
  gen_x:     'Gen X (1965–1980) — fungsionalitas, Facebook & WhatsApp, loyalitas merek',
  boomers:   'Baby Boomers (1946–1964) — layanan personal, teks jelas, Grup WA & FB',
};

// ─── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

// ─── POST /api/analyze ────────────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  try {
    const {
      productName,
      productDetail,
      productUrl          = '',
      selectedMedia       = [],
      selectedGenerations = [],
      locations           = [],
    } = req.body;

    if (!productName?.trim()) {
      return res.status(400).json({ error: 'productName wajib diisi.' });
    }

    const mediaTxt = selectedMedia.map(id => `  - ${MEDIA_LABELS[id] ?? id}`).join('\n') || '  - (tidak dipilih)';
    const genTxt   = selectedGenerations.map(id => `  - ${GEN_LABELS[id] ?? id}`).join('\n') || '  - (tidak dipilih)';
    const locTxt   = locations.join(', ') || '(tidak ditentukan)';
    const urlLine  = productUrl?.trim()
      ? `- Link Produk (marketplace/website/WA): ${productUrl.trim()}\n  Analisis link ini: identifikasi platform penjualan, format CTA yang sesuai, dan optimalkan strategi berdasarkan saluran tersebut.`
      : '- Link Produk: (tidak diisi)';

    const prompt = `Kamu adalah konsultan periklanan senior spesialis Ekonomi Kreatif Indonesia (Ekraf).
Tugasmu: buat rekomendasi strategi iklan yang sangat spesifik, actionable, dan berbasis data.

---
PROFIL PRODUK:
- Nama Produk/Brand: ${productName}
- Deskripsi & Keunggulan: ${productDetail?.trim() || '(tidak diisi)'}
${urlLine}

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
      "description": "string (1-2 kalimat, apa & kenapa cocok — jika ada link produk, sebutkan relevansinya dengan platform tersebut)",
      "reasoning": "string (alasan strategis berdasarkan demografi & media, 1 kalimat)",
      "icon": "string (salah satu: Flame|Laptop|Globe|Users|BookOpen|Tv|Smartphone)"
    }
  ],
  "copywritingStyles": [
    {
      "title": "string (nama gaya & target, maks 60 karakter)",
      "example": "string (contoh teks iklan NYATA untuk ${productName}, pakai emoji, langsung bisa dipakai — jika ada link produk, sertakan CTA yang mengarahkan ke link tersebut)",
      "tips": "string (1-2 tip praktis)"
    }
  ],
  "marketplaceStrategies": [
    {
      "title": "string (judul strategi, maks 60 karakter)",
      "details": "string (penjelasan strategi yang spesifik untuk saluran terkait dari daftar: ${locTxt} — jika ada link produk, sebutkan cara mengoptimalkan listing/profil di saluran tersebut, 2-3 kalimat)",
      "actionItems": ["string (aksi konkret 1)", "string (aksi konkret 2)", "string (aksi konkret 3)"]
    }
  ],
  "quickWins": [
    "string (aksi konkret yang bisa dilakukan hari ini atau minggu ini — jika ada link produk, salah satu quick win harus terkait optimasi link tersebut)"
  ]
}

KETENTUAN:
- recommendedPlatforms: 3-4 item sesuai media & generasi dipilih
- copywritingStyles: 1 gaya per generasi dipilih (maks 3)
- marketplaceStrategies: 2-3 strategi, masing-masing fokus pada satu saluran dari daftar (${locTxt}) — bisa marketplace, platform sosmed, kota target, atau saluran offline
- quickWins: tepat 3 item, sangat actionable
- Bahasa Indonesia natural, mudah dipahami UMKM
- Contoh copywriting HARUS sebut nama "${productName}" secara eksplisit
- Jangan output apapun di luar JSON`;

    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 4096,
      messages:   [{ role: 'user', content: prompt }],
    });

    const rawText = message.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse failed. Raw length:', rawText.length, '| Preview:', rawText.slice(0, 400));
      return res.status(500).json({ error: 'AI menghasilkan format tidak valid. Silakan coba lagi.' });
    }

    res.json({ success: true, recommendation: parsed });

  } catch (err) {
    console.error('API error:', err?.message || err);
    const status = err?.status || 500;
    res.status(status).json({ error: err?.message || 'Terjadi kesalahan server.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅  Pariwara Backend running on http://localhost:${PORT}`);
});
