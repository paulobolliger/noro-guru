import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, plan } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    // Check if slug already exists
    const { data: existing } = await supabase
      .schema('cp')
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { message: 'Slug já está em uso' },
        { status: 400 }
      );
    }

    // Create tenant
    const { data, error } = await supabase
      .schema('cp')
      .from('tenants')
      .insert({
        name,
        slug,
        plan: plan || 'free',
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating org:', error);
    return NextResponse.json(
      { message: error.message || 'Erro ao criar empresa' },
      { status: 500 }
    );
  }
}
