import type { MediaCategory, TargetGeneration, CreativeSubsector } from '../types';

export const NATIONAL_STATS_2024 = {
  totalWorkers:    24.3,
  gdpContribution: 1413,
  gdpPercentage:   7.8,
  year:            '2024',
  source:          'Kemenparekraf RI',
} as const;

export const CREATIVE_SUBSECTORS: CreativeSubsector[] = [
  { name: 'Kuliner (Cuisine)',         workers: 9.75, percentage: 40.1, colorClass: 'bg-amber-400',   icon: 'Utensils'  },
  { name: 'Kriya (Crafts)',            workers: 7.61, percentage: 31.3, colorClass: 'bg-stone-400',   icon: 'Hammer'    },
  { name: 'Fashion (Busana)',          workers: 4.39, percentage: 18.1, colorClass: 'bg-sage-500',    icon: 'Shirt'     },
  { name: 'Lainnya (Seni, Musik, dll)',workers: 2.55, percentage: 10.5, colorClass: 'bg-ink-200',     icon: 'Sparkles'  },
];

export const MEDIA_CATEGORIES: MediaCategory[] = [
  { id: 'socmed',      name: 'Media Sosial',          description: 'Instagram, TikTok, Facebook, WhatsApp Stories',                icon: 'Smartphone' },
  { id: 'digital_ads', name: 'Iklan Digital & Web',   description: 'Website, SEO, Google Ads, Portal Berita, Email Marketing',    icon: 'Globe'      },
  { id: 'print_media', name: 'Media Cetak & Offline', description: 'Brosur, Pamflet, Billboard, Banner, Majalah',                 icon: 'BookOpen'   },
  { id: 'broadcast',   name: 'Video & Penyiaran',     description: 'YouTube, TikTok Video, TV, Radio, Podcast, Live Streaming',   icon: 'Tv'         },
  { id: 'community',   name: 'Komunitas & Event',     description: 'Bazaar lokal, Word of Mouth, Influencer RT/RW, Arisan',       icon: 'Users'      },
];

export const TARGET_GENERATIONS: TargetGeneration[] = [
  { id: 'gen_alpha', name: 'Gen Alpha',      span: 'Lahir 2010+',   description: 'Digital-native sejak lahir. Cinta video pendek, gaming, dan konten interaktif. Keputusan beli dipengaruhi orang tua.',           icon: 'Gamepad2'       },
  { id: 'gen_z',     name: 'Gen Z',          span: '1997–2009',     description: 'Cari produk di TikTok & Instagram. Sangat peduli keaslian (authenticity) dan nilai sosial. Gampang terpancing FOMO.',               icon: 'Flame'          },
  { id: 'gen_y',     name: 'Milenial (Y)',   span: '1981–1996',     description: 'Riset produk dulu sebelum beli. Aktif di IG & FB. Suka storytelling emosional dan ulasan nyata dari pengguna lain.',                icon: 'Laptop'         },
  { id: 'gen_x',     name: 'Gen X',          span: '1965–1980',     description: 'Utamakan fungsi dan kualitas. Loyal terhadap merek yang sudah dipercaya. Aktif di Facebook dan WhatsApp.',                          icon: 'Briefcase'      },
  { id: 'boomers',   name: 'Baby Boomers',   span: '1946–1964',     description: 'Suka layanan personal dan teks yang jelas & besar. Beli berdasarkan kepercayaan. Aktif di Grup WA dan Facebook.',                   icon: 'HeartHandshake' },
];

export const LOCATION_PRESETS = [
  'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Bali', 'Yogyakarta',
  'Shopee', 'Tokopedia', 'TikTok Shop', 'Lazada', 'Bazaar Lokal',
];
