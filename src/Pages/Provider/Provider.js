// src/pages/Provider.jsx
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { useStoreProvider, useProvider, useUpdateProvider } from "../../Utils/Helpers/Hooks/useProvider";
import Button from "../../Components/Button";
import ProviderModal from "./ProviderModal"; 


const Provider = () => {
  
  const { providers } = useProvider();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setModalOpen] = useState(false); // ✅ perbaikan
  const [selectedProvider, setSelectedProvider] = useState(null); // untuk edit jika diperlukan

  const filteredProviders = providers.filter((item) =>
    item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const paginatedData = filteredProviders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { fetchProviders } = useProvider();
const { storeProvider } = useStoreProvider();
const { updateProvider } = useUpdateProvider();
const { deleteProvider } = useStoreProvider();


const handleDelete = async (id) => {
  const konfirmasi = window.confirm("Yakin ingin menghapus provider?");
  if (!konfirmasi) return;

  try {
    await deleteProvider(id);
    await fetchProviders(); // refresh data setelah hapus
  } catch (error) {
    console.error("Gagal menghapus provider:", error);
  }
};


const handleSubmit = async (data) => {
  try {
    const payload = {
      kategori: data.kategori,
      provider: data.provider,
      kode: data.kode,
      hargajual: parseInt(data.hargajual),
      hargabeli: parseInt(data.hargabeli),
    };

    if (selectedProvider) {
      // Edit mode
      await updateProvider(selectedProvider.id, payload);
    } else {
      // Tambah mode
      await storeProvider(payload);
    }

    await fetchProviders(); 
    setModalOpen(false); // ⬅️ Tutup modal
    setSelectedProvider(null); // ⬅️ Reset form
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
  }
};


  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-purple-800">Data Provider</h2>
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari provider..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64 border border-purple-300 rounded-lg px-4 py-2"
          />
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="md:w-13 border border-purple-300 rounded-lg px-4 py-2"
          >
            <option value={5}>5 / halaman</option>
            <option value={10}>10 / halaman</option>
            <option value={20}>20 / halaman</option>
          </select>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => {
              setSelectedProvider(null);
              setModalOpen(true);
            }}
          >
            + Tambah Provider
          </Button>
        </div>
      </div>

      <table className="min-w-full border border-purple-300">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="py-2 px-4 border">No</th>
            <th className="py-2 px-4 border">Kategori</th>
            <th className="py-2 px-4 border">Nama Provider</th>
            <th className="py-2 px-4 border">Kode</th>
            <th className="py-2 px-4 border">Harga Jual</th>
            <th className="py-2 px-4 border">Harga Beli</th>
            <th className="py-2 px-4 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Data tidak ditemukan
              </td>
            </tr>
          ) : (
            paginatedData.map((item, index) => (
              <tr key={item.id} className="even:bg-purple-50">
                <td className="py-2 px-4 border">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="py-2 px-4 border">{item.kategori}</td>
                <td className="py-2 px-4 border">{item.provider}</td>
                <td className="py-2 px-4 border">{item.kode}</td>
                <td className="py-2 px-4 border">Rp {item.hargajual.toLocaleString()}</td>
                <td className="py-2 px-4 border">Rp {item.hargabeli.toLocaleString()}</td>
                <td className="py-2 px-4 border space-x-2">
                <button
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    onClick={() => {
                      setSelectedProvider(item);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={16} />
                </button>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
        <div className="text-sm text-gray-600">
          Menampilkan {paginatedData.length} dari {filteredProviders.length} data
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-purple-700">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-purple-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal tambah/edit provider */}
      <ProviderModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedProvider={selectedProvider}
      />
    </div>
  );
};

export default Provider;
