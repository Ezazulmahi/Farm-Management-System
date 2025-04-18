// components/DashboardChart.jsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#A28CF7"];

const DashboardChart = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-center text-sm text-gray-500">No expense data to display.</p>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-5 mt-6 w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ _id }) => _id}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
