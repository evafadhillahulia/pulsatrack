// src/Components/Header.js
import React from "react";
import ProfileMenu from "./ProfileMenu";
import { useAuthStateContext } from "../Context/AuthContext";

const Header = () => {
  const { user } = useAuthStateContext();

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">UDINUS HOME</h1>
          {user && (
            <p className="text-sm text-gray-500">Welcome, {user.nama} ({user.role})</p>
          )}
        </div>
        {user && <ProfileMenu />}
      </div>
    </header>
  );
};

export default Header;
