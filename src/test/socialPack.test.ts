import { describe, it, expect } from 'vitest';
import { generateSocialPack } from '../utils/socialPackGenerator';
import { PromptRecord } from '../types/prompt';

describe('Social Publishing Pack Generator', () => {
  const mockPrompt: PromptRecord = {
    id: '01',
    title: 'Haute Couture Crystalline Coat',
    slug: 'haute-couture-crystalline-coat',
    prompt: 'High fashion editorial portrait, 8k, photorealistic --ar 4:3',
    image: '/images/01.jpg',
    thumbnail: '/images/thumbnails/01.jpg',
    category: 'fashion',
    tags: ['fashion', 'portrait'],
    alt: 'High fashion model in crystal coat',
    status: 'published',
    featured: true,
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-20T10:00:00.000Z',
    model: 'Midjourney v6.1',
  };

  it('generates permanent URL matching prompt ID', () => {
    const pack = generateSocialPack(mockPrompt);
    expect(pack.promptUrl).toContain('/p/01');
    expect(pack.promptId).toBe('01');
  });

  it('generates Instagram comment trigger word matching prompt ID', () => {
    const pack = generateSocialPack(mockPrompt);
    expect(pack.commentTrigger).toBe('PROMPT01');
    expect(pack.instagramCaption).toContain('PROMPT01');
    expect(pack.pinnedComment).toContain('PROMPT01');
  });

  it('generates DM automation template containing exact prompt URL', () => {
    const pack = generateSocialPack(mockPrompt);
    expect(pack.dmResponse).toContain(pack.promptUrl);
    expect(pack.dmResponse).toContain('Haute Couture Crystalline Coat');
  });

  it('generates category-specific hashtags for fashion', () => {
    const pack = generateSocialPack(mockPrompt);
    expect(pack.hashtags).toContain('#AIFashion');
    expect(pack.hashtags).toContain('#EditorialPortrait');
  });

  it('produces complete text pack for one-click copy', () => {
    const pack = generateSocialPack(mockPrompt);
    expect(pack.fullPackText).toContain('SOCIAL PUBLISHING PACK: #01');
    expect(pack.fullPackText).toContain(pack.promptUrl);
    expect(pack.fullPackText).toContain('REEL COVER TEXT');
    expect(pack.fullPackText).toContain('DM AUTOMATION TEMPLATE');
  });
});
