/**
 * Sacred Geometry Rendering System
 * 
 * Generates SVG patterns for Flower of Life, Seed of Life, and other
 * sacred geometric structures for visual coherence and harmonic design.
 */

/**
 * Generate Seed of Life SVG pattern
 * @param size - Size of the pattern (default: 200)
 * @param color - Color of the pattern (default: currentColor)
 * @returns SVG string
 */
export function generateSeedOfLife(size: number = 200, color: string = 'currentColor'): string {
  const radius = size / 6;
  const cx = size / 2;
  const cy = size / 2;

  // Seven circles arranged in Seed of Life pattern
  const circles = [
    { x: cx, y: cy }, // Center
    { x: cx + radius, y: cy }, // Right
    { x: cx - radius, y: cy }, // Left
    { x: cx + radius / 2, y: cy + (radius * Math.sqrt(3)) / 2 }, // Bottom right
    { x: cx - radius / 2, y: cy + (radius * Math.sqrt(3)) / 2 }, // Bottom left
    { x: cx + radius / 2, y: cy - (radius * Math.sqrt(3)) / 2 }, // Top right
    { x: cx - radius / 2, y: cy - (radius * Math.sqrt(3)) / 2 }, // Top left
  ];

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  circles.forEach((circle) => {
    svg += `<circle cx="${circle.x}" cy="${circle.y}" r="${radius}" fill="none" stroke="${color}" stroke-width="2"/>`;
  });
  svg += '</svg>';

  return svg;
}

/**
 * Generate Flower of Life SVG pattern
 * @param size - Size of the pattern (default: 300)
 * @param color - Color of the pattern (default: currentColor)
 * @param layers - Number of layers (default: 3)
 * @returns SVG string
 */
export function generateFlowerOfLife(
  size: number = 300,
  color: string = 'currentColor',
  layers: number = 3
): string {
  const cx = size / 2;
  const cy = size / 2;
  const baseRadius = size / 8;

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

  for (let layer = 0; layer < layers; layer++) {
    const radius = baseRadius * (layer + 1);
    const circlesInLayer = 6 * (layer + 1);

    for (let i = 0; i < circlesInLayer; i++) {
      const angle = (i / circlesInLayer) * Math.PI * 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const circleRadius = baseRadius * 0.8;

      svg += `<circle cx="${x}" cy="${y}" r="${circleRadius}" fill="none" stroke="${color}" stroke-width="1.5"/>`;
    }
  }

  svg += '</svg>';
  return svg;
}

/**
 * Generate Vesica Piscis (two overlapping circles)
 * @param size - Size of the pattern (default: 200)
 * @param color - Color of the pattern (default: currentColor)
 * @returns SVG string
 */
export function generateVesicaPiscis(size: number = 200, color: string = 'currentColor'): string {
  const radius = size / 3;
  const cx = size / 2;
  const cy = size / 2;

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<circle cx="${cx - radius / 2}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="2"/>`;
  svg += `<circle cx="${cx + radius / 2}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="2"/>`;
  svg += '</svg>';

  return svg;
}

/**
 * Generate Metatron's Cube (geometric pattern)
 * @param size - Size of the pattern (default: 250)
 * @param color - Color of the pattern (default: currentColor)
 * @returns SVG string
 */
export function generateMetatronsCube(size: number = 250, color: string = 'currentColor'): string {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 4;

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

  // Draw 13 circles (12 outer + 1 center)
  for (let i = 0; i < 13; i++) {
    let x, y;
    if (i === 0) {
      x = cx;
      y = cy;
    } else {
      const angle = ((i - 1) / 12) * Math.PI * 2;
      x = cx + radius * Math.cos(angle);
      y = cy + radius * Math.sin(angle);
    }
    svg += `<circle cx="${x}" cy="${y}" r="8" fill="${color}" opacity="0.6"/>`;
  }

  svg += '</svg>';
  return svg;
}

