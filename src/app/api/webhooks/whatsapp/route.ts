import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateBotResponse } from "@/lib/gemini";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

// ============================================
// GET: Webhook Verification (Meta Challenge)
// ============================================
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WhatsApp Webhook] Homologação Concluída com a Meta");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ============================================
// Lógica de Processamento (Assíncrona para não travar o Webhook)
// ============================================
async function processWebhookMessage(message: any, value: any, phoneNumberId: string) {
  const from = message.from;
  const messageId = message.id;
  const messageType = message.type;
  
  let content = "";
  if (messageType === "text") {
    content = message.text?.body || "";
  } else {
    content = `[Mídia do tipo ${messageType}]`;
  }

  try {
    // 1. LOCALIZAR O ATENDENTE (TENANT)
    const tenant = await prisma.tenant.findFirst({
      where: { whatsappPhoneId: phoneNumberId, isActive: true },
      include: { users: true }
    });

    if (!tenant) return;

    const tenantOwner = tenant.users.find(tu => tu.role === "OWNER") || tenant.users[0];
    if (!tenantOwner) return;

    // Idempotência
    const msgDuplicada = await prisma.message.findUnique({ where: { waMessageId: messageId } });
    if (msgDuplicada) return;

    // 2. REGISTRAR CONTACTO
    const contactName = value.contacts?.[0]?.profile?.name || from;
    let contact = await prisma.contact.findFirst({
      where: { waId: from, userId: tenantOwner.userId }
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          waId: from,
          name: contactName,
          userId: tenantOwner.userId,
          tenantId: tenant.id
        }
      });
    }

    // 3. CONVERSAÇÃO
    let conversation = await prisma.conversation.findFirst({
      where: { contactId: contact.id, tenantId: tenant.id, status: "ACTIVE" }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          tenantId: tenant.id,
          contactId: contact.id,
          status: "ACTIVE",
          botEnabled: true,
        }
      });
    }

    // 4. PERSISTIR MENSAGEM INBOUND
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: "INBOUND",
        content: content,
        messageType: "TEXT",
        waMessageId: messageId
      }
    });

    // 5. RESPOSTA DO BOT (Se habilitado e configurado)
    if (conversation.botEnabled && tenant.geminiKey) {
      const botReply = await generateBotResponse(
        tenant.id,
        tenant.geminiKey,
        tenant.systemPrompt,
        content
      );

      // Se a IA retornar erro ou vazio, ficamos em silêncio (conforme pedido pelo USER)
      if (!botReply || botReply.includes("Desculpe, meu cérebro digital")) {
        console.log(`[🤖] Silêncio mantido para ${from} devido a falha ou resposta vazia da IA.`);
        return;
      }

      if (tenant.whatsappToken) {
        await sendWhatsAppMessage(phoneNumberId, tenant.whatsappToken, from, botReply);
        
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            direction: "OUTBOUND",
            content: botReply,
            messageType: "TEXT"
          }
        });
      }
    }
  } catch (error) {
    console.error(`[Webhook Process error] Falha ao processar mensagem ${messageId}:`, error);
    // Silent failure to maintain "humanized" busy look
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 200 }); // Meta pede 200 mesmo em lixo
    }

    // Resposta imediata para a Meta (Fast-Ack) para evitar retries
    // No Next.js 15/16 podemos usar unstable_after se necessário, 
    // mas aqui disparamos o processamento e respondemos.
    
    const entries = body.entry || [];
    for (const entry of entries) {
      for (const change of (entry.changes || [])) {
        if (change.field !== "messages") continue;
        
        const value = change.value;
        const phoneNumberId = value.metadata?.phone_number_id;

        // Processa Status (Update silencioso)
        for (const status of (value.statuses || [])) {
          console.log(`[Meta Status] ${status.id} -> ${status.status}`);
        }

        // Processa Mensagens (Trigger assíncrono)
        for (const message of (value.messages || [])) {
          // Chamada sem await para liberar o Webhook
          processWebhookMessage(message, value, phoneNumberId).catch(console.error);
        }
      }
    }

    return NextResponse.json({ status: "accepted" }, { status: 200 });
  } catch (error) {
    console.error("[WhatsApp Webhook Critical]:", error);
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
