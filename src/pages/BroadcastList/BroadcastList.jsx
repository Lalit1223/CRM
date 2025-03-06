// src/pages/BroadcastList/BroadcastList.jsx
import React, { useState } from "react";
import { Search, Plus, SortDesc, MoreVertical, Zap } from "lucide-react";
import "./BroadcastList.css";

const BroadcastList = () => {
  const [sortOrder, setSortOrder] = useState("Date created - descending");

  const broadcastLists = [
    {
      id: 1,
      name: "Junk Interested",
      memberCount: 1,
      lastActivity: "Yesterday",
      isActive: true,
    },
    {
      id: 2,
      name: "Abhi dnp",
      memberCount: 85,
      lastActivity: "2 days ago",
      isActive: false,
    },
    {
      id: 3,
      name: "Gauri Test",
      memberCount: 1,
      lastActivity: "3 days ago",
      isActive: false,
    },
    {
      id: 4,
      name: "4 march 2025 gd 11:30",
      memberCount: 30,
      lastActivity: "1 week ago",
      isActive: false,
    },
    {
      id: 5,
      name: "Test by Sahil",
      memberCount: 0,
      lastActivity: "2 weeks ago",
      isActive: false,
    },
    {
      id: 6,
      name: "Vishu test 2",
      memberCount: 3,
      lastActivity: "3 weeks ago",
      isActive: false,
    },
    {
      id: 7,
      name: "11:00am gd 3rd march 25",
      memberCount: 15,
      lastActivity: "4 weeks ago",
      isActive: false,
    },
  ];

  return (
    <div className="broadcast-list-page">
      <div className="broadcast-header">
        <h2>Broadcast lists</h2>
        <div className="broadcast-actions">
          <button className="manage-access-btn">Manage Access</button>
          <div className="search-container">
            <input type="text" placeholder="Search" />
            <Search size={18} className="search-icon" />
          </div>
        </div>
      </div>

      <div className="broadcast-controls">
        <div className="sort-control">
          <SortDesc size={16} />
          <span>Sort by {sortOrder}</span>
        </div>
        <button className="new-list-btn">
          <Plus size={16} />
        </button>
      </div>
      {/* 
      <div className="broadcast-lists">
        {broadcastLists.map((list) => (
          <div
            key={list.id}
            className={`broadcast-item ${list.isActive ? "active" : ""}`}
          >
            <div className="list-icon">
              <div className="avatar">
                {list.isActive && <Zap size={14} className="active-icon" />}
              </div>
            </div>
            <div className="list-details">
              <div className="list-name">{list.name}</div>
              <div className="list-count">
                {list.memberCount === 0
                  ? "No members"
                  : list.memberCount === 1
                  ? "1 Member"
                  : `${list.memberCount} Members`}
              </div>
            </div>
            <div className="list-actions">
              <button className="more-btn">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default BroadcastList;
