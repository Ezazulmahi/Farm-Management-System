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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardData();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Calculate total expenses
  const totalExpense = stats?.expenses.reduce((sum, e) => sum + e.total, 0) || 0;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-100 to-blue-100">
      <Sidebar handleLogout={handleLogout} />
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome back, Admin!</h2>

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ) : !stats ? (
          <p className="text-red-500">Failed to load dashboard data.</p>
        ) : (
          <>
            {/* Dashboard Cards */}
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

            {/* Dashboard Chart */}
            <DashboardChart data={stats.expenses} />
          </>
        )}
      </main>
    </div>
  );
};

// Prop validation for DashboardCard
DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
};

export default AdminDashboard;
