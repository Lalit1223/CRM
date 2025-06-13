// src/pages/Agents/AgentsList.jsx - Fixed version with status visibility
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Edit,
  Trash,
  UserX,
  UserCheck,
} from "lucide-react";
import { agentAPI } from "../../utils/api";
import "./AgentsList.css";

const AgentsList = () => {
  const navigate = useNavigate();

  // State for agents data
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);

  // State for UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalAgents, setTotalAgents] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch agents on component mount and when filters change
  useEffect(() => {
    fetchAgents();
  }, [page, limit, statusFilter]);

  // Apply search and role filters
  useEffect(() => {
    if (agents && agents.length > 0) {
      applyFilters();
    }
  }, [agents, searchTerm, roleFilter]);

  const fetchAgents = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fix: Properly handle status parameter for API call
      let statusParam = "";
      if (statusFilter === "active") {
        statusParam = "true";
      } else if (statusFilter === "inactive") {
        statusParam = "false";
      }
      // For "all", we leave statusParam empty

      const response = await agentAPI.getAllAgents(statusParam, page, limit);

      if (response.success) {
        // Ensure we have proper data structure
        const agentsData = response.data || [];
        console.log("Fetched agents:", agentsData); // Debug log

        setAgents(agentsData);
        setTotalAgents(response.pagination?.totalRecords || agentsData.length);
      } else {
        setError(response.message || "Failed to fetch agents");
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError("An error occurred while fetching agents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (!agents || !Array.isArray(agents)) {
      setFilteredAgents([]);
      return;
    }

    let filtered = [...agents];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (agent) =>
          (agent.first_name && agent.first_name.toLowerCase().includes(term)) ||
          (agent.last_name && agent.last_name.toLowerCase().includes(term)) ||
          (agent.email_id && agent.email_id.toLowerCase().includes(term)) ||
          (agent.mobile && agent.mobile.toString().includes(term))
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((agent) => agent.role === roleFilter);
    }

    console.log("Filtered agents:", filtered); // Debug log
    setFilteredAgents(filtered);
  };

  const handleAddAgent = () => {
    navigate("/agents/register");
  };

  const handleRefresh = () => {
    fetchAgents();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page when changing limit
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalAgents / limit)) {
      setPage(newPage);
    }
  };

  const toggleDropdown = (agentId) => {
    if (activeDropdown === agentId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(agentId);
    }
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [activeDropdown]);

  const handleEdit = (agentId) => {
    closeDropdown();
    navigate(`/agents/edit/${agentId}`);
  };

  const handleToggleStatus = async (agentId, currentStatus) => {
    closeDropdown();

    // Confirm status change
    const confirmMessage = currentStatus
      ? "Are you sure you want to deactivate this agent?"
      : "Are you sure you want to activate this agent?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Call API to toggle status
      const response = await agentAPI.updateAgentStatus(
        agentId,
        !currentStatus
      );

      if (response.success) {
        // Update local state
        setAgents(
          agents.map((agent) =>
            agent._id === agentId ? { ...agent, status: !currentStatus } : agent
          )
        );
      } else {
        setError(response.message || "Failed to update agent status");
      }
    } catch (error) {
      console.error("Error updating agent status:", error);

      // If API doesn't exist yet, simulate the update for testing
      setAgents(
        agents.map((agent) =>
          agent._id === agentId ? { ...agent, status: !currentStatus } : agent
        )
      );
    }
  };

  const handleDelete = async (agentId) => {
    closeDropdown();

    // Confirm deletion
    if (
      !window.confirm(
        "Are you sure you want to delete this agent? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // Call API to delete agent
      const response = await agentAPI.deleteAgent(agentId);

      if (response.success) {
        // Update local state
        setAgents(agents.filter((agent) => agent._id !== agentId));
        setTotalAgents((prev) => prev - 1);
      } else {
        setError(response.message || "Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);

      // If API doesn't exist yet, simulate the deletion for testing
      setAgents(agents.filter((agent) => agent._id !== agentId));
      setTotalAgents((prev) => prev - 1);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalAgents / limit);

  // Helper function to format role display
  const formatRole = (role) => {
    return role
      ? role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "N/A";
  };

  // Helper function to get status display
  const getStatusDisplay = (status) => {
    console.log("Agent status:", status, typeof status); // Debug log
    return status === true || status === "true" || status === 1;
  };

  return (
    <div className="agents-list-container">
      <div className="agents-list-header">
        <div className="header-left">
          <h1>Agents</h1>
          <p>Manage your team members and their permissions</p>
        </div>
        <div className="header-right">
          <button className="add-agent-button" onClick={handleAddAgent}>
            <Plus size={16} />
            <span>Add Agent</span>
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="agents-list-filters">
        <div className="search-filter">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="customer_support">Customer Support</option>
              <option value="sales">Sales</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="refresh-button" onClick={handleRefresh}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="agents-table-container">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading agents...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="no-agents">
            <p>
              No agents found.{" "}
              {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                ? "Try adjusting your filters or search term."
                : "Add your first agent to get started."}
            </p>
            <button className="add-agent-button" onClick={handleAddAgent}>
              <Plus size={16} />
              <span>Add Agent</span>
            </button>
          </div>
        ) : (
          <table className="agents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Lead Capacity</th>
                <th>Current Leads</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => {
                const isActive = getStatusDisplay(agent.status);
                return (
                  <tr key={agent._id}>
                    <td className="agent-name">
                      {agent.first_name} {agent.last_name}
                    </td>
                    <td>{agent.email_id}</td>
                    <td>{agent.mobile}</td>
                    <td>
                      <span className={`role-badge ${agent.role}`}>
                        {formatRole(agent.role)}
                      </span>
                    </td>
                    <td>{agent.leadCapacity || "N/A"}</td>
                    <td>{agent.currentLeadCount || 0}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          minWidth: "60px",
                          textAlign: "center",
                          backgroundColor: isActive ? "#e8f5e9" : "#ffebee",
                          color: isActive ? "#2e7d32" : "#c62828",
                          border: isActive
                            ? "1px solid #c3e6cb"
                            : "1px solid #ffcdd2",
                        }}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-cell">
                        <button
                          className="action-menu-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(agent._id);
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeDropdown === agent._id && (
                          <div className="action-dropdown">
                            <button
                              className="dropdown-item"
                              onClick={() => handleEdit(agent._id)}
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>

                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleToggleStatus(agent._id, isActive)
                              }
                            >
                              {isActive ? (
                                <>
                                  <UserX size={14} />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <UserCheck size={14} />
                                  <span>Activate</span>
                                </>
                              )}
                            </button>

                            <button
                              className="dropdown-item delete"
                              onClick={() => handleDelete(agent._id)}
                            >
                              <Trash size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && filteredAgents.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalAgents)} of {totalAgents} agents
            </span>

            <div className="pagination-limit">
              <span>Show:</span>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="limit-select"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-button"
              disabled={page === 1}
              onClick={() => handlePageChange(1)}
            >
              First
            </button>
            <button
              className="pagination-button"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>

            <div className="pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate page numbers to show
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    className={`pagination-page ${
                      pageNum === page ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-button"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
            <button
              className="pagination-button"
              disabled={page === totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsList;
