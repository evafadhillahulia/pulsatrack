// FormMahasiswa.js => src/Components/FormMahasiswa.js

import React, { useState, useEffect } from "react";
import Label from "../Components/Label";
import Input from "../Components/Input";
import Button from "../Components/Button";
import PropTypes from "prop-types";

const FormMahasiswa = ({ onSubmit, editData, onClose }) => {
  const [formData, setFormData] = useState({
    nim: "",
    nama: "",
    email: "",
    jurusan: "",
    maxSKS: 0,
    totalSKS: 0,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        nim: editData.nim || "",
        nama: editData.nama || "",
        email: editData.email || "",
        jurusan: editData.jurusan || "",
        maxSKS: editData.maxSKS || 0,
        totalSKS: editData.maxSKS || 0,
      });
    } else {
      resetForm();
    }
  }, [editData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "status" ? value === "true" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nim, nama, jurusan } = formData;

    if (!nim || !nama || !jurusan) {
      alert("NIM,Nama Email dan Jurusan harus diisi!");
      return;
    }

    if (nim.length < 4) {
      alert("NIM minimal 4 karakter");
      return;
    }

    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nim: "", nama: "",email: "", jurusan:"", maxSKS: 0 , totalSKS: 0 });
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <Label htmlFor="nim">NIM</Label>
        <Input
          type="text"
          id="nim"
          value={formData.nim}
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
        <Label htmlFor="jurusan">Email</Label>
        <Input
          type="text"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="jurusan">Jurusan</Label>
        <Input
          type="text"
          id="jurusan"
          value={formData.jurusan}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="maxSKS">Maksimal SKS</Label>  
        <Input
          type="number"
          id="maxSKS"
          value={formData.maxSKS}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="totalSKS">Total SKS</Label>  
        <Input
          type="number"
          id="totalSKS"
          value={formData.totalSKS}
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

FormMahasiswa.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  editData: PropTypes.shape({
    nim: PropTypes.string,
    nama: PropTypes.string,
    email: PropTypes.string,
    jurusan: PropTypes.string,
    maxSKS: PropTypes.number,
    totalSKS: PropTypes.number,
  }),
};

export default FormMahasiswa;
