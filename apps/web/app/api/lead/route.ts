import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  interest: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: LeadData = await req.json();

    // Validação básica
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Integrar com o Control Plane para salvar no CRM
    const controlPlaneUrl = process.env.CONTROL_PLANE_URL || 'https://control.noro.guru';
    
    try {
      const response = await fetch(`${controlPlaneUrl}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CONTROL_PLANE_API_KEY}`,
        },
        body: JSON.stringify({
          nome: data.name,
          email: data.email,
          telefone: data.phone || '',
          empresa: data.company || '',
          mensagem: data.message,
          origem: 'website',
          interesse: data.interest,
          status: 'novo',
          data_contato: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error('Erro ao salvar lead no Control Plane:', await response.text());
        // Continua mesmo se falhar, para não perder o lead
      }
    } catch (controlError) {
      console.error('Erro na integração com Control Plane:', controlError);
      // Continua mesmo se falhar
    }

    // Enviar email de confirmação para o lead
    try {
      await fetch(`${controlPlaneUrl}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CONTROL_PLANE_API_KEY}`,
        },
        body: JSON.stringify({
          to: data.email,
          subject: 'Recebemos sua mensagem - NORO',
          template: 'lead-confirmation',
          data: {
            name: data.name,
            interest: data.interest,
          },
        }),
      });
    } catch (emailError) {
      console.error('Erro ao enviar email de confirmação:', emailError);
    }

    // Notificar equipe de vendas
    try {
      await fetch(`${controlPlaneUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CONTROL_PLANE_API_KEY}`,
        },
        body: JSON.stringify({
          type: 'new_lead',
          title: 'Novo Lead Capturado',
          message: `${data.name} (${data.email}) entrou em contato via website`,
          data: {
            lead: data,
          },
          priority: 'high',
        }),
      });
    } catch (notifError) {
      console.error('Erro ao enviar notificação:', notifError);
    }

    // Por enquanto, apenas loga os dados
    console.log('Novo lead capturado:', {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'website',
    });

    return NextResponse.json({
      success: true,
      message: 'Lead capturado com sucesso',
    });

  } catch (error) {
    console.error('Erro ao processar lead:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sua solicitação' },
      { status: 500 }
    );
  }
}