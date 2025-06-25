import React, { useEffect, useState } from "react";
import Label from "../Components/Label";
import Input from "../Components/Input";
import Button from "../Components/Button";
import PropTypes from "prop-types";
import AxiosInstance from "../Utils/Helpers/AxiosInstance";

const FormKelas = ({ onSubmit, editData, onClose }) => {
  const [formData, setFormData] = useState({
    nama: "",
    mataKuliahId: "",
    dosenId: "",
    mahasiswaIds: [],
  });

  const [mataKuliahs, setMataKuliahs] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [sksMatkul, setSksMatkul] = useState(0);

  // Fetch data awal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mkRes, dosenRes, mhsRes] = await Promise.all([
          AxiosInstance.get("/matakuliah"),
          AxiosInstance.get("/dosen"),
          AxiosInstance.get("/mahasiswa"),
        ]);

        // Normalisasi: konversi id mahasiswa ke string
        const mhsFormatted = mhsRes.data.map((m) => ({
          ...m,
          id: String(m.id),
        }));

        setMataKuliahs(mkRes.data);
        setDosenList(dosenRes.data);
        setMahasiswaList(mhsFormatted);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };
    fetchData();
  }, []);

  // Set formData ketika editData tersedia
  useEffect(() => {
    if (editData) {
      setFormData({
        nama: editData.nama || "",
        mataKuliahId:
          editData.mataKuliahId?.toString() ||
          editData.matakuliah?.id?.toString() ||
          "",
        dosenId:
          editData.dosenId?.toString() ||
          editData.dosen?.id?.toString() ||
          "",
        mahasiswaIds: (editData.mahasiswaIds || editData.mahasiswa || []).map(
          (m) => (typeof m === "object" ? String(m.id) : String(m))
        ),
      });
    }
  }, [editData]);

  // Update SKS berdasarkan mata kuliah
  useEffect(() => {
    const matkul = mataKuliahs.find(
      (mk) => mk.id === Number(formData.mataKuliahId)
    );
    setSksMatkul(matkul ? matkul.sks : 0);
  }, [formData.mataKuliahId, mataKuliahs]);

  const isMahasiswaEligible = (m) =>
    m && m.totalSKS + sksMatkul <= m.maxSKS;

  const isDosenEligible = (d) =>
    d && d.totalSKS + sksMatkul <= d.maxSKS;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (idStr) => {
    setFormData((prev) => {
      const exists = prev.mahasiswaIds.includes(idStr);
      return {
        ...prev,
        mahasiswaIds: exists
          ? prev.mahasiswaIds.filter((mid) => mid !== idStr)
          : [...prev.mahasiswaIds, idStr],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, mataKuliahId, dosenId, mahasiswaIds } = formData;

    if (!nama || !mataKuliahId || !dosenId || mahasiswaIds.length === 0) {
      alert("Harap lengkapi semua field dan pilih minimal satu mahasiswa.");
      return;
    }

    const dosen = dosenList.find((d) => String(d.id) === dosenId);
    const matkul = mataKuliahs.find((mk) => String(mk.id) === mataKuliahId);

    if (!dosen || !matkul) {
      alert("Dosen atau mata kuliah tidak ditemukan.");
      return;
    }

    if (!isDosenEligible(dosen)) {
      alert("Dosen melebihi batas SKS.");
      return;
    }

    const mahasiswaInvalid = mahasiswaIds
      .map((id) => mahasiswaList.find((m) => m.id === id))
      .filter((m) => !m || !isMahasiswaEligible(m));

    if (mahasiswaInvalid.length > 0) {
      alert(
        `Mahasiswa melebihi SKS: ${mahasiswaInvalid
          .map((m) => (m ? m.nama : "(Mahasiswa tidak ditemukan)"))
          .join(", ")}`
      );
      return;
    }

    const payload = {
      nama,
      matakuliah: { id: Number(matkul.id), nama: matkul.nama },
      dosen: { id: Number(dosen.id), nama: dosen.nama },
      mahasiswaIds: mahasiswaIds.map((id) => Number(id)),
      mahasiswa: mahasiswaIds.map((idStr) => {
        const m = mahasiswaList.find((m) => m.id === idStr);
        return { id: Number(m.id), nama: m.nama };
      }),
    };

    onSubmit(payload);
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <Label htmlFor="nama">Nama Kelas</Label>
        <Input
          id="nama"
          type="text"
          value={formData.nama}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="mataKuliahId">Mata Kuliah</Label>
        <select
          id="mataKuliahId"
          value={formData.mataKuliahId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Pilih Mata Kuliah --</option>
          {mataKuliahs.map((mk) => (
            <option key={mk.id} value={mk.id}>
              {mk.nama} ({mk.sks} SKS)
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="dosenId">Dosen</Label>
        <select
          id="dosenId"
          value={formData.dosenId}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Pilih Dosen --</option>
          {dosenList.map((d) => (
            <option key={d.id} value={d.id} disabled={!isDosenEligible(d)}>
              {d.nama} ({d.totalSKS}/{d.maxSKS} SKS)
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Mahasiswa</Label>
        <div className="max-h-40 overflow-y-auto border p-2 rounded space-y-1">
          {mahasiswaList.map((m) => {
            const idStr = String(m.id);
            const disabled = !isMahasiswaEligible(m);
            return (
              <div key={idStr}>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={idStr}
                    checked={formData.mahasiswaIds.includes(idStr)}
                    onChange={() => handleCheckboxChange(idStr)}
                    disabled={disabled}
                  />
                  <span className={disabled ? "text-red-500" : ""}>
                    {m.nama} ({m.totalSKS}/{m.maxSKS} SKS)
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button type="button" className="bg-gray-400" onClick={handleCancel}>
          Batal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {editData ? "Simpan Perubahan" : "Simpan"}
        </Button>
      </div>
    </form>
  );
};

FormKelas.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  editData: PropTypes.object,
};

export default FormKelas;
