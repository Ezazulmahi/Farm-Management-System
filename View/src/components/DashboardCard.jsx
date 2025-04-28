// components/DashboardCard.jsx
import React from 'react';
 import { cn } from "../lib/utils"; 


const DashboardCard = ({ title, value, icon: Icon, className }) => {
  return (
    <div className={cn("bg-white shadow-md rounded-2xl p-5 flex items-center justify-between", className)}>
      <div>
        <h4 className="text-sm text-gray-500 font-medium">{title}</h4>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      {Icon && (
        <div className="text-3xl text-primary-500 bg-primary-100 p-3 rounded-full">
          <Icon />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
