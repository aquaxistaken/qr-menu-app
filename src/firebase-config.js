// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  // measurementId'yi .env.local'da eklediyseniz, burada da olmalı:
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function createFirebaseApp() {
  // Bu kısım, sunucu tarafı ve istemci tarafı renderlama arasındaki farkı yönetir.
  // Her iki ortamda da Firebase uygulamasının tek bir örneğinin olmasını sağlar.
  if (typeof window !== 'undefined' && window.firebaseAppInstance) {
    return window.firebaseAppInstance;
  }
  const app = initializeApp(firebaseConfig);
  if (typeof window !== 'undefined') {
    window.firebaseAppInstance = app;
  }
  return app;
}

const app = createFirebaseApp();
export const db = getFirestore(app);