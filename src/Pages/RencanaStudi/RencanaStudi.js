import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Button from "../../Components/Button";
import ModalRencanaStudi from "./RencanaStudiModal";
import TableRencanaStudi from "./RencanaStudiTable";

import {
  useKelas,
  useStoreKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "../../Utils/Helpers/Hooks/useKelas";
import { useMahasiswa } from "../../Utils/Helpers/Hooks/useMahasiswa";
import { useDosen } from "../../Utils/Helpers/Hooks/useDosen";
import { useMataKuliah } from "../../Utils/Helpers/Hooks/useMataKuliah";

const RencanaStudi = () => {
  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});
  const [selectedMatkul, setSelectedMatkul] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data: kelasResult, refetch } = useKelas();
  const kelas = Array.isArray(kelasResult) ? kelasResult : Array.isArray(kelasResult?.data) ? kelasResult.data : [];
  
  const { data: mahasiswaResult } = useMahasiswa();
  const mahasiswa = Array.isArray(mahasiswaResult) ? mahasiswaResult : Array.isArray(mahasiswaResult?.data) ? mahasiswaResult.data : [];
  
  const { data: dosenResult } = useDosen();
  const dosen = Array.isArray(dosenResult) ? dosenResult : Array.isArray(dosenResult?.data) ? dosenResult.data : [];
  
  const { data: mataKuliahResult } = useMataKuliah();
  const mataKuliah = Array.isArray(mataKuliahResult) ? mataKuliahResult : Array.isArray(mataKuliahResult?.data) ? mataKuliahResult.data : [];
  

  const { mutate: store } = useStoreKelas();
  const { mutate: update } = useUpdateKelas();
  const { mutate: remove } = useDeleteKelas();

  const showCustomToast = (message, type = "success") => {
    toast.custom(() => (
      <div className="flex items-center gap-3 bg-white border p-4 rounded shadow">
        <span>{type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}</span>
        <span>{message}</span>
      </div>
    ));
  };

  const getMaxSks = (id) => mahasiswa.find((m) => m.id === id)?.maxSKS || 0;
  const getDosenMaxSks = (id) => dosen.find((d) => d.id === id)?.maxSKS || 0;

  const handleAddMahasiswa = (kelasItem, mhsId) => {
    const sks = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id)?.sks || 0;
    const totalSks = kelas
      .filter((k) => (k.mahasiswa_ids || []).includes(mhsId))
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
    const maxSks = getMaxSks(mhsId);

    if (totalSks + sks > maxSks) return showCustomToast("SKS melebihi batas", "error");

    update(
      { id: kelasItem.id, data: { ...kelasItem, mahasiswa_ids: [...(kelasItem.mahasiswa_ids || []), mhsId] } },
      {
        onSuccess: () => {
          showCustomToast("Mahasiswa ditambahkan", "success");
          refetch();
          setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
        },
      }
    );
  };

  const handleDeleteMahasiswa = (kelasItem, mhsId) => {
    const updated = {
      ...kelasItem,
      mahasiswa_ids: (kelasItem.mahasiswa_ids || []).filter((id) => id !== mhsId),
    };
    update({ id: kelasItem.id, data: updated }, {
      onSuccess: () => {
        showCustomToast("Mahasiswa dihapus", "success");
        refetch();
      },
    });
  };

  const handleChangeDosen = (kelasItem) => {
    const dsnId = selectedDsn[kelasItem.id];
    const totalSksDosen = kelas
      .filter((k) => k.dosen_id === dsnId && k.id !== kelasItem.id)
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);

    const kelasSks = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id)?.sks || 0;
    const maxSks = getDosenMaxSks(dsnId);

    if (totalSksDosen + kelasSks > maxSks)
      return showCustomToast("SKS dosen melebihi batas", "error");

    update(
      { id: kelasItem.id, data: { ...kelasItem, dosen_id: dsnId } },
      {
        onSuccess: () => {
          showCustomToast("Dosen diperbarui", "success");
          refetch();
        },
      }
    );
  };

  const handleChangeMatkul = (kelasItem) => {
    const newMatkulId = selectedMatkul[kelasItem.id];
    const matkulDipakai = kelas.some((k) => k.id !== kelasItem.id && k.mata_kuliah_id === newMatkulId);
    if (matkulDipakai) return showCustomToast("Mata kuliah sudah dipakai", "error");

    update({ id: kelasItem.id, data: { ...kelasItem, mata_kuliah_id: newMatkulId } }, {
      onSuccess: () => {
        showCustomToast("Mata kuliah diperbarui", "success");
        refetch();
      },
    });
  };

  const handleDeleteKelas = (id) => {
    Swal.fire({
      title: "Hapus Kelas?",
      text: "Data kelas akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    }).then((res) => {
      if (res.isConfirmed) {
        remove(id, {
          onSuccess: () => {
            showCustomToast("Kelas dihapus", "success");
            refetch();
          },
        });
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    store(
      { ...form, mahasiswa_ids: [] },
      {
        onSuccess: () => {
          showCustomToast("Kelas ditambahkan", "success");
          setIsModalOpen(false);
          refetch();
        },
      }
    );
  };

  const filteredKelas = kelas.filter((kls) => {
    const matkul = mataKuliah.find((m) => m.id === kls.mata_kuliah_id)?.nama?.toLowerCase() || "";
    const dsn = dosen.find((d) => d.id === kls.dosen_id)?.nama?.toLowerCase() || "";
    return matkul.includes(searchTerm.toLowerCase()) || dsn.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredKelas.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedKelas = filteredKelas.slice(startIndex, startIndex + limit);

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-800">Daftar Rencana Studi</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Cari..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2"
          />
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5 / halaman</option>
            <option value={10}>10 / halaman</option>
            <option value={20}>20 / halaman</option>
          </select>
          <Button className ="bg-blue-700" onClick={() => { setForm({ mata_kuliah_id: "", dosen_id: "" }); setIsModalOpen(true); }}>
            + Tambah Kelas
          </Button>
        </div>
      </div>

      <TableRencanaStudi
        kelas={paginatedKelas}
        mahasiswa={mahasiswa}
        dosen={dosen}
        mataKuliah={mataKuliah}
        selectedMhs={selectedMhs}
        setSelectedMhs={setSelectedMhs}
        selectedDsn={selectedDsn}
        setSelectedDsn={setSelectedDsn}
        handleAddMahasiswa={handleAddMahasiswa}
        handleDeleteMahasiswa={handleDeleteMahasiswa}
        handleChangeDosen={handleChangeDosen}
        handleDeleteKelas={handleDeleteKelas}
        selectedMatkul={selectedMatkul}
        setSelectedMatkul={setSelectedMatkul}
        handleChangeMatkul={handleChangeMatkul}
      />

      <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
        <p className="text-sm text-gray-600">
          Menampilkan {filteredKelas.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + limit, filteredKelas.length)} dari {filteredKelas.length} kelas
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="bg-blue-500 hover:bg-blue-600">
            ⬅ Sebelumnya
          </Button>
          <span className="text-sm">Halaman {currentPage} dari {totalPages}</span>
          <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="bg-blue-500 hover:bg-blue-600">
            Selanjutnya ➡
          </Button>
        </div>
      </div>

      <ModalRencanaStudi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
        onSubmit={handleSubmit}
        form={form}
        dosen={dosen}
        mataKuliah={mataKuliah}
        kelas={kelas}
      />
    </div>
  );
};

export default RencanaStudi;
