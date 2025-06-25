import React, { useState, useEffect } from "react";
import Label from "../Components/Label";
import Input from "../Components/Input";
import Button from "../Components/Button";
import PropTypes from "prop-types";

const FormDosen = ({ onSubmit, editData, onClose }) => {
  const [formData, setFormData] = useState({
    nip: "",
    nama: "",
    email: "",
    maxSKS: 0,
    totalSKS: 0,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || "",
        nip: editData.nip || "",
        nama: editData.nama || "",
        email: editData.email || "",
        maxSKS: editData.maxSKS || 0,
        totalSKS: editData.totalSKS || 0,
      });
    } else {
      resetForm();
    }
  }, [editData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "maxSKS" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nip, nama, email, maxSKS,totalSKS } = formData;

    if (!nip || !nama || !email || !maxSKS || !totalSKS) {
      alert("Semua field harus diisi!");
      return;
    }

    if (nip.length < 4) {
      alert("NIP minimal 4 karakter");
      return;
    }
    if (maxSKS <= 0) {
      alert("Maksimal SKS harus lebih dari 0");
      return;
    }
    if (totalSKS <= 0) {
      alert("Total SKS harus lebih dari 0");
      return;
    }
    onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      nip: "",
      nama: "",
      email: "",
      maxSKS: 0,
      totalSKS: 0,
    });
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <Label htmlFor="nip">NIP</Label>
        <Input
          type="text"
          id="nip"
          value={formData.nip}
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
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          value={formData.email}
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
          min="1"
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
          min="1"
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

FormDosen.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  editData: PropTypes.shape({
    nip: PropTypes.string,
    nama: PropTypes.string,
    email: PropTypes.string,
    maxSKS: PropTypes.number,
    totalSKS: PropTypes.number,
  }),
};

export default FormDosen;
