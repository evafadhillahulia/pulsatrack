import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import { User, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";
import AxiosInstance from "../Utils/Helpers/AxiosInstance";
import { useAuthStateContext } from "../Context/AuthContext";

const MahasiswaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStateContext();

  const [mahasiswaData, setMahasiswaData] = useState(null);
  const [totalSKS, setTotalSKS] = useState(0); // ⬅️ NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showCustomToast = (message, type = "success") => {
    toast.custom(
      () => (
        <div
          className="flex items-center gap-3"
          style={{
            background: type === "success" ? "#4ade80" : type === "error" ? "#f87171" : "#fcd34d",
            color: "#1e3a8a",
            fontWeight: "bold",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "16px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          <span>{type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}</span>
          <span>{message}</span>
        </div>
      ),
      {
        position: "top-center",
        duration: 3000,
      }
    );
  };

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDetailWithSKS = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ambil data mahasiswa
        const mhsRes = await AxiosInstance.get(`/mahasiswa/${id}`);
        const mhs = mhsRes.data;
        setMahasiswaData(mhs);

        // Ambil kelas dan matkul
        const [kelasRes, matkulRes] = await Promise.all([
          AxiosInstance.get("/kelas"),
          AxiosInstance.get("/matakuliah"),
        ]);

        const kelas = kelasRes.data;
        const matakuliah = matkulRes.data;

        // Filter kelas yang diikuti mahasiswa
        const kelasMahasiswa = kelas.filter((k) =>
          (k.mahasiswa_ids || []).includes(mhs.id)
        );

        // Hitung total SKS berdasarkan kelas yang diikuti
        const total = kelasMahasiswa.reduce((sum, k) => {
          const matkul = matakuliah.find((m) => m.id === k.mata_kuliah_id);
          return sum + (matkul?.sks || 0);
        }, 0);

        setTotalSKS(total);

        showCustomToast(`Detail mahasiswa ${mhs.nama} berhasil dimuat.`, "success");
      } catch (err) {
        setError(err);
        console.error("Error fetching detail:", err);
        if (err.response?.status === 404) {
          showCustomToast("Data mahasiswa tidak ditemukan", "error");
          navigate("/dashboard/mahasiswa", { replace: true });
        } else if (err.response?.status === 401) {
          showCustomToast("Sesi login habis. Silakan login kembali", "error");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          showCustomToast("Terjadi kesalahan jaringan", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetailWithSKS();
  }, [id, user, isLoading, navigate]);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-700">Memuat detail mahasiswa...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-600">Memeriksa sesi login...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <p className="text-xl text-red-500 mb-4">
          Error: Gagal memuat detail. Silakan coba lagi. ({error.message})
        </p>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/dashboard/mahasiswa")}
        >
          ← Kembali ke Daftar Mahasiswa
        </Button>
      </div>
    );
  }

  if (!mahasiswaData) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200 text-center">
        <div className="text-red-600 font-medium text-lg mb-4">
          Data mahasiswa tidak ditemukan 😥
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/dashboard/mahasiswa")}
        >
          ← Kembali ke Daftar Mahasiswa
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
        Detail Mahasiswa
      </h1>

      <div className="space-y-5 text-gray-800 text-[16px]">
        <div className="flex items-center gap-4">
          <BadgeCheck className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">NIM</p>
            <p className="font-semibold">{mahasiswaData.nim}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <User className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Nama</p>
            <p className="font-semibold">{mahasiswaData.nama}</p>
          </div>
        </div>

        {mahasiswaData.jurusan && (
          <div className="flex items-center gap-4">
            <span className="text-blue-600">📚</span>
            <div>
              <p className="text-gray-500 text-sm">Jurusan</p>
              <p className="font-semibold">{mahasiswaData.jurusan}</p>
            </div>
          </div>
        )}

        {mahasiswaData.email && (
          <div className="flex items-center gap-4">
            <span className="text-blue-600">📧</span>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold">{mahasiswaData.email}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <span className="text-blue-600">📊</span>
          <div>
            <p className="text-gray-500 text-sm">Maksimal SKS</p>
            <p className="font-semibold">{mahasiswaData.maxSKS}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-blue-600">📈</span>
          <div>
            <p className="text-gray-500 text-sm">Total SKS Saat Ini</p>
            <p className="font-semibold">{totalSKS}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/dashboard/mahasiswa")}
        >
          ← Kembali ke Daftar Mahasiswa
        </Button>
      </div>
    </div>
  );
};

export default MahasiswaDetail;
