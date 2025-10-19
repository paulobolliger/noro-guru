import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Assina parâmetros de upload do Cloudinary no servidor
export async function POST(request: Request) {
  try {
    const { folder } = await request.json().catch(() => ({ folder: undefined }));

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiKey || !apiSecret || !cloudName) {
      return NextResponse.json(
        { error: 'Cloudinary env vars missing: CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME' },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    // Monta string para assinatura em ordem alfabética de chaves
    // Campos com valor undefined não entram na assinatura
    const params: Record<string, string | number | undefined> = {
      folder: folder || undefined,
      timestamp,
    };

    const toSign = Object.keys(params)
      .filter((k) => params[k] !== undefined)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join('&') + apiSecret;

    const signature = createHash('sha1').update(toSign).digest('hex');

    return NextResponse.json({ timestamp, signature, apiKey, cloudName, folder: folder || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to sign upload' }, { status: 500 });
  }
}

