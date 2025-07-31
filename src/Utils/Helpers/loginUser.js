// src/utils/loginUser.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Ambil data user dari Firestore
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      uid: user.uid,
      email: user.email,
      role: docSnap.data().role,
      nama: docSnap.data().nama
    };
  } else {
    throw new Error("User data not found in Firestore");
  }
};
