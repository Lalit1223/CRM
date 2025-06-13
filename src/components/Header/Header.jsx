// src/components/Header/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, HelpCircle, Star, Download, Settings } from "lucide-react";
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="address-bar">
          <h1 className="app-title">WhatsApp CRM</h1>
        </div>
      </div>

      <div className="header-right">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
