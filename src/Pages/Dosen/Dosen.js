import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce";


import Button from "../../Components/Button";
import Modal from "../../Components/Modal";
import FormDosen from "../../Components/FormDosen";
import {
  useDosen,
  useStoreDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "../../Utils/Helpers/Hooks/useDosen";
import { useKelas } from "../../Utils/Helpers/Hooks/useKelas";
import { useMataKuliah } from "../../Utils/Helpers/Hooks/useMataKuliah";

const Dosen = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy] = useState("nama");
  const [sortOrder] = useState("asc");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const {
    data: result = { data: [], total: 0 },
    isLoading,
    isError,
    error,
  } = useDosen({
    q: debouncedSearchTerm,
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

  const { mutate: store } = useStoreDosen();
  const { mutate: update } = useUpdateDosen();
  const { mutate: remove } = useDeleteDosen();

  const dosenWithSKS = result.data.map((dsn) => {
    const totalSKS = kelas
      .filter((kls) => kls.dosen_id === dsn.id)
      .map((kls) => mataKuliah.find((mk) => mk.id === kls.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
    return { ...dsn, totalSKS };
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
    if (selectedDosen) {
      Swal.fire({
        title: "Konfirmasi Update",
        text: `Update data dosen NIP ${selectedDosen.nip}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Update!",
      }).then((result) => {
        if (result.isConfirmed) {
          update(
            { id: selectedDosen.id, data: form },
            {
              onSuccess: () => {
                setModalOpen(false);
                setSelectedDosen(null);
                showCustomToast("Dosen berhasil diperbarui!", "success");
              },
              onError: () => showCustomToast("Gagal memperbarui dosen.", "error"),
            }
          );
        }
      });
    } else {
      store(form, {
        onSuccess: () => {
          setModalOpen(false);
          showCustomToast("Dosen berhasil ditambahkan!", "success");
        },
        onError: () => showCustomToast("Gagal menambahkan dosen.", "error"),
      });
    }
  };

  const deleteDosen = (id) => {
    const dsn = result.data.find((d) => d.id === id);
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Hapus dosen "${dsn?.nama}" (NIP: ${dsn?.nip})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
    }).then((res) => {
      if (res.isConfirmed) {
        remove(id, {
          onSuccess: () => showCustomToast("Dosen berhasil dihapus!", "success"),
          onError: () => showCustomToast("Gagal menghapus dosen.", "error"),
        });
      }
    });
  };

  if (isLoading)
    return <div className="text-center py-20">Memuat data dosen...</div>;
  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Gagal memuat data: {error.message}
      </div>
    );

  const totalPages = Math.ceil(result.total / limit);
  const currentDosen = dosenWithSKS;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Daftar Dosen</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari nama, NIP, atau email..."
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
            + Tambah Dosen
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">NIP</th>
              <th className="py-3 px-4 text-left">Nama</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Maksimal SKS</th>
              <th className="py-3 px-4 text-left">Total SKS</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentDosen.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Tidak ada data dosen yang sesuai
                </td>
              </tr>
            ) : (
              currentDosen.map((dsn) => (
                <tr key={dsn.id} className="even:bg-gray-100 odd:bg-white">
                  <td className="py-2 px-4">{dsn.nip}</td>
                  <td className="py-2 px-4">{dsn.nama}</td>
                  <td className="py-2 px-4">{dsn.email}</td>
                  <td className="py-2 px-4">{dsn.maxSKS}</td>
                  <td className="py-2 px-4">{dsn.totalSKS}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate(`/dashboard/dosen/${dsn.id}`, { state: dsn })}>
                      Detail
                    </Button>
                    <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => { setSelectedDosen(dsn); setModalOpen(true); }}>
                      Edit
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600" onClick={() => deleteDosen(dsn.id)}>
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
          Menampilkan {result.total === 0 ? 0 : (currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, result.total)} dari {result.total} dosen
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
        <FormDosen onSubmit={handleSubmit} editData={selectedDosen} />
      </Modal>
    </div>
  );
};

export default Dosen;