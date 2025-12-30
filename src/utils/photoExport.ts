/**
 * Utility functions for photo export/download
 */

import type { photoCapturedDataType } from "../types/types";

// Canvas dimensions for exported photos
const CANVAS_WIDTH = 270;
const CANVAS_HEIGHT = 304;
const PADDING = 16;
const TEXT_HEIGHT = 32;
const PADDING_BOTTOM = 24;

/**
 * Download a captured photo with frame, filter, and love word text
 * @param data - The photo data including image, filter, frame, and love word
 */
export function downloadPhoto(data: photoCapturedDataType): void {
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

    // Trigger download
    const link = document.createElement("a");
    link.download = `photo-booth-${Date.now()}-${data.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
}
