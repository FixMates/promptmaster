import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../dist');
const promptsJsonPath = path.resolve(__dirname, '../src/data/prompts.json');

const defaultOrigin = process.env.SITE_ORIGIN || 'https://fixmates.github.io';
const basePath = `/${(process.env.VITE_BASE_PATH || '/promptmaster/').replace(/^\/+|\/+$/g, '')}/`;
const siteUrl = route => `${defaultOrigin}${basePath}${String(route || '').replace(/^\/+/, '')}`;

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const promptsRaw = fs.readFileSync(promptsJsonPath, 'utf-8');
const prompts = JSON.parse(promptsRaw);

const categories = [
  'fashion',
  'anime',
  'fantasy',
  'wallpapers',
  'cyberpunk',
  'architecture',
  'nature',
  'scifi',
];

const staticPages = [
  '',
  '/explore',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/copyright',
  '/advertising',
];

// 1. Generate Sitemap XML
const today = new Date().toISOString().slice(0, 10);
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Static routes
staticPages.forEach(p => {
  sitemap += `  <url>
    <loc>${siteUrl(p)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
});

// Category routes
categories.forEach(cat => {
  sitemap += `  <url>
    <loc>${siteUrl(`/categories/${cat}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
`;
});

// Prompt detail routes
prompts.filter(p => p.status === 'published').forEach(p => {
  const modDate = p.updatedAt ? p.updatedAt.slice(0, 10) : today;
  sitemap += `  <url>
    <loc>${siteUrl(`/p/${p.id}/`)}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;
});

sitemap += `</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf-8');
console.log('✓ Generated dist/sitemap.xml');

// 2. Pre-render Static HTML Shells for Prompt Detail Routes
const indexHtmlPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  prompts.forEach(p => {
    const promptDir = path.join(distDir, 'p', p.id);
    if (!fs.existsSync(promptDir)) {
      fs.mkdirSync(promptDir, { recursive: true });
    }

    const cleanTitle = p.title.replace(/"/g, '&quot;');
    const title = `${cleanTitle} Prompt #${p.id} | Prompt Master Gallery`;
    const desc = `Explore the AI-generated ${p.category} artwork titled &quot;${cleanTitle}&quot; and copy its complete generation prompt.`;
    const canonical = siteUrl(`/p/${p.id}/`);
    const img = p.image.startsWith('http')
      ? p.image
      : p.image.startsWith('data:')
        ? siteUrl('/images/og-cover.jpg')
        : new URL(p.image.replace(/^\/+/, ''), `${defaultOrigin}${basePath}`).href;

    let preRendered = indexHtml
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${desc}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${desc}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${img}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${desc}" />`)
      .replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${img}" />`);

    fs.writeFileSync(path.join(promptDir, 'index.html'), preRendered, 'utf-8');
  });

  console.log(`✓ Pre-rendered ${prompts.length} static HTML route shells in dist/p/*/index.html`);

  const homeUrl = siteUrl('');
  const homeImage = siteUrl('/images/og-cover.jpg');
  const basePage = indexHtml
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${homeUrl}" />`)
    .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${homeImage}" />`)
    .replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${homeImage}" />`);
  fs.writeFileSync(indexHtmlPath, basePage, 'utf-8');
  fs.writeFileSync(path.join(distDir, '404.html'), basePage, 'utf-8');
  const staticShellPaths = [
    ...staticPages.filter(Boolean),
    ...categories.map(category => `/categories/${category}`),
    '/admin',
  ];
  staticShellPaths.forEach(route => {
    const routeDir = path.join(distDir, route.replace(/^\/+/, ''));
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), basePage, 'utf-8');
  });
  console.log('✓ Wrote repository Pages fallback and home metadata');
}

// 3. Ensure _redirects exists in dist
const redirectsSrc = path.resolve(__dirname, '../public/_redirects');
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, path.join(distDir, '_redirects'));
  console.log('✓ Copied _redirects to dist/');
}

const robotsSrc = path.resolve(__dirname, '../public/robots.txt');
if (fs.existsSync(robotsSrc)) {
  const robots = fs.readFileSync(robotsSrc, 'utf-8')
    .replace(/Sitemap:.*$/m, `Sitemap: ${siteUrl('/sitemap.xml')}`);
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf-8');
}

console.log('Static post-build generation completed successfully.');
