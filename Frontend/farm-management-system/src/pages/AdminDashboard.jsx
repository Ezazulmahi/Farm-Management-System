import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import { getDashboardData } from "../api/adminAPI";
import { Package, AlertTriangle, ClipboardList, Wallet } from "lucide-react";
import "../styles/Dashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4 text-gray-600">Loading dashboard...</div>;
  if (!stats) return <div className="p-4 text-red-500">Failed to load data.</div>;

  const totalExpense = stats.expenses.reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="admin-dashboard p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Products" value={stats.totalProducts} icon={Package} />
        <DashboardCard title="Low Inventory" value={stats.lowInventoryCount} icon={AlertTriangle} />
        <DashboardCard title="Pending Tasks" value={stats.pendingTasks} icon={ClipboardList} />
        <DashboardCard title="Monthly Expenses" value={`₹${totalExpense}`} icon={Wallet} />
      </div>

      <DashboardChart data={stats.expenses} />
    </div>
  );
};

export default AdminDashboard;
