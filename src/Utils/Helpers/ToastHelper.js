// ToastHelper.js => src/Utils/Helpers/ToastHelper.js

import { toast } from "react-hot-toast";
import Swal from "sweetalert2"; 

const toastOption = {
  duration: 3000,
  position: "top-right",
};

export const toastSuccess = (message) => toast.success(message, toastOption);
export const toastError = (message) => toast.error(message, toastOption);
export const toastInfo = (message) => toast(message, toastOption);

export const confirmDelete = async (onConfirm) => {
  const result = await Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Data yang dihapus tidak dapat dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    onConfirm();
  }
};
