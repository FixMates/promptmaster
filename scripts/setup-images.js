import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brainDir = 'C:\\Users\\Sundar\\.gemini\\antigravity-ide\\brain\\045780cc-0a29-4fc2-99b6-ffcb1e48a401';
const destDir = path.resolve(__dirname, '../public/images');
const thumbDir = path.join(destDir, 'thumbnails');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

const brainFiles = fs.readdirSync(brainDir);

const mapping = [
  { prefix: 'fashion_portrait', out: '01.jpg' },
  { prefix: 'anime_rooftop', out: '02.jpg' },
  { prefix: 'fantasy_guardian', out: '03.jpg' },
  { prefix: 'obsidian_dunes', out: '04.jpg' },
  { prefix: 'cyberpunk_samurai', out: '05.jpg' },
  { prefix: 'biophilic_architecture', out: '06.jpg' },
];

mapping.forEach(m => {
  const match = brainFiles.find(f => f.startsWith(m.prefix) && f.endsWith('.jpg'));
  if (match) {
    const src = path.join(brainDir, match);
    const dest = path.join(destDir, m.out);
    const thumbDest = path.join(thumbDir, m.out);
    fs.copyFileSync(src, dest);
    fs.copyFileSync(src, thumbDest);
    console.log(`Copied ${match} -> ${m.out}`);
  } else {
    console.warn(`No match found for ${m.prefix}`);
  }
});

// Create 04 as og-cover
const ogSrc = path.join(destDir, '04.jpg');
if (fs.existsSync(ogSrc)) {
  fs.copyFileSync(ogSrc, path.join(destDir, 'og-cover.jpg'));
  console.log('Copied og-cover.jpg');
}

console.log('Images setup completed successfully.');
