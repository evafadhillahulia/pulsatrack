import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./Context/AuthContext";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Dashboard from "./Pages/Admin/Dashboard";
import Transaksi from "./Pages/Transaksi/Transaksi";
import Provider from "./Pages/Provider/Provider";

import AuthLayout from "./Layouts/AuthLayout";
import MainLayout from "./Layouts/AdminLayout";
import ProtectedRoute from "./Routes/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Pages */}
      <Route element={<ProtectedRoute requiredRole={["admin", "owner"]} />}>
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transaksi" element={<Transaksi />} />
          <Route path="provider" element={<Provider />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#333",
              fontWeight: "500",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
