import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../Components/Button";
import { Book, Hash, Layers } from "lucide-react";
import toast from "react-hot-toast";
import AxiosInstance from "../../Utils/Helpers/AxiosInstance";
import { useAuthStateContext } from "../../Context/AuthContext";

const MataKuliahDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStateContext();

  const [mataKuliahData, setMataKuliahData] = useState(null);
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
    if (isLoading) return; // ⏳ Tunggu sampai context selesai

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMataKuliahDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await AxiosInstance.get(`/matakuliah/${id}`);
        setMataKuliahData(response.data);
        showCustomToast(`Detail mata kuliah ${response.data.nama} berhasil dimuat.`, "success");
      } catch (err) {
        setError(err);
        console.error("Error fetching mata kuliah detail:", err);

        if (err.response) {
          if (err.response.status === 404) {
            showCustomToast("Data mata kuliah tidak ditemukan", "error");
            navigate("/dashboard/matakuliah", { replace: true });
          } else if (err.response.status === 401) {
            showCustomToast("Sesi login habis. Silakan login kembali", "error");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/login");
          }
        } else {
          showCustomToast("Terjadi kesalahan jaringan", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMataKuliahDetail();
    }
  }, [id, user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-600">Memuat sesi login...</p>
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl text-gray-700">Memuat detail mata kuliah...</p>
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
          onClick={() => navigate("/dashboard/matakuliah")}
        >
          ← Kembali ke Daftar Mata Kuliah
        </Button>
      </div>
    );
  }

  if (!mataKuliahData) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200 text-center">
        <div className="text-red-600 font-medium text-lg mb-4">
          Data mata kuliah tidak ditemukan 😥
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/dashboard/matakuliah")}
        >
          ← Kembali ke Daftar Mata Kuliah
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
        Detail Mata Kuliah
      </h1>

      <div className="space-y-5 text-gray-800 text-[16px]">
        <div className="flex items-center gap-4">
          <Hash className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Kode</p>
            <p className="font-semibold">{mataKuliahData.kode}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Book className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">Nama</p>
            <p className="font-semibold">{mataKuliahData.nama}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Layers className="text-blue-600" />
          <div>
            <p className="text-gray-500 text-sm">SKS</p>
            <p className="font-semibold">{mataKuliahData.sks}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate("/dashboard/matakuliah")}
        >
          ← Kembali ke Daftar Mata Kuliah
        </Button>
      </div>
    </div>
  );
};

export default MataKuliahDetail;
