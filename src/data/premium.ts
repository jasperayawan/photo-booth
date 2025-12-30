/**
 * Premium/Monetization Configuration
 * Defines subscription tiers, watermark settings, and sponsored content
 */

// Subscription Tiers
export type TierType = "free" | "pro" | "business";

export interface TierConfig {
  name: string;
  price: number; // monthly price in USD
  watermark: boolean;
  maxFilters: number | "unlimited";
  maxFrames: number | "unlimited";
  dailyExports: number | "unlimited";
  apiAccess: boolean;
  embedAccess: boolean;
  whiteLabel: boolean;
  printDiscount: number; // percentage discount on prints
  features: string[];
}

export const TIERS: Record<TierType, TierConfig> = {
  free: {
    name: "Free",
    price: 0,
    watermark: true,
    maxFilters: 5,
    maxFrames: 3,
    dailyExports: 10,
    apiAccess: false,
    embedAccess: false,
    whiteLabel: false,
    printDiscount: 0,
    features: [
      "5 basic filters",
      "3 frame styles",
      "10 exports per day",
      "Watermarked photos",
    ],
  },
  pro: {
    name: "Pro",
    price: 9.99,
    watermark: false,
    maxFilters: "unlimited",
    maxFrames: "unlimited",
    dailyExports: "unlimited",
    apiAccess: false,
    embedAccess: true,
    whiteLabel: false,
    printDiscount: 10,
    features: [
      "All filters & frames",
      "No watermark",
      "Unlimited exports",
      "Embed widget",
      "10% print discount",
      "Priority support",
    ],
  },
  business: {
    name: "Business",
    price: 29.99,
    watermark: false,
    maxFilters: "unlimited",
    maxFrames: "unlimited",
    dailyExports: "unlimited",
    apiAccess: true,
    embedAccess: true,
    whiteLabel: true,
    printDiscount: 20,
    features: [
      "Everything in Pro",
      "API access",
      "White-label branding",
      "Custom filters & frames",
      "20% print discount",
      "Dedicated support",
    ],
  },
};

// Watermark Configuration
export const WATERMARK_CONFIG = {
  text: "photobooth.app",
  font: "11px Arial, sans-serif",
  color: "rgba(255, 255, 255, 0.6)",
  shadowColor: "rgba(0, 0, 0, 0.3)",
  position: "bottom-right" as const,
  padding: 8,
};

// Sponsor Configuration
export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  link: string;
  message?: string;
  active: boolean;
}

export interface SponsoredFilter {
  name: string;
  value: string;
  intensity: number;
  color: string;
  sponsor: Sponsor;
}

export interface SponsoredFrame {
  name: string;
  style: string;
  strokeColor: string;
  sponsor: Sponsor;
}

// Example Sponsored Content (replace with real sponsors)
export const SPONSORS: Sponsor[] = [
  {
    id: "demo-sponsor",
    name: "Your Brand Here",
    logo: "/sponsors/placeholder.png",
    link: "https://example.com",
    message: "Sponsored by Your Brand",
    active: false, // Set to true when you have real sponsors
  },
];

export const SPONSORED_FILTERS: SponsoredFilter[] = [
  // Add sponsored filters here when you have sponsors
  // {
  //   name: "Brand Glow",
  //   value: "brightness(110%) saturate(120%)",
  //   intensity: 1,
  //   color: "bg-brand-500",
  //   sponsor: SPONSORS[0],
  // },
];

export const SPONSORED_FRAMES: SponsoredFrame[] = [
  // Add sponsored frames here when you have sponsors
  // {
  //   name: "Brand Frame",
  //   style: "border-4 border-brand-500",
  //   strokeColor: "#FF0000",
  //   sponsor: SPONSORS[0],
  // },
];

// Download Banner Configuration
export interface BannerConfig {
  enabled: boolean;
  sponsor: Sponsor | null;
  fallbackMessage: string;
}

export const BANNER_CONFIG: BannerConfig = {
  enabled: true,
  sponsor: null, // Set to a sponsor when you have one
  fallbackMessage: "Love this app? Support us!",
};

// Print Products Configuration (for Printful)
export interface PrintProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  sizes: PrintSize[];
  category: "prints" | "canvas" | "merchandise";
}

export interface PrintSize {
  id: string;
  label: string;
  dimensions: string;
  price: number;
  printfulVariantId: number; // Printful product variant ID
}

export const PRINT_PRODUCTS: PrintProduct[] = [
  {
    id: "photo-print",
    name: "Photo Print",
    description: "High-quality glossy photo print",
    basePrice: 4.99,
    category: "prints",
    sizes: [
      { id: "4x6", label: "4x6", dimensions: "4\" x 6\"", price: 4.99, printfulVariantId: 1 },
      { id: "5x7", label: "5x7", dimensions: "5\" x 7\"", price: 7.99, printfulVariantId: 2 },
      { id: "8x10", label: "8x10", dimensions: "8\" x 10\"", price: 12.99, printfulVariantId: 3 },
    ],
  },
  {
    id: "canvas-print",
    name: "Canvas Print",
    description: "Gallery-wrapped canvas print",
    basePrice: 24.99,
    category: "canvas",
    sizes: [
      { id: "8x8", label: "8x8", dimensions: "8\" x 8\"", price: 24.99, printfulVariantId: 10 },
      { id: "12x12", label: "12x12", dimensions: "12\" x 12\"", price: 34.99, printfulVariantId: 11 },
      { id: "16x16", label: "16x16", dimensions: "16\" x 16\"", price: 49.99, printfulVariantId: 12 },
    ],
  },
  {
    id: "photo-magnet",
    name: "Photo Magnet",
    description: "Fridge magnet with your photo",
    basePrice: 6.99,
    category: "merchandise",
    sizes: [
      { id: "3x3", label: "3x3", dimensions: "3\" x 3\"", price: 6.99, printfulVariantId: 20 },
      { id: "4x4", label: "4x4", dimensions: "4\" x 4\"", price: 8.99, printfulVariantId: 21 },
    ],
  },
];

// API Configuration
export const API_CONFIG = {
  version: "v1",
  rateLimit: {
    free: 100, // requests per day
    pro: 1000,
    business: 10000,
  },
  endpoints: {
    filters: "/api/v1/filters",
    export: "/api/v1/export",
    collage: "/api/v1/collage",
  },
};

// Version
export const APP_VERSION = "2.1.2";
