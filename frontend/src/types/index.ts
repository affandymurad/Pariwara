export interface PhotoItem {
  id:   string;
  url:  string;
  name: string;
}

export interface PariwaraFormData {
  productName:         string;
  productDetail:       string;
  productUrls:         string[]; // link marketplace / website / WhatsApp (array)
  photos:              PhotoItem[];
  goal:                string; // tujuan promosi, opsional
  selectedMedia:       string[];
  selectedGenerations: string[];
  locations:           string[];
}

export interface RecommendedPlatform {
  name:        string;
  description: string;
  reasoning:   string;
  icon:        string;
}

export interface CopywritingStyle {
  title:   string;
  example: string;
  tips:    string;
}

export interface MarketplaceStrategy {
  title:       string;
  details:     string;
  actionItems: string[];
}

export interface AIRecommendation {
  recommendedPlatforms:  RecommendedPlatform[];
  copywritingStyles:     CopywritingStyle[];
  marketplaceStrategies: MarketplaceStrategy[];
  quickWins:             string[];
}

export interface AnalyzeAPIResponse {
  success:        boolean;
  recommendation: AIRecommendation;
  error?:         string;
}

export interface MediaCategory {
  id:          string;
  name:        string;
  description: string;
  icon:        string;
}

export interface TargetGeneration {
  id:          string;
  name:        string;
  span:        string;
  description: string;
  icon:        string;
}

export interface CreativeSubsector {
  name:       string;
  workers:    number;
  percentage: number;
  colorClass: string;
  icon:       string;
}

export interface PromoGoal {
  id:   string;
  name: string;
  icon: string;
}
