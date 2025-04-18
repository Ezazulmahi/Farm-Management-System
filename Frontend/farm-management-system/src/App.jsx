import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Remove duplicate import
import React from 'react';
import TaskPage from './pages/TaskPage'; // adjust the path if needed
import ExpensePage from './pages/ExpensePage'; // adjust path if necessary
import Startpage from "./pages/Startpage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import WeatherUpdate from "./pages/WeatherUpdate";

import FarmProfile from "./pages/FarmProfile";
import Cart from "./pages/Cart";
import Notification from "./pages/Notification";
import Payment from "./pages/Payment";
import LocationTracking from "./pages/LocationTracking";
import Dashboard from "./pages/AdminDashboard";
import InventoryPage from "./pages/InventoryPage";
import Post from "./pages/Adminpost";
import Weather from "./pages/WeatherPage";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/post" element={<Post/>} />
        <Route path="/weather" element={<Weather/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Startpage />} />
        <Route path="/track" element={<LocationTracking />} />
        <Route path="/profile" element={<FarmProfile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/weather" element={<WeatherUpdate />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/payment" element={<Payment />} />


      </Routes>
    </Router>
  );
};

export default App;
