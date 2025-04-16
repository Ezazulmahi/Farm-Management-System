import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Remove duplicate import
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
import TaskPage from "./pages/TaskPage"; // Assuming you have this component
import ExpensePage from "./pages/ExpensePage"; // Assuming you have this component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Startpage />} />
        <Route path="/track" element={<LocationTracking />} />
        <Route path="/profile" element={<FarmProfile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/admin/tasks" element={<TaskPage />} />
        <Route path="/admin/expenses" element={<ExpensePage />} />
      </Routes>
    </Router>
  );
};

export default App;
