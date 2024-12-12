// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Your Firebase configuration object here

  apiKey: "AIzaSyCClY1aNCRLslBxn_sxXdA9barxnwf9u_k",
  authDomain: "vibesnap-alter-office.firebaseapp.com",
  projectId: "vibesnap-alter-office",
  storageBucket: "vibesnap-alter-office.firebasestorage.app",
  messagingSenderId: "316951623857",
  appId: "1:316951623857:web:2154929504e111bc480a90",
  measurementId: "G-Z3CMG8RFWZ"

//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;