import React from "react";

const DosenTable = ({ dosen, openEditModal, onDelete, onDetail }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4 text-left">ID</th> 
            <th className="py-3 px-4 text-left">NIP</th>
            <th className="py-3 px-4 text-left">Nama</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Maksimal SKS</th>
            <th className="py-3 px-4 text-left">Total SKS</th> 
            <th className="py-3 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dosen.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500"> 
                Tidak ada data dosen.
              </td>
            </tr>
          ) : (
            dosen.map((dsn) => (
              <tr key={dsn.id} className="even:bg-gray-100 odd:bg-white">
                <td className="py-2 px-4 font-medium">{dsn.id}</td> 
                <td className="py-2 px-4 font-medium">{dsn.nip}</td>
                <td className="py-2 px-4">{dsn.nama}</td> 
                <td className="py-2 px-4">{dsn.email || 'N/A'}</td>
                <td className="py-2 px-4">{dsn.maxSKS}</td>
                <td className="py-2 px-4">{dsn.totalSKS}</td> 
                <td className="py-2 px-4 text-center space-x-2">
                  {onDetail && (
                    <button
                      onClick={() => onDetail(dsn.id)} 
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Detail
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(dsn)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(dsn.id)} 
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

export default DosenTable;