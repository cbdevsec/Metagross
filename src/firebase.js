// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBy9U8Ai41E8fFHkwRU8LlMFfch_yYARQQ",
  authDomain: "school-management-be0f1.firebaseapp.com",
  projectId: "school-management-be0f1",
  storageBucket: "school-management-be0f1.firebasestorage.app",
  messagingSenderId: "836991601555",
  appId: "1:836991601555:web:b11507e730f8b8a71e3666",
  measurementId: "G-EC04TS9RYT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };