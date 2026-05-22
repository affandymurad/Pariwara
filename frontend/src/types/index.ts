// ─── Form Data ────────────────────────────────────────────────

export interface PhotoItem {
  id: string;
  url: string;
  name: string;
}

export interface PariwaraFormData {
  productName: string;
  productDetail: string; // merged: description + USP/kelebihan
  photos: PhotoItem[];
  selectedMedia: string[];
  selectedGenerations: string[];
  locations: string[];
}

// ─── API Response ─────────────────────────────────────────────

export interface RecommendedPlatform {
  name: string;
  description: string;
  reasoning: string;
  icon: string;
}

export interface CopywritingStyle {
  title: string;
  example: string;
  tips: string;
}

export interface MarketplaceStrategy {
  title: string;
  details: string;
  actionItems: string[];
}

export interface AIRecommendation {
  recommendedPlatforms: RecommendedPlatform[];
  copywritingStyles: CopywritingStyle[];
  marketplaceStrategies: MarketplaceStrategy[];
  quickWins: string[];
}

export interface AnalyzeAPIResponse {
  success: boolean;
  recommendation: AIRecommendation;
  error?: string;
}

// ─── Static data types ────────────────────────────────────────

export interface MediaCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface TargetGeneration {
  id: string;
  name: string;
  span: string;
  description: string;
  icon: string;
}

export interface CreativeSubsector {
  name: string;
  workers: number;
  percentage: number;
  colorClass: string;
  icon: string;
}
