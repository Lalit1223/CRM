// src/pages/ProductCatalogs/CatalogDetail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Settings,
  Globe,
  Palette,
  Search as SearchIcon,
  Edit,
  Star,
  Clock,
  Check,
  X,
  AlertCircle,
  DollarSign,
  Calendar,
  RotateCcw,
  Shield,
  Facebook,
  Instagram,
  MessageCircle,
  Eye,
  Trash2,
  Send,
} from "lucide-react";
import { productAPI } from "../../utils/api";

const CatalogDetail = () => {
  const navigate = useNavigate();
  const { catalogId } = useParams();

  // State
  const [catalog, setCatalog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Safe rendering helpers
  const safeText = (value, fallback = "Not configured") => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") {
      console.warn("Attempted to render object as text:", value);
      return fallback;
    }
    return String(value);
  };

  const renderConnectionStatus = (integration) => {
    if (!integration || typeof integration !== "object") {
      return <span className="catalog-detail-empty-value">Not configured</span>;
    }

    if (integration.hasOwnProperty("connected")) {
      return (
        <span
          className={`catalog-detail-connection-status ${
            integration.connected ? "connected" : "disconnected"
          }`}
        >
          {renderBooleanIcon(integration.connected)}
          <span>{integration.connected ? "Connected" : "Not connected"}</span>
        </span>
      );
    }

    return <span className="catalog-detail-configured-value">Configured</span>;
  };

  // Fetch catalog data
  useEffect(() => {
    fetchCatalog();
  }, [catalogId]);

  const fetchCatalog = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await productAPI.getProductCatalogById(
        catalogId,
        true,
        true
      );

      if (response.success) {
        setCatalog(response.data);
      } else {
        setError(response.message || "Failed to fetch catalog details");
      }
    } catch (error) {
      console.error("Error fetching catalog:", error);
      setError(
        "An error occurred while fetching catalog details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle actions
  const handleBack = () => {
    navigate("/product-catalogs");
  };

  const handleEdit = () => {
    navigate(`/product-catalogs/${catalogId}/edit`);
  };

  const handleSetDefault = async () => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await productAPI.setDefaultCatalog(catalogId);

      if (response.success) {
        setSuccess("Default catalog updated successfully");
        fetchCatalog(); // Refresh data
      } else {
        setError(response.message || "Failed to set as default catalog");
      }
    } catch (error) {
      console.error("Error setting default catalog:", error);
      setError("Failed to set as default catalog");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this catalog? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await productAPI.deleteProductCatalog(catalogId);

      if (response.success) {
        setSuccess("Catalog deleted successfully");
        setTimeout(() => {
          navigate("/product-catalogs");
        }, 2000);
      } else {
        setError(response.message || "Failed to delete catalog");
      }
    } catch (error) {
      console.error("Error deleting catalog:", error);
      setError("Failed to delete catalog");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await productAPI.submitCatalogForReview(
        catalogId,
        "Catalog ready for SuperAdmin review"
      );

      if (response.success) {
        setSuccess("Catalog submitted for review successfully");
        fetchCatalog(); // Refresh data
      } else {
        setError(response.message || "Failed to submit catalog for review");
      }
    } catch (error) {
      console.error("Error submitting catalog:", error);
      setError("Failed to submit catalog for review");
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <span className={`catalog-detail-status-badge ${statusInfo.class}`}>
        {statusInfo.icon && (
          <span className="catalog-detail-status-icon">{statusInfo.icon}</span>
        )}
        <span>{statusInfo.text}</span>
      </span>
    );
  };

  // Render boolean as icon
  const renderBooleanIcon = (value) => {
    return value ? (
      <Check className="catalog-detail-boolean-icon true" size={16} />
    ) : (
      <X className="catalog-detail-boolean-icon false" size={16} />
    );
  };

  return (
    <div className="catalog-detail-container">
      {/* Header */}
      <div className="catalog-detail-header">
        <div className="catalog-detail-header-left">
          <button className="catalog-detail-back-button" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Back to Catalogs</span>
          </button>
          <div className="catalog-detail-title-section">
            <div className="catalog-detail-title-row">
              <h1>{safeText(catalog?.name, "Loading...")}</h1>
              {catalog?.isDefault && (
                <Star className="catalog-detail-default-star" size={20} />
              )}
              {catalog && renderStatusBadge(catalog.status)}
            </div>
            <p>View and manage catalog details</p>
          </div>
        </div>

        {catalog && (
          <div className="catalog-detail-header-actions">
            <button
              className="catalog-detail-action-button catalog-detail-edit-button"
              onClick={handleEdit}
              disabled={actionLoading}
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>

            {!catalog.isDefault && catalog.status === "active" && (
              <button
                className="catalog-detail-action-button catalog-detail-default-button"
                onClick={handleSetDefault}
                disabled={actionLoading}
              >
                <Star size={16} />
                <span>Set Default</span>
              </button>
            )}

            {catalog.status === "draft" && (
              <>
                <button
                  className="catalog-detail-action-button catalog-detail-submit-button"
                  onClick={handleSubmitForReview}
                  disabled={actionLoading}
                >
                  <Send size={16} />
                  <span>Submit for Review</span>
                </button>

                <button
                  className="catalog-detail-action-button catalog-detail-delete-button"
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="catalog-detail-error-message">
          <AlertCircle size={16} />
          <span>{safeText(error)}</span>
          <button
            className="catalog-detail-close-alert"
            onClick={() => setError("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div className="catalog-detail-success-message">
          <Check size={16} />
          <span>{safeText(success)}</span>
          <button
            className="catalog-detail-close-alert"
            onClick={() => setSuccess("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="catalog-detail-loading">
          <div className="catalog-detail-spinner"></div>
          <p>Loading catalog details...</p>
        </div>
      ) : catalog ? (
        <div className="catalog-detail-content">
          {/* Basic Information */}
          <div className="catalog-detail-section">
            <div className="catalog-detail-section-header">
              <h2 className="catalog-detail-section-title">
                <Package size={20} />
                Basic Information
              </h2>
            </div>

            <div className="catalog-detail-grid">
              <div className="catalog-detail-item">
                <div className="catalog-detail-label">Name</div>
                <div className="catalog-detail-value">
                  {safeText(catalog.name)}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">Category</div>
                <div className="catalog-detail-value">
                  <span className="catalog-detail-category-badge">
                    {safeText(catalog.category)}
                  </span>
                </div>
              </div>

              <div className="catalog-detail-item catalog-detail-full-width">
                <div className="catalog-detail-label">Description</div>
                <div className="catalog-detail-value">
                  {safeText(catalog.description)}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">Product Count</div>
                <div className="catalog-detail-value">
                  {safeText(catalog.productCount || 0)}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">Default Catalog</div>
                <div className="catalog-detail-value">
                  {renderBooleanIcon(catalog.isDefault)}
                  <span>{safeText(catalog.isDefault)}</span>
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">Created</div>
                <div className="catalog-detail-value">
                  {formatDate(catalog.createdAt)}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">Last Updated</div>
                <div className="catalog-detail-value">
                  {formatDate(catalog.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Settings */}
          <div className="catalog-detail-section">
            <div className="catalog-detail-section-header">
              <h2 className="catalog-detail-section-title">
                <Settings size={20} />
                Catalog Settings
              </h2>
            </div>

            <div className="catalog-detail-grid">
              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <DollarSign size={16} />
                  Currency
                </div>
                <div className="catalog-detail-value">
                  {safeText(catalog.settings?.currencyCode, "INR")}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <DollarSign size={16} />
                  Tax Rate
                </div>
                <div className="catalog-detail-value">
                  {safeText(catalog.settings?.taxRate || 0)}%
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <RotateCcw size={16} />
                  Weight Unit
                </div>
                <div className="catalog-detail-value">
                  {safeText(catalog.settings?.weightUnit, "kg")}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <Shield size={16} />
                  Dimension Unit
                </div>
                <div className="catalog-detail-value">
                  {safeText(catalog.settings?.dimensionUnit, "cm")}
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="catalog-detail-features-section">
              <h3>Features</h3>
              <div className="catalog-detail-features-grid">
                <div className="catalog-detail-feature-item">
                  {renderBooleanIcon(catalog.settings?.hasVariants)}
                  <span>Has Product Variants</span>
                </div>

                <div className="catalog-detail-feature-item">
                  {renderBooleanIcon(catalog.settings?.allowBackorders)}
                  <span>Allow Backorders</span>
                </div>

                <div className="catalog-detail-feature-item">
                  {renderBooleanIcon(catalog.settings?.trackInventory)}
                  <span>Track Inventory</span>
                </div>

                <div className="catalog-detail-feature-item">
                  {renderBooleanIcon(catalog.settings?.requireApproval)}
                  <span>Require Approval</span>
                </div>

                <div className="catalog-detail-feature-item">
                  {renderBooleanIcon(catalog.settings?.isDigitalOnly)}
                  <span>Digital Products Only</span>
                </div>

                <div className="catalog-detail-feature-item">
                  {renderBooleanIcon(catalog.settings?.taxIncluded)}
                  <span>Tax Included in Price</span>
                </div>

                <div className="catalog-detail-feature-item">
                  {renderBooleanIcon(catalog.settings?.autoPublish)}
                  <span>Auto Publish</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Integrations */}
          <div className="catalog-detail-section">
            <div className="catalog-detail-section-header">
              <h2 className="catalog-detail-section-title">
                <Globe size={20} />
                Platform Integrations
              </h2>
            </div>

            <div className="catalog-detail-grid">
              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <Facebook size={16} />
                  Facebook Page
                </div>
                <div className="catalog-detail-value">
                  {renderConnectionStatus(catalog.integrations?.facebookPage)}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <Instagram size={16} />
                  Instagram Account
                </div>
                <div className="catalog-detail-value">
                  {renderConnectionStatus(
                    catalog.integrations?.instagramAccount
                  )}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <MessageCircle size={16} />
                  WhatsApp Business
                </div>
                <div className="catalog-detail-value">
                  {renderConnectionStatus(
                    catalog.integrations?.whatsappBusinessAccount
                  )}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <SearchIcon size={16} />
                  Google Merchant
                </div>
                <div className="catalog-detail-value">
                  {renderConnectionStatus(catalog.integrations?.googleMerchant)}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <Package size={16} />
                  Shopify
                </div>
                <div className="catalog-detail-value">
                  {renderConnectionStatus(catalog.integrations?.shopify)}
                </div>
              </div>

              <div className="catalog-detail-item">
                <div className="catalog-detail-label">
                  <Package size={16} />
                  WooCommerce
                </div>
                <div className="catalog-detail-value">
                  {renderConnectionStatus(catalog.integrations?.woocommerce)}
                </div>
              </div>
            </div>
          </div>

          {/* Review Information */}
          {(catalog.status === "rejected" ||
            catalog.superAdminNotes ||
            catalog.rejectionReason) && (
            <div className="catalog-detail-section">
              <div className="catalog-detail-section-header">
                <h2 className="catalog-detail-section-title">
                  <AlertCircle size={20} />
                  Review Information
                </h2>
              </div>

              {catalog.superAdminNotes && (
                <div className="catalog-detail-review-item">
                  <div className="catalog-detail-review-label">
                    SuperAdmin Notes
                  </div>
                  <div className="catalog-detail-review-content catalog-detail-notes">
                    {safeText(catalog.superAdminNotes)}
                  </div>
                </div>
              )}

              {catalog.rejectionReason && (
                <div className="catalog-detail-review-item">
                  <div className="catalog-detail-review-label">
                    Rejection Reason
                  </div>
                  <div className="catalog-detail-review-content catalog-detail-rejection">
                    {safeText(catalog.rejectionReason)}
                  </div>
                </div>
              )}

              {catalog.reviewedAt && (
                <div className="catalog-detail-review-item">
                  <div className="catalog-detail-review-label">Reviewed At</div>
                  <div className="catalog-detail-review-content">
                    {formatDate(catalog.reviewedAt)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Facebook Integration Details */}
          {(catalog.facebookCatalogId || catalog.facebookCatalogUrl) && (
            <div className="catalog-detail-section">
              <div className="catalog-detail-section-header">
                <h2 className="catalog-detail-section-title">
                  <Facebook size={20} />
                  Facebook Integration
                </h2>
              </div>

              <div className="catalog-detail-grid">
                {catalog.facebookCatalogId && (
                  <div className="catalog-detail-item">
                    <div className="catalog-detail-label">
                      Facebook Catalog ID
                    </div>
                    <div className="catalog-detail-value">
                      {safeText(catalog.facebookCatalogId)}
                    </div>
                  </div>
                )}

                {catalog.facebookCatalogUrl && (
                  <div className="catalog-detail-item">
                    <div className="catalog-detail-label">
                      Facebook Catalog URL
                    </div>
                    <div className="catalog-detail-value">
                      <a
                        href={catalog.facebookCatalogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="catalog-detail-url-link"
                      >
                        View on Facebook
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Preview */}
          {catalog.productSamples && catalog.productSamples.length > 0 && (
            <div className="catalog-detail-section">
              <div className="catalog-detail-section-header">
                <h2 className="catalog-detail-section-title">
                  <Package size={20} />
                  Products Preview
                </h2>
                <button
                  className="catalog-detail-view-all-button"
                  onClick={() => navigate(`/products?catalogId=${catalogId}`)}
                >
                  <Eye size={16} />
                  View All Products
                </button>
              </div>

              <div className="catalog-detail-products-preview">
                {catalog.productSamples.map((product) => (
                  <div
                    key={product._id}
                    className="catalog-detail-product-preview-card"
                  >
                    <div className="catalog-detail-product-name">
                      {safeText(product.name)}
                    </div>
                    <div className="catalog-detail-product-price">
                      {safeText(product.currency)} {safeText(product.price)}
                    </div>
                    <div className="catalog-detail-product-status">
                      {renderStatusBadge(product.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics */}
          {catalog.metrics && (
            <div className="catalog-detail-section">
              <div className="catalog-detail-section-header">
                <h2 className="catalog-detail-section-title">
                  <Package size={20} />
                  Metrics
                </h2>
              </div>

              <div className="catalog-detail-grid">
                <div className="catalog-detail-item">
                  <div className="catalog-detail-label">Total Views</div>
                  <div className="catalog-detail-value">
                    {safeText(catalog.metrics.totalViews || 0)}
                  </div>
                </div>

                <div className="catalog-detail-item">
                  <div className="catalog-detail-label">Total Orders</div>
                  <div className="catalog-detail-value">
                    {safeText(catalog.metrics.totalOrders || 0)}
                  </div>
                </div>

                <div className="catalog-detail-item">
                  <div className="catalog-detail-label">Total Revenue</div>
                  <div className="catalog-detail-value">
                    {catalog.settings?.currencyCode || "INR"}{" "}
                    {safeText(catalog.metrics.totalRevenue || 0)}
                  </div>
                </div>

                <div className="catalog-detail-item">
                  <div className="catalog-detail-label">Average Rating</div>
                  <div className="catalog-detail-value">
                    {safeText(catalog.metrics.averageRating || 0)} / 5
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="catalog-detail-not-found">
          <AlertCircle size={24} />
          <p>Catalog not found or has been deleted.</p>
          <button
            className="catalog-detail-back-to-list-button"
            onClick={handleBack}
          >
            Back to Catalogs List
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogDetail;
