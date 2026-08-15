import { NextResponse } from 'next/server';
import { lookupAddressByCep } from '@noro/lib';

export async function GET(
  request: Request,
  { params }: { params: { cep: string } }
) {
  try {
    const rawCep = params.cep;
    const address = await lookupAddressByCep(rawCep);

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'CEP não encontrado ou inválido' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      address,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
