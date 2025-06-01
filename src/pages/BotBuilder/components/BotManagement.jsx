// src/pages/BotBuilder/components/BotManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BotManagement.css";

const BotManagement = ({
  savedWorkflows = [],
  onLoadWorkflow,
  onNewBot,
  onDeleteWorkflow,
  onDuplicateWorkflow,
  currentBotId,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // 'date', 'name', 'status'
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc', 'desc'
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);

  // Filter and sort workflows whenever dependencies change
  useEffect(() => {
    const filtered = savedWorkflows
      .filter(
        (workflow) =>
          (workflow.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (workflow.trigger || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "date") {
          return sortDirection === "asc"
            ? a.timestamp - b.timestamp
            : b.timestamp - a.timestamp;
        } else if (sortBy === "name") {
          return sortDirection === "asc"
            ? (a.name || "").localeCompare(b.name || "")
            : (b.name || "").localeCompare(a.name || "");
        } else if (sortBy === "status") {
          if (sortDirection === "asc") {
            return a.enabled === b.enabled ? 0 : a.enabled ? 1 : -1;
          } else {
            return a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1;
          }
        }
        return 0;
      });

    setFilteredWorkflows(filtered);
  }, [savedWorkflows, searchTerm, sortBy, sortDirection]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleNewBot = () => {
    //console.log("Creating new bot...");
    if (onNewBot) {
      onNewBot();
    }
    // Explicitly navigate to the create page - this should fix the issue
    navigate("/bot-builder/create");
  };

  const handleEditBot = (id) => {
    //console.log("Editing bot with ID:", id);
    if (onLoadWorkflow) {
      onLoadWorkflow(id);
    }
    navigate(`/bot-builder/edit/${id}`);
  };

  return (
    <div className="bot-management">
      <div className="bot-management-header">
        <h2>Bot Management</h2>
        <button className="create-bot-button" onClick={handleNewBot}>
          Create New Bot
        </button>
      </div>

      <div className="bot-search">
        <input
          type="text"
          placeholder="Search bots by name or trigger type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {savedWorkflows.length === 0 ? (
        <div className="no-bots-message">
          <p>
            No bots created yet. Click "Create New Bot" to get started building
            your first WhatsApp bot.
          </p>
          <div className="empty-state-illustration">
            <div className="bot-icon">🤖</div>
            <p>Your automated assistants will appear here</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bot-list-header">
            <div
              className={`header-cell name ${
                sortBy === "name" ? "sorted" : ""
              }`}
              onClick={() => handleSort("name")}
            >
              Bot Name{" "}
              {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="header-cell trigger">Trigger Type</div>
            <div
              className={`header-cell date ${
                sortBy === "date" ? "sorted" : ""
              }`}
              onClick={() => handleSort("date")}
            >
              Last Modified{" "}
              {sortBy === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div
              className={`header-cell status ${
                sortBy === "status" ? "sorted" : ""
              }`}
              onClick={() => handleSort("status")}
            >
              Status{" "}
              {sortBy === "status" && (sortDirection === "asc" ? "↑" : "↓")}
            </div>
            <div className="header-cell actions">Actions</div>
          </div>

          <div className="bot-list">
            {filteredWorkflows.length === 0 ? (
              <div className="no-results">
                <p>No bots matching your search criteria</p>
              </div>
            ) : (
              filteredWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`bot-item ${
                    workflow.id === currentBotId ? "active" : ""
                  }`}
                >
                  <div className="bot-cell name">
                    {workflow.name || "Unnamed Bot"}
                  </div>
                  <div className="bot-cell trigger">
                    {workflow.trigger || "New Message Received"}
                  </div>
                  <div className="bot-cell date">
                    {formatDate(workflow.timestamp)}
                  </div>
                  <div className="bot-cell status">
                    <span
                      className={`status-badge ${
                        workflow.enabled ? "enabled" : "disabled"
                      }`}
                    >
                      {workflow.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="bot-cell actions">
                    <button
                      className="action-button edit"
                      onClick={() => handleEditBot(workflow.id)}
                      title="Edit Bot"
                    >
                      Edit
                    </button>
                    <button
                      className="action-button duplicate"
                      onClick={() => {
                        if (onDuplicateWorkflow) {
                          onDuplicateWorkflow(workflow.id);
                        }
                      }}
                      title="Duplicate Bot"
                    >
                      Copy
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete the bot "${workflow.name}"?`
                          )
                        ) {
                          if (onDeleteWorkflow) {
                            onDeleteWorkflow(workflow.id);
                          }
                        }
                      }}
                      title="Delete Bot"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BotManagement;
