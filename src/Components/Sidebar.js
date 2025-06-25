import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "../Context/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  if (!user || !user.permissions) return null;

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠", permission: "dashboard.page" },
    { to: "/dashboard/mahasiswa", label: "Mahasiswa", icon: "🎓", permission: "mahasiswa.page" },
    { to: "/dashboard/dosen", label: "Dosen", icon: "👨‍🏫", permission: "dosen.page" },
    { to: "/dashboard/matakuliah", label: "Mata Kuliah", icon: "📖", permission: "matakuliah.page" },
    { to: "/dashboard/rencanastudi", label: "Rencana Studi", icon: "📋", permission: "rencanastudi.page" }, 
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white p-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-8 text-white">Admin Panel</h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) =>
          user.permissions.includes(item.permission) ? (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
                  : "flex items-center gap-2 hover:bg-blue-500 hover:text-white px-4 py-2 rounded"
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ) : null
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
