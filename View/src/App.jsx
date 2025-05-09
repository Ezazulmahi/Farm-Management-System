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
import Dashboard from "./pages/AdminDashboard";
import InventoryPage from "./pages/InventoryPage";
import TaskPage from "./pages/TaskPage";
import ExpensePage from "./pages/ExpensePage";
import Post from "./pages/Adminpost";
import Weather from "./pages/WeatherPage";
import Bracseed from "./pages/Farms/BracSeed";
import AdminFarmPanel from "./pages/AdminFarmPanel";

import LocationTracking from "./pages/LocationTracking";
import Sadeeq  from './pages/Farms/Sadeeq';
import Soformali from './pages/Farms/Soformali';
import Cattle from './pages/Farms/Cattle';

import ProductPage from "./pages/ProductPage";

>>>>>>> 0bf27bb70c91fd24e980891f8ad27a5dca5ac3b8
const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="cattle-ranch" element={<Cattle/>}/>
        <Route path="soformali" element={<Soformali/>}/>
        <Route path="sadeeq-agro" element={<Sadeeq/>}/>

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
        <Route path="/track" element={<LocationTracking />} />
        <Route path="/tracking" element={<LocationTracking />} />
        <Route path="/admin" element={<AdminFarmPanel />} />
        <Route path="/admin/farm" element={<AdminFarmPanel />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;