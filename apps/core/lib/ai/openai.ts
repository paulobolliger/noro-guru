// lib/ai/openai.ts
import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';

/**
 * Interface para resultado de geração
 */
export interface GenerationResult {
  content: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: {
    text: number;
    total: number;
  };
}

/**
 * Calcula o custo baseado nos tokens usados
 */
function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: string
): { text: number; total: number } {
  // Preços por 1M tokens (ajustar conforme modelo usado)
  const prices: Record<string, { input: number; output: number }> = {
    'gpt-4-turbo-preview': {
      input: 10 / 1_000_000,    // $10 por 1M tokens
      output: 30 / 1_000_000,   // $30 por 1M tokens
    },
    'gpt-4': {
      input: 30 / 1_000_000,
      output: 60 / 1_000_000,
    },
    'gpt-3.5-turbo': {
      input: 0.5 / 1_000_000,
      output: 1.5 / 1_000_000,
    },
  };

  const modelPrices = prices[model] || prices['gpt-4-turbo-preview'];

  const textCost =
    (promptTokens * modelPrices.input) +
    (completionTokens * modelPrices.output);

  return {
    text: textCost,
    total: textCost,
  };
}

/**
 * Gera um roteiro de viagem usando OpenAI
 */
export async function generateRoteiro(
  destino: string,
  options: {
    tipo?: string;
    dificuldade?: string;
    categoria?: string;
  } = {}
): Promise<GenerationResult> {
  const { tipo, dificuldade, categoria } = options;

  const prompt = `
Você é um especialista em turismo e criação de roteiros de viagem detalhados.

Crie um roteiro completo e detalhado para: ${destino}

Informações adicionais:
${tipo ? `- Tipo de turismo: ${tipo}` : ''}
${dificuldade ? `- Nível de dificuldade: ${dificuldade}` : ''}
${categoria ? `- Categoria: ${categoria}` : ''}

O roteiro deve incluir:

1. **Introdução** (2-3 parágrafos)
   - Visão geral do destino
   - Por que visitar
   - Melhor época para ir

2. **Informações Essenciais**
   - Como chegar
   - Documentação necessária
   - Moeda e custos médios
   - Idioma

3. **Itinerário Dia a Dia** (mínimo 3 dias, ideal 5-7 dias)
   Para cada dia:
   - Manhã: atividades e locais
   - Tarde: atividades e locais
   - Noite: sugestões de jantar e entretenimento
   - Dicas práticas

4. **Atrações Principais**
   Lista das top 10 atrações com:
   - Nome
   - Descrição breve
   - Tempo sugerido de visita
   - Preço médio (se aplicável)

5. **Gastronomia**
   - Pratos típicos para experimentar
   - Restaurantes recomendados (3-5)
   - Dicas de onde comer

6. **Dicas Práticas**
   - Transporte local
   - Segurança
   - Comunicação
   - Costume locais
   - O que levar na mala

7. **Orçamento Estimado**
   - Hospedagem (baixo, médio, alto)
   - Alimentação
   - Transporte
   - Atrações
   - Total estimado por dia

Formate em HTML válido e bem estruturado, usando tags semânticas (h2, h3, p, ul, ol, etc).
Seja detalhado, prático e útil. Inclua informações atualizadas e relevantes.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em turismo e roteiros de viagem. Crie conteúdo detalhado, prático e bem formatado em HTML.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    const cost = calculateCost(
      usage.prompt_tokens,
      usage.completion_tokens,
      DEFAULT_MODEL
    );

    return {
      content,
      tokensUsed: {
        prompt: usage.prompt_tokens,
        completion: usage.completion_tokens,
        total: usage.total_tokens,
      },
      cost,
    };
  } catch (error: any) {
    console.error('Erro ao gerar roteiro com OpenAI:', error);
    throw new Error(`Falha na geração: ${error.message}`);
  }
}

/**
 * Gera um artigo de blog usando OpenAI
 */
export async function generateArtigo(
  topico: string,
  options: {
    categoria?: string;
    tom?: string;
    tamanho?: string;
  } = {}
): Promise<GenerationResult> {
  const { categoria, tom, tamanho } = options;

  // Mapear tamanho para tokens aproximados
  const tamanhoMap: Record<string, number> = {
    'Curto': 1000,
    'Médio': 2000,
    'Longo': 3500,
  };
  const maxTokens = tamanhoMap[tamanho || 'Médio'] || 2000;

  const prompt = `
Você é um redator especializado em conteúdo de viagens e turismo.

Escreva um artigo de blog completo sobre: ${topico}

Informações adicionais:
${categoria ? `- Categoria: ${categoria}` : ''}
${tom ? `- Tom de escrita: ${tom}` : ''}
${tamanho ? `- Tamanho: ${tamanho}` : ''}

O artigo deve incluir:

1. **Título Atrativo** (H1)
   - Use o tópico como base
   - Torne-o cativante e SEO-friendly

2. **Introdução Engajadora** (2-3 parágrafos)
   - Apresente o tema
   - Crie conexão com o leitor
   - Prometa valor

3. **Conteúdo Principal**
   - Divida em seções lógicas (H2)
   - Use subtítulos (H3) quando apropriado
   - Inclua listas (ul/ol) para facilitar leitura
   - Seja informativo e prático
   - Adicione dicas úteis

4. **Conclusão**
   - Resume pontos principais
   - Call-to-action
   - Encoraje engajamento

5. **SEO**
   - Use palavras-chave naturalmente
   - Estrutura clara com headings
   - Parágrafos curtos e escaneáveis

Formate em HTML válido e bem estruturado.
Use o tom ${tom || 'informativo'} durante todo o texto.
Seja ${tamanho === 'Curto' ? 'conciso e direto' : tamanho === 'Longo' ? 'detalhado e aprofundado' : 'equilibrado entre informação e concisão'}.
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: `Você é um redator expert em conteúdo de viagens. Escreva artigos ${tom || 'informativos'} e envolventes em HTML.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: maxTokens,
    });

    const content = completion.choices[0]?.message?.content || '';
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    const cost = calculateCost(
      usage.prompt_tokens,
      usage.completion_tokens,
      DEFAULT_MODEL
    );

    return {
      content,
      tokensUsed: {
        prompt: usage.prompt_tokens,
        completion: usage.completion_tokens,
        total: usage.total_tokens,
      },
      cost,
    };
  } catch (error: any) {
    console.error('Erro ao gerar artigo com OpenAI:', error);
    throw new Error(`Falha na geração: ${error.message}`);
  }
}

/**
 * Gera metadados SEO para conteúdo usando OpenAI
 */
export async function generateSEOMetadata(
  titulo: string,
  conteudo: string
): Promise<{
  meta_title: string;
  meta_description: string;
}> {
  const prompt = `
Com base no seguinte conteúdo, gere metadados SEO otimizados:

Título: ${titulo}

Conteúdo: ${conteudo.substring(0, 1000)}...

Gere:
1. meta_title: Título otimizado para SEO (máximo 60 caracteres)
2. meta_description: Descrição atrativa (máximo 160 caracteres)

Retorne APENAS em formato JSON:
{
  "meta_title": "...",
  "meta_description": "..."
}
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Usar modelo mais barato para metadados
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em SEO. Retorne apenas JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const metadata = JSON.parse(content);

    return {
      meta_title: metadata.meta_title || titulo.substring(0, 60),
      meta_description: metadata.meta_description || '',
    };
  } catch (error: any) {
    console.error('Erro ao gerar metadados SEO:', error);
    // Fallback em caso de erro
    return {
      meta_title: titulo.substring(0, 60),
      meta_description: '',
    };
  }
}
