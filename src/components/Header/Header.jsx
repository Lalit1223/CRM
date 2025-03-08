// src/components/Header/Header.jsx
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Star,
  Download,
  User,
  HelpCircle,
  Settings,
} from "lucide-react";
import "./Header.css";
import logo from "../../assets/react.svg"; // Adjust the path based on your actual file location

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <div className="navigation-buttons">
          <button className="icon-button">
            <ChevronLeft size={20} />
          </button>
          <button className="icon-button">
            <ChevronRight size={20} />
          </button>
          <button className="icon-button">
            <RefreshCw size={20} />
          </button>
        </div>
        <div className="address-bar">
          <img src={logo} alt="LG Media" className="logo" />
          <h1 className="app-title">Pixe</h1>
        </div>
      </div>
      <div className="header-right">
        <button className="icon-button">
          <Star size={20} />
        </button>
        <button className="icon-button">
          <Download size={20} />
        </button>
        <button className="icon-button">
          <User size={20} />
        </button>
        <button className="help-button">
          <HelpCircle size={16} />
          <span>Get help</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
