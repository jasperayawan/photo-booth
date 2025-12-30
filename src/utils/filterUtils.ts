/**
 * Utility functions for filter processing
 */

/**
 * Generate CSS filter string based on filter name and intensity
 * @param filterName - The name of the filter (e.g., "Vintage", "B&W")
 * @param intensity - Filter intensity from 0 to 1
 * @returns CSS filter string
 */
export function getFilterStyle(filterName: string, intensity: number): string {
  switch (filterName) {
    // Basic
    case "None":
      return "none";
    case "B&W":
      return `grayscale(${intensity})`;

    // Warm tones
    case "Vintage":
      return `sepia(${intensity}) contrast(${1 + 0.2 * intensity})`;
    case "Warm":
      return `hue-rotate(${30 * intensity}deg) saturate(${1 + 0.3 * intensity})`;
    case "Golden":
      return `sepia(${0.5 * intensity}) saturate(${1 + 0.4 * intensity}) brightness(${1 + 0.1 * intensity})`;

    // Cool tones
    case "Cool":
      return `hue-rotate(${180 * intensity}deg) saturate(${1 + 0.5 * intensity})`;
    case "Arctic":
      return `hue-rotate(${200 * intensity}deg) saturate(${0.8 + 0.2 * (1 - intensity)}) brightness(${1 + 0.1 * intensity})`;

    // Vibrant
    case "Vibrant":
      return `saturate(${1 + intensity}) contrast(${1 + 0.2 * intensity})`;
    case "Pop Art":
      return `saturate(${1 + 2 * intensity}) contrast(${1 + 0.5 * intensity}) brightness(${1 + 0.1 * intensity})`;

    // Moody
    case "Noir":
      return `grayscale(${intensity}) contrast(${1 + 0.5 * intensity}) brightness(${1 - 0.1 * intensity})`;
    case "Fade":
      return `contrast(${1 - 0.1 * intensity}) brightness(${1 + 0.1 * intensity}) saturate(${1 - 0.2 * intensity})`;
    case "Twilight":
      return `hue-rotate(${270 * intensity}deg) saturate(${1 - 0.4 * intensity}) brightness(${1 - 0.1 * intensity})`;

    // Artistic
    case "Dreamy":
      return `blur(${intensity}px) brightness(${1 + 0.1 * intensity}) saturate(${1 + 0.2 * intensity})`;
    case "Vignette":
      return `contrast(${1 + 0.1 * intensity}) brightness(${1 - 0.05 * intensity})`;
    case "Retro":
      return `sepia(${0.4 * intensity}) hue-rotate(${-10 * intensity}deg) saturate(${1 + 0.5 * intensity})`;

    default:
      return "none";
  }
}
