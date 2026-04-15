"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateAccount(userId: string, data: any) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        darkMode: data.darkMode,
      },
    });

    revalidatePath("/dashboard/account");
    revalidatePath("/dashboard/layout");
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar conta:", error);
    return { success: false, error: error.message };
  }
}
