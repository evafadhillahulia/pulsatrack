import React from "react";
import Button from "../../Components/Button";

const TableRencanaStudi = ({
  kelas,
  mahasiswa,
  dosen,
  mataKuliah,
  selectedMhs,
  setSelectedMhs,
  selectedDsn,
  setSelectedDsn,
  selectedMatkul,
  setSelectedMatkul,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  handleChangeDosen,
  handleChangeMatkul,
  handleDeleteKelas,
}) => {
  return (
    <div className="space-y-6">
      {kelas.map((kls) => {
        const matkul = mataKuliah.find((m) => m.id === kls.mata_kuliah_id);
        const dosenPengampu = dosen.find((d) => d.id === kls.dosen_id);
        const mhsInClass = (kls.mahasiswa_ids || []).map((id) =>
          mahasiswa.find((m) => m.id === id)
        ).filter(Boolean);

        return (
          <div key={kls.id} className="border rounded-lg bg-white shadow">
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mata Kuliah</p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {matkul?.nama || "-"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-3">Dosen Pengampu</p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {dosenPengampu?.nama || "-"}
                  </h3>
                </div>
                {mhsInClass.length === 0 && (
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDeleteKelas(kls.id)}
                  >
                    Hapus Kelas
                  </Button>
                )}
              </div>

              {/* Edit Mata Kuliah & Dosen */}
              <div className="mt-4 flex flex-wrap gap-4">
                {/* Ganti Matkul */}
                <div className="flex gap-2">
                  <select
                    value={selectedMatkul[kls.id] || ""}
                    onChange={(e) => setSelectedMatkul({ ...selectedMatkul, [kls.id]: e.target.value })}
                    className="px-3 py-1.5 border rounded"
                  >
                    <option value="">-- Ganti Mata Kuliah --</option>
                    {mataKuliah.map((mk) => (
                      <option key={mk.id} value={mk.id}>
                        {mk.nama}
                      </option>
                    ))}
                  </select>
                  <Button onClick={() => handleChangeMatkul(kls)} className="bg-indigo-600 hover:bg-indigo-700">
                    Simpan
                  </Button>
                </div>

                {/* Ganti Dosen */}
                <div className="flex gap-2">
                  <select
                    value={selectedDsn[kls.id] || ""}
                    onChange={(e) => setSelectedDsn({ ...selectedDsn, [kls.id]: e.target.value })}
                    className="px-3 py-1.5 border rounded"
                  >
                    <option value="">-- Ganti Dosen --</option>
                    {dosen.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                  <Button onClick={() => handleChangeDosen(kls)} className="bg-blue-600 hover:bg-blue-700">
                    Simpan
                  </Button>
                </div>
              </div>
            </div>

            {/* Mahasiswa */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="py-2 px-4">No</th>
                    <th className="py-2 px-4 text-left">Nama</th>
                    <th className="py-2 px-4 text-left">NIM</th>
                    <th className="py-2 px-4 text-center">Total SKS</th>
                    <th className="py-2 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mhsInClass.length > 0 ? (
                    mhsInClass.map((m, i) => {
                      const totalSks = kelas
                        .filter((k) => (k.mahasiswa_ids || []).includes(m.id))
                        .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
                        .reduce((a, b) => a + b, 0);

                      return (
                        <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="py-2 px-4">{i + 1}</td>
                          <td className="py-2 px-4">{m.nama}</td>
                          <td className="py-2 px-4">{m.nim}</td>
                          <td className="py-2 px-4 text-center">{totalSks}</td>
                          <td className="py-2 px-4 text-center">
                            <Button
                              onClick={() => handleDeleteMahasiswa(kls, m.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Hapus
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-3 italic text-gray-500">
                        Belum ada mahasiswa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tambah Mahasiswa */}
            <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-start gap-3">
              <select
                value={selectedMhs[kls.id] || ""}
                onChange={(e) => setSelectedMhs({ ...selectedMhs, [kls.id]: e.target.value })}
                className="w-full md:w-64 px-3 py-1.5 border rounded"
              >
                <option value="">-- Pilih Mahasiswa --</option>
                {mahasiswa.map((m) => {
                  const totalSks = kelas
                    .filter((k) => (k.mahasiswa_ids || []).includes(m.id))
                    .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
                    .reduce((a, b) => a + b, 0);
                  return (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.nim}) - {totalSks} / {m.maxSKS || 0} SKS
                    </option>
                  );
                })}
              </select>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleAddMahasiswa(kls, selectedMhs[kls.id])}
              >
                Tambah Mahasiswa
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableRencanaStudi;
