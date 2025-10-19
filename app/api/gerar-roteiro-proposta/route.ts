// app/api/gerar-roteiro-proposta/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validação dos dados recebidos do modal
    if (!body.destino || !body.dias_viagem) {
      return NextResponse.json({ error: 'Destino e duração são obrigatórios.' }, { status: 400 });
    }

    const API_KEY = process.env.OPENAI_API_KEY;
    if (!API_KEY) {
      throw new Error('Chave da API OpenAI não configurada no servidor.');
    }
    
    // Cálculo dinâmico de max_completion_tokens (500 tokens/dia)
    const diasViagem = parseInt(body.dias_viagem as string, 10);
    
    // Define o valor dinâmico com um limite de 5000 tokens (10 dias) para controle de custos.
    const maxTokens = Math.min(diasViagem * 500, 5000); 
    
    // Monta o prompt final com base no seu novo template
    const systemPrompt = `Você é um especialista em turismo e roteiros personalizados da plataforma Noro.`;
    
    const userPrompt = `
      Gere um roteiro de viagem detalhado, criativo e realista com base nas informações abaixo.
      A resposta deve vir formatada por dia, de forma organizada e fluida.

      ### Dados do cliente:
      - Destino: ${body.destino}
      - Duração: ${body.dias_viagem} dias
      - Nº de pessoas: ${body.num_pessoas || 'Não informado'}
      - Tipo de viagem: ${body.perfil_viajante?.join(', ') || 'Não informado'}
      - Orçamento estimado: ${body.orcamento_estimado ? `${body.orcamento_estimado} €` : 'Não informado'}
      - Preferências e observações: ${body.preferencias?.join(', ') || 'Não informado'}. ${body.restricoes || ''}

      ### Instruções de estilo:
      1. Estruture a resposta em formato de roteiro diário:
         **Dia 1 | Descrição**
         **Dia 2 | Descrição**
         ...
      2. Descreva brevemente as experiências, passeios, refeições e sensações de cada dia.
      3. Use linguagem inspiradora, mas objetiva (ideal para proposta comercial).
      4. Não invente valores ou nomes de hotéis específicos — use descrições genéricas como “hotel 4 estrelas à beira-mar”.
      5. O tom deve ser profissional, encantador e visualmente agradável para o cliente final.
      6. Ao final, adicione uma breve seção “Resumo do Pacote” com destaque para o que está incluso e não incluso.

      Retorne o texto puro, sem formatações Markdown.
    `;

    const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        // CORREÇÃO: Removido o parâmetro 'temperature'
        max_completion_tokens: maxTokens, 
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error("Erro da API OpenAI:", errorData);
      throw new Error('Falha ao comunicar com a IA.');
    }

    const responseData = await apiResponse.json();
    const roteiroGerado = responseData.choices[0].message.content;

    return NextResponse.json({ roteiro: roteiroGerado });

  } catch (error: any) {
    console.error("Erro na API /gerar-roteiro-proposta:", error);
    return NextResponse.json({ error: error.message || 'Erro interno do servidor.' }, { status: 500 });
  }
}