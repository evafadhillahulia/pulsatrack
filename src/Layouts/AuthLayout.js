// AuthLayout.js => src/Layouts/AuthLayout.js

import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mx-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
