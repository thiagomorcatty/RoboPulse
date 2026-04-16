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
// POST: Incoming Messages & Status Updates
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const entries = body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        if (change.field !== "messages") continue;

        const value = change.value;
        const metadata = value.metadata;
        const phoneNumberId = metadata?.phone_number_id;

        // Verifica Status das mensagens enviadas (Entregue/Lida) e finaliza o loop
        const statuses = value.statuses || [];
        for (const status of statuses) {
          console.log(`[Meta Status] ${status.id} -> ${status.status}`);
        }

        // Processa Mensagens Recebidas (Inbound)
        const messages = value.messages || [];
        for (const message of messages) {
          const from = message.from; // Sender's WhatsApp number (Lead)
          const messageId = message.id;
          const messageType = message.type;
          
          // Tratamento inicial pra texto. No futuro, expandir para mídias (áudio, foto)
          let content = "";
          if (messageType === "text") {
            content = message.text?.body || "";
          } else {
            content = `[Mídia do tipo ${messageType} pendente de transcrição]`;
          }

          console.log(`[Inbound] Nova msg de ${from} p/ ID ${phoneNumberId}: ${content}`);

          // --- 1. LOCALIZAR O ATENDENTE (TENANT) PROPRIETÁRIO DO BOT ---
          const tenant = await prisma.tenant.findFirst({
            where: { whatsappPhoneId: phoneNumberId, isActive: true },
            include: { users: true }
          });

          if (!tenant) {
            console.error(`[Aviso] Nenhuma conta/perfil ativa vinculada ao Phone ID: ${phoneNumberId}`);
            continue;
          }

          // Pegamos o Dono deste Atendente (Admin do sistema do cliente logado)
          const tenantOwner = tenant.users.find(tu => tu.role === "OWNER") || tenant.users[0];
          if (!tenantOwner) continue;

          // Evitar processamento de mensagens duplicadas (idempotência)
          const msgDuplicada = await prisma.message.findUnique({ where: { waMessageId: messageId } });
          if (msgDuplicada) continue;

          // --- 2. REGISTRAR O CONTACTO (LEAD) ---
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
            console.log(`[Nova Lead] Contato ${contactName} salvo!`);
          }

          // --- 3. CONECTAR OU ABRIR NOVA CONVERSAÇÃO ATIVA ---
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

          // --- 4. PERSISTIR A MENSAGEM INBOUND NA TIMELINE ---
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              direction: "INBOUND",
              content: content,
              messageType: "TEXT",
              waMessageId: messageId
            }
          });

          // --- 5. RAG / GEMINI: DEVOLVER RESPOSTA DO BOT SE ATIVADO ---
          if (conversation.botEnabled && tenant.geminiKey) {
            console.log(`[🤖] Bot Ativado - Pensando na resposta para o Perfil: ${tenant.name}...`);
            
            // Aqui a "Magia" ocorre: Módulo Geminis com as Prompts dinâmicas e Pesquisa no DB
            const botReply = await generateBotResponse(
               tenant.id,
               tenant.geminiKey,
               tenant.systemPrompt,
               content
            );

            if (tenant.whatsappToken) {
               // Disparo oficial com o Cartão Meta
               try {
                 await sendWhatsAppMessage(
                   phoneNumberId,
                   tenant.whatsappToken,
                   from,
                   botReply
                 );
                 
                 // Persistir a Resposta do robô na Timeline Outbound
                 await prisma.message.create({
                   data: {
                     conversationId: conversation.id,
                     direction: "OUTBOUND",
                     content: botReply,
                     messageType: "TEXT"
                     // Outbound bots geralmente não têm waMessageId estrito até o callback, deixando null
                   }
                  });
               } catch (e) {
                 console.error("[Disparo Oficial Meta] Falha crítica de conexão:", e);
               }
            } else {
               console.warn(`[Configuração Incompleta] O Perfil ${tenant.name} tem IA ligada, mas o Token do WhatsApp não está preenchido.`);
            }
          }
        }
      }
    }

    // Serverless Acknowledgment - Responder HTTP 200 no final do ciclo
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("[WhatsApp Webhook Critical] Ocorreu uma exceção no loop principal:", error);
    return NextResponse.json(
      { error: "Internal server error no processamento" },
      { status: 500 }
    );
  }
}
