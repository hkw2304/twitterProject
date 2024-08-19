import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAb6YTdDq0xNed3XMZoRPMGkTmy0o0iM3I",
  authDomain: "twitterproject-65fd8.firebaseapp.com",
  projectId: "twitterproject-65fd8",
  storageBucket: "twitterproject-65fd8.appspot.com",
  messagingSenderId: "945550914117",
  appId: "1:945550914117:web:7dfaaa927f9e517b96e92c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);

