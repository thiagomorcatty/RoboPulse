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
    // 1. Buscar o documento e o Tenant (precisamos da Gemini Key)
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { tenant: true }
    });

    if (!doc || !doc.tenant) {
      throw new Error("Documento ou Tenant não encontrado");
    }

    // Atualizar status para PROCESSING
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" }
    });

    // 2. Extrair Buffer do Data URI ou URL
    // No nosso caso atual, estamos salvando como Data URI no fileUrl
    const buffer = extractBufferFromDataUri(doc.fileUrl);
    
    // 3. Extrair Texto
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

    // 4. Dividir em Chunks (1000 chars com 200 de overlap)
    const chunks = chunkText(fullText, 1000, 200);
    console.log(`[Processor] ${chunks.length} chunks gerados para ${doc.fileName}`);

    // 5. Gerar Embeddings e Salvar
    // Se o Tenant não tiver chave própria, tentamos usar a global do sistema
    const apiKey = doc.tenant.geminiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("Gemini API Key não configurada para este perfil ou sistema.");
    }

    // Limpar embeddings antigos se existirem (para re-treinamento)
    await prisma.documentEmbedding.deleteMany({
      where: { documentId: doc.id }
    });

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk, apiKey);
      const vectorString = `[${embedding.join(",")}]`;

      // Inserção via SQL Puro devido ao tipo 'vector' (pgvector)
      await prisma.$executeRawUnsafe(`
        INSERT INTO document_embeddings ("id", "tenantId", "documentId", "content", "embedding", "createdAt")
        VALUES (
          '${crypto.randomUUID()}', 
          '${doc.tenantId}', 
          '${doc.id}', 
          $1, 
          '${vectorString}'::vector, 
          NOW()
        )
      `, chunk);
    }

    // 6. Finalizar
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "READY" }
    });

    console.log(`[Processor] Sucesso! Documento ${doc.fileName} está pronto para RAG.`);

  } catch (error: any) {
    console.error(`[Processor] Erro fatal no documento ${documentId}:`, error);
    
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "ERROR" }
    });
  }
}

/**
 * Função utilitária para dividir texto em blocos menores com sobreposição.
 */
function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  const cleanText = text.replace(/\s+/g, " ").trim();
  
  let i = 0;
  while (i < cleanText.length) {
    const end = Math.min(i + size, cleanText.length);
    chunks.push(cleanText.substring(i, end));
    i += (size - overlap);
    
    // Evitar loops infinitos se o texto for muito curto ou os parâmetros estranhos
    if (end === cleanText.length) break;
  }
  
  return chunks;
}

/**
 * Extrai o Buffer de uma string Base64 ou Data URI.
 */
function extractBufferFromDataUri(dataUrl: string): Buffer {
  if (dataUrl.startsWith("data:")) {
    const base64 = dataUrl.split(",")[1];
    return Buffer.from(base64, "base64");
  }
  return Buffer.from(dataUrl, "base64");
}
