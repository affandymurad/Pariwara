# Pariwara — Panduan Lengkap Setup & Deploy

Proyek ini terdiri dari **2 folder terpisah** dengan strategi berbeda per environment:

| Environment | Frontend | Backend |
|---|---|---|
| **Lokal (dev)** | `vite dev` di port 5173 | Express di `backend/` port 3001 |
| **Produksi (Netlify)** | Static build (`dist/`) | Netlify Function di `netlify/functions/` |

Cara kerjanya: frontend membaca `VITE_API_URL` dari `.env`. Kalau ada → kirim ke Express lokal. Kalau tidak ada (seperti di Netlify) → fallback ke path relatif `/api/analyze` → ditangani Netlify Function otomatis.

---

## Struktur Proyek

```
pariwara/
├── backend/                        ← Express server (lokal saja)
│   ├── src/
│   │   └── index.js
│   ├── .env                        ← buat manual, JANGAN di-push ke GitHub
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/                       ← React + TypeScript (lokal & produksi)
│   ├── netlify/
│   │   └── functions/
│   │       └── analyze.mts         ← Backend produksi (Netlify Function)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── StatInfographics.tsx
│   │   │   ├── PariwaraForm.tsx
│   │   │   └── AnalysisResult.tsx
│   │   ├── data/statistics.ts
│   │   ├── hooks/useAnalyze.ts
│   │   ├── types/index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── netlify.toml
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── .env                        ← buat manual, JANGAN di-push ke GitHub
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

---

## LANGKAH 1 — Setup Backend (Express Lokal)

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

> Dapatkan API key di: https://console.anthropic.com/
> Jangan gunakan tanda kutip dan pastikan tidak ada spasi di sekitar `=`.

Jalankan backend:

```bash
node src/index.js
```

Verifikasi backend jalan:

```bash
curl http://localhost:3001/health
# Harus balas: {"status":"ok"}
```

---

## LANGKAH 2 — Setup Frontend (Lokal)

Buka terminal baru:

```bash
cd frontend
npm install
```

Buat file `.env` di folder `frontend/`:

```
VITE_API_URL=http://localhost:3001
```

Jalankan frontend:

```bash
npm run dev
```

Buka browser: **http://localhost:5173**

Pastikan backend dari Langkah 1 masih berjalan di terminal satunya.

---

## LANGKAH 3 — Push ke GitHub

Buat **satu repository** bernama `pariwara` di GitHub, lalu push seluruh folder:

```bash
# dari root folder pariwara/
git init
git add .
git commit -m "feat: Pariwara v2"

git remote add origin https://github.com/USERNAME/pariwara.git
git branch -M main
git push -u origin main
```

File `.env` di kedua folder sudah tercantum di `.gitignore` masing-masing — tidak akan ikut ter-push.

---

## LANGKAH 4 — Deploy Frontend ke Netlify

### Install Netlify CLI (sekali saja, global)

```bash
npm install -g netlify-cli
```

> Netlify CLI diinstall **global**, bukan sebagai dependency project, untuk menghindari konflik di Windows.

### Opsi A — Via Netlify Dashboard

1. Buka **https://app.netlify.com** → login
2. Klik **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub** → authorize → pilih repo **pariwara**
4. Atur konfigurasi build:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Functions directory**: `frontend/netlify/functions`
5. Klik **"Show advanced"** → **"New variable"** → tambahkan:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
   ```
   > Jangan tambahkan `VITE_API_URL` di Netlify — biarkan kosong agar frontend otomatis menggunakan Netlify Function.
6. Klik **"Deploy site"** → tunggu ~2–3 menit → site live!

### Opsi B — Via Netlify CLI

```bash
# dari folder frontend/
netlify login
netlify init

netlify env:set ANTHROPIC_API_KEY "sk-ant-xxxxxxxxxxxxxxxx"

netlify deploy --build           # preview dulu
netlify deploy --build --prod    # deploy ke produksi
```

---

## LANGKAH 5 — Verifikasi Deploy

Setelah deploy, test Netlify Function berjalan:

