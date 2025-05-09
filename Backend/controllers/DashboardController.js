import Task from "../Model/models/taskModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const stats = {
      totalProducts: 100, // Placeholder (replace with Product model count)
      lowInventoryCount: 5, // Placeholder
      pendingTasks,
      expenses: [
        { month: "Jan", total: 5000 },
        { month: "Feb", total: 6000 },
        // Add more as needed
      ],
      recentActivities: [
        "Product added: Apple",
        "Task completed: Harvest",
      ],
      totalUsers: 50, // Placeholder
      notifications: [
        "Low inventory for Wheat",
        "Task overdue: Irrigation",
      ],
    };
    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};