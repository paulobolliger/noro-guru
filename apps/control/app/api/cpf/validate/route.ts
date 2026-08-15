import { NextResponse } from 'next/server';
import { validateCpf, formatCpf } from '@noro/lib';

export async function POST(request: Request) {
  try {
    const { cpf } = await request.json();
    const isValid = validateCpf(cpf || '');

    return NextResponse.json({
      success: true,
      isValid,
      formattedCpf: isValid ? formatCpf(cpf) : null,
      message: isValid ? 'CPF Válido' : 'CPF com dígito verificador inválido',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