```bash
# Ganti URL dengan URL Netlify kamu
curl -X POST https://pariwara.netlify.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"productName":"Test","selectedMedia":["socmed"],"selectedGenerations":["gen_z"],"locations":["Jakarta"]}'
```

Harus balas JSON dengan `"success": true`.

---

## LANGKAH 6 — Custom Domain (Opsional)

1. Netlify Dashboard → Site configuration → Domain management
2. Klik **"Add custom domain"** → masukkan domain (contoh: `pariwara.id`)
3. Update DNS di registrar:
   - CNAME record: `www` → `pariwara.netlify.app`
   - Atau ikuti instruksi nameserver Netlify untuk apex domain
4. SSL otomatis di-generate oleh Netlify (Let's Encrypt) — gratis
5. Tunggu propagasi DNS 5–30 menit

---

## Checklist

### Lokal
- [ ] `backend/.env` sudah dibuat dengan `ANTHROPIC_API_KEY`
- [ ] `node src/index.js` di folder `backend/` jalan tanpa error
- [ ] `curl http://localhost:3001/health` balas `{"status":"ok"}`
- [ ] `frontend/.env` sudah dibuat dengan `VITE_API_URL=http://localhost:3001`
- [ ] `npm run dev` di folder `frontend/` jalan di `localhost:5173`
- [ ] Form bisa diisi dan analisis berhasil di browser

### Produksi
- [ ] Kode sudah di-push ke GitHub
- [ ] Site deploy di Netlify dengan base directory `frontend`
- [ ] `ANTHROPIC_API_KEY` sudah diset di Netlify environment variables
- [ ] `VITE_API_URL` **tidak** diset di Netlify
- [ ] Test produksi: buka URL Netlify, isi form, analisis berhasil ✅

---

## Troubleshooting

### Error: `ANTHROPIC_API_KEY` tidak terbaca (lokal)
→ Pastikan file `.env` ada di folder `backend/`, bukan di root atau `frontend/`
→ Pastikan format benar: `ANTHROPIC_API_KEY=sk-ant-xxx` tanpa spasi dan tanpa tanda kutip
→ Restart `node src/index.js` setelah buat atau edit `.env`

Verifikasi cepat dari folder `backend/`:
```bash
node -e "import('dotenv/config').then(()=>console.log(process.env.ANTHROPIC_API_KEY?.slice(0,12)))"
# Harus print: sk-ant-api03
```

### Error: `ANTHROPIC_API_KEY` tidak terbaca (Netlify)
→ Netlify Dashboard → Site configuration → Environment variables
→ Pastikan key sudah ditambahkan dan di-redeploy setelahnya

### npm install gagal di Windows (netlify-cli)
→ Jangan install `netlify-cli` sebagai dependency project
→ Install global saja: `npm install -g netlify-cli`

### Function timeout di Netlify
→ Netlify Functions free tier timeout 10 detik
→ Claude Sonnet 4.6 biasanya selesai 3–8 detik, tapi bisa lebih lama saat traffic tinggi
→ Solusi: upgrade ke Netlify Pro (timeout 26 detik)

### 404 di `/api/analyze` saat produksi
→ Pastikan `netlify.toml` di folder `frontend/` berisi redirect:
```toml
[[redirects]]
  from   = "/api/*"
  to     = "/.netlify/functions/:splat"
  status = 200
```

### CORS error di browser
→ Netlify Function sudah include header `Access-Control-Allow-Origin: *`
→ Pastikan `useAnalyze.ts` menggunakan path relatif, bukan URL absolut saat di produksi

---

## Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3 + CSS Variables (dark mode otomatis) |
| Animasi | Motion (Framer Motion) |
| PDF Export | jsPDF |
| Backend lokal | Express.js (Node.js) |
| Backend produksi | Netlify Functions (TypeScript `.mts`) |
| AI Engine | Anthropic Claude Sonnet 4.6 |
| Hosting | Netlify (gratis) |

---

*Pariwara oleh Affandy Murad — https://affandymurad.github.io/*
