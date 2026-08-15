import { NextResponse } from 'next/server';
import { lookupCnpj } from '@noro/lib';

export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  try {
    const rawCnpj = params.cnpj;
    const company = await lookupCnpj(rawCnpj);

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'CNPJ não encontrado ou inválido' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      company,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
