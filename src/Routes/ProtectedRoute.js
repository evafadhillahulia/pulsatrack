// src/Routes/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStateContext } from "../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, isLoading } = useAuthStateContext();
  const [checkingRole, setCheckingRole] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setIsAuthorized(false);
        setCheckingRole(false);
        return;
      }

      if (!requiredRole) {
        setIsAuthorized(true);
        setCheckingRole(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userRole = userDoc.exists() ? userDoc.data().role : null;
        setIsAuthorized(requiredRole.includes(userRole));
      } catch (err) {
        console.error("❌ Gagal memeriksa role:", err);
        setIsAuthorized(false);
      } finally {
        setCheckingRole(false);
      }
    };

    checkAccess();
  }, [user, requiredRole]);

  if (isLoading || checkingRole) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Memeriksa akses...</p>
      </div>
    );
  }

  if (!user || !isAuthorized) return <Navigate to="/login" />;
  return <Outlet />;
};

export default ProtectedRoute;
