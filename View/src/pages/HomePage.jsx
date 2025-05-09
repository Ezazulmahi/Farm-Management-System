import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/HomePage.css";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch farm data from the backend
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/farms");
        setFarms(res.data);
        setFilteredFarms(res.data.slice(0, 4)); // Show first 4 initially
      } catch (err) {
        setError("Failed to fetch farms.");
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  // Search filter
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredFarms(farms.slice(0, 4)); // Reset to first 4 if search is empty
    } else {
      const results = farms.filter((farm) =>
        farm.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFarms(results);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Navigate to farm page based on farm name
  const goToFarm = (farmName) => {
    const farmRoute = farmName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${farmRoute}`);
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <div className="nav-bar">
        <h2>Farmora</h2>
        <div className="nav-icons">
          <img src="/images/cart.png" alt="Cart" onClick={() => navigate("/cart")} className="nav-icon" />
          <img src="/images/notification.png" alt="Notification" onClick={() => navigate("/notifications")} className="nav-icon" />
          <img src="/images/profile.png" alt="Profile" onClick={() => navigate("/farm-profile")} className="nav-icon" />
          <img src="/images/logout.png" alt="Logout" onClick={handleLogout} className="nav-icon" />
        </div>
      </div>

      {/* Search */}
      <div className="search-bar-section">
        <input
          type="text"
          placeholder="Search farms or agros..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {/* Farms List */}
      <div className="farm-list">
        <h2>Available Farms & Agros</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredFarms.length === 0 ? (
          <p>No farms found</p>
        ) : (
          <div className="farm-items">
            {filteredFarms.map((farm) => (
              <div key={farm._id} className="farm-card" onClick={() => goToFarm(farm.name)}>
                {/* Displaying the image from the /public/images folder */}
                <img src={farm.image} alt={farm.name} className="farm-image" />
                <p>{farm.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
