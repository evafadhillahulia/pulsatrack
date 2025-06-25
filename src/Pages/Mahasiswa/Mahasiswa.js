import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce";


import Button from "../../Components/Button";
import Modal from "../../Components/Modal";
import FormMahasiswa from "../../Components/FormMahasiswa";
import { useAuthStateContext } from "../../Context/AuthContext";

import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "../../Utils/Helpers/Hooks/useMahasiswa";
import { useKelas } from "../../Utils/Helpers/Hooks/useKelas";
import { useMataKuliah } from "../../Utils/Helpers/Hooks/useMataKuliah";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy] = useState("nama");
  const [sortOrder] = useState("asc");

  const [debouncedSearch] = useDebounce(searchTerm, 500); // 500 ms delay

  const {
    data: result = { data: [], total: 0 },
    isLoading,
    isError,
    error,
  } = useMahasiswa({
    q: debouncedSearch,
    _sort: sortBy,
    _order: sortOrder,
    _page: currentPage,
    _limit: limit,
  });
  

  const { data: kelas = [] } = useKelas();
  const {
    data: mataKuliahResult = { data: [] },
  } = useMataKuliah({ q: "", _page: 1, _limit: 1000 });
  const mataKuliah = mataKuliahResult.data;

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const mahasiswaWithSKS = result.data.map((mhs) => {
    const totalSKS = kelas
      .filter((kls) => (kls.mahasiswa_ids || []).includes(mhs.id))
      .map((kls) => mataKuliah.find((mk) => mk.id === kls.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
    return { ...mhs, totalSKS };
  });

  const showCustomToast = (message, type = "success") => {
    toast.custom(() => (
      <div className="flex items-center gap-3 bg-white border p-4 rounded shadow">
        <span>{type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}</span>
        <span>{message}</span>
      </div>
    ));
  };

  const handleSubmit = (form) => {
    if (selectedMahasiswa) {
      Swal.fire({
        title: "Konfirmasi Update",
        text: `Yakin ingin mengupdate data mahasiswa NIM ${selectedMahasiswa.nim}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Update!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          update(
            { id: selectedMahasiswa.id, data: form },
            {
              onSuccess: () => {
                setModalOpen(false);
                setSelectedMahasiswa(null);
                showCustomToast("Mahasiswa berhasil diperbarui!", "success");
              },
              onError: () => showCustomToast("Gagal memperbarui mahasiswa.", "error"),
            }
          );
        }
      });
    } else {
      const exists = result.data.find((m) => m.nim === form.nim);
      if (exists) {
        showCustomToast("NIM sudah terdaftar!", "error");
        return;
      }
      store(form, {
        onSuccess: () => {
          setModalOpen(false);
          showCustomToast("Mahasiswa berhasil ditambahkan!", "success");
        },
        onError: () => showCustomToast("Gagal menambahkan mahasiswa.", "error"),
      });
    }
  };

  const deleteMahasiswa = (id) => {
    const mhs = result.data.find((m) => m.id === id);
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Yakin ingin menghapus data mahasiswa "${mhs?.nama}" (NIM: ${mhs?.nim})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        remove(id, {
          onSuccess: () => showCustomToast("Mahasiswa berhasil dihapus!", "success"),
          onError: () => showCustomToast("Gagal menghapus mahasiswa.", "error"),
        });
      }
    });
  };

  if (!user?.permissions?.includes("mahasiswa.page")) {
    return <div className="text-center py-20 text-red-600 font-bold">🚫 Akses ditolak</div>;
  }
  if (isLoading) return <div className="text-center py-20">Memuat data mahasiswa...</div>;
  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Gagal memuat data: {error.message}
      </div>
    );

  const totalPages = Math.ceil(result.total / limit);
  const currentMahasiswa = mahasiswaWithSKS;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Daftar Mahasiswa</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari nama atau NIM..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64 border border-gray-300 rounded-lg px-4 py-2"
          />
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
          >
            <option value={5}>5 / halaman</option>
            <option value={10}>10 / halaman</option>
            <option value={20}>20 / halaman</option>
          </select>
          {user.permissions.includes("mahasiswa.create") && (
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setSelectedMahasiswa(null); setModalOpen(true); }}>
              + Tambah Mahasiswa
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">NIM</th>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Jurusan</th>
              <th className="py-3 px-4 text-left">Maksimal SKS</th>
              <th className="py-3 px-4 text-left">Total SKS</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentMahasiswa.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Tidak ada data mahasiswa yang sesuai
                </td>
              </tr>
            ) : (
              currentMahasiswa.map((mhs) => (
                <tr key={mhs.id} className="even:bg-gray-100 odd:bg-white">
                  <td className="py-2 px-4 font-medium">{mhs.nim}</td>
                  <td className="py-2 px-4">{mhs.nama}</td>
                  <td className="py-2 px-4">{mhs.email || "N/A"}</td>
                  <td className="py-2 px-4">{mhs.jurusan}</td>
                  <td className="py-2 px-4">{mhs.maxSKS}</td>
                  <td className="py-2 px-4">{mhs.totalSKS}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate(`/dashboard/mahasiswa/${mhs.id}`, { state: mhs })}>
                      Detail
                    </Button>
                    {user.permissions.includes("mahasiswa.update") && (
                      <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => setSelectedMahasiswa(mhs) || setModalOpen(true)}>
                        Edit
                      </Button>
                    )}
                    {user.permissions.includes("mahasiswa.delete") && (
                      <Button className="bg-red-500 hover:bg-red-600" onClick={() => deleteMahasiswa(mhs.id)}>
                        Hapus
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
        <p className="text-sm text-gray-600">
          Menampilkan {result.total === 0 ? 0 : (currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, result.total)} dari {result.total} mahasiswa
        </p>
        <div className="flex items-center gap-2 ">
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            ⬅ Sebelumnya
          </Button>
          <span className="text-sm">Halaman {currentPage} dari {totalPages}</span>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>
            Selanjutnya ➡
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <FormMahasiswa onSubmit={handleSubmit} editData={selectedMahasiswa} />
      </Modal>
    </div>
  );
};

export default Mahasiswa;