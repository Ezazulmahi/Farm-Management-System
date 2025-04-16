import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Startpage from "./pages/Startpage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import FarmProfile from "./pages/FarmProfile";
import Cart from "./pages/Cart";
import Notification from "./pages/Notification";
import Payment from "./pages/Payment";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LocationTracking from "./pages/LocationTracking";
import dashboard from "./pages/AdminDashboard"



const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/dashboard" element={<dashboard/>} />

        <Route path="/" element={<Startpage />} />
        <Route path="/track" element={<LocationTracking />} />
        <Route path="/profile" element={<FarmProfile />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/payment" element={<Payment />} />


      </Routes>
    </Router>
  );
};

export default App;
