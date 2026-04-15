"use server";

import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as any;
  const whatsapp = formData.get("whatsapp") as string;

  try {
    // 1. Criar usuário no Firebase via Admin SDK
    // Isso evita deslogar o admin atual
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Sincronizar com Prisma
    await prisma.user.create({
      data: {
        email,
        name,
        firebaseUid: userRecord.uid,
        role: role || "USER",
        whatsapp: whatsapp || null,
      },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string, firebaseUid: string) {
  try {
    // 1. Remover do Firebase
    await adminAuth.deleteUser(firebaseUid);

    // 2. Remover do Prisma
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao eliminar usuário:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUser(id: string, data: any) {
  try {
    // 1. Atualizar no Prisma
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        whatsapp: data.whatsapp,
        // Campos de configuração futura (APIs, etc) podem ser guardados em JSON ou novas colunas
      },
    });

    // 2. Opcional: Atualizar no Firebase se o nome mudou
    if (data.name) {
      await adminAuth.updateUser(updated.firebaseUid, {
        displayName: data.name,
      });
    }

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    return { success: false, error: error.message };
  }
}
