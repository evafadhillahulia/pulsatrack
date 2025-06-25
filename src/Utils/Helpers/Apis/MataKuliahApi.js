import axios from "../../../Utils/Helpers/AxiosInstance";

//  Ambil semua mata kuliah dengan dukungan query: pagination, search, sort, limit
export const getAllMataKuliah = (params = {}) => {
  return axios.get("/matakuliah", { params });
};

//  Ambil satu data mata kuliah berdasarkan ID
export const getMataKuliah = (id) => {
  return axios.get(`/matakuliah/${id}`);
};

//  Tambahkan data mata kuliah baru
export const storeMataKuliah = (data) => {
  return axios.post("/matakuliah", data);
};

//  Perbarui data mata kuliah berdasarkan ID
export const updateMataKuliah = (id, data) => {
  return axios.put(`/matakuliah/${id}`, data);
};

//  Hapus data mata kuliah berdasarkan ID
export const deleteMataKuliah = (id) => {
  return axios.delete(`/matakuliah/${id}`);
};
