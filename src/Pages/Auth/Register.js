// src/pages/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelper";


const Register = () => {
  const [form, setForm] = useState({ nama: "", email: "", password: "", role: "admin" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        nama: form.nama,
        email: form.email,
        role: form.role,
      });
  
      // ✅ Tampilkan toast sukses
      toastSuccess("Berhasil daftar, silakan login.");
      navigate("/login");
    } catch (error) {
      toastError(error.message);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 p-8 bg-white rounded-lg mx-auto">
      <h2 className="text-3xl font-bold text-center text-purple-700">Register</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <div className="flex items-center border border-purple-300 rounded-lg px-3">
          <FaUser className="text-purple-500 mr-2" />
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Masukkan nama"
            className="w-full py-2 outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <div className="flex items-center border border-purple-300 rounded-lg px-3">
          <FaEnvelope className="text-purple-500 mr-2" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            className="w-full py-2 outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <div className="flex items-center border border-purple-300 rounded-lg px-3">
          <FaLock className="text-purple-500 mr-2" />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            className="w-full py-2 outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <div className="flex items-center border border-purple-300 rounded-lg px-3">
          <FaUserShield className="text-purple-500 mr-2" />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full py-2 outline-none bg-white"
            required
          >
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
      >
        <FaUser />
        Register
      </button>

      <p className="text-center text-sm text-gray-700">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-purple-700 font-medium hover:underline">
          Login sekarang
        </Link>
      </p>
    </form>
  );
};

export default Register;
