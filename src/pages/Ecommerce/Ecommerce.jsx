import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Clock,
  Check,
  X,
  AlertCircle,
  Trash2,
  FileText,
  Star,
  ShoppingCart,
  Send,
} from "lucide-react";

const Ecommerce = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    subCategory: "",
    search: "",
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const navigate = useNavigate();

  // API base URL
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://pixe-backend-83iz.onrender.com";

  // Get admin token from localStorage or sessionStorage
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  // Check if we actually have a token
  if (!token) {
    console.warn(
      "No authentication token found in storage. API requests will likely fail with 401 Unauthorized."
    );
  }

  // Fetch products and catalogs on component mount
  useEffect(() => {
    fetchCatalogs();
    fetchProducts();
  }, [filters]);

  // Fetch products based on current filters
  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Build query string from filters
      const queryParams = new URLSearchParams({
        status: filters.status,
        category: filters.category,
        subCategory: filters.subCategory,
        search: filters.search,
        page: filters.page,
        limit: filters.limit,
        sort: filters.sort,
        order: filters.order,
      });

      const response = await fetch(
        `${baseUrl}/api/products/admin?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.productRequests || []);
        setPagination({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.total || 0,
        });
      } else {
        setError(data.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("An error occurred while fetching products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available catalogs
  const fetchCatalogs = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/product-catalogs/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setCatalogs(data.data || []);
      } else {
        console.error("Failed to fetch catalogs:", data.message);
      }
    } catch (err) {
      console.error("Error fetching catalogs:", err);
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

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      page: 1,
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchProducts();
    fetchCatalogs();
  };

  // UPDATED: Handle product creation - Navigate to standalone route
  const handleAddProduct = () => {
    navigate("/ecommerce/products/create");
  };

  // UPDATED: Handle product edit - Navigate to standalone route
  const handleEditProduct = (product) => {
    navigate(`/ecommerce/products/edit/${product._id}`);
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${baseUrl}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Product deleted successfully");
        fetchProducts(); // Refresh the list
      } else {
        setError(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    }
  };

  // Handle product view details
  const handleViewProduct = (productId) => {
    navigate(`/ecommerce/products/${productId}`);
  };

  // Handle product submission for review
  const handleSubmitForReview = async (productId) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${baseUrl}/api/products/${productId}/apply`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "submitted",
            adminNotes: "Product is ready for review.",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Product submitted for review successfully");
        fetchProducts(); // Refresh the list
      } else {
        setError(data.message || "Failed to submit product for review");
      }
    } catch (err) {
      console.error("Error submitting product for review:", err);
      setError("Failed to submit product for review");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusMap = {
      draft: {
        icon: <Clock size={14} />,
        class: "draft",
        text: "Draft",
      },
      submitted: {
        icon: <Send size={14} />,
        class: "submitted",
        text: "Pending Review",
      },
      approved: {
        icon: <Check size={14} />,
        class: "approved",
        text: "Approved",
      },
      rejected: {
        icon: <X size={14} />,
        class: "rejected",
        text: "Rejected",
      },
      published: {
        icon: <ShoppingCart size={14} />,
        class: "published",
        text: "Published",
      },
    };

    const statusInfo = statusMap[status] || {
      icon: null,
      class: "",
      text: status,
    };

    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.icon && (
          <span className="status-icon">{statusInfo.icon}</span>
        )}
        <span>{statusInfo.text}</span>
      </span>
    );
  };

  // Get currency symbol
  const getCurrencySymbol = (currency) => {
    const currencyMap = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      JPY: "¥",
    };

    return currencyMap[currency] || currency;
  };

  return (
    <div className="ecommerce-container">
      {/* Header */}
      <div className="ecommerce-header">
        <div className="header-left">
          <h1>WhatsApp Product Management</h1>
          <p>Manage your products and catalogs for WhatsApp Commerce</p>
        </div>
        <div className="header-right">
          <button className="add-product-button" onClick={handleAddProduct}>
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="ecommerce-tabs">
        <button
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <Package size={18} />
          <span>Products</span>
        </button>
        <button
          className={`tab-button ${activeTab === "catalogs" ? "active" : ""}`}
          onClick={() => setActiveTab("catalogs")}
        >
          <FileText size={18} />
          <span>Catalogs</span>
        </button>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="close-alert" onClick={() => setError("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <Check size={16} />
          <span>{success}</span>
          <button className="close-alert" onClick={() => setSuccess("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Content area */}
      <div className="ecommerce-content">
        {activeTab === "products" && (
          <>
            {/* Filters */}
            <div className="product-filters">
              <div className="search-filter">
                <div className="search-input-container">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="filters">
                <div className="filter-group">
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="filter-group">
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Garden</option>
                    <option value="beauty">Beauty & Health</option>
                    <option value="sports">Sports</option>
                    <option value="toys">Toys & Games</option>
                    <option value="automotive">Automotive</option>
                  </select>
                </div>

                <button className="refresh-button" onClick={handleRefresh}>
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Products List */}
            <div className="products-list-content">
              {isLoading ? (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="no-products">
                  <Package size={48} />
                  <h3>No products found</h3>
                  <p>
                    {filters.search || filters.status || filters.category
                      ? "Try a different search term or clear filters."
                      : "Create your first product to get started."}
                  </p>
                  <button
                    className="add-product-button"
                    onClick={handleAddProduct}
                  >
                    <Plus size={16} />
                    <span>Add Product</span>
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product._id} className="product-card">
                      <div className="product-image">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={
                              product.images.find((img) => img.isPrimary)
                                ?.url || product.images[0].url
                            }
                            alt={product.name}
                          />
                        ) : (
                          <div className="no-image">
                            <Package size={32} />
                            <span>No Image</span>
                          </div>
                        )}
                        {renderStatusBadge(product.status)}
                      </div>

                      <div className="product-details">
                        <h3 className="product-name">{product.name}</h3>

                        <div className="product-info">
                          <div className="product-price">
                            {product.salePrice ? (
                              <>
                                <span className="sale-price">
                                  {getCurrencySymbol(product.currency)}
                                  {product.salePrice.toFixed(2)}
                                </span>
                                <span className="original-price">
                                  {getCurrencySymbol(product.currency)}
                                  {product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="regular-price">
                                {getCurrencySymbol(product.currency)}
                                {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="product-meta">
                            <span className="product-brand">
                              {product.brand}
                            </span>
                            <span className="product-category">
                              {product.category}
                            </span>
                          </div>

                          <div className="product-inventory">
                            <span className="inventory-label">Qty:</span>
                            <span className="inventory-value">
                              {product.inventory?.quantity || 0}
                            </span>
                            <span className="inventory-label">SKU:</span>
                            <span className="inventory-value">
                              {product.inventory?.sku || "N/A"}
                            </span>
                          </div>

                          <div className="product-catalog">
                            <span className="catalog-label">Catalog:</span>
                            <span className="catalog-value">
                              {product.catalogId?.name || "N/A"}
                            </span>
                          </div>

                          <div className="product-date">
                            <span className="date-label">Created:</span>
                            <span className="date-value">
                              {formatDate(product.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="product-actions">
                        <button
                          className="action-btn btn-view"
                          onClick={() => handleViewProduct(product._id)}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        <button
                          className="action-btn btn-edit"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>

                        {product.status === "draft" && (
                          <>
                            <button
                              className="action-btn btn-submit"
                              onClick={() => handleSubmitForReview(product._id)}
                            >
                              <Send size={14} />
                              <span>Submit</span>
                            </button>

                            <button
                              className="action-btn btn-delete"
                              onClick={() => handleDeleteProduct(product._id)}
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
            {!isLoading && products.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  <span>
                    Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                    {Math.min(
                      filters.page * filters.limit,
                      pagination.totalItems
                    )}{" "}
                    of {pagination.totalItems} products
                  </span>

                  <div className="pagination-limit">
                    <span>Show:</span>
                    <select
                      value={filters.limit}
                      onChange={handleLimitChange}
                      className="limit-select"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
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
          </>
        )}

        {activeTab === "catalogs" && (
          <div className="catalogs-redirect">
            <div className="redirect-content">
              <FileText size={48} />
              <h3>Catalog Management</h3>
              <p>
                Manage your product catalogs in the dedicated Catalogs section
              </p>
              <button
                className="redirect-button"
                onClick={() => navigate("/product-catalogs")}
              >
                Go to Catalogs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ecommerce;
