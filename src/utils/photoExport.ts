/**
 * Utility functions for photo export/download
 */

import type { photoCapturedDataType } from "../types/types";
import { WATERMARK_CONFIG } from "../data/premium";

// Canvas dimensions for exported photos
const CANVAS_WIDTH = 270;
const CANVAS_HEIGHT = 304;
const PADDING = 16;
const TEXT_HEIGHT = 32;
const PADDING_BOTTOM = 24;

/**
 * Draw watermark on canvas
 * @param ctx - Canvas 2D context
 * @param canvasWidth - Width of the canvas
 * @param canvasHeight - Height of the canvas
 */
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  const { text, font, color, shadowColor, padding } = WATERMARK_CONFIG;

  ctx.save();

  // Set font and measure text
  ctx.font = font;
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = 11; // Approximate height for 11px font

  // Position in bottom-right corner
  const x = canvasWidth - textWidth - padding;
  const y = canvasHeight - padding - 30; // Above the love word

  // Draw shadow for better visibility
  ctx.fillStyle = shadowColor;
  ctx.fillText(text, x + 1, y + 1);

  // Draw watermark text
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, x, y);

  ctx.restore();
}

/**
 * Download a captured photo with frame, filter, and love word text
 * @param data - The photo data including image, filter, frame, and love word
 * @param isPremium - Whether the user has premium (no watermark)
 */
export function downloadPhoto(
  data: photoCapturedDataType,
  isPremium: boolean = false
): void {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH + PADDING * 2;
  canvas.height = CANVAS_HEIGHT + PADDING + TEXT_HEIGHT + PADDING_BOTTOM;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Draw background (frame color or white if no frame)
  ctx.fillStyle =
    data.frame.name === "None" ? "#fff" : data.frame.strokeColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw frame border if needed
  if (data.frame.name !== "None") {
    ctx.save();
    ctx.strokeStyle = data.frame.strokeColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(
      PADDING - ctx.lineWidth / 2,
      PADDING - ctx.lineWidth / 2,
      CANVAS_WIDTH + ctx.lineWidth,
      CANVAS_HEIGHT + ctx.lineWidth
    );
    ctx.restore();
  }

  // Load and draw the image with filter and mirror
  const img = new window.Image();
  img.src = data.image;
  img.onload = () => {
    ctx.save();
    ctx.filter = data.filter;

    // Calculate aspect ratios for object-fit: cover effect
    const imgAspect = img.width / img.height;
    const canvasAspect = CANVAS_WIDTH / CANVAS_HEIGHT;

    let sx = 0,
      sy = 0,
      sWidth = img.width,
      sHeight = img.height;

    if (imgAspect > canvasAspect) {
      // Image is wider - crop left/right
      sWidth = img.height * canvasAspect;
      sx = (img.width - sWidth) / 2;
    } else {
      // Image is taller - crop top/bottom
      sHeight = img.width / canvasAspect;
      sy = (img.height - sHeight) / 2;
    }

    if (data.mirror) {
      ctx.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        PADDING,
        PADDING,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
    } else {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        PADDING,
        PADDING,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
    }
    ctx.restore();

    // Draw the loveWord text
    ctx.font = "32px 'Square Peg', cursive";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const offsetFromBottom = 25;
    ctx.fillText(
      data.loveWord || "",
      canvas.width / 2,
      canvas.height - offsetFromBottom
    );

    // Draw watermark for non-premium users
    if (!isPremium) {
      drawWatermark(ctx, canvas.width, canvas.height);
    }

    // Trigger download
    const link = document.createElement("a");
    link.download = `photo-booth-${Date.now()}-${data.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
}

/**
 * Export photo as data URL (for API/embed use)
 * @param data - The photo data
 * @param isPremium - Whether to include watermark
 * @returns Promise with the data URL
 */
export function exportPhotoAsDataUrl(
  data: photoCapturedDataType,
  isPremium: boolean = false
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH + PADDING * 2;
    canvas.height = CANVAS_HEIGHT + PADDING + TEXT_HEIGHT + PADDING_BOTTOM;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    // Draw background
    ctx.fillStyle =
      data.frame.name === "None" ? "#fff" : data.frame.strokeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw frame border if needed
    if (data.frame.name !== "None") {
      ctx.save();
      ctx.strokeStyle = data.frame.strokeColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(
        PADDING - ctx.lineWidth / 2,
        PADDING - ctx.lineWidth / 2,
        CANVAS_WIDTH + ctx.lineWidth,
        CANVAS_HEIGHT + ctx.lineWidth
      );
      ctx.restore();
    }

    const img = new window.Image();
    img.src = data.image;
    img.onload = () => {
      ctx.save();
      ctx.filter = data.filter;

      const imgAspect = img.width / img.height;
      const canvasAspect = CANVAS_WIDTH / CANVAS_HEIGHT;

      let sx = 0,
        sy = 0,
        sWidth = img.width,
        sHeight = img.height;

      if (imgAspect > canvasAspect) {
        sWidth = img.height * canvasAspect;
        sx = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / canvasAspect;
        sy = (img.height - sHeight) / 2;
      }

      if (data.mirror) {
        ctx.drawImage(img, sx, sy, sWidth, sHeight, PADDING, PADDING, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, PADDING, PADDING, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      ctx.restore();

      // Draw loveWord
      ctx.font = "32px 'Square Peg', cursive";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(data.loveWord || "", canvas.width / 2, canvas.height - 25);

      // Draw watermark for non-premium
      if (!isPremium) {
        drawWatermark(ctx, canvas.width, canvas.height);
      }

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
}
