# Prompt Master Gallery 🎨
> **"Discover the Prompt Behind the Image."**

**Prompt Master Gallery** is an AI image gallery and publishing workspace. Built with React, TypeScript, Vite, and Tailwind CSS, it publishes high-fidelity AI-generated imagery paired with exact generation prompts, complete with unique permanent URLs (e.g. `/p/01`, `/p/02`), one-click copy actions, and social media publishing packs for Instagram Reels and Facebook.

---

## 🚀 Live Local Development

- **Local Development URL:** [http://localhost:5173/](http://localhost:5173/)
- **Separate Admin Studio:** [http://localhost:5173/admin](http://localhost:5173/admin) *(local demo passcode: `promptmaster`)*

---

The Featured Masterpieces section is a swipeable carousel. The Admin Studio lives at `/admin` in a separate full-screen interface, away from the public navigation and page shell. Uploaded images are resized before they are stored in the current browser.

**Publishing model:** This is a static site. Admin changes are saved in the browser that made them; they do not automatically update other visitors. Use **Admin Studio → Overview → Export JSON**, replace `src/data/prompts.json` with that export, then rebuild and deploy the site to publish catalogue edits. The local demo passcode is included in the client app and is only a convenience gate, not secure authentication. Do not treat it as protection for private data.

## 🛠 Technology Stack

- **Frontend Core:** React 18, TypeScript 5, Vite 5
- **Styling & Aesthetics:** Tailwind CSS v3 with obsidian dark theme palette (`#07080B`), glassmorphism, and micro-interactions
- **Routing:** React Router v6 with pre-rendered static route shells for zero-JS SEO
- **Typography:** Plus Jakarta Sans (UI) & JetBrains Mono (Prompts & Code)
- **Icons & Effects:** Lucide React, Canvas Confetti
- **Testing:** Vitest, Testing Library (React & DOM), JSDOM (26 Automated Tests Passing)
- **Monetization:** Adsterra Advertising Engine (Native Banners, Display Banners, Social Bar, Popunder safety guard)
- **Target Hosting:** Cloudflare Pages (Free-tier static delivery with `_redirects` SPA fallback)

---

## 📦 Local Installation & Running

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite (26 passing tests)
npm test

# 3. Start local development server
npm run dev
# -> Opens http://localhost:5173/

# 4. Create production build and static SEO generator
npm run build
# -> Generates optimized bundle in dist/
# -> Automatically builds dist/sitemap.xml
# -> Pre-renders static HTML route shells in dist/p/*/index.html
# -> Copies Cloudflare Pages _redirects

# 5. Preview production build locally
npm run preview
```

---

## 📂 Project Architecture

```
prompt-web/
├── public/
│   ├── _redirects                  # Cloudflare Pages SPA rewrite rule
│   ├── robots.txt                  # Search crawler directives + sitemap pointer
│   ├── logo-icon.svg               # SVG brand aperture icon
│   └── images/                     # Optimized artwork (01.jpg - 08.jpg)
│       └── thumbnails/             # Web thumbnails
├── scripts/
│   ├── setup-images.js             # Asset initialization utility
│   └── generate-static.js          # Pre-rendering & sitemap post-build script
├── src/
│   ├── config/
│   │   ├── siteConfig.ts           # Domain origin, brand metadata, canonical helpers
│   │   └── adsConfig.ts            # Adsterra placement settings & localStorage persistence
│   ├── data/
│   │   ├── categories.ts           # Fashion, Anime, Fantasy, Wallpapers, Cyberpunk, etc.
│   │   └── prompts.json            # Master content database (Single Source of Truth)
│   ├── types/
│   │   ├── prompt.ts               # PromptRecord schema & validation interfaces
│   │   └── ads.ts                  # Adsterra placement types & telemetry definitions
│   ├── utils/
│   │   ├── idGenerator.ts          # Permanent ID allocator (format: "01", duplicate prevention)
│   │   ├── csvParser.ts            # RFC 4180 CSV parser/serializer with row validation
│   │   ├── socialPackGenerator.ts  # Instagram Reels hooks, captions, hashtags & DM trigger generator
│   │   ├── storage.ts              # LocalStorage content repository & deleted ID retirement registry
│   │   └── analytics.ts            # Privacy-first event telemetry (views, copies, searches)
│   ├── components/
│   │   ├── layout/                 # Header, Footer, Layout wrapper
│   │   ├── gallery/                # PromptCard, GalleryGrid, FilterBar, ImageLightbox
│   │   ├── ads/                    # AdPlacement (zero-CLS reserved container)
│   │   ├── admin/                  # AdminGuard, OverviewTab, PromptTable, PromptEditorModal,
│   │   │                           # BulkImportModal, SocialPackModal, AdSettingsTab, AnalyticsTab
│   │   └── common/                 # Toast notifications, Breadcrumbs, SEOHead, SocialIcons
│   ├── pages/
│   │   ├── HomePage.tsx            # Hero showcase, categories, featured, latest stream
│   │   ├── ExplorePage.tsx         # Full gallery with instant search, category filters, sorting
│   │   ├── CategoryPage.tsx        # Dedicated category showcase (/categories/:slug)
│   │   ├── PromptDetailPage.tsx    # Individual prompt (/p/:id) with copy, share, related prompts
│   │   ├── AdminPage.tsx           # Publishing dashboard (/admin)
│   │   ├── LegalPages.tsx          # About, Contact, Privacy, Terms, Copyright DMCA, Advertising
│   │   └── NotFoundPage.tsx        # 404 page with navigation fallbacks
│   └── test/                       # 26 automated unit and integration tests
├── dist/                           # Generated production build
├── tailwind.config.js              # Custom dark obsidian palette
├── vite.config.ts                  # Vite + Vitest configuration
└── package.json
```

---

## 🏷️ Unique Permanent Prompt URLs (`/p/:id`)

Every published prompt receives a permanent identifier:
- `https://YOUR-DOMAIN/p/01/`
- `https://YOUR-DOMAIN/p/02/`
- `https://YOUR-DOMAIN/p/03/`

### ID Assignment Rules
1. **Two-Digit Minimum Formatting:** Small numbers are formatted as `01`, `02`, ... `10`, `100`.
2. **Permanent ID Preservation:** Editing an existing entry preserves its ID and creation timestamp.
3. **Never Reused on Deletion:** Deleted IDs are permanently retired in an internal reserved registry (`pm_deleted_reserved_ids_v1`) to prevent broken external links from resolving to mismatched content.
4. **Duplicate Prevention:** Bulk import and manual creation strictly prevent collisions against the database.
5. **Static Pre-Rendering:** During `npm run build`, `scripts/generate-static.js` creates a static directory shell for each ID (e.g. `dist/p/01/index.html`) with customized `<title>`, `<meta name="description">`, and `<meta property="og:image">` tags. This ensures social share unfurls on Instagram, WhatsApp, Facebook, and Twitter/X work instantly even before client JS loads.

---

## 📱 Instagram & Facebook Social Publishing Pack

For every prompt, the Admin Dashboard can generate a complete social media publishing package:

1. **Permanent URL:** Direct share link (e.g. `https://YOUR-DOMAIN/p/01/`). Every prompt has a unique, ID-based page URL; use the matching link in that prompt's Reel or promotion.
2. **Reel Cover Hook:** Clean hook text formatted for video overlay
3. **Instagram Caption:** Pre-written copy directing followers to bio and DMs
4. **Category Hashtags:** Curated tag lists (e.g. `#AIFashion`, `#MakotoShinkaiStyle`, `#MidjourneyAnime`)
5. **Suggested Pinned Comment:** Engagement prompt
6. **Comment Trigger Phrase:** Custom trigger keyword (e.g. `PROMPT01`)
7. **DM Automation Template:** Ready-to-use reply for ManyChat or Meta Messaging API
8. **Facebook Caption:** Concise post copy
9. **Alt Text:** Descriptive accessibility and SEO text

*Features individual copy buttons and a **Copy Full Pack** one-click button.*

---

## 💰 Adsterra Monetization Engine

### Implemented Ad Formats
- **Native Banner (In-Feed):** Restrained placement between gallery cards and on the homepage.
- **Display Banners (728x90):** Positioned safely below the prompt text on `/p/:id`.
- **Social Bar:** Configurable floating bottom bar.
- **Popunder (Guarded):** Strictly **disabled by default** to protect user retention from Instagram mobile traffic.

### Placement Safety Standards
- **Zero Layout Shift (CLS = 0):** All ad slots utilize dimension-reserved containers with background loading states.
- **Ad Blocker Resilience:** The website remains 100% functional and visually balanced if ads fail to load or are blocked.
- **Never Disguised:** Every ad is visibly marked with an `Advertisement` disclosure tag.
- **No Deceptive Click Walls:** Prompts are never gated behind surveys or mandatory ad clicks.
- **Placeholder Mode:** Default test mode simulates ad containers without executing untrusted external scripts until official publisher keys are entered.

### How to Configure Official Adsterra Codes
1. Log in to [Adsterra Publisher Dashboard](https://publishers.adsterra.com).
2. Add your website domain (e.g., `promptmastergallery.pages.dev`).
3. Generate ad units: **Native Banner**, **728x90 Banner**, and **Social Bar**.
4. Navigate to **Admin Dashboard -> Adsterra Monetization** (`/admin`).
5. Paste your official Script URLs and Slot Keys, then toggle **Placeholder Mode** to **OFF**.

---

## 📊 Analytics & Privacy-First Telemetry

The platform tracks genuine interaction metrics:
- Page views
- Prompt copies
- Share actions
- Gallery keyword searches
- Category views
- Ad impressions

> ⚠️ **Integrity Note:** This platform **never invents or fabricates fake visitor or revenue numbers**. Real ad revenue must be viewed directly in your official Adsterra Publisher Dashboard.

---

## 🚢 Cloudflare Pages Deployment Steps

1. Push this repository to **GitHub**.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
3. Click **Create Application** -> **Pages** -> **Connect to Git**.
4. Select your `prompt-web` repository.
5. In **Build Settings**, configure:
   - **Framework preset:** `None` or `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Click **Save and Deploy**.
7. Cloudflare Pages will build the site, generate the static route shells, configure the `_redirects` SPA rule, and deploy to a free `*.pages.dev` subdomain.

---

## 📄 License & Attribution

- Application code is licensed under the MIT License.
- AI art prompts are curated and provided free for personal and commercial generative art experimentation.
