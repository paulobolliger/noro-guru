import { NextResponse } from 'next/server';

const message = 'Endpoint legado desativado: o modelo de dados legado deste recurso foi desativado.';

export async function GET() {
  return NextResponse.json({ data: [], message });
}

export async function POST() {
  return NextResponse.json({ error: message }, { status: 410 });
}

export async function PUT() {
  return NextResponse.json({ error: message }, { status: 410 });
}

export async function PATCH() {
  return NextResponse.json({ error: message }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ error: message }, { status: 410 });
}