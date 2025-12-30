/**
 * Collage/Photo Strip Generator
 * Creates classic photo booth strips and collage layouts
 */

import type { photoCapturedDataType } from "../types/types";
import { WATERMARK_CONFIG } from "../data/premium";

export type CollageLayout = "strip-4x1" | "strip-2x1" | "grid-2x2" | "single";

interface CollageOptions {
  layout: CollageLayout;
  photos: photoCapturedDataType[];
  backgroundColor?: string;
  padding?: number;
  showLoveWords?: boolean;
  isPremium?: boolean;
}

// Layout configurations
const LAYOUTS = {
  "strip-4x1": { cols: 1, rows: 4, photoWidth: 270, photoHeight: 200 },
  "strip-2x1": { cols: 1, rows: 2, photoWidth: 270, photoHeight: 304 },
  "grid-2x2": { cols: 2, rows: 2, photoWidth: 200, photoHeight: 200 },
  "single": { cols: 1, rows: 1, photoWidth: 270, photoHeight: 304 },
};

/**
 * Draw watermark on canvas
 */
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { text, font, color, shadowColor, padding } = WATERMARK_CONFIG;

  ctx.save();
  ctx.font = font;
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;

  const x = canvasWidth - textWidth - padding;
  const y = canvasHeight - padding - 14;

  ctx.fillStyle = shadowColor;
  ctx.fillText(text, x + 1, y + 1);

  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, x, y);

  ctx.restore();
}

/**
 * Generate a collage/strip from multiple photos
 */
export async function generateCollage(options: CollageOptions): Promise<string> {
  const {
    layout,
    photos,
    backgroundColor = "#ffffff",
    padding = 16,
    showLoveWords = true,
    isPremium = false,
  } = options;

  const config = LAYOUTS[layout];
  const requiredPhotos = config.cols * config.rows;

  // Use available photos, repeat if needed
  const photosToUse: photoCapturedDataType[] = [];
  for (let i = 0; i < requiredPhotos; i++) {
    photosToUse.push(photos[i % photos.length]);
  }

  // Calculate canvas dimensions
  const textHeight = showLoveWords ? 28 : 0;
  const cellWidth = config.photoWidth + padding * 2;
  const cellHeight = config.photoHeight + padding + textHeight + (showLoveWords ? 8 : padding);

  const canvasWidth = cellWidth * config.cols + padding * 2;
  const canvasHeight = cellHeight * config.rows + padding * 2;

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Draw background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Load all images first
  const loadedImages = await Promise.all(
    photosToUse.map((photo) => loadImage(photo.image))
  );

  // Draw each photo
  for (let i = 0; i < photosToUse.length; i++) {
    const photo = photosToUse[i];
    const img = loadedImages[i];

    const col = i % config.cols;
    const row = Math.floor(i / config.cols);

    const x = padding + col * cellWidth + padding;
    const y = padding + row * cellHeight + padding;

    // Draw frame background
    if (photo.frame.strokeColor) {
      ctx.fillStyle = photo.frame.strokeColor;
      ctx.fillRect(x - 4, y - 4, config.photoWidth + 8, config.photoHeight + 8 + textHeight + 8);
    }

    // Apply filter and draw image
    ctx.save();
    ctx.filter = photo.filter;

    // Calculate crop for object-fit: cover
    const imgAspect = img.width / img.height;
    const targetAspect = config.photoWidth / config.photoHeight;

    let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

    if (imgAspect > targetAspect) {
      sWidth = img.height * targetAspect;
      sx = (img.width - sWidth) / 2;
    } else {
      sHeight = img.width / targetAspect;
      sy = (img.height - sHeight) / 2;
    }

    // Handle mirror
    if (photo.mirror) {
      ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, config.photoWidth, config.photoHeight);
    } else {
      ctx.translate(x + config.photoWidth, y);
      ctx.scale(-1, 1);
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, config.photoWidth, config.photoHeight);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    ctx.restore();

    // Draw love word
    if (showLoveWords && photo.loveWord) {
      ctx.font = "24px 'Square Peg', cursive";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        photo.loveWord,
        x + config.photoWidth / 2,
        y + config.photoHeight + textHeight / 2 + 8
      );
    }
  }

  // Add strip branding for strip layouts
  if (layout.startsWith("strip")) {
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#666666";
    ctx.textAlign = "center";
    ctx.fillText("Photo Booth", canvasWidth / 2, canvasHeight - 8);
  }

  // Draw watermark for non-premium users
  if (!isPremium) {
    drawWatermark(ctx, canvasWidth, canvasHeight);
  }

  return canvas.toDataURL("image/png");
}

/**
 * Download a collage
 */
export async function downloadCollage(options: CollageOptions): Promise<void> {
  const dataUrl = await generateCollage(options);

  const link = document.createElement("a");
  link.download = `photo-strip-${options.layout}-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Helper to load an image
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Get layout display info
 */
export const LAYOUT_OPTIONS = [
  { value: "single" as CollageLayout, label: "Single", minPhotos: 1, icon: "1" },
  { value: "strip-2x1" as CollageLayout, label: "Strip (2)", minPhotos: 2, icon: "2↕" },
  { value: "strip-4x1" as CollageLayout, label: "Strip (4)", minPhotos: 4, icon: "4↕" },
  { value: "grid-2x2" as CollageLayout, label: "Grid (2x2)", minPhotos: 4, icon: "⊞" },
];
