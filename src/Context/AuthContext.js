import { createContext, useContext, useEffect, useState } from "react";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, _setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

  const setUser = (user) => {
    _setUser(user);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      _setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // setelah cek localStorage, loading selesai
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
