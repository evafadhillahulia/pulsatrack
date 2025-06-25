import React, { useState, useEffect } from "react";
import Label from "../Components/Label";
import Input from "../Components/Input";
import Button from "../Components/Button";
import PropTypes from "prop-types";

const FormMataKuliah = ({ onSubmit, editData, onClose }) => {
  const [formData, setFormData] = useState({
    id: "",
    kode: "",
    nama: "",
    sks: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || "",
        kode: editData.kode || "",
        nama: editData.nama || "",
        sks: editData.sks || "",
      });
    } else {
      resetForm();
    }
  }, [editData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { id, kode, nama, sks} = formData;

    if (!kode || !nama || !sks) {
      alert("Kode, Nama, SKS, dan Dosen ID harus diisi!");
      return;
    }

    if (kode.length < 4) {
      alert("Kode minimal 4 karakter");
      return;
    }

    if (editData && !id) {
      alert("ID wajib saat mengedit data.");
      return;
    }

    console.log("Data disubmit:", formData); // Debugging
    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      kode: "",
      nama: "",
      sks: "",
    });
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* Hanya tampilkan field ID saat mode edit */}
      {editData && (
        <div>
          <Label htmlFor="id">ID</Label>
          <Input
            type="text"
            id="id"
            value={formData.id}
            onChange={handleChange}
            disabled
          />
        </div>
      )}

      <div>
        <Label htmlFor="kode">Kode</Label>
        <Input
          type="text"
          id="kode"
          value={formData.kode}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="nama">Nama</Label>
        <Input
          type="text"
          id="nama"
          value={formData.nama}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="sks">SKS</Label>
        <Input
          type="text"
          id="sks"
          value={formData.sks}
          onChange={handleChange}
          required
        />
      </div>


      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          className="bg-gray-400 text-white"
          onClick={handleCancel}
        >
          Batal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {editData ? "Simpan Perubahan" : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

FormMataKuliah.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  editData: PropTypes.shape({
    id: PropTypes.string,
    kode: PropTypes.string,
    nama: PropTypes.string,
    sks: PropTypes.string,
  }),
};

export default FormMataKuliah;
