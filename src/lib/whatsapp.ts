export async function sendWhatsAppMessage(
  phoneId: string,
  token: string,
  to: string,
  message: string
) {
  const url = `https://graph.facebook.com/v22.0/${phoneId}/messages`;
  
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to, // O número do destinatário, deve incluir DDI (ex: 551199999999)
    type: "text",
    text: { preview_url: false, body: message },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("[WhatsApp Meta API] Erro ao enviar:", JSON.stringify(errorData, null, 2));
    throw new Error(`Falha no disparo WhatsApp: ${response.statusText}`);
  }

  const result = await response.json();
  console.log(`[WhatsApp Meta API] Mensagem enviada para ${to}. Meta Message ID: ${result.messages?.[0]?.id}`);
  return result;
}
