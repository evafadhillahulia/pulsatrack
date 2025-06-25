import React from "react";
import { useAuth } from "../../Context/AuthContext";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete, onDetail }) => {
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">NIM</th>
            <th className="py-3 px-4 text-left">Nama</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Jurusan</th>
            <th className="py-3 px-4 text-left">Maksimal SKS</th>
            <th className="py-3 px-4 text-left">Total SKS</th>
            <th className="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mahasiswa.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                Tidak ada data mahasiswa.
              </td>
            </tr>
          ) : (
            mahasiswa.map((mhs) => (
              <tr key={mhs.id} className="even:bg-gray-100 odd:bg-white">
                <td className="py-2 px-4 font-medium">{mhs.id}</td>
                <td className="py-2 px-4 font-medium">{mhs.nim}</td>
                <td className="py-2 px-4">{mhs.nama}</td>
                <td className="py-2 px-4">{mhs.email}</td>
                <td className="py-2 px-4">{mhs.jurusan || 'N/A'}</td>
                <td className="py-2 px-4">{mhs.maxSKS}</td>
                <td className="py-2 px-4">{mhs.totalSKS}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  {onDetail && (
                    <button
                      onClick={() => onDetail(mhs.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Detail
                    </button>
                  )}
                  {user?.permission.includes("mahasiswa.update") && (
                    <button
                      onClick={() => openEditModal(mhs)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                  {user?.permission.includes("mahasiswa.delete") && (
                    <button
                      onClick={() => onDelete(mhs.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;
