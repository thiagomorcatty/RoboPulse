import { NextRequest, NextResponse } from "next/server";

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
    console.log("[WhatsApp Webhook] Verification successful");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("[WhatsApp Webhook] Verification failed - token mismatch");
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ============================================
// POST: Incoming Messages & Status Updates
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // WhatsApp Cloud API always sends an 'object' field
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

        // Process incoming messages
        const messages = value.messages || [];
        for (const message of messages) {
          const from = message.from; // Sender's WhatsApp number
          const messageId = message.id;
          const timestamp = message.timestamp;
          const messageType = message.type;

          let content = "";

          switch (messageType) {
            case "text":
              content = message.text?.body || "";
              break;
            case "image":
            case "document":
            case "audio":
            case "video":
              content = message[messageType]?.caption || `[${messageType}]`;
              break;
            case "location":
              content = `[location: ${message.location?.latitude}, ${message.location?.longitude}]`;
              break;
            default:
              content = `[${messageType}]`;
          }

          console.log(
            `[WhatsApp] Message from ${from} (phone_id: ${phoneNumberId}): ${content}`
          );

          // TODO: Phase 3 - Process message through RAG pipeline
          // 1. Find Tenant by phoneNumberId
          // 2. Find or create Contact by 'from' number
          // 3. Find or create Conversation
          // 4. Save inbound Message
          // 5. If bot_enabled, run RAG pipeline with Gemini
          // 6. Send response back via WhatsApp API
        }

        // Process status updates (sent, delivered, read)
        const statuses = value.statuses || [];
        for (const status of statuses) {
          console.log(
            `[WhatsApp] Status update: ${status.id} -> ${status.status}`
          );
        }
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("[WhatsApp Webhook] Error processing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
