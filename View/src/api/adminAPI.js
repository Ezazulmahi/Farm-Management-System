// src/api/adminAPI.js

export const getDashboardData = async () => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 800));
  
    return {
      totalProducts: 52,
      lowInventoryCount: 5,
      pendingTasks: 8,
      expenses: [
        { _id: "Seeds", total: 4000 },
        { _id: "Fertilizers", total: 2500 },
        { _id: "Labor", total: 3200 },
        { _id: "Machinery", total: 1500 },
        { _id: "Transport", total: 1800 },
      ],
    };
  };
  