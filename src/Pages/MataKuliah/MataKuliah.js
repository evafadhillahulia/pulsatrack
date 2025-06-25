import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import Button from "../../Components/Button";
import Modal from "../../Components/Modal";
import FormMataKuliah from "../../Components/FormMataKuliah";
import {
  useMataKuliah,
  useStoreMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from "../../Utils/Helpers/Hooks/useMataKuliah";

const MataKuliah = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMataKuliah, setSelectedMataKuliah] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy] = useState("nama");
  const [sortOrder] = useState("asc");

  const {
    data: result = { data: [], total: 0 },
  } = useMataKuliah({
    q: searchTerm,
    _sort: sortBy,
    _order: sortOrder,
    _page: currentPage,
    _limit: limit,
  });

  const { mutate: store } = useStoreMataKuliah();
  const { mutate: update } = useUpdateMataKuliah();
  const { mutate: remove } = useDeleteMataKuliah();

  const showCustomToast = (message, type = "success") => {
    toast.custom(() => (
      <div className="flex items-center gap-3 bg-white border p-4 rounded shadow">
        <span>{type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}</span>
        <span>{message}</span>
      </div>
    ));
  };

  const handleSubmit = (form) => {
    if (selectedMataKuliah) {
      Swal.fire({
        title: "Konfirmasi Update",
        text: `Update Mata Kuliah Kode ${selectedMataKuliah.kode}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Update!",
      }).then((result) => {
        if (result.isConfirmed) {
          update(
            { id: selectedMataKuliah.id, data: form },
            {
              onSuccess: () => {
                setModalOpen(false);
                setSelectedMataKuliah(null);
                showCustomToast("Mata Kuliah berhasil diperbarui!", "success");
              },
              onError: () => showCustomToast("Gagal memperbarui mata kuliah.", "error"),
            }
          );
        }
      });
    } else {
      store(form, {
        onSuccess: () => {
          setModalOpen(false);
          showCustomToast("Mata Kuliah berhasil ditambahkan!", "success");
        },
        onError: () => showCustomToast("Gagal menambahkan mata kuliah.", "error"),
      });
    }
  };

  const deleteMataKuliah = (id) => {
    const mk = result.data.find((m) => m.id === id);
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Hapus Mata Kuliah "${mk?.nama}" (Kode: ${mk?.kode})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
    }).then((res) => {
      if (res.isConfirmed) {
        remove(id, {
          onSuccess: () => showCustomToast("Mata Kuliah berhasil dihapus!", "success"),
          onError: () => showCustomToast("Gagal menghapus mata kuliah.", "error"),
        });
      }
    });
  };

  const totalPages = Math.ceil(result.total / limit);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Daftar Mata Kuliah</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari nama atau kode..."
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
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={5}>5 / halaman</option>
            <option value={10}>10 / halaman</option>
            <option value={20}>20 / halaman</option>
          </select>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setModalOpen(true)}>
            + Tambah Mata Kuliah
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Kode</th>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4 text-left">SKS</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  Tidak ada data mata kuliah yang sesuai
                </td>
              </tr>
            ) : (
              result.data.map((mk) => (
                <tr key={mk.id} className="even:bg-gray-100 odd:bg-white">
                  <td className="py-2 px-4">{mk.kode}</td>
                  <td className="py-2 px-4">{mk.nama}</td>
                  <td className="py-2 px-4">{mk.sks}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate(`/dashboard/matakuliah/${mk.id}`, { state: mk })}>
                      Detail
                    </Button>
                    <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => { setSelectedMataKuliah(mk); setModalOpen(true); }}>
                      Edit
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600" onClick={() => deleteMataKuliah(mk.id)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
        <p className="text-sm text-gray-600">
          Menampilkan {result.total === 0 ? 0 : (currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, result.total)} dari {result.total} mata kuliah
        </p>
        <div className="flex items-center gap-2">
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            ⬅ Sebelumnya
          </Button>
          <span className="text-sm">Halaman {currentPage} dari {totalPages}</span>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Selanjutnya ➡
          </Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <FormMataKuliah onSubmit={handleSubmit} editData={selectedMataKuliah} />
      </Modal>
    </div>
  );
};

export default MataKuliah;