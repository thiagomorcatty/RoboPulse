import * as admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

function createFirebaseAdminApp() {
  if (admin.apps.length) return admin.app();
  
  if (!firebaseAdminConfig.projectId || !firebaseAdminConfig.clientEmail) {
    return null;
  }

  return admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig as any),
  });
}

const adminApp = createFirebaseAdminApp();
const adminAuth = adminApp ? admin.auth(adminApp) : null as any;
const adminDb = adminApp ? admin.firestore(adminApp) : null as any;

export { adminApp, adminAuth, adminDb };
