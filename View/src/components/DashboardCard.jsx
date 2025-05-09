import React from "react";
import PropTypes from "prop-types";
import "../styles/DashboardCard.css";

const DashboardCard = ({ title, value, icon: Icon, trend, trendValue, alertLevel }) => {
  const getAlertClass = () => {
    switch (alertLevel) {
      case "high":
        return "high-alert";
      case "medium":
        return "medium-alert";
      default:
        return "";
    }
  };

  const getTrendIcon = () => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "";
  };

  const getTrendClass = () => {
    if (trend === "up") return "trend-up";
    if (trend === "down") return "trend-down";
    return "";
  };

  return (
    <div className={`dashboard-card ${getAlertClass()}`}>
      <div className="card-header">
        <h3>{title}</h3>
        {Icon && <Icon className="card-icon" />}
      </div>
      <div className="card-value">{value}</div>
      {trend && trendValue && (
        <div className={`card-trend ${getTrendClass()}`}>
          {getTrendIcon()} {trendValue}
        </div>
      )}
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  trend: PropTypes.oneOf(["up", "down"]),
  trendValue: PropTypes.string,
  alertLevel: PropTypes.oneOf(["high", "medium", ""]),
};

DashboardCard.defaultProps = {
  icon: null,
  trend: null,
  trendValue: null,
  alertLevel: "",
};

export default DashboardCard;