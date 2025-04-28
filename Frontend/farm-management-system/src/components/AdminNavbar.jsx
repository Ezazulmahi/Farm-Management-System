import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <div className="logo" onClick={() => navigate("/admin/dashboard")}>
        🌿 AgriAdmin
      </div>
      <ul className="navbar-links">
        <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/admin/expenses")}>Expenses</li>
        <li onClick={() => navigate("/admin/inventory")}>Inventory</li>
        <li onClick={() => navigate("/admin/products")}>Products</li>
        <li onClick={() => navigate("/admin/tasks")}>Tasks</li>
        <li>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
