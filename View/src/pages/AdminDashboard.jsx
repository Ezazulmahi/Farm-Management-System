import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import { getDashboardData } from "../api/adminAPI";
import {
  Package,
  AlertTriangle,
  ClipboardList,
  Wallet,
} from "lucide-react";
// import "../styles/AdminDashboard.css"; // Optional: for extra custom CSS if needed

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
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const totalExpense =
    stats?.expenses.reduce((sum, e) => sum + e.total, 0) || 0;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-100 to-blue-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-700 mb-6">Admin Panel</h1>
          <ul className="space-y-3 text-base font-medium text-gray-700">
            <li><a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a></li>
            <li><a href="/admin/expenses" className="hover:text-blue-600">Expenses</a></li>
            <li><a href="/admin/inventory" className="hover:text-blue-600">Inventory</a></li>
            <li><a href="/admin/products" className="hover:text-blue-600">Products</a></li>
            <li><a href="/admin/tasks" className="hover:text-blue-600">Tasks</a></li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="bg-green-600 text-white mt-6 py-2 px-4 rounded hover:bg-green-700"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome back, Admin!</h2>

        {loading ? (
          <p className="text-gray-600">Loading data...</p>
        ) : !stats ? (
          <p className="text-red-500">Failed to load dashboard data.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            <DashboardChart data={stats.expenses} />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
