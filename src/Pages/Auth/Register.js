import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosInstance from "../../Utils/Helpers/AxiosInstance";
import Label from "../../Components/Label";
import Input from "../../Components/Input";
import Button from "../../Components/Button";

const Register = () => {
  const navigate = useNavigate();
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const nama = e.target.nama.value.trim();
    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.password.value;
    const selectedRole = role.toLowerCase();

    if (!selectedRole) {
      showCustomToast("Silakan pilih role terlebih dahulu", "error");
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      showCustomToast("Password minimal 4 karakter", "error");
      setLoading(false);
      return;
    }

    try {
      const cekRes = await AxiosInstance.get(`/user?email=${email}`);
      if (cekRes.data.length > 0) {
        showCustomToast("Email sudah terdaftar!", "error");
        setLoading(false);
        return;
      }

      let permissions = [];
      switch (selectedRole) {
        case "admin":
          permissions = [
            "dashboard.page",
            "user.manage",
            "krs.page",
            "mahasiswa.page",
            "dosen.page",
            "matakuliah.page",
          ];
          break;
        case "dosen":
          permissions = ["krs.read", "krs.page"];
          break;
        case "mahasiswa":
          permissions = ["krs.page"];
          break;
        default:
          permissions = [];
      }

      const newUser = {
        nama,
        email,
        password,
        role: selectedRole,
        permissions,
      };

      await AxiosInstance.post("/user", newUser);

      showCustomToast("Registrasi berhasil! Silakan login.", "success");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err?.response?.data || err.message);
      showCustomToast("Gagal registrasi. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Register
      </h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="nama">Nama</Label>
          <Input
            type="text"
            id="nama"
            name="nama"
            placeholder="Masukkan nama"
            required
            disabled={loading}
          />
        </div>
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
            className="w-full border border-gray-300 rounded-md p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">-- Pilih Role --</option>
            <option value="admin">Admin</option>
            <option value="dosen">Dosen</option>
            <option value="mahasiswa">Mahasiswa</option>
          </select>
        </div>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Mendaftarkan..." : "Register"}
        </Button>
      </form>

      <p className="text-center mt-4">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login di sini
        </Link>
      </p>
    </>
  );
};

export default Register;
