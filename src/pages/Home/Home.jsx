// src/pages/Home/Home.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import FeatureCards from "../../components/FeatureCards/FeatureCards";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome back, {user?.first_name || "User"}!</h1>
        <p>Select a feature to get started with your WhatsApp CRM:</p>
      </div>

      <FeatureCards />
    </div>
  );
};

export default Home;
