"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getConversations(tenantId: string) {
  if (!tenantId) return [];
  
  try {
    const conversations = await prisma.conversation.findMany({
      where: { tenantId },
      include: {
        contact: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return conversations;
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return [];
  }
}

export async function getMessages(conversationId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
    return messages;
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return [];
  }
}

export async function sendMessage(conversationId: string, content: string, userId?: string) {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        direction: "OUTBOUND",
        sentByUserId: userId,
      },
    });

    // Atualizar o timestamp da conversa
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/dashboard/inbox");
    return { success: true, message };
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return { success: false };
  }
}
