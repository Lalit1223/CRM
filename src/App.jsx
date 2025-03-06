// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Chats from "./pages/Chats/Chats";
import BroadcastList from "./pages/BroadcastList/BroadcastList";
import Analytics from "./pages/Analytics/Analytics";
import Customers from "./pages/Customers/Customers";
import "./App.css";

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleSidebarExpansion = (expanded) => {
    setSidebarExpanded(expanded);
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <div className="main-container">
          <Sidebar onExpand={handleSidebarExpansion} />
          <div
            className={`main-content ${
              sidebarExpanded ? "sidebar-expanded" : ""
            }`}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/broadcast-list" element={<BroadcastList />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/customers" element={<Customers />} />
              {/* Add other routes as needed */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
