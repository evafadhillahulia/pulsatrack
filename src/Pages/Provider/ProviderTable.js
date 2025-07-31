// src/Components/ProviderTable.js
import { Pencil, Trash2 } from "lucide-react";

const ProviderTable = ({ data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-3 px-4 text-left">No</th>
            <th className="py-3 px-4 text-left">Kategori</th>
            <th className="py-3 px-4 text-left">Kode</th>
            <th className="py-3 px-4 text-left">Harga Jual</th>
            <th className="py-3 px-4 text-left">Harga Beli</th>
            <th className="py-3 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                Tidak ada data provider.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{item.kategori}</td>
                <td className="py-2 px-4">{item.kode}</td>
                <td className="py-2 px-4">
                  Rp{Number(item.hargajual).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  Rp{Number(item.hargabeli).toLocaleString()}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
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

export default ProviderTable;
