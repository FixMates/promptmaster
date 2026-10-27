import { CategoryInfo } from '../types/prompt';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'fashion',
    name: 'Fashion & Portrait',
    slug: 'fashion',
    description: 'High-end haute couture, editorial studio portraits, hyper-realistic street style, and cinematic fashion photography.',
    gradient: 'from-pink-500/20 via-purple-500/20 to-indigo-500/20',
    iconName: 'Sparkles',
  },
  {
    id: 'anime',
    name: 'Anime & Manga',
    slug: 'anime',
    description: 'Vibrant Makoto Shinkai aesthetics, Studio Ghibli nostalgic watercolors, dynamic mecha, and modern cel-shaded character art.',
    gradient: 'from-amber-500/20 via-rose-500/20 to-purple-500/20',
    iconName: 'Palette',
  },
  {
    id: 'fantasy',
    name: 'Fantasy & Myth',
    slug: 'fantasy',
    description: 'Mythical dragons, glowing enchanted elven groves, ethereal spellcasters, and grand dark-fantasy architecture.',
    gradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    iconName: 'Wand2',
  },
  {
    id: 'wallpapers',
    name: '4K Wallpapers',
    slug: 'wallpapers',
    description: 'Ultra-wide minimalistic landscapes, abstract 3D geometry, neon grids, and OLED-perfect deep dark backgrounds.',
    gradient: 'from-blue-500/20 via-indigo-500/20 to-violet-500/20',
    iconName: 'Monitor',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk & Sci-Fi',
    slug: 'cyberpunk',
    description: 'Rain-slicked neo-Tokyo streets, holographic neon signage, bionic prosthetics, and sprawling orbital megastructures.',
    gradient: 'from-cyan-500/20 via-blue-500/20 to-fuchsia-500/20',
    iconName: 'Zap',
  },
  {
    id: 'architecture',
    name: 'Architecture & 3D',
    slug: 'architecture',
    description: 'Brutalist concrete monoliths, organic Zaha Hadid parametric pavilions, and hyper-detailed Octane 3D interior renders.',
    gradient: 'from-orange-500/20 via-amber-500/20 to-stone-500/20',
    iconName: 'Box',
  },
  {
    id: 'nature',
    name: 'Nature & Wildlife',
    slug: 'nature',
    description: 'Bioluminescent deep-sea flora, National Geographic macro insect photography, and moody alpine morning mists.',
    gradient: 'from-lime-500/20 via-emerald-500/20 to-teal-500/20',
    iconName: 'Compass',
  },
  {
    id: 'scifi',
    name: 'Cosmic & Space',
    slug: 'scifi',
    description: 'Interstellar nebulae, retro-futuristic Mars colonies, deep space probes, and alien planetary horizons.',
    gradient: 'from-violet-500/20 via-purple-500/20 to-indigo-500/20',
    iconName: 'Rocket',
  },
];

export function getCategoryById(id: string): CategoryInfo | undefined {
  const normalized = id.toLowerCase().trim();
  return CATEGORIES.find(c => c.id === normalized || c.slug === normalized);
}
