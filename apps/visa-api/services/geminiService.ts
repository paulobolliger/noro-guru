import { GoogleGenAI } from "@google/genai";
import type { CountryVisaInfo } from "../types";

// IMPORTANT: This key is managed externally and assumed to be set in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateSummaryWithAI = async (countryInfo: CountryVisaInfo): Promise<string> => {
  if (!API_KEY) return "AI service is unavailable. API key not configured.";

  const { country, general_info, required_documents, process_steps } = countryInfo;

  const prompt = `
    Baseado nas seguintes informações sobre o visto para ${country}, gere uma dica de aprovação concisa e útil em português do Brasil. A dica deve ser um parágrafo curto e direto ao ponto.

    - Custo: ${general_info.totalCost}
    - Validade Máxima: ${general_info.maxValidity}
    - Tempo de Processamento: ${general_info.processingTime}
    - Entrevista Necessária: ${general_info.interviewRequired ? 'Sim' : 'Não'}
    - Biometria Necessária: ${general_info.biometricsRequired ? 'Sim' : 'Não'}
    - Documentos Essenciais: ${required_documents.join(', ')}
    - Primeiro Passo do Processo: ${process_steps[0]?.title || 'Não informado'}

    Foque em um conselho prático que ajude a aumentar as chances de aprovação do visto.
    Exemplo: "Para o visto da ${country}, o segredo é a organização financeira. Apresente extratos bancários consistentes dos últimos 3 meses para comprovar seus vínculos e capacidade de custear a viagem, pois este é o ponto mais analisado."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Não foi possível gerar a dica de aprovação. Tente novamente.";
  }
};


export const researchTopicWithAI = async (countryName: string, topic: string): Promise<string> => {
  if (!API_KEY) return "AI service is unavailable. API key not configured.";

  const prompt = `
    Como um assistente de pesquisa especializado em viagens, sua tarefa é encontrar informações precisas e atualizadas sobre o seguinte tópico para um cidadão brasileiro viajando para ${countryName}.

    Tópico da Pesquisa: "${topic}"

    Instruções:
    1.  Forneça uma resposta clara, concisa e em português do Brasil.
    2.  Priorize informações de fontes oficiais (consulados, embaixadas, ministérios da saúde).
    3.  Se encontrar um link para a fonte oficial, inclua-o no final da sua resposta.
    4.  Se não encontrar uma resposta definitiva, informe que a informação não foi encontrada em fontes confiáveis e recomende consultar o consulado.

    Exemplo de Tópico: "Vacina de febre amarela é obrigatória?"
    Exemplo de Resposta:
    Sim, o Certificado Internacional de Vacinação ou Profilaxia (CIVP) contra a febre amarela é obrigatório para a entrada na ${countryName}. A vacina deve ser tomada pelo menos 10 dias antes da viagem.
    Fonte: [link para o site do consulado ou órgão de saúde]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for research:", error);
    return "Ocorreu um erro ao pesquisar com a IA. Por favor, tente novamente.";
  }
};