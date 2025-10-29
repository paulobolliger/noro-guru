// app/api/gerar-roteiro/route.ts
import { NextRequest, NextResponse } from 'next/server';

function buildCorsHeaders(origin: string | null) {
  const allowed = (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes('*') ? '*' : (origin && allowed.includes(origin) ? origin : '');
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
  if (allowOrigin) headers['Access-Control-Allow-Origin'] = allowOrigin;
  return headers;
}

export async function OPTIONS(req: NextRequest) {
  const cors = buildCorsHeaders(req.headers.get('origin'));
  return new NextResponse(null, { status: 204, headers: cors });
}

function sanitizeHtml(html: string): string {
  // Remove script/style tags and their content
  let out = html.replace(/<\/(?:script|style)>/gi, "").replace(/<(?:script|style)[^>]*>[\s\S]*?<\/(?:script|style)>/gi, "");
  // Remove on* handlers
  out = out.replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, "").replace(/ on[a-z]+\s*=\s*'[^']*'/gi, "").replace(/ on[a-z]+\s*=\s*[^\s>]+/gi, "");
  // Neutralize javascript: URLs
  out = out.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"').replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'");
  return out;
}

// Função para gerar um resumo (teaser) do roteiro completo
function gerarResumo(roteiroCompleto: string, nome: string, destino: string, duracao: string): string {
  const linhas = roteiroCompleto.split('\n');
  const primeiros3Dias = linhas.slice(0, 25).join('\n');
  
  return `
    <h2>✨ Olá ${nome.split(' ')[0]}! Aqui está um preview do seu roteiro para ${destino}</h2>
    <p><strong>Duração:</strong> ${duracao} dias</p>
    <div style="background: #12152c; padding: 20px; border-radius: 12px; margin: 20px 0;">
      ${primeiros3Dias}
      <p style="text-align: center; margin-top: 30px; font-size: 1.2em;">
        <strong>📩 O roteiro COMPLETO foi enviado para o seu email!</strong>
      </p>
    </div>
  `;
}

// Função para gerar o HTML do e-mail
function gerarEmailHTML(nome: string, destino: string, duracao: string, roteiro: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; background: #f9fafb; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { color: #5053c4; }
        .roteiro { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✨ Seu Roteiro Mágico para ${destino}</h1>
        <p>Olá <strong>${nome}</strong>!</p>
        <p>Preparamos com muito carinho um roteiro completo de <strong>${duracao} dias</strong> para a sua viagem dos sonhos!</p>
        
        <div class="roteiro">
          ${roteiro}
        </div>

        <p style="text-align: center; margin-top: 30px;">
          <a href="https://www.nomade.guru/contato" style="background: #5053c4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
            Fale com um Especialista
          </a>
        </p>

        <div class="footer">
          <p><strong>Nomade Guru</strong><br/>
          Rua Comendador Torlogo Dauntre, 74 – Sala 1207<br/>
          Cambuí – Campinas – SP<br/>
          ✉️ contato@nomadeguru.com.br | ☎️ (19) 99999-9999</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { nome, email, destino, duracao, interesses } = await req.json();
    const cors = buildCorsHeaders(req.headers.get('origin'));

    if (!nome || !email || !destino || !duracao) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400, headers: cors });
    }

    const API_KEY = process.env.OPENAI_API_KEY;
    if (!API_KEY) {
      throw new Error('OpenAI API Key não configurada');
    }
    
    const systemPrompt = `Você é o "Nomade Guru", um especialista em criar roteiros de viagem detalhados e envolventes para uma agência de viagens premium. Formate em HTML limpo (h2, h3, p, strong) e use emojis.`;
    const userPrompt = `Crie um roteiro COMPLETO de ${duracao} dias para ${destino}. Viajante: ${nome}, Interesses: ${interesses || 'experiências autênticas'}. Seja específico com lugares, restaurantes e atrações REAIS.`;

    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2500,
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("Erro OpenAI:", errorData);
      throw new Error('Erro ao gerar roteiro');
    }

    const responseData = await apiResponse.json();
    const roteiroCompleto = responseData.choices[0].message.content as string;
    const roteiroResumo = gerarResumo(roteiroCompleto, nome, destino, duracao);

    const roteiroResumoSafe = sanitizeHtml(roteiroResumo);
    const roteiroEmailSafe = sanitizeHtml(roteiroCompleto);

    fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'Nomade Guru <contato@nomade.guru>',
            to: email,
            subject: `✨ Seu Roteiro Mágico para ${destino} está pronto!`,
            html: gerarEmailHTML(nome, destino, duracao, roteiroEmailSafe)
        })
    }).catch(emailError => console.error('Erro ao enviar email:', emailError));

    return NextResponse.json({ 
      roteiro: roteiroResumoSafe,
      mensagem: `🎉 Perfeito, ${nome.split(' ')[0]}! Enviamos seu roteiro completo para ${email}. Confira sua caixa de entrada!`
    }, { headers: cors });

  } catch (error) {
    console.error("ERRO:", error instanceof Error ? error.message : 'Erro desconhecido');
    const cors = buildCorsHeaders(req.headers.get('origin'));
    return NextResponse.json({ error: 'Ops! Algo deu errado. Tente novamente em instantes.' }, { status: 500, headers: cors });
  }
}

