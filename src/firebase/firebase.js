// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4TJg-zs7z11UTq_fA_627AeiSJk7SDVE",
  authDomain: "pulsapuka.firebaseapp.com",
  projectId: "pulsapuka",
  storageBucket: "pulsapuka.appspot.com", 
  messagingSenderId: "758416072579",
  appId: "1:758416072579:web:4c4751328ab9c68cc760b6",
  measurementId: "G-5NS1MZYW9M",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Gagal set persistence:", err);
});

export { auth, db };