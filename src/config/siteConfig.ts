export const siteConfig = {
  name: 'Prompt Master Gallery',
  shortName: 'Prompt Master',
  tagline: 'Discover the Prompt Behind the Image.',
  description: 'Explore AI-generated art, cinematic portraits, anime, fantasy worlds, and the prompts that bring them to life.',
  // Default origin for sitemap, canonical links, and social publishing packs.
  // Can be overridden via window.location.origin or environment variable
  defaultOrigin: 'https://promptmastergallery.pages.dev',
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
  const origin = getSiteOrigin();
  return `${origin}/p/${id}`;
}

export function getShareUrl(path: string): string {
  const origin = getSiteOrigin();
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}
