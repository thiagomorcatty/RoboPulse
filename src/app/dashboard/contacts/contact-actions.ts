"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createContact(userId: string, data: any) {
  try {
    // Garantir que o waId (número) só tenha dígitos
    const cleanWaId = data.waId.replace(/\D/g, "");

    const contact = await prisma.contact.create({
      data: {
        userId,
        waId: cleanWaId,
        name: data.name,
        email: data.email,
        tenantId: data.tenantId || null,
      },
    });

    revalidatePath("/dashboard/contacts");
    return { success: true, contact };
  } catch (error: any) {
    console.error("Erro ao criar contacto:", error);
    return { success: false, error: error.message };
  }
}

export async function updateContact(id: string, data: any) {
  try {
    await prisma.contact.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        waId: data.waId ? data.waId.replace(/\D/g, "") : undefined,
      },
    });

    revalidatePath("/dashboard/contacts");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar contacto:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });

    revalidatePath("/dashboard/contacts");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao eliminar contacto:", error);
    return { success: false, error: error.message };
  }
}

export async function importContacts(userId: string, contacts: any[]) {
  try {
    // Processamento em lote (Batch Upsert ou CreateMany)
    // Para simplificar, usaremos um loop com tratamento de erro individual ou transação
    const results = await Promise.all(
      contacts.map(async (c) => {
        const cleanWaId = c.waId.replace(/\D/g, "");
        if (!cleanWaId) return null;

        return prisma.contact.upsert({
          where: {
            userId_waId: {
              userId,
              waId: cleanWaId,
            },
          },
          update: {
            name: c.name || undefined,
            email: c.email || undefined,
          },
          create: {
            userId,
            waId: cleanWaId,
            name: c.name || "",
            email: c.email || "",
          },
        });
      })
    );

    revalidatePath("/dashboard/contacts");
    return { success: true, count: results.filter(r => r !== null).length };
  } catch (error: any) {
    console.error("Erro na importação CSV:", error);
    return { success: false, error: error.message };
  }
}
