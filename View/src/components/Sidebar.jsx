import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaTachometerAlt, FaMoneyBill, FaBox, FaTasks } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Sidebar.css";

const Sidebar = ({ handleLogout, user = { name: "John Doe", role: "Admin", avatar: "https://via.placeholder.com/40" } }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      handleLogout();
    }
  };

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/expenses", label: "Expenses", icon: <FaMoneyBill /> },
    { path: "/inventory", label: "Inventory", icon: <FaBox /> },
    { path: "/products", label: "Products", icon: <FaBox /> },
    { path: "/tasks", label: "Tasks", icon: <FaTasks /> },
  ];

  const filteredLinks = links.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`sidebar ${darkMode ? "dark-mode" : ""}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toggle-sidebar-btn"
        aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {isOpen ? "Close" : "Menu"}
      </button>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="toggle-dark-mode-btn"
        aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <div>
        <h1 className="sidebar-title">Admin Panel</h1>
        <div className="user-info">
          <img
            src={user.avatar}
            alt={`${user.name}'s Avatar`}
            className="user-avatar"
          />
          <div>
            <p className="user-name">{user.name}</p>
            <p className="user-role">{user.role}</p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          aria-label="Search links"
        />
        <ul className="sidebar-links">
          {filteredLinks.map((item) => (
            <li key={item.path} className="sidebar-link-item">
              <Link
                to={item.path}
                aria-current={location.pathname === item.path ? "page" : undefined}
                className={`sidebar-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                {item.icon} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleLogoutClick}
        className="logout-btn"
        aria-label="Logout"
      >
        Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;
