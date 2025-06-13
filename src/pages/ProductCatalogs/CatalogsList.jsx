// src/pages/ProductCatalogs/CatalogsList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Star,
  Clock,
  Check,
  X,
  AlertCircle,
  Package,
  Trash2,
  Send,
} from "lucide-react";
import { productAPI } from "../../utils/api";

const CatalogsList = () => {
  const navigate = useNavigate();

  // State for catalogs data
  const [catalogs, setCatalogs] = useState([]);
  const [filteredCatalogs, setFilteredCatalogs] = useState([]);

  // State for UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalCatalogs, setTotalCatalogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Home & Garden" },
    { value: "books", label: "Books" },
    { value: "sports", label: "Sports" },
    { value: "beauty", label: "Beauty & Health" },
    { value: "toys", label: "Toys & Games" },
    { value: "automotive", label: "Automotive" },
  ];

  // Fetch catalogs on component mount and when filters change
  useEffect(() => {
    fetchCatalogs();
  }, [page, limit, statusFilter, categoryFilter]);

  // Apply search filter
  useEffect(() => {
    if (catalogs && catalogs.length > 0) {
      applyFilters();
    }
  }, [catalogs, searchTerm]);

  const fetchCatalogs = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filters if not "all"
      if (statusFilter !== "all") queryParams.append("status", statusFilter);
      if (categoryFilter !== "all")
        queryParams.append("category", categoryFilter);
      if (searchTerm) queryParams.append("search", searchTerm);

      const response = await productAPI.getProductCatalogs(`?${queryParams}`);

      if (response.success) {
        // Handle the actual API response structure
        const catalogsData = response.data || [];
        setCatalogs(catalogsData);
        setTotalCatalogs(
          response.pagination?.totalRecords || catalogsData.length
        );
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError(response.message || "Failed to fetch catalogs");
      }
    } catch (error) {
      console.error("Error fetching catalogs:", error);
      setError("An error occurred while fetching catalogs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    if (!catalogs || !Array.isArray(catalogs)) {
      setFilteredCatalogs([]);
      return;
    }

    let filtered = [...catalogs];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (catalog) =>
          catalog.name.toLowerCase().includes(term) ||
          (catalog.description &&
            catalog.description.toLowerCase().includes(term))
      );
    }

    setFilteredCatalogs(filtered);
  };

  // Handle actions
  const handleAddCatalog = () => {
    navigate("/product-catalogs/create");
  };

  const handleRefresh = () => {
    fetchCatalogs();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleView = (catalogId) => {
    navigate(`/product-catalogs/${catalogId}`);
  };

  const handleEdit = (catalogId) => {
    navigate(`/product-catalogs/${catalogId}/edit`);
  };

  const handleSetDefault = async (catalogId) => {
    try {
      setError("");
      setSuccess("");

      const response = await productAPI.setDefaultCatalog(catalogId);

      if (response.success) {
        setSuccess("Default catalog updated successfully");
        fetchCatalogs(); // Refresh the list
      } else {
        setError(response.message || "Failed to set as default catalog");
      }
    } catch (error) {
      console.error("Error setting default catalog:", error);
      setError("Failed to set as default catalog");
    }
  };

  const handleDelete = async (catalogId) => {
    if (!window.confirm("Are you sure you want to delete this catalog?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await productAPI.deleteProductCatalog(catalogId);

      if (response.success) {
        setSuccess("Catalog deleted successfully");
        fetchCatalogs(); // Refresh the list
      } else {
        setError(response.message || "Failed to delete catalog");
      }
    } catch (error) {
      console.error("Error deleting catalog:", error);
      setError("Failed to delete catalog");
    }
  };

  const handleSubmitForReview = async (catalogId) => {
    try {
      setError("");
      setSuccess("");

      const response = await productAPI.submitCatalogForReview(
        catalogId,
        "Catalog ready for SuperAdmin review"
      );

      if (response.success) {
        setSuccess("Catalog submitted for review successfully");
        fetchCatalogs(); // Refresh the list
      } else {
        setError(response.message || "Failed to submit catalog for review");
      }
    } catch (error) {
      console.error("Error submitting catalog:", error);
      setError("Failed to submit catalog for review");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Capitalize category
  const capitalizeCategory = (category) => {
    if (!category) return "Not specified";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusMap = {
      draft: {
        icon: <Clock size={14} />,
        class: "draft",
        text: "Draft",
      },
      pending: {
        icon: <Clock size={14} />,
        class: "pending",
        text: "Pending Review",
      },
      active: {
        icon: <Check size={14} />,
        class: "active",
        text: "Active",
      },
      rejected: {
        icon: <X size={14} />,
        class: "rejected",
        text: "Rejected",
      },
      inactive: {
        icon: <X size={14} />,
        class: "inactive",
        text: "Inactive",
      },
    };

    const statusInfo = statusMap[status] || {
      icon: null,
      class: "unknown",
      text: status || "Unknown",
    };

    return (
      <span className={`catalogs-list-status-badge ${statusInfo.class}`}>
        {statusInfo.icon && (
          <span className="catalogs-list-status-icon">{statusInfo.icon}</span>
        )}
        <span>{statusInfo.text}</span>
      </span>
    );
  };

  return (
    <div className="catalogs-list-container">
      {/* Header */}
      <div className="catalogs-list-header">
        <div className="catalogs-list-header-left">
          <h1>Product Catalogs</h1>
          <p>Manage your product catalogs and their settings</p>
        </div>
        <div className="catalogs-list-header-right">
          <button
            className="catalogs-list-add-button"
            onClick={handleAddCatalog}
          >
            <Plus size={16} />
            <span>Create Catalog</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="catalogs-list-error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            className="catalogs-list-close-alert"
            onClick={() => setError("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div className="catalogs-list-success-message">
          <Check size={16} />
          <span>{success}</span>
          <button
            className="catalogs-list-close-alert"
            onClick={() => setSuccess("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="catalogs-list-filters">
        <div className="catalogs-list-search-filter">
          <div className="catalogs-list-search-container">
            <input
              type="text"
              placeholder="Search catalogs..."
              value={searchTerm}
              onChange={handleSearch}
              className="catalogs-list-search-input"
            />
          </div>
        </div>

        <div className="catalogs-list-filters-right">
          <div className="catalogs-list-filter-group">
            <Filter size={16} className="catalogs-list-filter-icon" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="catalogs-list-filter-select"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="catalogs-list-filter-group">
            <Filter size={16} className="catalogs-list-filter-icon" />
            <select
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
              className="catalogs-list-filter-select"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="catalogs-list-refresh-button"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Catalogs Grid */}
      <div className="catalogs-list-content">
        {isLoading ? (
          <div className="catalogs-list-loading">
            <div className="catalogs-list-spinner"></div>
            <p>Loading catalogs...</p>
          </div>
        ) : filteredCatalogs.length === 0 ? (
          <div className="catalogs-list-no-catalogs">
            <Package size={48} />
            <h3>No catalogs found</h3>
            <p>
              {searchTerm
                ? "Try a different search term or clear filters."
                : "Create your first catalog to get started."}
            </p>
            <button
              className="catalogs-list-add-button"
              onClick={handleAddCatalog}
            >
              <Plus size={16} />
              <span>Create Catalog</span>
            </button>
          </div>
        ) : (
          <div className="catalogs-list-grid">
            {filteredCatalogs.map((catalog) => (
              <div key={catalog._id} className="catalogs-list-card">
                <div className="catalogs-list-card-header">
                  <div className="catalogs-list-card-title">
                    <h3>{catalog.name}</h3>
                    {catalog.isDefault && (
                      <Star className="catalogs-list-default-star" size={16} />
                    )}
                  </div>
                  {renderStatusBadge(catalog.status)}
                </div>

                <div className="catalogs-list-card-description">
                  <p>{catalog.description}</p>
                </div>

                <div className="catalogs-list-card-stats">
                  <div className="catalogs-list-stat-row">
                    <span className="catalogs-list-stat-label">Category:</span>
                    <span className="catalogs-list-stat-value">
                      {capitalizeCategory(catalog.category)}
                    </span>
                  </div>
                  <div className="catalogs-list-stat-row">
                    <span className="catalogs-list-stat-label">Products:</span>
                    <span className="catalogs-list-stat-value">
                      {catalog.productCount || 0}
                    </span>
                  </div>
                  <div className="catalogs-list-stat-row">
                    <span className="catalogs-list-stat-label">Created:</span>
                    <span className="catalogs-list-stat-value">
                      {formatDate(catalog.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="catalogs-list-card-actions">
                  <button
                    className="catalogs-list-action-btn catalogs-list-btn-view"
                    onClick={() => handleView(catalog._id)}
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>

                  <button
                    className="catalogs-list-action-btn catalogs-list-btn-edit"
                    onClick={() => handleEdit(catalog._id)}
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>

                  {!catalog.isDefault && catalog.status === "active" && (
                    <button
                      className="catalogs-list-action-btn catalogs-list-btn-default"
                      onClick={() => handleSetDefault(catalog._id)}
                    >
                      <Star size={14} />
                      <span>Default</span>
                    </button>
                  )}

                  {catalog.status === "draft" && (
                    <>
                      <button
                        className="catalogs-list-action-btn catalogs-list-btn-submit"
                        onClick={() => handleSubmitForReview(catalog._id)}
                      >
                        <Send size={14} />
                        <span>Submit</span>
                      </button>

                      <button
                        className="catalogs-list-action-btn catalogs-list-btn-delete"
                        onClick={() => handleDelete(catalog._id)}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredCatalogs.length > 0 && (
        <div className="catalogs-list-pagination-container">
          <div className="catalogs-list-pagination-info">
            <span>
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalCatalogs)} of {totalCatalogs}{" "}
              catalogs
            </span>

            <div className="catalogs-list-pagination-limit">
              <span>Show:</span>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="catalogs-list-limit-select"
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>
          </div>

          <div className="catalogs-list-pagination-controls">
            <button
              className="catalogs-list-pagination-button"
              disabled={page === 1}
              onClick={() => handlePageChange(1)}
            >
              First
            </button>
            <button
              className="catalogs-list-pagination-button"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>

            <div className="catalogs-list-pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                    className={`catalogs-list-pagination-page ${
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
              className="catalogs-list-pagination-button"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
            <button
              className="catalogs-list-pagination-button"
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

export default CatalogsList;
