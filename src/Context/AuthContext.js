import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase"; // pastikan path-nya sesuai

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, _setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = (user) => {
    _setUser(user);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const { uid, email } = firebaseUser;

        try {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            const userData = {
              uid,
              email,
              nama: data.nama || "",
              role: data.role || "",
              permissions: data.permissions || [],
            };

            setUser(userData);
            console.log("✅ Logged in as:", userData);
          } else {
            console.warn("⚠️ No user document found in Firestore.");
            setUser({ uid, email }); // fallback
          }
        } catch (error) {
          console.error("🔥 Error getting user data from Firestore:", error);
          setUser({ uid, email }); // fallback jika error
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthStateContext.Provider value={{ user, isLoading }}>
      <AuthDispatchContext.Provider value={{ setUser }}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () => useContext(AuthStateContext);
export const useAuthDispatchContext = () => useContext(AuthDispatchContext);
