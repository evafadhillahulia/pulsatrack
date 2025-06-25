// src/Components/FormRencanaStudi.js
import React from "react";
import Label from "./Label";
import Select from "./Select";
import Button from "./Button";
import Form from "./Form";

const FormRencanaStudi = ({ form, onChange, onSubmit, dosen, mataKuliah, onCancel }) => {
  return (
    <Form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
        <Select
          name="mata_kuliah_id"
          value={form.mata_kuliah_id}
          onChange={onChange}
          required
          className="w-full"
        >
          <option value="">-- Pilih Mata Kuliah --</option>
          {mataKuliah.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="dosen_id">Dosen Pengampu</Label>
        <Select
          name="dosen_id"
          value={form.dosen_id}
          onChange={onChange}
          required
          className="w-full"
        >
          <option value="">-- Pilih Dosen --</option>
          {dosen.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button variant="secondary" type="button" onClick={onCancel}>Batal</Button>
        )}
        <Button type="submit">Simpan</Button>
      </div>
    </Form>
  );
};

export default FormRencanaStudi;
