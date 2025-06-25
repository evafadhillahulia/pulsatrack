// src/Components/ProfileMenu.js

import { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { confirmLogout } from "../Utils/Helpers/SwalHelper";

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    confirmLogout(() => {
      alert("Logout berhasil!");
      setIsOpen(false);
      window.location.href = "/Login";
    });
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <FaUserCircle className="text-3xl text-gray-600 hover:text-gray-800 transition" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 animate-fade-in">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">admin@gmail.com</p>
          </div>
          <div className="py-1">
            <button
              onClick={() => alert("Fitur profile belum tersedia")}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaUser className="text-gray-500" /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt className="text-gray-500" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
