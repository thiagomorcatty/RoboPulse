import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tenantId = searchParams.get("tenantId");

  try {
    const where = tenantId ? { tenantId } : {};
    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        tenant: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[API Documents] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const tenantId = formData.get("tenantId") as string | null;
    const title = formData.get("title") as string | null;

    if (!file || !tenantId) {
      return NextResponse.json(
        { error: "File and tenantId are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, DOCX and TXT files are allowed" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Maximum file size is 10MB" },
        { status: 400 }
      );
    }

    // Tenant must exist
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) {
      return NextResponse.json(
        { error: "Tenant not found" },
        { status: 404 }
      );
    }

    // Convert file to base64 and store as data URI
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Determine file extension
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";

    // Save document record
    const document = await prisma.document.create({
      data: {
        tenantId,
        title: title || file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        fileUrl: dataUri,
        fileType: ext,
        fileSize: file.size,
        status: "PENDING",
      },
    });

    console.log(
      `[Documents] Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)}KB) for tenant ${tenant.name}`
    );

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("[API Documents] Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
