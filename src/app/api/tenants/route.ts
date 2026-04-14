import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            contacts: true,
            conversations: true,
            documents: true,
          },
        },
      },
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error("[API Tenants] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}
