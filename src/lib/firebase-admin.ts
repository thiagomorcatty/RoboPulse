import * as admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

function createFirebaseAdminApp() {
  if (!admin.apps.length) {
    return admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
  }
  return admin.app();
}

const adminApp = createFirebaseAdminApp();
const adminAuth = admin.auth(adminApp);
const adminDb = admin.firestore(adminApp);

export { adminApp, adminAuth, adminDb };
