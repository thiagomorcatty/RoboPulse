import crypto from "crypto";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import { prisma } from "./db";
import { getEmbedding } from "./gemini";

/**
 * Orquestrador principal do treinamento de um documento.
 */
export async function processDocument(documentId: string) {
  console.log(`[Processor] Iniciando treinamento do documento: ${documentId}`);
  
  try {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { tenant: true }
    });

    if (!doc || !doc.tenant) {
      throw new Error("Documento ou Tenant não encontrado");
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" }
    });

    const buffer = extractBufferFromDataUri(doc.fileUrl);
    
    let fullText = "";
    if (doc.fileType === "pdf") {
      const data = await pdf(buffer);
      fullText = data.text;
    } else if (doc.fileType === "docx") {
      const data = await mammoth.extractRawText({ buffer });
      fullText = data.value;
    } else {
      fullText = buffer.toString("utf-8");
    }

    if (!fullText.trim()) {
      throw new Error("Não foi possível extrair texto do documento.");
    }

    // Chunks dinâmicos respeitando pontuação
    const chunks = chunkText(fullText, 1000, 200);
    console.log(`[Processor] ${chunks.length} chunks inteligentes gerados para ${doc.fileName}`);

    const apiKey = doc.tenant.geminiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API Key ausente");

    await prisma.documentEmbedding.deleteMany({
      where: { documentId: doc.id }
    });

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk, apiKey);
      const vectorString = `[${embedding.join(",")}]`;

      // Inserção segura via Template Tags
      await prisma.$executeRaw`
        INSERT INTO document_embeddings ("id", "tenantId", "documentId", "content", "embedding", "createdAt")
        VALUES (
          ${crypto.randomUUID()}, 
          ${doc.tenantId}, 
          ${doc.id}, 
          ${chunk}, 
          ${vectorString}::vector, 
          NOW()
        )
      `;
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { status: "READY" }
    });

    console.log(`[Processor] Sucesso! Documento ${doc.fileName} pronto.`);

  } catch (error: any) {
    console.error(`[Processor] Erro:`, error);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "ERROR" }
    });
  }
}

/**
 * Divide o texto tentando quebrar em frases completas.
 */
function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  const cleanText = text.replace(/\s+/g, " ").trim();
  
  let start = 0;
  while (start < cleanText.length) {
    let end = Math.min(start + size, cleanText.length);
    
    // Tentar encontrar um ponto final, interrogação ou exclamação próximo do fim para não cortar a frase
    if (end < cleanText.length) {
      const lastSentenceEnd = cleanText.lastIndexOf(". ", end);
      const lastQuestion = cleanText.lastIndexOf("? ", end);
      const lastExclamation = cleanText.lastIndexOf("! ", end);
      
      const bestEnd = Math.max(lastSentenceEnd, lastQuestion, lastExclamation);
      
      // Se encontrar um fim de frase nos últimos 20% do chunk, quebra ali
      if (bestEnd > start + (size * 0.8)) {
        end = bestEnd + 1;
      }
    }
    
    chunks.push(cleanText.substring(start, end).trim());
    start = end - overlap;
    
    // Garantir progresso
    if (start >= cleanText.length || end === cleanText.length) break;
    if (start < 0) start = 0;
  }
  
  return chunks;
}

function extractBufferFromDataUri(dataUrl: string): Buffer {
  if (dataUrl.startsWith("data:")) {
    const base64 = dataUrl.split(",")[1];
    return Buffer.from(base64, "base64");
  }
  return Buffer.from(dataUrl, "base64");
}
