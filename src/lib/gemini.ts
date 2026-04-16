import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./db";

// Suporte para chaves globais (Painel Vercel geral) se for útil no futuro
export const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const geminiChat = genAI ? genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
}) : null;

export const geminiEmbedding = genAI ? genAI.getGenerativeModel({
  model: "text-embedding-004",
}) : null;

/**
 * Converte um texto limpo em uma matriz matemática de 768 posições para buscas exatas.
 */
export async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  const tenantGenAI = new GoogleGenerativeAI(apiKey);
  const model = tenantGenAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Roda a RAG inferindo os dados da chave dinâmica do Tenant (atendente) e sua Base de Conhecimento.
 */
export async function generateBotResponse(
  tenantId: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string
) {
  const tenantGenAI = new GoogleGenerativeAI(apiKey);
  let contextText = "";

  // 1. Buscador Vetorial Rápido (Recuperação de até 3 trechos de PDFs via Banco de Dados)
  try {
    const vector = await getEmbedding(userMessage, apiKey);
    const vectorString = `[${vector.join(',')}]`;

    const contextDocs = await prisma.$queryRaw<{content: string}[]>`
      SELECT content
      FROM document_embeddings
      WHERE "tenantId" = ${tenantId}
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT 3;
    `;

    if (contextDocs && contextDocs.length > 0) {
      contextText = contextDocs.map(doc => doc.content).join("\n\n");
    }
  } catch (error) {
    console.error("[Gemini RAG] Pesquisa Vetorial falhou ou vazia. Bot seguirá como Persona pura:", error);
  }

  // 2. Injeção de RAG Oculta (Geração)
  let finalSystemPrompt = systemPrompt || "Você é um assistente virtual prestativo e educado.";
  
  if (contextText) {
    finalSystemPrompt += `\n\n--- INFORMAÇÕES DE CONTEXTO TÉCNICO ---\nUse SOMENTE os dados técnicos abaixo como fonte de verdade para embasar a sua resposta matemática, de produto ou corporativa, caso eles tratem da pergunta do cliente. Se a dúvida não tiver correlação forte com as regras soltas abaixo, despreze-as e atue apenas com a sua Persona:\n\n${contextText}`;
  }
  
  const model = tenantGenAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: finalSystemPrompt, 
  });

  const chat = model.startChat({
    history: [],
  });
  
  try {
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("[Gemini RAG] Falha no fechamento da resposta final:", error);
    return "Desculpe, meu cérebro digital está passando por uma manutenção na nuvem. Pode repetir o que disse? 🤖";
  }
}
