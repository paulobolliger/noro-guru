import { NextRequest, NextResponse } from 'next/server';

// Esta é a mesma lógica do seu arquivo original, apenas movida para o lugar certo.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('=== NOVO LEAD RECEBIDO (App Router) ===');
    console.log('Dados:', body);
    
    // Enviar para o Google Sheets (sem esperar a resposta para não atrasar o usuário)
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          nome: body.nome || '',
          email: body.email || '',
          destino: body.destino || '',
          duracao: body.duracao || '',
          interesses: body.interesses || ''
        }),
      }).catch(err => console.error('Erro ao enviar para Google Sheets:', err));
    }
    
    // Enviar para Telegram (sem esperar a resposta)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const message = `🎯 *Novo Lead (Site V2)*\n\n👤 *Nome:* ${body.nome}\n📧 *Email:* ${body.email}\n🌍 *Destino:* ${body.destino}\n📅 *Duração:* ${body.duracao} dias\n💫 *Interesses:* ${body.interesses}`;
      fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }).catch(err => console.error('Erro ao enviar para Telegram:', err));
    }
    
    return NextResponse.json({ success: true, message: 'Lead recebido.' });
    
  } catch (error) {
    console.error('Erro geral na API submit-lead:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}

