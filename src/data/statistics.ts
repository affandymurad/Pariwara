import type { MediaCategory, TargetGeneration, CreativeSubsector } from "../types";

export const NATIONAL_STATS_2024 = {
  totalWorkers:    24.3,
  gdpContribution: 1413,
  gdpPercentage:   7.8,
  year:            "2024",
  source:          "Kemenparekraf RI",
} as const;

export const CREATIVE_SUBSECTORS: CreativeSubsector[] = [
  { name: "Kuliner",  workers: 9.75, percentage: 40.1, icon: "Utensils", barColor: "var(--amber)"      },
  { name: "Kriya",    workers: 7.61, percentage: 31.3, icon: "Hammer",   barColor: "var(--text-muted)" },
  { name: "Fashion",  workers: 4.39, percentage: 18.1, icon: "Shirt",    barColor: "var(--sage)"       },
  { name: "Lainnya",  workers: 2.55, percentage: 10.5, icon: "Sparkles", barColor: "var(--text-ink2)"  },
];

export const MEDIA_CATEGORIES: MediaCategory[] = [
  { id: "socmed",      name: "Media Sosial",          description: "Instagram, TikTok, Facebook, WhatsApp Stories",              icon: "Smartphone" },
  { id: "digital_ads", name: "Iklan Digital & Web",   description: "Website, SEO, Google Ads, Portal Berita, Email Marketing",   icon: "Globe"      },
  { id: "print_media", name: "Media Cetak & Offline", description: "Brosur, Pamflet, Billboard, Banner, Majalah",                icon: "BookOpen"   },
  { id: "broadcast",   name: "Video & Penyiaran",     description: "YouTube, TikTok Video, TV, Radio, Podcast, Live Streaming",  icon: "Tv"         },
  { id: "community",   name: "Komunitas & Event",     description: "Bazaar lokal, Word of Mouth, Influencer RT/RW, Arisan",      icon: "Users"      },
];

export const TARGET_GENERATIONS: TargetGeneration[] = [
  { id: "gen_alpha", name: "Gen Alpha",    span: "Lahir 2010+", description: "Digital-native sejak lahir. Suka video pendek & gaming. Keputusan beli dipengaruhi orang tua.",             icon: "Gamepad2"       },
  { id: "gen_z",     name: "Gen Z",        span: "1997–2009",   description: "Cari produk di TikTok & Instagram. Peduli keaslian dan nilai sosial. Gampang terpancing FOMO.",              icon: "Flame"          },
  { id: "gen_y",     name: "Milenial (Y)", span: "1981–1996",   description: "Riset produk sebelum beli. Aktif di IG & FB. Suka storytelling emosional dan ulasan nyata.",                 icon: "Laptop"         },
  { id: "gen_x",     name: "Gen X",        span: "1965–1980",   description: "Utamakan fungsi & kualitas. Loyal terhadap merek yang dipercaya. Aktif di Facebook dan WhatsApp.",           icon: "Briefcase"      },
  { id: "boomers",   name: "Baby Boomers", span: "1946–1964",   description: "Suka layanan personal dan teks yang jelas. Beli berdasarkan kepercayaan. Aktif di Grup WA & Facebook.",      icon: "HeartHandshake" },
];

// ─── Preset groups untuk Step 4 ───────────────────────────────

export const LOCATION_PRESET_GROUPS = [
  {
    label: "Kota & Wilayah",
    presets: ["Jakarta", "Bandung", "Surabaya", "Medan", "Bali", "Yogyakarta", "Makassar", "Semarang"],
  },
  {
    label: "Marketplace",
    presets: ["Shopee", "Tokopedia", "Lazada", "Blibli", "TikTok Shop", "Zalora", "Bukalapak"],
  },
  {
    label: "Platform Sosial Media",
    presets: ["Instagram", "TikTok", "Facebook", "YouTube", "X (Twitter)", "LinkedIn", "Pinterest", "Threads", "WhatsApp"],
  },
  {
    label: "Saluran Lainnya",
    presets: ["Toko Fisik", "Bazaar Lokal", "Reseller / Agen", "Website Sendiri"],
  },
];

// Flat list tetap tersedia untuk kompatibilitas jika dibutuhkan
export const LOCATION_PRESETS = LOCATION_PRESET_GROUPS.flatMap(g => g.presets);
