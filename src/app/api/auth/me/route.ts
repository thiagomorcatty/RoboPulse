import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // 1. Verificar o token no Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(session);
    const email = decodedToken.email;

    // 2. Buscar no Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
  }
}
