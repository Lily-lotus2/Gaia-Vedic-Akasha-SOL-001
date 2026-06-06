/**
 * Fibonacci Harmonic Rendering System
 * 
 * Applies Fibonacci mathematics to UI spacing, sizing, and color transitions
 * for coherent, mathematically-grounded visual hierarchy.
 */

// Fibonacci sequence for spacing (in pixels)
export const FIBONACCI_SCALE = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144] as const;

// Harmonic color palette (placeholder - to be replaced with brand colors)
export const HARMONIC_PALETTE = {
  darkNavy: '#0a1428',
  cyan: '#00d4ff',
  magenta: '#ff00ff',
  aquamarine: '#7fffd4',
  blue: '#0066ff',
} as const;

/**
 * Get Fibonacci spacing value by index
 * @param index - Position in Fibonacci sequence (0-11)
 * @returns Pixel value
 */
export function fibonacciSpacing(index: number): number {
  return FIBONACCI_SCALE[Math.min(index, FIBONACCI_SCALE.length - 1)];
}

/**
 * Generate Fibonacci-based spacing scale for CSS
 * @returns Object with spacing utility names and values
 */
export function generateFibonacciSpacingScale(): Record<string, string> {
  const scale: Record<string, string> = {};
  FIBONACCI_SCALE.forEach((value, index) => {
    scale[`fib-${index}`] = `${value}px`;
  });
  return scale;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Interpolate between two hex colors
 * @param color1 - Starting hex color
 * @param color2 - Ending hex color
 * @param factor - Interpolation factor (0-1)
 * @returns Interpolated hex color
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Generate harmonic color gradient using Fibonacci sequence
 * @param startColor - Starting hex color
 * @param endColor - Ending hex color
 * @param steps - Number of steps (default: 5)
 * @returns Array of interpolated colors
 */
export function generateHarmonicGradient(
  startColor: string,
  endColor: string,
  steps: number = 5
): string[] {
  const colors: string[] = [startColor];
  for (let i = 1; i < steps; i++) {
    const factor = i / (steps - 1);
    colors.push(interpolateColor(startColor, endColor, factor));
  }
  return colors;
}

/**
 * Generate tier pricing based on Fibonacci sequence
 * @param basePriceUSD - Base price in USD
 * @param tiers - Number of tiers (default: 5)
 * @returns Array of tier prices
 */
export function generateFibonacciPricing(basePriceUSD: number, tiers: number = 5): number[] {
  const prices: number[] = [];
  for (let i = 0; i < tiers; i++) {
    const fibValue = FIBONACCI_SCALE[Math.min(i, FIBONACCI_SCALE.length - 1)];
    prices.push(Math.round(basePriceUSD * fibValue));
  }
  return prices;
}

/**
 * Calculate harmonic layout dimensions using Fibonacci
 * @param containerWidth - Container width in pixels
 * @param divisions - Number of divisions (default: 5)
 * @returns Array of calculated widths
 */
export function calculateFibonacciLayout(containerWidth: number, divisions: number = 5): number[] {
  const fibSequence = FIBONACCI_SCALE.slice(0, divisions);
  const total = fibSequence.reduce((a, b) => a + b, 0);
  return fibSequence.map((value) => Math.round((value / total) * containerWidth));
}

/**
 * Generate CSS custom properties for Fibonacci spacing
 * @returns CSS variable declarations
 */
export function generateFibonacciCSSVariables(): string {
  let css = ':root {\n';
  FIBONACCI_SCALE.forEach((value, index) => {
    css += `  --fib-${index}: ${value}px;\n`;
  });
  css += '}\n';
  return css;
}

/**
 * Generate CSS custom properties for harmonic colors
 * @param palette - Color palette object
 * @returns CSS variable declarations
 */
export function generateHarmonicColorCSSVariables(palette: Record<string, string>): string {
  let css = ':root {\n';
  Object.entries(palette).forEach(([name, color]) => {
    css += `  --color-${name}: ${color};\n`;
  });
  css += '}\n';
  return css;
}

/**
 * Calculate golden ratio (φ) for proportional sizing
 * @param baseSize - Base size value
 * @returns Proportional size using golden ratio
 */
export function goldenRatio(baseSize: number): number {
  const PHI = 1.618033988749895;
  return baseSize * PHI;
}

/**
 * Validate Fibonacci spacing index
 * @param index - Index to validate
 * @returns Valid index within range
 */
export function validateFibonacciIndex(index: number): number {
  return Math.max(0, Math.min(index, FIBONACCI_SCALE.length - 1));
}

/**
 * Generate responsive Fibonacci spacing based on viewport
 * @param baseIndex - Base Fibonacci index
 * @param mobileOffset - Offset for mobile (default: -2)
 * @param tabletOffset - Offset for tablet (default: -1)
 * @returns Object with responsive spacing values
 */
export function generateResponsiveFibonacciSpacing(
  baseIndex: number,
  mobileOffset: number = -2,
  tabletOffset: number = -1
): {
  mobile: number;
  tablet: number;
  desktop: number;
} {
  return {
    mobile: fibonacciSpacing(validateFibonacciIndex(baseIndex + mobileOffset)),
    tablet: fibonacciSpacing(validateFibonacciIndex(baseIndex + tabletOffset)),
    desktop: fibonacciSpacing(baseIndex),
  };
}

/**
 * Create a Fibonacci-based tier structure
 * @param tierCount - Number of tiers
 * @returns Tier configuration with Fibonacci-based properties
 */
export function generateFibonacciTierStructure(tierCount: number = 5) {
  const tiers = [];
  for (let i = 0; i < tierCount; i++) {
    const fibValue = FIBONACCI_SCALE[Math.min(i, FIBONACCI_SCALE.length - 1)];
    tiers.push({
      tier: i + 1,
      fibonacciValue: fibValue,
      features: fibValue,
      priority: fibValue,
      multiplier: fibValue / FIBONACCI_SCALE[0],
    });
  }
  return tiers;
}
