// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuthStateContext } from "./Context/AuthContext";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Dashboard from "./Pages/Admin/Dashboard";
import AuthLayout from "./Layouts/AuthLayout";
import MainLayout from "./Layouts/AdminLayout";
import ProtectedRoute from "./Routes/ProtectedRoute";

import Mahasiswa from "./Pages/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "./Pages/MahasiswaDetail";
import Dosen from "./Pages/Dosen/Dosen";
import DosenDetail from "./Pages/Dosen/DosenDetail";
import MataKuliah from "./Pages/MataKuliah/MataKuliah";
import MataKuliahDetail from "./Pages/MataKuliah/MataKuliahDetail";
import RencanaStudi from "./Pages/RencanaStudi/RencanaStudi";

const AppRoutes = () => {
  const { isLoading } = useAuthStateContext();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-gray-600">Memuat aplikasi...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute requiredRole={["admin", "dosen", "mahasiswa"]} />}>
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="mahasiswa" element={<Mahasiswa />} />
          <Route path="mahasiswa/:id" element={<MahasiswaDetail />} />

          <Route path="dosen" element={<Dosen />} />
          <Route path="dosen/:id" element={<DosenDetail />} />

          <Route path="matakuliah" element={<MataKuliah />} />
          <Route path="matakuliah/:id" element={<MataKuliahDetail />} />
          <Route path="rencanastudi" element={<RencanaStudi />} />
          
        </Route>
      </Route>

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
