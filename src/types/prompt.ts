export type PromptCategory = 
  | 'fashion' 
  | 'anime' 
  | 'fantasy' 
  | 'wallpapers' 
  | 'cyberpunk' 
  | 'architecture' 
  | 'nature' 
  | 'scifi' 
  | string;

export interface PromptRecord {
  id: string; // e.g. "01", "02", "124"
  title: string;
  slug: string;
  prompt: string;
  image: string;
  thumbnail: string;
  category: PromptCategory;
  tags: string[];
  alt: string;
  status: 'published' | 'draft';
  featured: boolean;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
  source?: string;
  license?: string;
  creator?: string;
  model?: string;
  aspectRatio?: string;
}

export interface ValidationIssue {
  row?: number;
  id?: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  gradient: string;
  iconName: string;
}
