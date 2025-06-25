import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AxiosInstance from "../../Utils/Helpers/AxiosInstance";
import {
  Users,
  BookOpen,
  UserCheck,
  LayoutDashboard,
  Download,
  Moon,
} from "lucide-react";
import { useAuthStateContext } from "../../Context/AuthContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useChartData } from "../../Utils/Helpers/Hooks/useChart";

const Dashboard = () => {
  const { user } = useAuthStateContext();
  const [jumlahMahasiswa, setJumlahMahasiswa] = useState(0);
  const [jumlahDosen, setJumlahDosen] = useState(0);
  const [jumlahMataKuliah, setJumlahMataKuliah] = useState(0);
  const [jumlahKelas, setJumlahKelas] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  const getColorByMode = (dark) => (dark ? "#60a5fa" : "#1e3a8a");
  const COLORS = darkMode
    ? ["#93c5fd", "#bfdbfe", "#60a5fa", "#a5b4fc", "#c7d2fe"]
    : ["#1e3a8a", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa"];

  const {
    data: chartData,
    isLoading: chartLoading,
    isError: chartError,
  } = useChartData();

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
    const fetchCounts = async () => {
      try {
        if (user.role === "admin") {
          const [resMahasiswa, resDosen, resMatkul, resKelas] = await Promise.all([
            AxiosInstance.get("/mahasiswa"),
            AxiosInstance.get("/dosen"),
            AxiosInstance.get("/matakuliah"),
            AxiosInstance.get("/kelas"),
          ]);

          setJumlahMahasiswa(resMahasiswa.data.length);
          setJumlahDosen(resDosen.data.length);
          setJumlahMataKuliah(resMatkul.data.length);
          setJumlahKelas(resKelas.data.length);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard count data:", err);
        setError(err);
        setLoading(false);
        toast.error("Gagal mengambil data. Pastikan server berjalan!");
      }
    };

    fetchCounts();
  }, [user.role]);

  const exportToPDF = async (id) => {
    const element = document.getElementById(id);
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("dashboard-chart.pdf");
  };

  if (loading || chartLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-700 text-lg animate-pulse">
        Memuat data dashboard...
      </div>
    );
  }

  if (error || chartError) {
    return (
      <div className="bg-red-100 p-6 rounded-xl shadow-md text-center text-red-700 text-lg">
        Error: Gagal memuat data dashboard. Silakan coba lagi.
      </div>
    );
  }

  const filteredStudents =
    selectedFaculty === "all"
      ? chartData.students
      : chartData.students.filter((s) => s.faculty === selectedFaculty);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300">
          Dashboard {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
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
        Selamat datang, {user.nama}! Berikut informasi untuk role: <strong>{user.role}</strong>.
      </p>

      {user.role === "admin" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <InfoCard icon={<Users />} label="Jumlah Mahasiswa" value={jumlahMahasiswa} bgLight="indigo-100" bgDark="indigo-800" textColor="indigo" />
            <InfoCard icon={<UserCheck />} label="Jumlah Dosen" value={jumlahDosen} bgLight="green-100" bgDark="emerald-800" textColor="green" />
            <InfoCard icon={<BookOpen />} label="Jumlah Mata Kuliah" value={jumlahMataKuliah} bgLight="yellow-100" bgDark="amber-800" textColor="yellow" />
            <InfoCard icon={<LayoutDashboard />} label="Jumlah Kelas" value={jumlahKelas} bgLight="blue-100" bgDark="blue-800" textColor="blue" />
          </div>

          <div id="chartContainer" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartBox title="Mahasiswa per Fakultas" id="barChart">
              <div className="mb-2">
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Semua</option>
                  {chartData.students.map((f) => (
                    <option key={f.id} value={f.faculty}>{f.faculty}</option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredStudents}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="faculty" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={getColorByMode(darkMode)} isAnimationActive />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>

            <ChartBox title="Rasio Gender Mahasiswa" id="pieChart">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.genderRatio}
                    dataKey="count"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    isAnimationActive
                  >
                    {chartData.genderRatio.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartBox>

            <ChartBox title="Tren Pendaftaran Mahasiswa" id="lineChart" full>
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => exportToPDF("chartContainer")}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  <Download size={16} />
                  Export ke PDF
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.registrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke={getColorByMode(darkMode)} isAnimationActive />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>

            <ChartBox title="Distribusi Nilai Mahasiswa" id="radarChart">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.gradeDistribution}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="A" dataKey="A" stroke={getColorByMode(darkMode)} fill={getColorByMode(darkMode)} fillOpacity={0.6} />
                  <Radar name="B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4} />
                  <Radar name="C" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </ChartBox>

            <ChartBox title="Jumlah Dosen per Pangkat" id="areaChart">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.lecturerRanks}>
                  <defs>
                    <linearGradient id="colorLecturer" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getColorByMode(darkMode)} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={getColorByMode(darkMode)} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="rank" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke={getColorByMode(darkMode)} fillOpacity={1} fill="url(#colorLecturer)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>
        </>
      )}

      {user.role === "dosen" && <RolePanel role="Dosen" message="Ini adalah area khusus untuk dosen." />}
      {user.role === "mahasiswa" && <RolePanel role="Mahasiswa" message="Selamat belajar!" />}
    </div>
  );
};

const InfoCard = ({ icon, label, value, bgLight, bgDark, textColor }) => (
  <div className={`p-6 rounded-xl shadow border transition-all duration-200 bg-${bgLight} dark:bg-${bgDark} border-gray-300 dark:border-gray-600`}>
    <div className="flex items-center gap-4">
      {React.cloneElement(icon, {
        className: `w-10 h-10 text-${textColor}-600 dark:text-${textColor}-300`,
      })}
      <div>
        <h2 className="text-md font-medium text-gray-800 dark:text-gray-100">{label}</h2>
        <p className={`text-3xl font-bold text-${textColor}-900 dark:text-${textColor}-100`}>{value}</p>
      </div>
    </div>
  </div>
);

const ChartBox = ({ title, id, children, full = false }) => (
  <div id={id} className={`${full ? "col-span-1 md:col-span-2" : ""} bg-white dark:bg-gray-800 p-4 rounded shadow`}>
    <h3 className="font-bold text-gray-700 dark:text-white mb-2">{title}</h3>
    {children}
  </div>
);

const RolePanel = ({ role, message }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mt-6">
    <h2 className="text-xl font-semibold text-blue-600">{`Panel ${role}`}</h2>
    <p className="text-gray-700 dark:text-gray-300 mt-2">{message}</p>
  </div>
);

export default Dashboard;
