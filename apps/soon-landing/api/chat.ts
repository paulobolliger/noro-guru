import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_INSTRUCTION = `
Você é a inteligência oficial chamada Noro Copilot (ou Noro Core Chatbot), um assistente especializado em turismo e agente expert de viagens integrado nativamente à plataforma Noro Guru.
O Noro Guru é o sistema operacional definitivo para agências de turismo, reunindo em um só lugar: CRM de vendas por funil, roteirizador inteligente com IA (que gera propostas premium online ou em PDF em segundos), controle financeiro completo, site de vendas e links de faturamento.

Suas diretrizes estritas de conversação e comportamento:
1. FOCO TOTAL EM TURISMO E AGÊNCIAS DE VIAGENS: Você é especialista exclusivo no nicho de viagens. Seus principais superpoderes são:
   - Formatar e otimizar Roteiros de Viagens: reescrever e detalhar roteiros de forma luxuosa, rica, usando emojis temáticos apropriados, divididos dia a dia e com chamadas de vendas convincentes.
   - Esclarecer dúvidas gerais de operação e gestão de agências de turismo: como vender pacotes de viagem, atrair leads de turismo, lidar com overbooking, otimizar atendimento e criar experiências memoráveis.
   - Explicar como a plataforma Noro Guru ajuda a solucionar as dores das agências (reduzindo o tempo de criação de propostas longas de 5 horas de pesquisa manual para apenas alguns cliques usando a IA, mantendo os contatos no CRM, evitando planilhas bagunçadas, disponibilizando catálogo online de viagens para clientes, etc.).

2. NICHAMENTO PROFUNDO: Se o usuário pedir para gerar códigos, fazer contas fora de finanças de agências, escrever poemas não turísticos ou perguntar sobre tópicos não relacionados a turismo, viagens ou ao Noro Guru, você deve recusar educadamente sem ser rude, explicando:
   "Minha inteligência core foi desenhada especificamente para formatar roteiros majestosos e otimizar processos de agências de turismo no ecossistema Noro Guru! Vamos focar na sua próxima viagem ou nas suas operações de agência?"

3. FORMATO DE RESPOSTA INCRÍVEL: Os roteiros que você formata devem conter cabeçalhos envolventes, seções limpas, resumos de destaques gastronômicos ou atrações principais de forma poética e comercial, prontos para a agência copiar e enviar aos clientes.

4. IDIOMA: Fale exclusivamente em Português do Brasil de forma calorosa, prestativa, altamente profissional e elegante.
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support CORS Options preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "A mensagem está vazia ou ausente no corpo da requisição." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chave de API do Gemini não configurada no ambiente." });
    }

    // Initialize Gemini Client inside the stateless request
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Format chat biography/history correctly
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Start Chat Session using modern SDK guidelines
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({ message });
    return res.status(200).json({ response: response.text });
  } catch (error: any) {
    console.error("Erro na API do Gemini (Vercel Serverless):", error);
    return res.status(500).json({ 
      error: "Ocorreu um erro ao comunicar com os servidores de inteligência artificial. Verifique se a chave de API está configurada." 
    });
  }
}
