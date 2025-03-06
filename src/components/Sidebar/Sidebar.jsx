// src/components/Sidebar/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Radio,
  FileText,
  Calendar,
  Users,
  BarChart2,
  PieChart,
  Users as Team,
  Box,
  MessageCircle,
  Clock,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/", name: "Home", icon: <Home size={20} /> },
    { path: "/chats", name: "Chats", icon: <MessageSquare size={20} /> },
    {
      path: "/broadcast-list",
      name: "Broadcast List",
      icon: <Radio size={20} />,
    },
    // { path: "/templates", name: "Templates", icon: <FileText size={20} /> },
    // {
    //   path: "/scheduled-broadcasts",
    //   name: "Scheduled Broadcasts",
    //   icon: <Calendar size={20} />,
    // },
    { path: "/customers", name: "Customers", icon: <Users size={20} /> },
    {
      path: "/analytics",
      name: "Analytics",
      icon: <BarChart2 size={20} />,
      badge: "BETA",
    },
    // {
    //   path: "/enterprise-analytics",
    //   name: "Enterprise Analytics",
    //   icon: <PieChart size={20} />,
    // },
    // { path: "/team", name: "Team", icon: <Team size={20} /> },
    // { path: "/bot-studio", name: "Bot Studio", icon: <Box size={20} /> },
    // { path: "/chat-gpt", name: "Chat GPT", icon: <MessageCircle size={20} /> },
    // {
    //   path: "/pending-requests",
    //   name: "Pending requests",
    //   icon: <Clock size={20} />,
    // },

    { path: "/logout", name: "Logout", icon: <LogOut size={20} /> },
  ];

  return (
    <div
      className={`sidebar ${expanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {menuItems.map((item) => (
        <Link
          to={item.path}
          key={item.path}
          className={`sidebar-item ${
            location.pathname === item.path ? "active" : ""
          }`}
        >
          <div className="icon-container">{item.icon}</div>
          <span className="menu-text">{item.name}</span>
          {item.badge && <span className="badge">{item.badge}</span>}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
