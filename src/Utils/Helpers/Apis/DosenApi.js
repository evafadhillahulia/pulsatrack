import axios from "../../../Utils/Helpers/AxiosInstance";

//  Ambil semua dosen dengan dukungan query (pagination, search, sort, limit, dsb)
export const getAllDosen = (params = {}) => {
  return axios.get("/dosen", { params });
};

//  Ambil satu data dosen berdasarkan ID
export const getDosen = (id) => {
  return axios.get(`/dosen/${id}`);
};

// Tambahkan data dosen baru
export const storeDosen = (data) => {
  return axios.post("/dosen", data);
};

// Perbarui data dosen berdasarkan ID
export const updateDosen = (id, data) => {
  return axios.put(`/dosen/${id}`, data);
};

//  Hapus data dosen berdasarkan ID
export const deleteDosen = (id) => {
  return axios.delete(`/dosen/${id}`);
};
