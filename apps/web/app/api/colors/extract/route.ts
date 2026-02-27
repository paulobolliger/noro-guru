import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function getDominantColors(imageData: ImageData, count: number = 3): string[] {
  const pixels = imageData.data;
  const colorCounts: Map<string, number> = new Map();

  // Sample every 10th pixel for performance
  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    // Skip very dark (almost black) and very light (almost white) pixels
    const brightness = (r + g + b) / 3;
    if (brightness < 30 || brightness > 240) continue;

    // Quantize to reduce similar colors
    const qr = Math.round(r / 51) * 51;
    const qg = Math.round(g / 51) * 51;
    const qb = Math.round(b / 51) * 51;

    const key = `${qr},${qg},${qb}`;
    colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
  }

  // Sort by frequency and get top N colors
  const sortedColors = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([rgb, _]) => {
      const [r, g, b] = rgb.split(',').map(Number);
      return rgbToHex(r, g, b);
    });

  return sortedColors;
}

export async function POST(req: Request) {
  try {
    const { logoUrl } = await req.json();

    if (!logoUrl) {
      return NextResponse.json(
        { success: false, error: 'logoUrl é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[COLOR EXTRACT] Processing:', logoUrl);

    // Load the image
    const image = await loadImage(logoUrl);
    
    // Create canvas and draw image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    // Extract dominant colors
    const dominantColors = getDominantColors(imageData, 3);

    if (dominantColors.length === 0) {
      throw new Error('Não foi possível extrair cores da imagem');
    }

    const primaryColor = dominantColors[0];
    const secondaryColor = dominantColors[1] || '';
    const accentColor = dominantColors[2] || '';

    console.log('[COLOR EXTRACT] Success:', { primaryColor, secondaryColor, accentColor });

    return NextResponse.json({
      success: true,
      primaryColor,
      secondaryColor,
      accentColor,
      allColors: dominantColors,
    });

  } catch (error: any) {
    console.error('[COLOR EXTRACT] Error:', error.message);

    return NextResponse.json({
      success: false,
      error: error.message || 'Falha ao extrair cores',
    }, { status: 500 });
  }
}
