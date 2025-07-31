// src/utils/registerUser.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

export const registerUser = async (email, password, nama, role) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Simpan user data ke Firestore (dengan UID sebagai Document ID)
  await setDoc(doc(db, "users", user.uid), {
    nama,
    email,
    role,
  });

  return user;
};
