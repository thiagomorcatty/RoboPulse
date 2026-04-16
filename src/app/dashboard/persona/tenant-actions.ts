"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateTenant(id: string, data: any) {
  try {
    await prisma.tenant.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        segment: data.segment,
        description: data.description,
        systemPrompt: data.systemPrompt,
        temperature: data.temperature !== undefined ? parseFloat(data.temperature.toString()) : 0.7,
        geminiKey: data.geminiKey,
        whatsappPhoneId: data.whatsappPhoneId,
        whatsappToken: data.whatsappToken,
        calendarId: data.calendarId,
      },
    });

    revalidatePath("/dashboard/persona");
    revalidatePath("/dashboard/integrations");
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    return { success: false, error: error.message };
  }
}

export async function createTenant(userId: string, data: any) {
  try {
    const slug = data.name.toLowerCase().replace(/ /g, "-") + "-" + Math.floor(Math.random() * 1000);
    
    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: slug,
        segment: data.segment || "Geral",
        description: data.description || "",
        systemPrompt: data.systemPrompt || "Você é um atendente prestativo.",
        temperature: 0.7,
        users: {
          create: {
            userId: userId,
            role: "OWNER",
          },
        },
      },
    });

    revalidatePath("/dashboard/persona");
    return { success: true, tenant };
  } catch (error: any) {
    console.error("Erro ao criar perfil:", error);
    return { success: false, error: error.message };
  }
}
