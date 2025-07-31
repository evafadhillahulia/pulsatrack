import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AxiosInstance from "../../Utils/Helpers/AxiosInstance";
import { Download, Moon } from "lucide-react";
import { useAuthStateContext } from "../../Context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend
} from "recharts";

const Dashboard = () => {
  const { user } = useAuthStateContext();
  const [transaksiData, setTransaksiData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newMode = !darkMode;
    html.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    setDarkMode(newMode);
  };

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const res = await AxiosInstance.get("/provider");
        setTransaksiData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data transaksi:", err);
        toast.error("Gagal memuat data transaksi");
      } finally {
        setLoading(false);
      }
    };

    if (user.role === "admin") {
      fetchTransaksi();
    }
  }, [user.role]);

  const exportToPDF = async () => {
    const element = document.getElementById("chartTransaksi");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("transaksi-dashboard.pdf");
  };

  const transaksiByProvider = transaksiData.reduce((acc, trx) => {
    acc[trx.provider] = (acc[trx.provider] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(transaksiByProvider).map((provider) => ({
    provider,
    jumlah: transaksiByProvider[provider],
  }));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
          Dashboard Transaksi
        </h1>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <Moon size={18} />
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Selamat datang, {user.nama}!
      </p>

      {user.role === "admin" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300">
              Grafik Transaksi per Provider
            </h2>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              <Download size={16} />
              Export ke PDF
            </button>
          </div>

          <div
            id="chartTransaksi"
            className="bg-white dark:bg-gray-800 p-4 rounded shadow"
          >
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-300">Memuat...</p>
            ) : chartData.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-300">Belum ada data transaksi.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="provider" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jumlah" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
