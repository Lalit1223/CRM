// src/pages/Chats/Chats.jsx
import React, { useState } from "react";
import { Search, Plus, Filter, MoreVertical, ChevronDown } from "lucide-react";
import "./Chats.css";

const Chats = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  // Sample chat data
  const chats = [
    {
      id: 1,
      name: "Sujit Gandhi",
      phone: "+91973861983",
      lastMessage: "'I'll look into this and get back to you soon.",
      timestamp: "10:45 AM",
      unread: 2,
      status: "active",
    },
    {
      id: 2,
      name: "Mark Zuk",
      phone: "+916969696966",
      lastMessage: "i want to hire you as a frontend dev",
      timestamp: "Yesterday",
      unread: 0,
      status: "active",
    },
    {
      id: 3,
      name: "Anushka Sharma",
      phone: "+919876543210",
      lastMessage: "Kohli aaaj Century Maarega",
      timestamp: "Yesterday",
      unread: 1,
      status: "active",
    },
    {
      id: 4,
      name: "Gaurav Patil",
      phone: "+919420624896",
      lastMessage: "OneconnectX.. Let's Get Connected!!",
      timestamp: "Monday",
      unread: 0,
      status: "archived",
    },
    {
      id: 5,
      name: "Swati Jain",
      phone: "+917058411248",
      lastMessage: "OneconnectX.. We are Hiring!!",
      timestamp: "12/02/2025",
      unread: 0,
      status: "active",
    },
  ];

  const tabs = [
    { id: "all", label: "All Chats", count: chats.length },
    {
      id: "active",
      label: "Active",
      count: chats.filter((c) => c.status === "active").length,
    },
    {
      id: "archived",
      label: "Archived",
      count: chats.filter((c) => c.status === "archived").length,
    },
    {
      id: "unread",
      label: "Unread",
      count: chats.filter((c) => c.unread > 0).length,
    },
  ];

  const filteredChats =
    selectedTab === "all"
      ? chats
      : selectedTab === "unread"
      ? chats.filter((c) => c.unread > 0)
      : chats.filter((c) => c.status === selectedTab);

  return (
    <div className="chats-page">
      <div className="chats-header">
        <h2>Chats</h2>
        <div className="header-actions">
          <button className="new-chat-btn">
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      <div className="chats-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search for conversations" />
        </div>
        <button className="filter-button">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      <div className="chats-container">
        <div className="chat-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`chat-tab ${selectedTab === tab.id ? "active" : ""}`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label} <span className="count">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="chat-list">
          {filteredChats.map((chat) => (
            <div key={chat.id} className="chat-item">
              <div className="chat-avatar">
                {chat.name.charAt(0)}
                {chat.status === "active" && (
                  <span className="status-indicator"></span>
                )}
              </div>
              <div className="chat-details">
                <div className="chat-header">
                  <span className="chat-name">{chat.name}</span>
                  <span className="chat-time">{chat.timestamp}</span>
                </div>
                <div className="chat-message">
                  <p className="message-preview">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="unread-badge">{chat.unread}</span>
                  )}
                </div>
              </div>
              <div className="chat-actions">
                <button className="more-btn">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="assign-chats">
        <button className="assign-btn">
          <span>Assign Chats</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

export default Chats;
