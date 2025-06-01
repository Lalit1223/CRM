// src/pages/Agents/AgentsList.jsx - Fixed version
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
      // Determine status for API call
      const status =
        statusFilter === "active"
          ? "true"
          : statusFilter === "inactive"
          ? "false"
          : "";

      const response = await agentAPI.getAllAgents(status, page, limit);

      if (response.success) {
        // Update based on the actual API response structure
        setAgents(response.data);
        setTotalAgents(
          response.pagination?.totalRecords || response.data.length
        );
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
          agent.first_name.toLowerCase().includes(term) ||
          agent.last_name.toLowerCase().includes(term) ||
          agent.email_id.toLowerCase().includes(term) ||
          (agent.mobile && agent.mobile.toString().includes(term))
      );
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((agent) => agent.role === roleFilter);
    }

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
      // Call API to toggle status (this would be specific to your API)
      /*
      const response = await agentAPI.updateAgentStatus(agentId, !currentStatus);
      
      if (response.success) {
        // Update local state
        setAgents(agents.map(agent => 
          agent._id === agentId ? {...agent, status: !currentStatus} : agent
        ));
      } else {
        setError(response.message || "Failed to update agent status");
      }
      */

      // Since we don't have the actual API, let's simulate the update
      setAgents(
        agents.map((agent) =>
          agent._id === agentId ? { ...agent, status: !currentStatus } : agent
        )
      );
    } catch (error) {
      console.error("Error updating agent status:", error);
      setError(
        "An error occurred while updating agent status. Please try again."
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
      // Call API to delete agent (this would be specific to your API)
      /*
      const response = await agentAPI.deleteAgent(agentId);
      
      if (response.success) {
        // Update local state
        setAgents(agents.filter(agent => agent._id !== agentId));
      } else {
        setError(response.message || "Failed to delete agent");
      }
      */

      // Since we don't have the actual API, let's simulate the deletion
      setAgents(agents.filter((agent) => agent._id !== agentId));
    } catch (error) {
      console.error("Error deleting agent:", error);
      setError("An error occurred while deleting agent. Please try again.");
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalAgents / limit);

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
            <Filter size={16} className="filter-icon" />
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
            <Filter size={16} className="filter-icon" />
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
              {searchTerm
                ? "Try a different search term or clear filters."
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent) => (
                <tr key={agent._id}>
                  <td className="agent-name">
                    {agent.first_name} {agent.last_name}
                  </td>
                  <td>{agent.email_id}</td>
                  <td>{agent.mobile}</td>
                  <td>
                    <span className={`role-badge ${agent.role}`}>
                      {agent.role.replace("_", " ")}
                    </span>
                  </td>
                  <td>{agent.leadCapacity || "N/A"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        agent.status ? "active" : "inactive"
                      }`}
                    >
                      {agent.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-cell">
                      <button
                        className="action-menu-button"
                        onClick={() => toggleDropdown(agent._id)}
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
                              handleToggleStatus(agent._id, agent.status)
                            }
                          >
                            {agent.status ? (
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
              ))}
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
