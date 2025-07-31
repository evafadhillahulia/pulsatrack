// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa"; // 🟣 Tambahkan ikon
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelper";


const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
  
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
  
        // ✅ Tampilkan toast sukses
        toastSuccess(`Selamat datang, ${data.nama}!`);
        navigate("/dashboard");
      } else {
        toastError("User data tidak ditemukan di Firestore.");
      }
    } catch (error) {
      toastError(error.message);
    }
  };
  

  return (
    <form 
      onSubmit={handleLogin}
      className="w-full max-w-md space-y-6 p-8  rounded-lg"
    >
      <h2 className="text-3xl font-bold text-center text-purple-700">Login</h2>

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

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
      >
        <FaSignInAlt />
        Login
      </button>

      <p className="text-center text-sm text-gray-700">
        Belum punya akun?{" "}
        <Link to="/register" className="text-purple-700 font-medium hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
};

export default Login;
