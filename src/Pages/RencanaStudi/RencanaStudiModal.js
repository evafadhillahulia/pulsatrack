import Button from "../../Components/Button";

const ModalRencanaStudi = ({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  form,
  dosen,
  mataKuliah,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Tambah Kelas Baru</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mata Kuliah
            </label>
            <select
              name="mata_kuliah_id"
              value={form.mata_kuliah_id}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {mataKuliah.map((mk) => (
                <option key={mk.id} value={mk.id}>
                  {mk.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dosen Pengampu
            </label>
            <select
              name="dosen_id"
              value={form.dosen_id}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Dosen --</option>
              {dosen.map((dsn) => (
                <option key={dsn.id} value={dsn.id}>
                  {dsn.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" className="bg-gray-500 hover:bg-gray-600" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRencanaStudi;
