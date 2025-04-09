import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Startpage from "./pages/Startpage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import WeatherUpdate from "./pages/WeatherUpdate";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/weather" element={<WeatherUpdate />} />
      </Routes>
    </Router>
  );
};

export default App;
