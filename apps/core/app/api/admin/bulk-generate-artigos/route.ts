// app/api/admin/bulk-generate-artigos/route.ts
import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';
import { generateArtigo, generateSEOMetadata } from '@/lib/ai/openai';

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
  const { topicos, options } = body;

  if (!topicos || !Array.isArray(topicos) || topicos.length === 0) {
    return new Response('Lista de tópicos é obrigatória', { status: 400 });
  }

  // Criar stream para Server-Sent Events
  const stream = new ReadableStream({
    async start(controller) {
      try {
        sendSSE(controller, `🚀 Iniciando geração de ${topicos.length} artigos...`);

        for (let i = 0; i < topicos.length; i++) {
          const topico = topicos[i];

          sendSSE(controller, `\n📝 [${i + 1}/${topicos.length}] Processando: ${topico}`);

          try {
            // Gerar conteúdo com OpenAI
            sendSSE(controller, `🤖 Gerando artigo com IA...`);

            const result = await generateArtigo(topico, options);

            sendSSE(controller, `📊 Tokens: ${result.tokensUsed.total} | Custo: $${result.cost.total.toFixed(4)}`);

            // Gerar metadados SEO
            sendSSE(controller, `🔍 Gerando metadados SEO...`);
            const seoMetadata = await generateSEOMetadata(topico, result.content);

            // Preparar dados do artigo
            const artigoData = {
              tenant_id: tenantId,
              titulo: topico,
              slug: topico.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 100),
              conteudo: result.content,
              categoria: options?.categoria || null,
              tom: options?.tom || 'Informativo',
              tamanho: options?.tamanho || 'Médio',
              status: 'draft',
              meta_title: seoMetadata.meta_title,
              meta_description: seoMetadata.meta_description,
              og_image: null,
              tags: [],
              created_by: user.id,
              created_at: new Date().toISOString(),
            };

            // Salvar no banco de dados
            // IMPORTANTE: Ajustar nome da tabela conforme seu schema
            const { data: artigo, error: dbError } = await supabase
              .from('artigos') // Ajustar para o nome real da sua tabela
              .insert(artigoData)
              .select()
              .single();

            if (dbError) {
              sendSSE(controller, `❌ Erro ao salvar "${topico}": ${dbError.message}`);
              continue;
            }

            // Registrar custo real da IA
            const costData = {
              tenant_id: tenantId,
              type: 'bulk_artigo',
              title: artigoData.titulo,
              text_cost: result.cost.text,
              image_cost: 0.0,
              total_cost: result.cost.total,
              metadata: {
                topico,
                options,
                tokens: result.tokensUsed,
              },
              created_at: new Date().toISOString(),
            };

            await supabase
              .from('ai_costs')
              .insert(costData);

            sendSSE(controller, `✅ "${topico}" gerado com sucesso! (ID: ${artigo.id.slice(0, 8)})`);

          } catch (error: any) {
            sendSSE(controller, `❌ Erro ao processar "${topico}": ${error.message}`);
          }
        }

        sendSSE(controller, `\n✨ Processo concluído! ${topicos.length} artigos processados.`);
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
