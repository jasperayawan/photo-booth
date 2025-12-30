/**
 * API v1 - Filters Endpoint
 * Returns available filters and frames
 */

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, createRateLimitHeaders } from "@/lib/apiAuth";
import { filters, frames, getAvailableFilters, getAvailableFrames } from "@/data/filters";
import { TIERS } from "@/data/premium";

export async function GET(request: NextRequest) {
  // Validate API key
  const authHeader = request.headers.get("Authorization");
  const validation = validateApiKey(authHeader);

  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 401 }
    );
  }

  const tier = validation.key!.tier;
  const isPremium = tier === "pro" || tier === "business";

  // Get available filters/frames based on tier
  const availableFilters = getAvailableFilters(isPremium).map((f) => ({
    name: f.name,
    value: f.value,
    premium: f.premium || false,
    sponsored: !!f.sponsor,
  }));

  const availableFrames = getAvailableFrames(isPremium).map((f) => ({
    name: f.name,
    style: f.style,
    strokeColor: f.strokeColor,
    premium: f.premium || false,
    sponsored: !!f.sponsor,
  }));

  const response = NextResponse.json({
    success: true,
    tier,
    filters: availableFilters,
    frames: availableFrames,
    limits: {
      filters: TIERS[tier].maxFilters,
      frames: TIERS[tier].maxFrames,
    },
  });

  // Add rate limit headers
  const rateLimitHeaders = createRateLimitHeaders(validation.key!.key);
  Object.entries(rateLimitHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
