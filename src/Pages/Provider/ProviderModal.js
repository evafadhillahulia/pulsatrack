import React, { useState, useEffect } from "react";
import { useStoreProvider, useUpdateProvider } from "../../Utils/Helpers/Hooks/useProvider";
import toast from "react-hot-toast";

const ProviderModal = ({
  isOpen,
  onClose,
  selectedProvider,
  fetchProviders,
}) => {
  const { storeProvider } = useStoreProvider();
  const { updateProvider } = useUpdateProvider();

  const [form, setForm] = useState({
    kategori: "",
    provider: "",
    kode: "",
    hargajual: "",
    hargabeli: "",
  });

  const [errors, setErrors] = useState({});

  // Set form data saat edit
  useEffect(() => {
    if (selectedProvider) {
      setForm({
        kategori: selectedProvider.kategori || "",
        provider: selectedProvider.provider || "",
        kode: selectedProvider.kode || "",
        hargajual: selectedProvider.hargajual || "",
        hargabeli: selectedProvider.hargabeli || "",
      });
    } else {
      setForm({
        kategori: "",
        provider: "",
        kode: "",
        hargajual: "",
        hargabeli: "",
      });
    }
  }, [selectedProvider, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.kategori) tempErrors.kategori = "Kategori wajib diisi";
    if (!form.provider) tempErrors.provider = "Provider wajib diisi";
    if (!form.kode) tempErrors.kode = "Kode wajib diisi";
    if (!form.hargajual) tempErrors.hargajual = "Harga jual wajib diisi";
    if (!form.hargabeli) tempErrors.hargabeli = "Harga beli wajib diisi";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      kategori: form.kategori,
      provider: form.provider,
      kode: form.kode,
      hargajual: parseInt(form.hargajual),
      hargabeli: parseInt(form.hargabeli),
    };

    try {
      if (selectedProvider?.id) {
        // EDIT
        await updateProvider(selectedProvider.id, payload);
        toast.success("Data berhasil diperbarui!");
      } else {
        // TAMBAH
        await storeProvider(payload);
        toast.success("Data berhasil ditambahkan!");
      }

      fetchProviders(); // Refresh data
      onClose(); // Tutup modal
    } catch (err) {
      console.error("Gagal simpan:", err);
      toast.error("Gagal menyimpan data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {selectedProvider ? "Edit Provider" : "Tambah Provider"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Kategori */}
          <div className="mb-4">
            <label className="block mb-1">Kategori</label>
            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Pilih Kategori</option>
              <option value="Pulsa">Pulsa</option>
              <option value="Top Up Ewallet">Top Up Ewallet</option>
              <option value="Tagihan">Tagihan</option>
              <option value="Top Up Game">Top Up Game</option>
              
            </select>
            {errors.kategori && (
              <p className="text-red-500 text-sm">{errors.kategori}</p>
            )}
          </div>

          {/* Provider */}
          <div className="mb-4">
            <label className="block mb-1">Provider</label>
            <select
              name="provider"
              value={form.provider}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Pilih Provider</option>
              <option value="Telkomsel">Telkomsel</option>
              <option value="Tri">Tri</option>
              <option value="XL">XL</option>
              <option value="Axis">Axis</option>
              <option value="Indosat">Indosat</option>
              <option value="Smartfren">Smartfren</option>
              <option value="OVO">OVO</option>
              <option value="DANA">DANA</option>
              <option value="Gopay">Gopay</option>
              <option value="ShopeePay">ShopeePay</option>
              <option value="LinkAja">LinkAja</option>
              <option value="Pulsa Listrik">Pulsa Listrik</option>
              <option value="PDAM">PDAM</option>
              <option value="PLN">PLN</option>
              <option value="Firefire">FireFire</option>
            </select>
            {errors.provider && (
              <p className="text-red-500 text-sm">{errors.provider}</p>
            )}
          </div>

          {/* Kode */}
          <div className="mb-4">
            <label className="block mb-1">Kode</label>
            <input
              type="text"
              name="kode"
              value={form.kode}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.kode && <p className="text-red-500 text-sm">{errors.kode}</p>}
          </div>

          {/* Harga Jual */}
          <div className="mb-4">
            <label className="block mb-1">Harga Jual</label>
            <input
              type="number"
              name="hargajual"
              value={form.hargajual}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.hargajual && (
              <p className="text-red-500 text-sm">{errors.hargajual}</p>
            )}
          </div>

          {/* Harga Beli */}
          <div className="mb-6">
            <label className="block mb-1">Harga Beli</label>
            <input
              type="number"
              name="hargabeli"
              value={form.hargabeli}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.hargabeli && (
              <p className="text-red-500 text-sm">{errors.hargabeli}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderModal;
