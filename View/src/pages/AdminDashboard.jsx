import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import Sidebar from '../components/Sidebar';
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/AdminDashboard.css";
import {
  Package,
  AlertTriangle,
  ClipboardList,
  Wallet,
  User,
} from "lucide-react";

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-message">
          <p>Error: {this.state.error?.message || "Something went wrong"}</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard');
        console.log('Response:', response);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Body: ${text}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, received: ${text}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError(`Failed to fetch dashboard data: ${error.message}`);
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

  // Handle search
  const handleSearch = (query) => {
    console.log("Search query:", query);
  };

  // Handle export
  const handleExport = () => {
    console.log("Exporting data...");
  };

  // Toggle theme
  const toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
  };

  // Calculate total expenses
  const totalExpense = stats?.expenses.reduce((sum, e) => sum + e.total, 0) || 0;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex bg-gradient-to-br from-cyan-100 to-blue-100">
        <Sidebar handleLogout={handleLogout} />
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome back, Admin!</h2>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search Dashboard"
          />

          {/* Error Message */}
          {error && (
            <div className="text-red-500">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn-retry">
                Retry
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {loading ? (
            <div className="skeleton-loader">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          ) : !stats ? (
            <p className="text-red-500">No dashboard data available. Please try again later.</p>
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
                <DashboardCard
                  title="Recent Activities"
                  value={stats.recentActivities.length}
                  icon={ClipboardList}
                />
                <DashboardCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={User}
                />
              </div>

              {/* Quick Actions */}
              <div className="quick-actions flex gap-4">
                <button onClick={() => navigate('/add-product')} className="btn-primary">Add Product</button>
                <button onClick={() => navigate('/manage-users')} className="btn-secondary">Manage Users</button>
                <button onClick={handleExport} className="btn-export" aria-label="Export Data">
                  Export Data
                </button>
              </div>

              {/* Notifications */}
              <div className="notifications">
                {stats?.notifications?.length > 0 ? (
                  stats.notifications.map((notification, index) => (
                    <p key={index} className="text-sm text-gray-600">{notification}</p>
                  ))
                ) : (
                  <p className="text-gray-500">No notifications available.</p>
                )}
              </div>

              {/* Dashboard Chart */}
              <DashboardChart data={stats.expenses} />
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

// Prop validation for DashboardCard
DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
};

export default AdminDashboard;