import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Copy,
  Play,
  AlertCircle,
  Check,
  X,
  FileText,
  MessageSquare,
  Users,
  Terminal,
  Database,
  CheckCircle,
} from "lucide-react";
import { workflowAPI } from "../../utils/api";
import "./WhatsAppMiniApps.css";

const WhatsAppMiniApps = () => {
  const [workflows, setWorkflows] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    status: "true", // Active workflows by default
    category: "",
    search: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const navigate = useNavigate();

  // Load workflows on component mount and when filters change
  useEffect(() => {
    fetchWorkflows();
    fetchTemplates();
  }, [filters]);

  // Fetch workflows based on current filters
  const fetchWorkflows = async () => {
    try {
      setLoading(true);

      const response = await workflowAPI.getAdminWorkflows(
        filters.status,
        filters.page,
        filters.limit,
        filters.category,
        filters.search,
        filters.sortBy,
        filters.sortOrder
      );

      if (response.success) {
        setWorkflows(response.data.workflows || []);
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalItems: response.data.pagination?.totalRecords || 0,
          limit: filters.limit,
        });
      } else {
        setError(response.message || "Failed to load workflows");
      }
    } catch (err) {
      console.error("Error loading workflows:", err);
      setError("An error occurred while loading workflows. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch workflow templates
  const fetchTemplates = async () => {
    try {
      const response = await workflowAPI.getWorkflowTemplates();

      if (response.success) {
        setTemplates(response.data.templates || []);
      } else {
        console.error("Failed to load templates:", response.message);
      }
    } catch (err) {
      console.error("Error loading templates:", err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Handle search input
  const handleSearch = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchWorkflows();
    fetchTemplates();
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  // Create a new workflow from scratch
  const handleCreateWorkflow = () => {
    navigate("/whatsapp-mini-apps/flow-editor/new");
  };

  // Create a workflow from template
  const handleCreateFromTemplate = (templateId) => {
    // TODO: Implement template-based workflow creation
    setShowTemplateModal(false);
    navigate(`/whatsapp-mini-apps/flow-editor/new?template=${templateId}`);
  };

  // Edit an existing workflow
  const handleEditWorkflow = (workflowId) => {
    navigate(`/whatsapp-mini-apps/flow-editor/${workflowId}`);
  };

  // Clone a workflow
  const handleCloneWorkflow = async (workflowId, workflowName) => {
    try {
      setError("");
      setSuccess("");

      const response = await workflowAPI.cloneWorkflow(workflowId, {
        name: `${workflowName} (Copy)`,
      });

      if (response.success) {
        setSuccess("Workflow cloned successfully");
        fetchWorkflows(); // Refresh the list
      } else {
        setError(response.message || "Failed to clone workflow");
      }
    } catch (err) {
      console.error("Error cloning workflow:", err);
      setError("Failed to clone workflow. Please try again.");
    }
  };

  // Test a workflow
  const handleTestWorkflow = async (workflowId) => {
    try {
      setError("");
      setSuccess("");

      const response = await workflowAPI.testWorkflow(workflowId, {});

      if (response.success) {
        setSuccess("Workflow test completed successfully");
      } else {
        setError(response.message || "Failed to test workflow");
      }
    } catch (err) {
      console.error("Error testing workflow:", err);
      setError("Failed to test workflow. Please try again.");
    }
  };

  // Delete a workflow
  const handleDeleteWorkflow = async (workflowId) => {
    if (!window.confirm("Are you sure you want to delete this workflow?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await workflowAPI.deleteWorkflow(workflowId);

      if (response.success) {
        setSuccess("Workflow deleted successfully");
        fetchWorkflows(); // Refresh the list
      } else {
        setError(response.message || "Failed to delete workflow");
      }
    } catch (err) {
      console.error("Error deleting workflow:", err);
      setError("Failed to delete workflow. Please try again.");
    }
  };

  // View workflow analytics
  const handleViewAnalytics = (workflowId) => {
    navigate(`/whatsapp-mini-apps/analytics/${workflowId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get category badge style
  const getCategoryBadgeStyle = (category) => {
    const categoryMap = {
      general: { bg: "#e0f2fe", color: "#0369a1" },
      kyc: { bg: "#dcfce7", color: "#15803d" },
      onboarding: { bg: "#dbeafe", color: "#1e40af" },
      sales: { bg: "#fef3c7", color: "#b45309" },
      support: { bg: "#f3e8ff", color: "#7e22ce" },
      finance: { bg: "#fce7f3", color: "#be185d" },
      "property-sales": { bg: "#ffedd5", color: "#c2410c" },
      "customer-onboarding": { bg: "#dbeafe", color: "#1e40af" },
    };

    return categoryMap[category] || { bg: "#f1f5f9", color: "#64748b" };
  };

  // Get node type icon
  const getNodeTypeIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare size={14} />;
      case "input":
        return <Terminal size={14} />;
      case "interactive":
        return <Users size={14} />;
      case "condition":
        return <FileText size={14} />;
      case "api":
        return <Database size={14} />;
      case "end":
        return <CheckCircle size={14} />;
      default:
        return <MessageSquare size={14} />;
    }
  };

  // Render template modal
  const renderTemplateModal = () => {
    if (!showTemplateModal) return null;

    return (
      <div className="modal-overlay">
        <div className="template-modal">
          <div className="modal-header">
            <h3>Create from Template</h3>
            <button
              className="close-modal"
              onClick={() => setShowTemplateModal(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="modal-content">
            {templates.length === 0 ? (
              <div className="no-templates">
                <p>No templates available</p>
              </div>
            ) : (
              <div className="templates-grid">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="template-card"
                    onClick={() => handleCreateFromTemplate(template.id)}
                  >
                    <div className="template-icon">
                      {template.category === "kyc" && <Users size={24} />}
                      {template.category === "sales" && (
                        <MessageSquare size={24} />
                      )}
                      {template.category === "finance" && (
                        <Database size={24} />
                      )}
                    </div>
                    <div className="template-info">
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                      <div className="template-meta">
                        <span className="category">{template.category}</span>
                        <span className="nodes-count">
                          {template.estimatedNodes} nodes
                        </span>
                      </div>
                      {template.hasSurePassIntegration && (
                        <div className="integration-badge">
                          <span>SurePass Integration</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              className="cancel-btn"
              onClick={() => setShowTemplateModal(false)}
            >
              Cancel
            </button>
            <button className="create-empty-btn" onClick={handleCreateWorkflow}>
              Create Empty Workflow
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="whatsapp-miniapps-container">
      {/* Header */}
      <div className="miniapps-header">
        <div className="header-left">
          <h1>WhatsApp Mini Apps</h1>
          <p>Create and manage interactive workflows for WhatsApp</p>
        </div>
        <div className="header-right">
          <button
            className="add-workflow-button"
            onClick={() =>
              navigate("/whatsapp-mini-apps/visual-flow-editor/new")
            }
          >
            <Plus size={16} />
            <span>Create with Visual Editor</span>
          </button>
          <button
            className="action-btn btn-edit"
            onClick={() =>
              navigate(`/whatsapp-mini-apps/visual-flow-editor/${workflow._id}`)
            }
          >
            <Edit size={14} />
            <span>Visual Editor</span>
          </button>
        </div>
      </div>

      {/* Alert messages */}
      {error && (
        <div className="alert error">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="close-alert" onClick={() => setError("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div className="alert success">
          <Check size={16} />
          <span>{success}</span>
          <button className="close-alert" onClick={() => setSuccess("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="workflows-filters">
        <div className="search-filter">
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={filters.search}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
              <option value="">All Status</option>
            </select>
          </div>

          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="kyc">KYC</option>
              <option value="onboarding">Onboarding</option>
              <option value="sales">Sales</option>
              <option value="support">Support</option>
              <option value="finance">Finance</option>
              <option value="property-sales">Property Sales</option>
            </select>
          </div>

          <button className="refresh-button" onClick={handleRefresh}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Workflows list */}
      <div className="workflows-list-content">
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading workflows...</p>
          </div>
        ) : workflows.length === 0 ? (
          <div className="no-workflows">
            <div className="empty-state">
              <FileText size={48} />
              <h3>No workflows found</h3>
              <p>
                {filters.search || filters.category || filters.status !== "true"
                  ? "Try a different search term or clear filters."
                  : "Create your first workflow to get started."}
              </p>
              <button
                className="create-workflow-button"
                onClick={() => setShowTemplateModal(true)}
              >
                <Plus size={16} />
                <span>Create Workflow</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="workflows-grid">
            {workflows.map((workflow) => (
              <div key={workflow._id} className="workflow-card">
                <div className="workflow-header">
                  <h3>{workflow.name}</h3>
                  <div className="workflow-status">
                    <span
                      className={`status-dot ${
                        workflow.isActive ? "active" : "inactive"
                      }`}
                    ></span>
                    <span>{workflow.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>

                <p className="workflow-description">
                  {workflow.description || "No description provided"}
                </p>

                <div className="workflow-meta">
                  <div className="workflow-category">
                    <span
                      className="category-badge"
                      style={{
                        backgroundColor: getCategoryBadgeStyle(
                          workflow.category
                        ).bg,
                        color: getCategoryBadgeStyle(workflow.category).color,
                      }}
                    >
                      {workflow.category || "general"}
                    </span>
                  </div>

                  <div className="workflow-tags">
                    {workflow.tags &&
                      workflow.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    {workflow.tags && workflow.tags.length > 3 && (
                      <span className="tag-more">
                        +{workflow.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="workflow-stats">
                  <div className="stat">
                    <span className="stat-label">Nodes:</span>
                    <span className="stat-value">
                      {workflow.nodes?.length || 0}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Created:</span>
                    <span className="stat-value">
                      {formatDate(workflow.createdAt)}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Updated:</span>
                    <span className="stat-value">
                      {formatDate(workflow.updatedAt)}
                    </span>
                  </div>
                </div>

                {workflow.surePassSummary &&
                  workflow.surePassSummary.hasIntegration && (
                    <div className="integration-info">
                      <span className="integration-label">
                        SurePass Integration
                      </span>
                      <span className="endpoints-count">
                        {workflow.surePassSummary.endpointCount} endpoints
                      </span>
                    </div>
                  )}

                <div className="workflow-actions">
                  <button
                    className="action-btn btn-edit"
                    onClick={() => handleEditWorkflow(workflow._id)}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>

                  <button
                    className="action-btn btn-clone"
                    onClick={() =>
                      handleCloneWorkflow(workflow._id, workflow.name)
                    }
                  >
                    <Copy size={14} />
                    <span>Clone</span>
                  </button>

                  <button
                    className="action-btn btn-test"
                    onClick={() => handleTestWorkflow(workflow._id)}
                  >
                    <Play size={14} />
                    <span>Test</span>
                  </button>

                  <button
                    className="action-btn btn-delete"
                    onClick={() => handleDeleteWorkflow(workflow._id)}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && workflows.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Showing {(filters.page - 1) * filters.limit + 1} to{" "}
              {Math.min(filters.page * filters.limit, pagination.totalItems)} of{" "}
              {pagination.totalItems} workflows
            </span>

            <div className="pagination-limit">
              <span>Show:</span>
              <select
                value={filters.limit}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    limit: parseInt(e.target.value, 10),
                    page: 1,
                  }))
                }
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
              disabled={filters.page === 1}
              onClick={() => handlePageChange(1)}
            >
              First
            </button>
            <button
              className="pagination-button"
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              Previous
            </button>

            <div className="pagination-pages">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (filters.page <= 3) {
                    pageNum = i + 1;
                  } else if (filters.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = filters.page - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      className={`pagination-page ${
                        pageNum === filters.page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              className="pagination-button"
              disabled={filters.page === pagination.totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              Next
            </button>
            <button
              className="pagination-button"
              disabled={filters.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.totalPages)}
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {renderTemplateModal()}
    </div>
  );
};

export default WhatsAppMiniApps;
