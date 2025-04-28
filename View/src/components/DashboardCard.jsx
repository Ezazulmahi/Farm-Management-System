import React from "react";
import { IconContext } from "react-icons";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import "../styles/DashboardCard.css"; // Assuming you have a CSS file for styling

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  alertLevel 
}) => {
  const getAlertClass = () => {
    switch(alertLevel) {
      case 'high': return 'high-alert';
      case 'medium': return 'medium-alert';
      default: return '';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '';
  };

  const getTrendClass = () => {
    if (trend === 'up') return 'trend-up';
    if (trend === 'down') return 'trend-down';
    return '';
  };

  return (
    <div className={`dashboard-card ${getAlertClass()}`}>
      <div className="card-header">
        <h3>{title}</h3>
        <IconContext.Provider value={{ className: "card-icon" }}>
          <Icon />
        </IconContext.Provider>
      </div>
      <div className="card-value">{value}</div>
      {(trend && trendValue) && (
        <div className={`card-trend ${getTrendClass()}`}>
          {getTrendIcon()} {trendValue}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;