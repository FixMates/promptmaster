import { PromptRecord } from '../types/prompt';
import { getPromptUrl, siteConfig } from '../config/siteConfig';

export interface SocialPublishingPack {
  promptId: string;
  promptUrl: string;
  reelCoverText: string;
  instagramCaption: string;
  hashtags: string[];
  pinnedComment: string;
  commentTrigger: string;
  dmResponse: string;
  facebookCaption: string;
  altText: string;
  fullPackText: string;
}

/**
 * Curated category-specific hashtag dictionaries for authentic AI art communities
 */
const CATEGORY_HASHTAGS: Record<string, string[]> = {
  fashion: [
    '#AIFashion',
    '#DigitalFashion',
    '#EditorialPortrait',
    '#CinematicPhotography',
    '#AIPhotography',
    '#PromptShare',
    '#HauteCoutureAI',
    '#FashionInspiration',
    '#PromptEngineering',
    '#AIGeneratedArt',
  ],
  anime: [
    '#AIAnime',
    '#AnimeArt',
    '#DigitalIllustration',
    '#MakotoShinkaiStyle',
    '#AnimeAesthetics',
    '#MidjourneyAnime',
    '#OtakuVibes',
    '#AnimePrompt',
    '#CelShading',
    '#MangaArt',
  ],
  fantasy: [
    '#FantasyArt',
    '#MythicalBeasts',
    '#DarkFantasy',
    '#ConceptArt',
    '#DigitalPainting',
    '#EnchantedForest',
    '#FantasyPrompt',
    '#WorldBuilding',
    '#EtherealArt',
    '#MagicRealism',
  ],
  wallpapers: [
    '#PhoneWallpaper',
    '#4KWallpaper',
    '#AmoledWallpaper',
    '#MinimalistWallpaper',
    '#DesktopWallpaper',
    '#AestheticWallpapers',
    '#LockscreenArt',
    '#WallpaperInspo',
    '#CleanAesthetic',
    '#VisualArt',
  ],
  cyberpunk: [
    '#CyberpunkAesthetic',
    '#SciFiArt',
    '#NeonNoir',
    '#BladeRunnerVibes',
    '#FuturisticCity',
    '#SynthwaveArt',
    '#CyberpunkCity',
    '#DystopianArt',
    '#TechNoir',
    '#CyberAesthetics',
  ],
  architecture: [
    '#AIArchitecture',
    '#ParametricDesign',
    '#ModernArchitecture',
    '#OctaneRender',
    '#3DVisualizer',
    '#ArchitecturalDesign',
    '#InteriorAesthetics',
    '#BrutalistArchitecture',
    '#DesignInspiration',
    '#ArchitecturalPrompt',
  ],
  nature: [
    '#NatureMacro',
    '#WildlifePhotography',
    '#BotanicalArt',
    '#NationalGeographicVibes',
    '#MacroPhotography',
    '#FloraAndFauna',
    '#EarthVisuals',
    '#NatureInspiration',
    '#WildEarth',
    '#Bioluminescence',
  ],
  scifi: [
    '#SpaceArt',
    '#CosmicWonder',
    '#DeepSpace',
    '#RetroFuturism',
    '#Interstellar',
    '#AstrophotographyAI',
    '#SciFiConcept',
    '#StarshipArt',
    '#CosmicVisuals',
    '#SpaceExploration',
  ],
};

const BASE_HASHTAGS = ['#PromptMaster', '#AIArtCommunity', '#PromptShare', '#CreativeAI'];

/**
 * Generate a complete publishing pack for Instagram Reels, Posts, and Facebook
 */
export function generateSocialPack(record: PromptRecord): SocialPublishingPack {
  const promptUrl = getPromptUrl(record.id);
  const triggerKeyword = `PROMPT${record.id}`;
  
  // Clean cover text for Reel video overlay
  const reelCoverText = `HOW TO CREATE THIS:\n"${record.title}"\nExact Prompt in Bio & DMs`;

  // Specific hashtags for this prompt category + base
  const catKey = record.category.toLowerCase();
  const categorySpecific = CATEGORY_HASHTAGS[catKey] || [
    '#AIArt',
    '#PromptDesign',
    '#GenerativeArt',
    '#DigitalCreator',
  ];
  const combinedHashtags = [...new Set([...categorySpecific, ...BASE_HASHTAGS])];
  const hashtagsString = combinedHashtags.join(' ');

  // Instagram Caption
  const instagramCaption = `✨ One image, one carefully crafted prompt.

Looking to recreate this visual style?

"${record.title}"
Category: ${record.category.toUpperCase()}
${record.model ? `Engine: ${record.model}` : ''}

🔗 Discover & copy the full prompt:
${promptUrl}

💬 Or comment "${triggerKeyword}" below and I'll send the direct link straight to your DMs!

Save this reel for your next creative session and follow ${siteConfig.instagramHandle} for daily master prompts.

${hashtagsString}`;

  // Suggested Pinned Comment
  const pinnedComment = `👇 Want this exact prompt? Comment "${triggerKeyword}" below to get the direct link in your DMs, or tap the link in bio! 🚀`;

  // Suggested DM Response for ManyChat / Meta Automation
  const dmResponse = `Hey! Here is the exact prompt and full resolution details for "${record.title}":\n\n👉 ${promptUrl}\n\nTap the link to copy the prompt with one click. Enjoy creating! ✨`;

  // Facebook Caption
  const facebookCaption = `🎨 Prompt of the Day: "${record.title}"

Looking for AI generation inspiration? Here is the exact prompt behind this image:
👉 ${promptUrl}

Free to explore and copy on Prompt Master Gallery!

${hashtagsString.slice(0, 5)}`;

  const altText = record.alt || `AI-generated ${record.category} artwork titled ${record.title}`;

  // Complete combined text pack
  const fullPackText = `=== SOCIAL PUBLISHING PACK: #${record.id} - ${record.title} ===
PERMANENT URL: ${promptUrl}

--- REEL COVER TEXT ---
${reelCoverText}

--- INSTAGRAM CAPTION ---
${instagramCaption}

--- SUGGESTED PINNED COMMENT ---
${pinnedComment}

--- COMMENT TRIGGER PHRASE ---
${triggerKeyword}

--- DM AUTOMATION TEMPLATE ---
${dmResponse}

--- FACEBOOK CAPTION ---
${facebookCaption}

--- ALT TEXT ---
${altText}
`;

  return {
    promptId: record.id,
    promptUrl,
    reelCoverText,
    instagramCaption,
    hashtags: combinedHashtags,
    pinnedComment,
    commentTrigger: triggerKeyword,
    dmResponse,
    facebookCaption,
    altText,
    fullPackText,
  };
}
