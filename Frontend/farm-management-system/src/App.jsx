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
import Dashboard from "./pages/AdminDashboard";
import InventoryPage from "./pages/InventoryPage";
import TaskPage from "./pages/TaskPage"; // ✅ Added
import ExpensePage from "./pages/ExpensePage"; // ✅ Added

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path="/profile" element={<FarmProfile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/admin/tasks" element={<TaskPage />} />
        <Route path="/admin/expenses" element={<ExpensePage />} />
      </Routes>
    </Router>
  );
};

export default App;
