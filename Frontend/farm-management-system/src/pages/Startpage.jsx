import { useState, useEffect } from "react";
import "../styles/StartPage.css"; // Assuming your CSS file is in the styles folder

const StartPage = () => {
  const [message, setMessage] = useState("Loading...");

  // Fetch message from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/welcome")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="start-page" style={{ backgroundImage: "url('/images/bg.jpg')" }}>
      <div className="overlay">
        <div className="nav-bar">
          <h2 className="system-name">Farm Management System</h2>
          <div className="nav-buttons">
            <button onClick={() => (window.location.href = "/login")}>Login</button>
            <button onClick={() => (window.location.href = "/signup")}>Sign Up</button>
            <button onClick={() => (window.location.href = "/about")}>About Us</button>
          </div>
        </div>
        <h1 className="app-name">Welcome to Farm Management System</h1>
        <p className="welcome-message">{message}</p>
      </div>
    </div>
  );
};

export default StartPage;
