import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import Sidebar from "../components/Sidebar";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/AdminDashboard.css";
import { Package, AlertTriangle, ClipboardList, Wallet, User } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Body: ${text}`);
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
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
    setSearchQuery(query.toLowerCase());
  };

  // Handle export
  const handleExport = () => {
    if (!stats) {
      setError("No data to export.");
      return;
    }
    const csv = convertToCSV(stats);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    link.download = `dashboard_stats_${timestamp}.csv`;
    link.click();
  };

  // Toggle theme
  const toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
  };

  // Calculate total expenses
  const totalExpense = stats?.expenses?.reduce((sum, e) => sum + (e.total || 0), 0) || 0;

  // Filter cards based on search query
  const filteredCards = [
    { title: "Total Products", value: stats?.totalProducts || 0, icon: Package },
    { title: "Low Inventory", value: stats?.lowInventoryCount || 0, icon: AlertTriangle, alertLevel: stats?.lowInventoryCount > 5 ? "high" : stats?.lowInventoryCount > 0 ? "medium" : "" },
    { title: "Pending Tasks", value: stats?.pendingTasks || 0, icon: ClipboardList },
    { title: "Monthly Expenses", value: `₹${totalExpense}`, icon: Wallet, alertLevel: totalExpense > 10000 ? "high" : totalExpense > 5000 ? "medium" : "" },
    { title: "Recent Activities", value: stats?.recentActivities?.length || 0, icon: ClipboardList },
    { title: "Total Users", value: stats?.totalUsers || 0, icon: User },
  ].filter((card) => card.title.toLowerCase().includes(searchQuery));

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Sidebar handleLogout={handleLogout} toggleTheme={toggleTheme} />
        <main>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome back, Admin!</h2>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search stats..."
            className="search-bar"
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search Dashboard"
          />

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="btn-secondary mb-4">
            Toggle Theme
          </button>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetch("http://localhost:5000/api/dashboard")
                    .then((response) => {
                      if (!response.ok) throw new Error("Failed to fetch");
                      return response.json();
                    })
                    .then((data) => setStats(data))
                    .catch((err) => setError(`Failed to fetch: ${err.message}`))
                    .finally(() => setLoading(false));
                }}
                className="btn-retry"
              >
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
                {filteredCards.map((card, index) => (
                  <DashboardCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    alertLevel={card.alertLevel}
                  />
                ))}
              </div>

              {/* Quick Actions */}
              <div className="quick-actions flex gap-4 mb-6">
                <button onClick={() => navigate("/add-product")} className="btn-primary">
                  Add Product
                </button>
                <button onClick={() => navigate("/manage-users")} className="btn-secondary">
                  Manage Users
                </button>
                <button onClick={handleExport} className="btn-export" aria-label="Export Data">
                  Export Data
                </button>
              </div>

              {/* Notifications */}
              <div className="notifications">
                {stats?.notifications?.length > 0 ? (
                  stats.notifications.map((notification, index) => (
                    <p key={index}>{notification}</p>
                  ))
                ) : (
                  <p>No notifications available.</p>
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

// Convert stats to CSV
const convertToCSV = (stats) => {
  const headers = ["Metric", "Value"];
  const rows = [
    ["Total Products", stats.totalProducts || 0],
    ["Low Inventory", stats.lowInventoryCount || 0],
    ["Pending Tasks", stats.pendingTasks || 0],
    ["Monthly Expenses", stats.expenses?.reduce((sum, e) => sum + (e.total || 0), 0) || 0],
    ["Recent Activities", stats.recentActivities?.length || 0],
    ["Total Users", stats.totalUsers || 0],
  ].map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","));
  return [headers.join(","), ...rows].join("\n");
};

export default AdminDashboard;