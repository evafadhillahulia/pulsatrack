import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import AxiosInstance from "../../Utils/Helpers/AxiosInstance";
import Label from "../../Components/Label";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useAuthDispatchContext } from "../../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser: setAuthUserAndToken } = useAuthDispatchContext();

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const showCustomToast = (message, type = "success") => {
    toast.custom(
      () => (
        <div
          className="flex items-center gap-3"
          style={{
            background:
              type === "success"
                ? "#4ade80"
                : type === "error"
                ? "#f87171"
                : "#fcd34d",
            color: "#1e3a8a",
            fontWeight: "bold",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          <span>
            {type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}
          </span>
          <span>{message}</span>
        </div>
      ),
      {
        position: "top-center",
        duration: 3000,
      }
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.password.value;
    const selectedRole = role.toLowerCase();

    if (!selectedRole) {
      showCustomToast("Pilih role terlebih dahulu!", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await AxiosInstance.get("/user");
      const users = res.data;

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email &&
          u.password === password &&
          u.role.toLowerCase() === selectedRole
      );

      if (!user) {
        showCustomToast("Email, password, atau role salah!", "error");
        return;
      }

      const userData = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        permissions: user.permissions ?? [],
      };

      setAuthUserAndToken(userData, "dummy-token-for-now");

      // ✅ Tambahkan ini agar data user bisa dibaca di halaman lain
      localStorage.setItem("userInfo", JSON.stringify(userData));

      showCustomToast("Login berhasil!", "success");

      // Delay agar context terset
      setTimeout(() => {
        switch (user.role.toLowerCase()) {
          case "admin":
          case "dosen":
          case "mahasiswa":
            navigate("/dashboard");
            break;
          default:
            showCustomToast("Role tidak dikenali!", "warning");
            navigate("/");
        }
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      showCustomToast("Gagal login. Coba lagi nanti.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Login
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Masukkan email"
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Masukkan password"
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="role">Pilih Role</Label>
          <select
            id="role"
            name="role"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
            required
          >
            <option value="">-- Pilih Role --</option>
            <option value="admin">Admin</option>
            <option value="dosen">Dosen</option>
            <option value="mahasiswa">Mahasiswa</option>
          </select>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Login"}
        </Button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        Belum punya akun?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </>
  );
};

export default Login;
