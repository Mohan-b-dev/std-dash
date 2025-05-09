import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0HsZINphf4bLQb0KZ2BwkZK_qKQQ_0IY",
  authDomain: "studentdashboard-1757d.firebaseapp.com",
  projectId: "studentdashboard-1757d",
  storageBucket: "studentdashboard-1757d.firebasestorage.app",
  messagingSenderId: "794097804981",
  appId: "1:794097804981:web:fdb7b8f618ee6c8a75c0fc",
  measurementId: "G-HX9TNN63EY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };