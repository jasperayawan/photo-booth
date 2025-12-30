/**
 * API v1 - Export Endpoint
 * Generate photos with filters applied
 */

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, createRateLimitHeaders } from "@/lib/apiAuth";
import { filters, frames } from "@/data/filters";

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();

    const {
      image, // Base64 image data
      filter: filterName = "None",
      frame: frameName = "None",
      text = null,
      mirror = true,
    } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Validate filter
    const filter = filters.find((f) => f.name === filterName);
    if (!filter) {
      return NextResponse.json(
        { error: `Invalid filter: ${filterName}` },
        { status: 400 }
      );
    }

    // Check if premium filter is used by free tier
    if (filter.premium && !isPremium) {
      return NextResponse.json(
        { error: `Filter "${filterName}" requires Pro or Business tier` },
        { status: 403 }
      );
    }

    // Validate frame
    const frame = frames.find((f) => f.name === frameName);
    if (!frame) {
      return NextResponse.json(
        { error: `Invalid frame: ${frameName}` },
        { status: 400 }
      );
    }

    // Check if premium frame is used by free tier
    if (frame.premium && !isPremium) {
      return NextResponse.json(
        { error: `Frame "${frameName}" requires Pro or Business tier` },
        { status: 403 }
      );
    }

    // In a real implementation, we would process the image server-side
    // For now, return the parameters that would be used
    const response = NextResponse.json({
      success: true,
      message: "Export parameters validated",
      params: {
        filter: filter.value,
        frame: {
          name: frame.name,
          strokeColor: frame.strokeColor,
        },
        text,
        mirror,
        watermark: !isPremium,
      },
      note: "Client-side processing required. Use the embed widget or web app for full export functionality.",
    });

    // Add rate limit headers
    const rateLimitHeaders = createRateLimitHeaders(validation.key!.key);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
