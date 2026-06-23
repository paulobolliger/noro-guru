import { NextResponse } from 'next/server';
import { createDatabaseClient } from '@noro/db';

export async function POST(request: Request) {
  const { client, close } = createDatabaseClient();
  try {
    const body = await request.json();
    const { name, slug, plan } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const [existing] = await client`
      SELECT id 
      FROM platform.tenants 
      WHERE slug = ${slug} 
      LIMIT 1
    `;

    if (existing) {
      return NextResponse.json(
        { message: 'Slug já está em uso' },
        { status: 400 }
      );
    }

    // Create tenant
    const [data] = await client`
      INSERT INTO platform.tenants (name, slug, plan, status)
      VALUES (${name}, ${slug}, ${plan || 'free'}, 'active')
      RETURNING *
    `;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating org:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao criar empresa' },
      { status: 500 }
    );
  } finally {
    await close();
  }
}
