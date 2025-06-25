// src/Routes/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStateContext } from "../Context/AuthContext";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStateContext();

  if (isLoading) {
    return <div>Loading...</div>; // atau spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
