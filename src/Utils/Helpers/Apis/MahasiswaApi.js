import axios from "../../../Utils/Helpers/AxiosInstance";

export const getAllMahasiswa = (params = {}) => {
  return axios.get("/mahasiswa", { params });
};

//  Ambil satu data mahasiswa berdasarkan ID
export const getMahasiswa = (id) => {
  return axios.get(`/mahasiswa/${id}`);
};

//  Tambahkan data mahasiswa baru
export const storeMahasiswa = (data) => {
  return axios.post("/mahasiswa", data);
};

//  Perbarui data mahasiswa berdasarkan ID
export const updateMahasiswa = (id, data) => {
  return axios.put(`/mahasiswa/${id}`, data);
};

//  Hapus data mahasiswa berdasarkan ID
export const deleteMahasiswa = (id) => {
  return axios.delete(`/mahasiswa/${id}`);
};
