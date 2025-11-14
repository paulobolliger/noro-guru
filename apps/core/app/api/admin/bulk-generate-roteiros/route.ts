// app/api/admin/bulk-generate-roteiros/route.ts
import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';
import { generateRoteiro, generateSEOMetadata } from '@/lib/ai/openai';

// Função helper para enviar eventos SSE
function sendSSE(controller: ReadableStreamDefaultController, message: string) {
  const data = `data: ${JSON.stringify({ message })}\n\n`;
  controller.enqueue(new TextEncoder().encode(data));
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const tenantId = await getCurrentTenantId();

  // Verificar autenticação
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return new Response('Não autenticado', { status: 401 });
  }

  // Obter dados do body
  const body = await request.json();
  const { destinos, options } = body;

  if (!destinos || !Array.isArray(destinos) || destinos.length === 0) {
    return new Response('Lista de destinos é obrigatória', { status: 400 });
  }

  // Criar stream para Server-Sent Events
  const stream = new ReadableStream({
    async start(controller) {
      try {
        sendSSE(controller, `🚀 Iniciando geração de ${destinos.length} roteiros...`);

        for (let i = 0; i < destinos.length; i++) {
          const destino = destinos[i];

          sendSSE(controller, `\n📍 [${i + 1}/${destinos.length}] Processando: ${destino}`);

          try {
            // Gerar conteúdo com OpenAI
            sendSSE(controller, `🤖 Gerando conteúdo com IA...`);

            const result = await generateRoteiro(destino, options);

            sendSSE(controller, `📊 Tokens: ${result.tokensUsed.total} | Custo: $${result.cost.total.toFixed(4)}`);

            // Gerar metadados SEO
            sendSSE(controller, `🔍 Gerando metadados SEO...`);
            const seoMetadata = await generateSEOMetadata(
              `Roteiro para ${destino}`,
              result.content
            );

            // Preparar dados do roteiro
            const titulo = `Roteiro para ${destino}`;
            const roteiroData = {
              tenant_id: tenantId,
              titulo,
              slug: `roteiro-${destino.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}`,
              destino: destino,
              tipo: options?.tipo || null,
              dificuldade: options?.dificuldade || null,
              categoria: options?.categoria || null,
              status: 'draft',
              conteudo: result.content,
              meta_title: seoMetadata.meta_title,
              meta_description: seoMetadata.meta_description,
              og_image: null,
              created_by: user.id,
              created_at: new Date().toISOString(),
            };

            // Salvar no banco de dados
            // IMPORTANTE: Ajustar nome da tabela conforme seu schema
            const { data: roteiro, error: dbError } = await supabase
              .from('roteiros') // Ajustar para o nome real da sua tabela
              .insert(roteiroData)
              .select()
              .single();

            if (dbError) {
              sendSSE(controller, `❌ Erro ao salvar ${destino}: ${dbError.message}`);
              continue;
            }

            // Registrar custo real da IA
            const costData = {
              tenant_id: tenantId,
              type: 'bulk_roteiro',
              title: roteiroData.titulo,
              text_cost: result.cost.text,
              image_cost: 0.0,
              total_cost: result.cost.total,
              metadata: {
                destino,
                options,
                tokens: result.tokensUsed,
              },
              created_at: new Date().toISOString(),
            };

            await supabase
              .from('ai_costs')
              .insert(costData);

            sendSSE(controller, `✅ ${destino} gerado com sucesso! (ID: ${roteiro.id.slice(0, 8)})`);

          } catch (error: any) {
            sendSSE(controller, `❌ Erro ao processar ${destino}: ${error.message}`);
          }
        }

        sendSSE(controller, `\n✨ Processo concluído! ${destinos.length} roteiros processados.`);
        sendSSE(controller, '[DONE]');

      } catch (error: any) {
        sendSSE(controller, `❌ ERRO FATAL: ${error.message}`);
      } finally {
        controller.close();
      }
    },
  });

  // Retornar stream com headers corretos para SSE
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
