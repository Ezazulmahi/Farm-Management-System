import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import { getDashboardData } from "../api/adminAPI";
import {
  Package,
  AlertTriangle,
  ClipboardList,
  Wallet,
  LogOut,
  Layers,
  DollarSign,
  ClipboardCheck,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // for navigation
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardData();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    // Replace with actual logout logic if needed
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalExpense = stats?.expenses.reduce((sum, e) => sum + e.total, 0) || 0;

  return (
    <div className="admin-dashboard-container">
      {/* Navbar */}
      <nav className="admin-navbar">
        <div className="nav-left">
          <h1 className="dashboard-title">Admin Panel</h1>
        </div>
        <div className="nav-right">
          <button onClick={() => navigate("/inventory")} className="nav-link">
            <Layers className="icon" /> Inventory
          </button>
          <button onClick={() => navigate("/expenses")} className="nav-link">
            <DollarSign className="icon" /> Expense
          </button>
          <button onClick={() => navigate("/tasks")} className="nav-link">
            <ClipboardCheck className="icon" /> Tasks
          </button>
          <button onClick={() => navigate("/products")} className="nav-link">
            <ShoppingBag className="icon" /> Products
          </button>
          <button onClick={handleLogout} className="nav-link logout-btn">
            <LogOut className="icon" /> Log Out
          </button>
        </div>
      </nav>

      {/* Main Section */}
      <main className="admin-dashboard">
        {loading ? (
          <div className="loading-message">Loading dashboard...</div>
        ) : !stats ? (
          <div className="error-message">Failed to load data.</div>
        ) : (
          <>
            <h2 className="dashboard-heading">Welcome, Admin</h2>

            {/* Cards */}
            <div className="card-container">
              <DashboardCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
              />
              <DashboardCard
                title="Low Inventory"
                value={stats.lowInventoryCount}
                icon={AlertTriangle}
              />
              <DashboardCard
                title="Pending Tasks"
                value={stats.pendingTasks}
                icon={ClipboardList}
              />
              <DashboardCard
                title="Monthly Expenses"
                value={`₹${totalExpense}`}
                icon={Wallet}
              />
            </div>

            {/* Chart */}
            <div className="dashboard-chart">
              <DashboardChart data={stats.expenses} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
