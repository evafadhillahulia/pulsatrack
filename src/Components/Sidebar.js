import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "../Context/AuthContext";

const Sidebar = () => {
  const { user } = useAuthStateContext();

  // Optional: log permissions saat dev
  console.log("🧠 Sidebar: user permissions ->", user?.permissions);

  // Jika user belum login atau tidak punya permission
  if (!user || !Array.isArray(user.permissions)) return null;

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠", permission: "dashboard.page" },
    { to: "/dashboard/transaksi", label: "Transaksi", icon: "💰", permission: "transaksi.page" },
    { to: "/dashboard/provider", label: "Provider", icon: "🏷️", permission: "provider.page" },
    { to: "/dashboard/penjualan", label: "Penjualan", icon: "📈", permission: "penjualan.page" },
    { to: "/dashboard/laporan", label: "Laporan", icon: "📊", permission: "laporan.page" },
    { to: "/dashboard/saldo", label: "Saldo", icon: "💳", permission: "saldo.page" }
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
                  : "flex items-center gap-2 hover:bg-blue-500 text-white px-4 py-2 rounded"
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
