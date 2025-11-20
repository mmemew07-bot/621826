export enum Platform {
  Facebook = 'facebook',
  Twitter = 'twitter',
  Instagram = 'instagram'
}

export enum Tone {
  Professional = 'Professional',
  Witty = 'Witty',
  Urgent = 'Urgent',
  Friendly = 'Friendly',
  Luxury = 'Luxury'
}

export interface GeneratedContent {
  text: string;
  imagePrompt: string;
}

export interface SocialPostsResponse {
  facebook: GeneratedContent;
  twitter: GeneratedContent;
  instagram: GeneratedContent;
}

export interface ImageData {
  url: string;
  loading: boolean;
  error?: string;
}

export interface PlatformResult {
  content: GeneratedContent | null;
  image: ImageData;
}

export interface AppState {
  facebook: PlatformResult;
  twitter: PlatformResult;
  instagram: PlatformResult;
}