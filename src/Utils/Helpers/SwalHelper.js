// SwalHelper.js => src/Utils/Helpers/SwalHelper.js

import Swal from "sweetalert2";

const showConfirm = (title, icon, confirmButtonText, successMessage, onConfirm) => {
  Swal.fire({
    title,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire({
        icon: "success",
        title: successMessage,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
};

export const confirmLogout = (onConfirm) => {
  showConfirm("Yakin ingin logout?", "warning", "Ya, logout", "Logout berhasil", onConfirm);
};

export const confirmDelete = (onConfirm) => {
  showConfirm("Yakin ingin menghapus data ini?", "warning", "Ya, hapus", "Data berhasil dihapus", onConfirm);
};

export const confirmUpdate = (onConfirm) => {
  showConfirm("Yakin ingin memperbarui data ini?", "question", "Ya, perbarui", "Data berhasil diperbarui", onConfirm);
};
