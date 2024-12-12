import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config

  apiKey: "AIzaSyCClY1aNCRLslBxn_sxXdA9barxnwf9u_k",
  authDomain: "vibesnap-alter-office.firebaseapp.com",
  projectId: "vibesnap-alter-office",
  storageBucket: "vibesnap-alter-office.firebasestorage.app",
  messagingSenderId: "316951623857",
  appId: "1:316951623857:web:2154929504e111bc480a90",
  measurementId: "G-Z3CMG8RFWZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);