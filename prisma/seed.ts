import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

import { adminAuth } from "../src/lib/firebase-admin";

async function main() {
  console.log("🌱 Seeding database...");

  const email = "admin@email.com";
  const password = "Senha123!";
  const name = "Admin";
  let firebaseUid = "";

  try {
    // 1. Tentar encontrar ou criar no Firebase
    try {
      const userRecord = await adminAuth.getUserByEmail(email);
      firebaseUid = userRecord.uid;
      console.log("ℹ️ User already exists in Firebase:", firebaseUid);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        const userRecord = await adminAuth.createUser({
          email,
          password,
          displayName: name,
        });
        firebaseUid = userRecord.uid;
        console.log("✅ User created in Firebase:", firebaseUid);
      } else {
        throw error;
      }
    }

    // 2. Upsert no Prisma
    const adminUser = await prisma.user.upsert({
      where: { email },
      update: {
        firebaseUid,
        name,
        role: "ADMIN",
      },
      create: {
        email,
        name,
        firebaseUid,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin user synced in Prisma:", adminUser.email);

  // Create 5 example tenant profiles
  const tenants = [
    {
      name: "Contabilidade Lisboa",
      slug: "contabilidade-lisboa",
      segment: "contabilidade",
      description:
        "Gabinete de contabilidade e fiscalidade em Lisboa. Especializado em IRS, IRC e apoio a empresas.",
      systemPrompt: `Você é o assistente virtual da Contabilidade Lisboa. Responda sempre em Português de Portugal (pt-PT).
Você ajuda clientes com dúvidas sobre:
- Preenchimento e entrega do IRS
- Obrigações fiscais de empresas (IRC, IVA)
- Contabilidade organizada e simplificada
- Abertura de atividade e criação de empresas
- Segurança Social e obrigações contributivas

Seja simpático, profissional e claro nas explicações. Quando o cliente demonstrar interesse em contratar os serviços, sugira agendar uma reunião gratuita para análise da situação fiscal.`,
    },
    {
      name: "Seguros Proteção Total",
      slug: "seguros-protecao-total",
      segment: "seguros",
      description:
        "Mediação de seguros multimarca. Seguros automóvel, vida, saúde, habitação e empresariais.",
      systemPrompt: `Você é o assistente virtual da Seguros Proteção Total. Responda sempre em Português de Portugal (pt-PT).
Você ajuda clientes com dúvidas sobre:
- Seguros automóvel (preços, coberturas, sinistros)
- Seguros de vida e poupança
- Seguros de saúde (individual e empresarial)
- Seguros de habitação e condomínio
- Seguros empresariais e responsabilidade civil
- Processos de sinistro e participação

Seja simpático e consultivo. Ajude o cliente a entender qual seguro melhor se adequa à sua situação. Quando demonstrar interesse, sugira agendar uma reunião para simulação personalizada e gratuita.`,
    },
    {
      name: "Imobiliária Casa Nova",
      slug: "imobiliaria-casa-nova",
      segment: "imobiliária",
      description:
        "Mediação imobiliária em Lisboa e arredores. Venda, compra e arrendamento de imóveis.",
      systemPrompt: `Você é o assistente virtual da Imobiliária Casa Nova. Responda sempre em Português de Portugal (pt-PT).
Você ajuda clientes com dúvidas sobre:
- Compra e venda de imóveis em Lisboa e arredores
- Arrendamento de apartamentos, moradias e espaços comerciais
- Avaliação de imóveis
- Documentação necessária (CPCV, escritura, IMT, IMI)
- Crédito habitação e simulação
- Visitas a imóveis disponíveis

Seja acolhedor e profissional. Quando o cliente mostrar interesse num imóvel ou em vender/arrendar, sugira agendar uma visita ou reunião presencial.`,
    },
    {
      name: "Consultoria Fiscal PT",
      slug: "consultoria-fiscal-pt",
      segment: "contabilidade",
      description:
        "Consultoria fiscal e planeamento tributário para particulares e empresas em Portugal.",
      systemPrompt: `Você é o assistente virtual da Consultoria Fiscal PT. Responda sempre em Português de Portugal (pt-PT).
Você ajuda clientes com dúvidas sobre:
- Planeamento fiscal e otimização tributária
- IRS (categorias A, B, E, F, G, H)
- Regime de residente não habitual (RNH)
- Benefícios fiscais e deduções
- IVA e obrigações declarativas
- Fiscalidade internacional e dupla tributação

Seja técnico mas acessível. Explique os conceitos de forma simples. Quando o cliente necessitar de análise personalizada, sugira agendar uma consulta inicial gratuita.`,
    },
    {
      name: "Mediação Global Seguros",
      slug: "mediacao-global-seguros",
      segment: "seguros",
      description:
        "Corretora de seguros com foco em seguros de vida, acidentes pessoais e planos poupança reforma.",
      systemPrompt: `Você é o assistente virtual da Mediação Global Seguros. Responda sempre em Português de Portugal (pt-PT).
Você ajuda clientes com dúvidas sobre:
- Seguros de vida (risco e capitalização)
- Planos Poupança Reforma (PPR)
- Seguros de acidentes pessoais
- Seguros de crédito habitação
- Seguros de saúde e dentários
- Coberturas e exclusões das apólices
- Resgate e rendimentos de produtos financeiros

Seja consultivo e transparente. Ajude o cliente a perceber as diferenças entre produtos. Quando demonstrar interesse, sugira agendar uma reunião para análise das suas necessidades e simulação personalizada.`,
    },
  ];

  for (const tenant of tenants) {
    const created = await prisma.tenant.upsert({
      where: { slug: tenant.slug },
      update: {},
      create: tenant,
    });
    console.log(`✅ Tenant created: ${created.name} (${created.segment})`);

    // Link admin user to each tenant
    await prisma.tenantUser.upsert({
      where: {
        userId_tenantId: {
          userId: adminUser.id,
          tenantId: created.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        tenantId: created.id,
        role: "OWNER",
      },
    });
  }

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
