/**
 * API Key Authentication
 * Validates API keys for B2B access
 */

import { API_CONFIG, TIERS, type TierType } from "@/data/premium";

export interface ApiKey {
  key: string;
  tier: TierType;
  customerId: string;
  createdAt: Date;
  expiresAt: Date | null;
  usageToday: number;
  lastUsed: Date | null;
}

// In production, this would be stored in a database
const API_KEYS: Map<string, ApiKey> = new Map([
  // Demo API key for testing
  [
    "demo-api-key-12345",
    {
      key: "demo-api-key-12345",
      tier: "business",
      customerId: "demo-customer",
      createdAt: new Date(),
      expiresAt: null,
      usageToday: 0,
      lastUsed: null,
    },
  ],
]);

/**
 * Validate an API key from request headers
 */
export function validateApiKey(
  authHeader: string | null
): { valid: boolean; key?: ApiKey; error?: string } {
  if (!authHeader) {
    return { valid: false, error: "Missing Authorization header" };
  }

  // Expect format: "Bearer <api-key>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return { valid: false, error: "Invalid Authorization header format" };
  }

  const apiKey = parts[1];
  const keyData = API_KEYS.get(apiKey);

  if (!keyData) {
    return { valid: false, error: "Invalid API key" };
  }

  // Check expiration
  if (keyData.expiresAt && keyData.expiresAt < new Date()) {
    return { valid: false, error: "API key expired" };
  }

  // Check rate limit
  const tierConfig = TIERS[keyData.tier];
  const rateLimit = API_CONFIG.rateLimit[keyData.tier];

  if (keyData.usageToday >= rateLimit) {
    return { valid: false, error: "Rate limit exceeded" };
  }

  // Check if tier has API access
  if (!tierConfig.apiAccess && keyData.tier !== "business") {
    return { valid: false, error: "API access not available for this tier" };
  }

  // Update usage
  keyData.usageToday++;
  keyData.lastUsed = new Date();

  return { valid: true, key: keyData };
}

/**
 * Get rate limit info for an API key
 */
export function getRateLimitInfo(apiKey: string): {
  limit: number;
  remaining: number;
  resetAt: Date;
} | null {
  const keyData = API_KEYS.get(apiKey);
  if (!keyData) return null;

  const limit = API_CONFIG.rateLimit[keyData.tier];
  const remaining = Math.max(0, limit - keyData.usageToday);

  // Reset at midnight UTC
  const resetAt = new Date();
  resetAt.setUTCHours(24, 0, 0, 0);

  return { limit, remaining, resetAt };
}

/**
 * Create API response headers with rate limit info
 */
export function createRateLimitHeaders(apiKey: string): Record<string, string> {
  const info = getRateLimitInfo(apiKey);
  if (!info) return {};

  return {
    "X-RateLimit-Limit": info.limit.toString(),
    "X-RateLimit-Remaining": info.remaining.toString(),
    "X-RateLimit-Reset": info.resetAt.toISOString(),
  };
}

/**
 * Generate a new API key (for admin use)
 */
export function generateApiKey(customerId: string, tier: TierType): string {
  const key = `pb_${tier}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

  API_KEYS.set(key, {
    key,
    tier,
    customerId,
    createdAt: new Date(),
    expiresAt: null,
    usageToday: 0,
    lastUsed: null,
  });

  return key;
}
