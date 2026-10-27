export const siteConfig = {
  name: 'Prompt Master Gallery',
  shortName: 'Prompt Master',
  tagline: 'Discover the Prompt Behind the Image.',
  description: 'Explore AI-generated art, cinematic portraits, anime, fantasy worlds, and the prompts that bring them to life.',
  // Default origin for sitemap, canonical links, and social publishing packs.
  // Can be overridden via window.location.origin or environment variable
  defaultOrigin: 'https://fixmates.github.io',
  instagramHandle: '@promptmaster.ai',
  facebookHandle: 'PromptMasterAI',
  contactEmail: 'hello@promptmastergallery.com',
  version: '1.0.0',
};

export function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    // If running on localhost or custom domain, use current origin
    return window.location.origin;
  }
  return siteConfig.defaultOrigin;
}

export function getPromptUrl(id: string): string {
  return getShareUrl(`/p/${id}/`);
}

export function getShareUrl(path: string): string {
  const origin = getSiteOrigin();
  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${origin}${basePath}${path.replace(/^\/+/, '')}`;
}

export function getAssetUrl(path: string): string {
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const basePath = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${basePath}${path.replace(/^\/+/, '')}`;
}
