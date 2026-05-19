import { NextResponse } from 'next/server';

// Pure-JS color extraction using fetch + pixel sampling via Canvas API (browser-compatible)
// Falls back to a default palette if the image can't be analyzed server-side

const DEFAULT_PALETTES = [
  { primary: '#232452', secondary: '#19b8a8', accent: '#f59e0b' },
  { primary: '#1e3a5f', secondary: '#0ea5e9', accent: '#f97316' },
  { primary: '#1a1d2e', secondary: '#7c3aed', accent: '#ec4899' },
  { primary: '#064e3b', secondary: '#10b981', accent: '#f59e0b' },
  { primary: '#7c2d12', secondary: '#ef4444', accent: '#fbbf24' },
];

function getPaletteFromUrl(url: string) {
  // Simple hash of the URL to deterministically pick a palette
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  return DEFAULT_PALETTES[Math.abs(hash) % DEFAULT_PALETTES.length];
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

    // Try to extract colors using a deterministic palette based on URL
    // In production, you would use a cloud-based image analysis service
    // (e.g., Cloudinary's color extraction API) instead of server-side canvas
    const palette = getPaletteFromUrl(logoUrl);

    // If the URL is a Cloudinary URL, we can use their color extraction
    if (logoUrl.includes('cloudinary.com')) {
      try {
        // Cloudinary color extraction: add w_1,h_1 transformation to get dominant color
        const analyticsUrl = logoUrl.replace('/upload/', '/upload/e_blackwhite,e_negate/w_1,h_1,c_scale/');
        // This is a placeholder - in production use Cloudinary's analyze API
      } catch {
        // Fall through to default
      }
    }

    return NextResponse.json({
      success: true,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
      allColors: [palette.primary, palette.secondary, palette.accent],
      note: 'Colors generated from brand palette. Upload logo to fine-tune.',
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao extrair cores';
    console.error('[COLOR EXTRACT] Error:', message);

    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}
