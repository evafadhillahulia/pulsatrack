import React, { useState, useEffect } from "react";

const MataKuliahModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedMataKuliah,
}) => {
  const [form, setForm] = useState({
    id: "",
    kode: "",
    nama: "",
    sks: "",

  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedMataKuliah) {
      setForm(selectedMataKuliah);
    } else {
      setForm({ id: "", kode: "", nama: "", sks: "" });
    }
  }, [selectedMataKuliah, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!form.id) tempErrors.id = "ID wajib diisi";
    if (!form.kode) tempErrors.kode = "Kode wajib diisi";
    if (!form.nama) tempErrors.nama = "Nama wajib diisi";
    if (!form.sks) tempErrors.sks = "SKS wajib diisi";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {selectedMataKuliah ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">ID</label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={!!selectedMataKuliah}
            />
            {errors.kode && (
              <p className="text-red-500 text-sm mt-1">{errors.id}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Kode</label>
            <input
              type="text"
              name="kode"
              value={form.kode}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.nama && (
              <p className="text-red-500 text-sm mt-1">{errors.kode}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nama</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {errors.jurusan && (
              <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
            )}
          </div>
            <div className="mb-4">
                <label className="block mb-1">SKS</label>
                <input
                type="text"
                name="sks"
                value={form.sks}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                />
                {errors.sks && (
                <p className="text-red-500 text-sm mt-1">{errors.sks}</p>
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

export default MataKuliahModal;