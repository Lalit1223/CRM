// src/pages/Home/Home.jsx
import React from "react";
import "./Home.css";
import FeatureCards from "../../components/FeatureCards/FeatureCards";

const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h2>Good morning, Lalit Gandhi 👋</h2>
        <div className="wa-number">
          WA Number
          <span className="phone-number">+918380852111</span>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <FeatureCards />

      <div className="training-card">
        <div className="training-info">
          <div className="training-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#25D366" />
              <path d="M2 17L12 22L22 17" fill="#25D366" />
              <path d="M2 12L12 17L22 12" fill="#25D366" />
            </svg>
          </div>
          <div className="training-text">
            <h3>Become a Master in WhatsApp Marketing</h3>
            <p>Join our group training session</p>
            <div className="training-details">
              <div className="training-time">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 6V12L16 14"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                4 hours - Live session
              </div>
              <div className="training-frequency">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                  />
                  <path d="M3 10H21" stroke="#5a5a5a" strokeWidth="2" />
                  <path
                    d="M8 3V7"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 3V7"
                    stroke="#5a5a5a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Every week
              </div>
            </div>
            <button className="register-button">Register now</button>
          </div>
        </div>
        <div className="qr-code">
          <img src="/QR.png" alt="QR Code" />
          <p>Scan QR on your mobile to register</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