/**
 * Generate Fibonacci spiral
 * @param size - Size of the pattern (default: 300)
 * @param color - Color of the pattern (default: currentColor)
 * @param turns - Number of turns (default: 3)
 * @returns SVG string
 */
export function generateFibonacciSpiral(
  size: number = 300,
  color: string = 'currentColor',
  turns: number = 3
): string {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2.5;

  let pathData = 'M';
  const steps = 100 * turns;

  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const r = (t / (turns * Math.PI * 2)) * maxRadius;
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);

    if (i === 0) {
      pathData += ` ${x} ${y}`;
    } else {
      pathData += ` L ${x} ${y}`;
    }
  }

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="2"/>`;
  svg += '</svg>';

  return svg;
}

/**
 * Generate hexagonal grid pattern
 * @param size - Size of the pattern (default: 400)
 * @param hexSize - Size of individual hexagons (default: 40)
 * @param color - Color of the pattern (default: currentColor)
 * @returns SVG string
 */
export function generateHexagonalGrid(
  size: number = 400,
  hexSize: number = 40,
  color: string = 'currentColor'
): string {
  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

  const width = hexSize * 2;
  const height = (hexSize * Math.sqrt(3)) / 2;

  for (let row = 0; row < Math.ceil(size / height); row++) {
    for (let col = 0; col < Math.ceil(size / width); col++) {
      const x = col * width + (row % 2) * (width / 2);
      const y = row * height;

      // Generate hexagon points
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = x + hexSize * Math.cos(angle);
        const py = y + hexSize * Math.sin(angle);
        points.push(`${px},${py}`);
      }

      svg += `<polygon points="${points.join(' ')}" fill="none" stroke="${color}" stroke-width="1" opacity="0.5"/>`;
    }
  }

  svg += '</svg>';
  return svg;
}

/**
 * Generate mandala pattern
 * @param size - Size of the pattern (default: 300)
 * @param color - Color of the pattern (default: currentColor)
 * @param layers - Number of layers (default: 5)
 * @returns SVG string
 */
export function generateMandala(
  size: number = 300,
  color: string = 'currentColor',
  layers: number = 5
): string {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2.5;

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

  for (let layer = 0; layer < layers; layer++) {
    const radius = (maxRadius / layers) * (layer + 1);
    const petals = 8 + layer * 4;

    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      const petalSize = radius * 0.3;

      svg += `<circle cx="${x}" cy="${y}" r="${petalSize}" fill="none" stroke="${color}" stroke-width="1" opacity="${0.8 - layer * 0.1}"/>`;
    }
  }

  svg += '</svg>';
  return svg;
}

/**
 * Get SVG as data URI for use in CSS
 * @param svgString - SVG string
 * @returns Data URI
 */
export function svgToDataUri(svgString: string): string {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml;utf8,${encoded}`;
}

/**
 * Generate CSS background pattern using sacred geometry
 * @param pattern - Pattern type ('seed', 'flower', 'vesica', 'metatron', 'spiral', 'hexagon', 'mandala')
 * @param size - Pattern size
 * @param color - Pattern color
 * @returns CSS background-image value
 */
export function generateSacredGeometryBackground(
  pattern: 'seed' | 'flower' | 'vesica' | 'metatron' | 'spiral' | 'hexagon' | 'mandala',
  size: number = 200,
  color: string = 'currentColor'
): string {
  let svg: string;

  switch (pattern) {
    case 'seed':
      svg = generateSeedOfLife(size, color);
      break;
    case 'flower':
      svg = generateFlowerOfLife(size, color);
      break;
    case 'vesica':
      svg = generateVesicaPiscis(size, color);
      break;
    case 'metatron':
      svg = generateMetatronsCube(size, color);
      break;
    case 'spiral':
      svg = generateFibonacciSpiral(size, color);
      break;
    case 'hexagon':
      svg = generateHexagonalGrid(size, 30, color);
      break;
    case 'mandala':
      svg = generateMandala(size, color);
      break;
    default:
      svg = generateSeedOfLife(size, color);
  }

  return `url('${svgToDataUri(svg)}')`;
}
