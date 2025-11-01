import { NextRequest, NextResponse } from 'next/server';

interface NewsletterData {
  email: string;
  name?: string;
  source?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as NewsletterData;
    const { email, name, source } = body;

    // Validação de email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Enviar para Control Plane (salvar como lead especial)
    const controlPlaneUrl = process.env.CONTROL_PLANE_URL;
    const apiKey = process.env.CONTROL_PLANE_API_KEY;

    if (controlPlaneUrl && apiKey) {
      try {
        const leadResponse = await fetch(`${controlPlaneUrl}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            name: name || 'Newsletter Subscriber',
            email,
            source: source || 'newsletter',
            interest: 'newsletter',
            message: 'Inscrito na newsletter',
          }),
        });

        if (!leadResponse.ok) {
          console.error('Erro ao salvar subscriber no Control Plane');
        }
      } catch (error) {
        console.error('Erro ao conectar com Control Plane:', error);
        // Continua mesmo se falhar - não queremos bloquear o usuário
      }
    }

    // Em produção, você pode integrar com:
    // - Mailchimp
    // - SendGrid
    // - ConvertKit
    // - Etc.

    // Por enquanto, apenas retorna sucesso
    return NextResponse.json(
      { 
        success: true, 
        message: 'Inscrição realizada com sucesso!' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
