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
      productUrls         = [],
      selectedMedia       = [],
      selectedGenerations = [],
      locations           = [],
    } = req.body;

    if (!productName?.trim()) {
      return res.status(400).json({ error: 'productName wajib diisi.' });
    }

    const detailTrunc = (productDetail?.trim() || '(tidak diisi)').slice(0, 500);
    const urlTxt      = productUrls.slice(0, 2).join(', ');

    const mediaTxt = selectedMedia.map(id => MEDIA_LABELS[id] ?? id).join(', ') || 'tidak dipilih';
    const genTxt   = selectedGenerations.map(id => GEN_LABELS[id] ?? id).join(', ') || 'tidak dipilih';
    const locTxt   = locations.slice(0, 5).join(', ') || 'tidak ditentukan';

    const prompt = `Konsultan iklan Ekraf Indonesia. Buat strategi iklan singkat dan actionable.

PRODUK: ${productName}
DETAIL: ${detailTrunc}${urlTxt ? `\nLINK: ${urlTxt}` : ''}
MEDIA: ${mediaTxt}
DEMOGRAFI: ${genTxt}
LOKASI/PLATFORM: ${locTxt}

Balas HANYA JSON valid, tanpa backtick, tanpa teks lain.

{"recommendedPlatforms":[{"name":"string(maks40kar)","description":"string(1kalimat)","reasoning":"string(1kalimat)","icon":"Flame|Laptop|Globe|Users|BookOpen|Tv|Smartphone"}],"copywritingStyles":[{"title":"string(maks50kar)","example":"string(teks iklan ${productName}, emoji, maks150kar${urlTxt ? `, CTA: ${urlTxt.split(',')[0].trim()}` : ''})","tips":"string(1tip)"}],"marketplaceStrategies":[{"title":"string(maks50kar)","details":"string(1-2kalimat, spesifik ${locTxt})","actionItems":["string","string"]}],"quickWins":["string","string","string"]}

KETENTUAN:
- recommendedPlatforms: maks 3 item
- copywritingStyles: maks 2 item (prioritas generasi utama)
- marketplaceStrategies: maks 2 item
- quickWins: tepat 3 item
- Bahasa Indonesia ringkas
- Sebutkan "${productName}" di contoh copywriting
- Jangan output apapun di luar JSON`;

    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2048,
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
