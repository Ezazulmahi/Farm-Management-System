import Task from "../Model/models/taskModel.js";
import Product from "../Model/models/productModel.js"; // Assuming you have a Product model
import User from "../Model/models/userModel.js"; // Assuming you have a User model
import Notification from "../Model/models/notificationModel.js"; // Assuming you have a Notification model
import Activity from "../Model/models/activityModel.js"; // Assuming you have an Activity model
import Expense from "../Model/models/expenseModel.js"; // Assuming you have an Expense model

export const getDashboardStats = async (req, res) => {
  try {
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const totalProducts = await Product.countDocuments();
    const lowInventoryCount = await Product.countDocuments({ quantity: { $lt: 5 } });
    const totalUsers = await User.countDocuments();
    const expenses = await Expense.find(); // Replace with your actual logic

    // Define otherStats if needed
    const otherStats = {
      totalRevenue: 10000, // Example placeholder value
      totalExpenses: 5000, // Example placeholder value
    };

    res.json({
      ...otherStats,
      pendingTasks,
      totalProducts,
      lowInventoryCount,
      totalUsers,
      expenses: expenses.length > 0 ? expenses : null,
      notifications: [
        "Low inventory for Wheat",
        "Task overdue: Irrigation",
      ],
      recentActivities: [
        "Product added: Apple",
        "Task completed: Harvest",
      ],
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};