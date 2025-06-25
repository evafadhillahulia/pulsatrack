// Utils/Apis/KelasApi.js
import axios from "../../../Utils/Helpers/AxiosInstance";

// Ambil semua kelas dengan dukungan query: search, sort, pagination
export const getAllKelas = (params = {}) => {
  return axios.get("/kelas", { params });
};

//  Ambil satu data kelas berdasarkan ID
export const getKelas = (id) => {
  return axios.get(`/kelas/${id}`);
};

//  Tambahkan data kelas baru
export const storeKelas = (data) => {
  return axios.post("/kelas", data);
};

//  Perbarui data kelas berdasarkan ID
export const updateKelas = (id, data) => {
  return axios.put(`/kelas/${id}`, data);
};

//  Hapus data kelas berdasarkan ID
export const deleteKelas = (id) => {
  return axios.delete(`/kelas/${id}`);
};
