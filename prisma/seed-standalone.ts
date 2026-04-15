import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as admin from "firebase-admin";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig as any),
  });
}

const adminAuth = admin.auth();

async function main() {
  console.log("🌱 Seeding Admin User...");

  const email = "admin@email.com";
  const password = "Senha123!";
  const name = "Admin";
  let firebaseUid = "";

  try {
    // 1. Firebase
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

    // 2. Prisma
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
    console.log("🎉 Seed finished!");
  } catch (error) {
    console.error("❌ Error during seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
