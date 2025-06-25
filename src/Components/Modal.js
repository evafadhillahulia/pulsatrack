// Modal.js => src/Components/Modal.js

import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Edit Mahasiswa</h2>
          <button
            className="text-gray-600 hover:text-red-500 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
