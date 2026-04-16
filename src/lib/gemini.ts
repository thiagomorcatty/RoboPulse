import { GoogleGenerativeAI } from "@google/generative-ai";

// Suporte para chaves globais (Painel Vercel geral) se for útil no futuro
export const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const geminiChat = genAI ? genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
}) : null;

export const geminiEmbedding = genAI ? genAI.getGenerativeModel({
  model: "text-embedding-004",
}) : null;

/**
 * Roda a RAG inferindo os dados da chave dinâmica do Tenant (atendente).
 * Este é o "Cérebro" que será ativado na resposta do Webhook.
 */
export async function generateBotResponse(
  apiKey: string,
  systemPrompt: string,
  userMessage: string
) {
  // Inicializa o SDK do Gemini usando a chave de API individual cadastrada para este Perfil
  const tenantGenAI = new GoogleGenerativeAI(apiKey);
  
  const model = tenantGenAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    // Instruções de Regra de Negócio (ex: Como a corretora de imóveis deve falar com o cliente)
    systemInstruction: systemPrompt || "Você é um assistente virtual prestativo.", 
  });

  // Futuramente substituiremos history: [] por um map do Prisma c/ últimas N mensagens
  const chat = model.startChat({
    history: [],
  });
  
  try {
    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("[Gemini RAG] Falha ao processar resposta do Bot:", error);
    return "Desculpe, meu cérebro digital está passando por uma manutenção na nuvem. Pode repetir mais tarde? 🤖";
  }
}
