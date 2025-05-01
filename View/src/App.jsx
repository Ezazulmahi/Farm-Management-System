import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Startpage from "./pages/Startpage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import FarmProfile from "./pages/FarmProfile";
import Cart from "./pages/Cart";
import Notification from "./pages/Notification";
import Payment from "./pages/Payment";
import LocationTracking from "./pages/LocationTracking";
import Dashboard from "./pages/AdminDashboard";
import InventoryPage from "./pages/InventoryPage";
import TaskPage from "./pages/TaskPage";
import ExpensePage from "./pages/ExpensePage";
import Post from "./pages/Adminpost";
import Weather from "./pages/WeatherPage";
import Bracseed from "./pages/Farms/BracSeed";
import AdminFarmPanel from "./pages/AdminFarmPanel";
import ProductPage from "./pages/ProductPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/farm-profile" element={<FarmProfile />} />
        <Route path="/brac-seed" element={<Bracseed />} />
        <Route path="/panel" element={<AdminFarmPanel />} />
        <Route path="/post" element={<Post />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/admin/expenses" element={<ExpensePage />} />
        <Route path="/tracking" element={<LocationTracking />} />
        <Route path="/admin" element={<AdminFarmPanel />} />
        <Route path="/admin/farm" element={<AdminFarmPanel />} />
        <Route path="/products" element={<ProductPage />} /> 

        {/* Optional: 404 Not Found fallback */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
