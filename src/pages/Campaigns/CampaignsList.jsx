// src/pages/Campaigns/CampaignsList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Check,
  X,
  Clock,
  BarChart2,
  AlertCircle,
} from "lucide-react";
import { campaignAPI } from "../../utils/api";

const CampaignsList = () => {
  const navigate = useNavigate();

  // State for campaigns data
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  // State for UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [objectiveFilter, setObjectiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCampaigns, setTotalCampaigns] = useState(0);

  // Fetch campaigns on component mount and when filters change
  useEffect(() => {
    fetchCampaigns();
  }, [page, limit, statusFilter]);

  // Apply search and objective filters
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      applyFilters();
    }
  }, [campaigns, searchTerm, objectiveFilter]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Determine status for API call
      const status = statusFilter !== "all" ? statusFilter : "";

      const response = await campaignAPI.getCampaignRequests(
        status,
        page,
        limit
      );

      if (response.success) {
        // Use the actual API response structure
        const campaignRequests = response.data.campaignRequests || [];
        setCampaigns(campaignRequests);
        setTotalCampaigns(
          response.data.pagination?.total || campaignRequests.length
        );
      } else {
        setError(response.message || "Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("An error occurred while fetching campaigns. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (!campaigns || !Array.isArray(campaigns)) {
      setFilteredCampaigns([]);
      return;
    }

    let filtered = [...campaigns];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(term) ||
          (campaign.description &&
            campaign.description.toLowerCase().includes(term))
      );
    }

    // Apply objective filter
    if (objectiveFilter !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.objective === objectiveFilter
      );
    }

    setFilteredCampaigns(filtered);
  };

  const handleAddCampaign = () => {
    navigate("/campaigns/create");
  };

  const handleRefresh = () => {
    fetchCampaigns();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleObjectiveFilterChange = (e) => {
    setObjectiveFilter(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page when changing limit
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalCampaigns / limit)) {
      setPage(newPage);
    }
  };

  const handleView = (campaignId) => {
    navigate(`/campaigns/${campaignId}`);
  };

  const formatBudget = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const capitalizeObjective = (objective) => {
    if (!objective) return "Not specified";
    return objective.charAt(0).toUpperCase() + objective.slice(1);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusMap = {
      submitted: {
        icon: <Clock size={14} />,
        class: "submitted",
        text: "Submitted",
      },
      approved: {
        icon: <Check size={14} />,
        class: "approved",
        text: "Approved",
      },
      rejected: { icon: <X size={14} />, class: "rejected", text: "Rejected" },
      running: {
        icon: <BarChart2 size={14} />,
        class: "running",
        text: "Running",
      },
      paused: { icon: <Clock size={14} />, class: "paused", text: "Paused" },
      completed: {
        icon: <Check size={14} />,
        class: "completed",
        text: "Completed",
      },
    };

    const statusInfo = statusMap[status] || {
      icon: null,
      class: "unknown",
      text: status || "Unknown",
    };

    return (
      <span className={`campaigns-list-status-badge ${statusInfo.class}`}>
        {statusInfo.icon && (
          <span className="campaigns-list-status-icon">{statusInfo.icon}</span>
        )}
        <span>{statusInfo.text}</span>
      </span>
    );
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCampaigns / limit);

  return (
    <div className="campaigns-list-container">
      <div className="campaigns-list-header">
        <div className="campaigns-list-header-left">
          <h1>Campaigns</h1>
          <p>Manage your WhatsApp marketing campaigns</p>
        </div>
        <div className="campaigns-list-header-right">
          <button
            className="campaigns-list-add-button"
            onClick={handleAddCampaign}
          >
            <Plus size={16} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="campaigns-list-error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="campaigns-list-filters">
        <div className="campaigns-list-search-filter">
          <div className="campaigns-list-search-container">
            <Search size={18} className="campaigns-list-search-icon" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={handleSearch}
              className="campaigns-list-search-input"
            />
          </div>
        </div>

        <div className="campaigns-list-filters-right">
          <div className="campaigns-list-filter-group">
            <Filter size={16} className="campaigns-list-filter-icon" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="campaigns-list-filter-select"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="campaigns-list-filter-group">
            <Filter size={16} className="campaigns-list-filter-icon" />
            <select
              value={objectiveFilter}
              onChange={handleObjectiveFilterChange}
              className="campaigns-list-filter-select"
            >
              <option value="all">All Objectives</option>
              <option value="awareness">Awareness</option>
              <option value="traffic">Traffic</option>
              <option value="engagement">Engagement</option>
              <option value="leads">Leads</option>
              <option value="conversions">Conversions</option>
              <option value="sales">Sales</option>
            </select>
          </div>

          <button
            className="campaigns-list-refresh-button"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="campaigns-list-table-container">
        {isLoading ? (
          <div className="campaigns-list-loading">
            <div className="campaigns-list-spinner"></div>
            <p>Loading campaigns...</p>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="campaigns-list-no-campaigns">
            <p>
              No campaigns found.{" "}
              {searchTerm
                ? "Try a different search term or clear filters."
                : "Create your first campaign to get started."}
            </p>
            <button
              className="campaigns-list-add-button"
              onClick={handleAddCampaign}
            >
              <Plus size={16} />
              <span>Create Campaign</span>
            </button>
          </div>
        ) : (
          <table className="campaigns-list-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Objective</th>
                <th>Platform</th>
                <th>Budget</th>
                <th>Schedule</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td className="campaigns-list-campaign-name">
                    <div>
                      <div className="campaigns-list-campaign-title">
                        {campaign.name}
                      </div>
                      {campaign.description && (
                        <div className="campaigns-list-campaign-description">
                          {campaign.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`campaigns-list-objective-badge ${campaign.objective}`}
                    >
                      {capitalizeObjective(campaign.objective)}
                    </span>
                  </td>
                  <td>
                    <span className="campaigns-list-platform">
                      {campaign.platform
                        ? campaign.platform.charAt(0).toUpperCase() +
                          campaign.platform.slice(1)
                        : "Not specified"}
                    </span>
                  </td>
                  <td>
                    <div className="campaigns-list-budget-info">
                      <div>
                        Daily:{" "}
                        {formatBudget(campaign.budgetSchedule?.dailyBudget)}
                      </div>
                      <div>
                        Total:{" "}
                        {formatBudget(campaign.budgetSchedule?.totalBudget)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="campaigns-list-schedule-info">
                      <div>
                        From: {formatDate(campaign.budgetSchedule?.startDate)}
                      </div>
                      <div>
                        To: {formatDate(campaign.budgetSchedule?.endDate)}
                      </div>
                    </div>
                  </td>
                  <td>{renderStatusBadge(campaign.status)}</td>
                  <td>
                    <button
                      className="campaigns-list-view-button"
                      onClick={() => handleView(campaign._id)}
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && filteredCampaigns.length > 0 && (
        <div className="campaigns-list-pagination-container">
          <div className="campaigns-list-pagination-info">
            <span>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalCampaigns)} of {totalCampaigns}{" "}
              campaigns
            </span>

            <div className="campaigns-list-pagination-limit">
              <span>Show:</span>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="campaigns-list-limit-select"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="campaigns-list-pagination-controls">
            <button
              className="campaigns-list-pagination-button"
              disabled={page === 1}
              onClick={() => handlePageChange(1)}
            >
              First
            </button>
            <button
              className="campaigns-list-pagination-button"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>

            <div className="campaigns-list-pagination-pages">
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
                    className={`campaigns-list-pagination-page ${
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
              className="campaigns-list-pagination-button"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
            <button
              className="campaigns-list-pagination-button"
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

export default CampaignsList;
