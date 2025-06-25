import React from "react";

const MataKuliahTable = ({ mataKuliah, openEditModal, onDelete, onDetail }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Kode</th>
            <th className="py-3 px-4 text-left">Nama</th>
            <th className="py-3 px-4 text-left">SKS</th>
            <th className="py-3 px-4 text-left">Semester</th>
            <th className="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mataKuliah.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                Tidak ada data mata kuliah.
              </td>
            </tr>
          ) : (
            mataKuliah.map((mtkl) => (
              <tr key={mtkl.id} className="even:bg-gray-100 odd:bg-white">
                <td className="py-2 px-4 font-medium">{mtkl.kode}</td>
                <td className="py-2 px-4">{mtkl.nama}</td>
                <td className="py-2 px-4">{mtkl.sks}</td>
                <td className="py-2 px-4">{mtkl.semester}</td>
                <td className="py-2 px-4 text-center space-x-2">
                  {onDetail && (
                    <button
                      onClick={() => onDetail(mtkl.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Detail
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(mtkl)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(mtkl.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MataKuliahTable;
