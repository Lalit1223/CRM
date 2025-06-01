// src/pages/WorkflowBuilder/WorkflowManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Play,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Eye,
  Download,
  Upload,
} from "lucide-react";
import { workflowAPI } from "../../utils/api";
import { WORKFLOW_CATEGORIES, WORKFLOW_STATUS } from "../../types/workflow";
import "./WorkflowManagement.css";

const WorkflowManagement = ({ onCreateNew, onEditWorkflow }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });

  useEffect(() => {
    loadWorkflows();
  }, [searchTerm, categoryFilter, statusFilter, pagination.currentPage]);

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const response = await workflowAPI.getAdminWorkflows(
        statusFilter || "true",
        pagination.currentPage,
        pagination.limit,
        categoryFilter,
        searchTerm,
        "createdAt",
        "desc"
      );

      if (response.success) {
        setWorkflows(response.data.workflows);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalRecords: response.data.pagination.totalRecords,
        }));
      }
    } catch (error) {
      console.error("Error loading workflows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workflowId) => {
    if (!window.confirm("Are you sure you want to delete this workflow?")) {
      return;
    }

    try {
      const response = await workflowAPI.deleteWorkflow(workflowId);
      if (response.success) {
        loadWorkflows();
      } else {
        alert("Failed to delete workflow");
      }
    } catch (error) {
      console.error("Error deleting workflow:", error);
      alert("Failed to delete workflow");
    }
  };

  const handleClone = async (workflow) => {
    try {
      const response = await workflowAPI.cloneWorkflow(workflow._id, {
        name: `${workflow.name} (Copy)`,
        description: workflow.description,
      });

      if (response.success) {
        loadWorkflows();
      } else {
        alert("Failed to clone workflow");
      }
    } catch (error) {
      console.error("Error cloning workflow:", error);
      alert("Failed to clone workflow");
    }
  };

  const handleTest = async (workflowId) => {
    try {
      const response = await workflowAPI.testWorkflow(workflowId, {});
      if (response.success) {
        alert("Workflow test completed successfully!");
        //console.log("Test results:", response.data);
      } else {
        alert("Workflow test failed");
      }
    } catch (error) {
      console.error("Error testing workflow:", error);
      alert("Failed to test workflow");
    }
  };

  const handleToggleStatus = async (workflowId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await workflowAPI.updateWorkflow(workflowId, {
        isActive: newStatus,
      });

      if (response.success) {
        loadWorkflows();
      } else {
        alert("Failed to update workflow status");
      }
    } catch (error) {
      console.error("Error updating workflow status:", error);
      alert("Failed to update workflow status");
    }
  };

  const handleExport = (workflow) => {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${workflow.name.replace(/\s+/g, "_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="status-badge active">Active</span>
    ) : (
      <span className="status-badge inactive">Inactive</span>
    );
  };

  const getCategoryBadge = (category) => {
    const colors = {
      general: "bg-gray-100 text-gray-800",
      kyc: "bg-blue-100 text-blue-800",
      sales: "bg-green-100 text-green-800",
      finance: "bg-purple-100 text-purple-800",
      "customer-service": "bg-orange-100 text-orange-800",
      onboarding: "bg-indigo-100 text-indigo-800",
    };

    return (
      <span className={`category-badge ${colors[category] || colors.general}`}>
        {category.replace("-", " ")}
      </span>
    );
  };

  return (
    <div className="workflow-management">
      <div className="workflow-management-header">
        <div className="header-left">
          <h1>Workflow Management</h1>
          <p>Create, manage and test your automated workflows</p>
        </div>
        <button className="btn btn-primary" onClick={onCreateNew}>
          <Plus className="w-4 h-4" />
          Create New Workflow
        </button>
      </div>

      <div className="workflow-filters">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {Object.entries(WORKFLOW_CATEGORIES).map(([key, value]) => (
            <option key={key} value={value}>
              {value.replace("-", " ").toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading workflows...</p>
        </div>
      ) : (
        <>
          <div className="workflows-grid">
            {workflows.map((workflow) => (
              <div key={workflow._id} className="workflow-card">
                <div className="workflow-card-header">
                  <div className="workflow-info">
                    <h3>{workflow.name}</h3>
                    <p>{workflow.description}</p>
                  </div>
                  <div className="workflow-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleTest(workflow._id)}
                      title="Test Workflow"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => onEditWorkflow(workflow._id)}
                      title="Edit Workflow"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <div className="dropdown">
                      <button className="action-btn">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="dropdown-menu">
                        <button onClick={() => handleClone(workflow)}>
                          <Copy className="w-4 h-4" />
                          Clone
                        </button>
                        <button onClick={() => handleExport(workflow)}>
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(workflow._id, workflow.isActive)
                          }
                          className={
                            workflow.isActive
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        >
                          {workflow.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(workflow._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="workflow-card-body">
                  <div className="workflow-stats">
                    <span>Nodes: {workflow.nodes?.length || 0}</span>
                    <span>Version: {workflow.version || 1}</span>
                  </div>

                  <div className="workflow-badges">
                    {getStatusBadge(workflow.isActive)}
                    {getCategoryBadge(workflow.category)}
                  </div>

                  {workflow.surePassSummary?.hasIntegration && (
                    <div className="surepass-indicator">
                      <span className="surepass-badge">
                        SurePass Integration (
                        {workflow.surePassSummary.endpointCount} endpoints)
                      </span>
                    </div>
                  )}
                </div>

                <div className="workflow-card-footer">
                  <div className="workflow-meta">
                    <small>Created: {formatDate(workflow.createdAt)}</small>
                    <small>Updated: {formatDate(workflow.updatedAt)}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {workflows.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-state-content">
                <h3>No workflows found</h3>
                <p>Get started by creating your first automated workflow</p>
                <button className="btn btn-primary" onClick={onCreateNew}>
                  <Plus className="w-4 h-4" />
                  Create Your First Workflow
                </button>
              </div>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                className="pagination-btn"
              >
                Previous
              </button>

              <div className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}(
                {pagination.totalRecords} total workflows)
              </div>

              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkflowManagement;
