import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Startpage from "./pages/Startpage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
<<<<<<< HEAD
import WeatherUpdate from "./pages/WeatherUpdate";
=======
import FarmProfile from "./pages/FarmProfile";
import Cart from "./pages/Cart";
import Notification from "./pages/Notification";
import Payment from "./pages/Payment";



>>>>>>> 6e0056b3696101fdd2e17d3a85dad2a5e4f57218

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path="/profile" element={<FarmProfile />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
<<<<<<< HEAD
        <Route path="/weather" element={<WeatherUpdate />} />
=======
        <Route path="/cart" element={<Cart />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/payment" element={<Payment />} />


>>>>>>> 6e0056b3696101fdd2e17d3a85dad2a5e4f57218
      </Routes>
    </Router>
  );
};

export default App;
