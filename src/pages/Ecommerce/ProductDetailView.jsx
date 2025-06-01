import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Tag,
  Truck,
  Clock,
  ShoppingBag,
  Info,
  Edit,
  Send,
  AlertCircle,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./ProductDetailView.css";

const ProductDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get admin token from localStorage or sessionStorage
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://pixe-backend-tkrb.onrender.com";

  // Fetch product details
  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      setLoading(true);
      setError("");

      try {
        // //console.log(
        //   "Fetching product details with token:",
        //   token ? "Token exists" : "No token"
        // );

        const response = await fetch(`${baseUrl}/api/products/admin/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Product fetch failed:", response.status, errorText);
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        //console.log("Product details response:", data);

        if (data.success) {
          setProduct(data.productRequest);

          // Find primary image index
          if (
            data.productRequest.images &&
            data.productRequest.images.length > 0
          ) {
            const primaryIndex = data.productRequest.images.findIndex(
              (img) => img.isPrimary
            );
            setCurrentImageIndex(primaryIndex !== -1 ? primaryIndex : 0);
          }
        } else {
          setError(data.message || "Failed to fetch product details");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error loading product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, token, baseUrl]);

  // Handle submit for review
  const handleSubmitForReview = async () => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${baseUrl}/api/products/${id}/apply`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "submitted",
          adminNotes: "Product is ready for review.",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Product submitted for review successfully");
        // Update local product state to show updated status
        setProduct((prev) => ({
          ...prev,
          status: "submitted",
        }));
      } else {
        setError(data.message || "Failed to submit product for review");
      }
    } catch (err) {
      console.error("Error submitting product for review:", err);
      setError("Failed to submit product for review");
    }
  };

  // Handle edit
  const handleEdit = () => {
    navigate(`/ecommerce/products/edit/${id}`);
  };

  // Handle back
  const handleBack = () => {
    navigate("/ecommerce");
  };

  // Image navigation
  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        icon: <ShoppingBag size={14} />,
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

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>

        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>

        <div className="error-actions">
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>

        <div className="not-found-message">
          <Package size={48} />
          <h2>Product Not Found</h2>
          <p>The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Header */}
      <div className="product-detail-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>

        <h1 className="product-detail-title">{product.name}</h1>

        <div className="product-detail-actions">
          <button className="edit-button" onClick={handleEdit}>
            <Edit size={16} />
            <span>Edit Product</span>
          </button>

          {product.status === "draft" && (
            <button className="submit-button" onClick={handleSubmitForReview}>
              <Send size={16} />
              <span>Submit for Review</span>
            </button>
          )}
        </div>
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

      {/* Product Content */}
      <div className="product-detail-content">
        {/* Left Column - Images */}
        <div className="product-detail-left">
          <div className="product-image-gallery">
            {product.images && product.images.length > 0 ? (
              <>
                <div className="product-main-image">
                  <img
                    src={product.images[currentImageIndex].url}
                    alt={
                      product.images[currentImageIndex].caption || product.name
                    }
                  />
                  {renderStatusBadge(product.status)}

                  {product.images.length > 1 && (
                    <>
                      <button
                        className="image-nav-button prev"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        className="image-nav-button next"
                        onClick={handleNextImage}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {product.images.length > 1 && (
                  <div className="product-thumbnails">
                    {product.images.map((image, index) => (
                      <div
                        key={image._id || index}
                        className={`product-thumbnail ${
                          index === currentImageIndex ? "active" : ""
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image.url}
                          alt={image.caption || `${product.name} ${index + 1}`}
                        />
                        {image.isPrimary && (
                          <span
                            className="primary-indicator"
                            title="Primary Image"
                          ></span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image-placeholder">
                <Package size={64} />
                <p>No images available</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="product-detail-right">
          <div className="product-info-card">
            <div className="product-info-header">
              <h2>Product Information</h2>
            </div>

            <div className="product-info-body">
              <div className="product-pricing">
                {product.salePrice ? (
                  <>
                    <div className="product-sale-price">
                      {getCurrencySymbol(product.currency)}
                      {product.salePrice.toFixed(2)}
                    </div>
                    <div className="product-original-price">
                      {getCurrencySymbol(product.currency)}
                      {product.price.toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="product-regular-price">
                    {getCurrencySymbol(product.currency)}
                    {product.price.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Brand:</span>
                  <span className="meta-value">{product.brand}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{product.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Sub-Category:</span>
                  <span className="meta-value">{product.subCategory}</span>
                </div>
              </div>

              <div className="product-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              {product.attributes && product.attributes.length > 0 && (
                <div className="product-attributes">
                  <h3>Attributes</h3>
                  <div className="attributes-list">
                    {product.attributes.map((attr, index) => (
                      <div key={index} className="attribute-item">
                        <span className="attribute-name">{attr.name}</span>
                        <span className="attribute-value">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="product-details-cards">
            <div className="detail-card">
              <div className="detail-card-header">
                <ShoppingBag size={18} />
                <h3>Inventory</h3>
              </div>
              <div className="detail-card-body">
                <div className="detail-item">
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">
                    {product.inventory?.quantity || 0}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">SKU:</span>
                  <span className="detail-value">
                    {product.inventory?.sku || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Management:</span>
                  <span className="detail-value">
                    {product.inventory?.managementType || "manual"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">
                    {product.isDigital ? "Digital Product" : "Physical Product"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Has Variants:</span>
                  <span className="detail-value">
                    {product.hasVariants ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-card-header">
                <Truck size={18} />
                <h3>Shipping</h3>
              </div>
              <div className="detail-card-body">
                <div className="detail-item">
                  <span className="detail-label">Weight:</span>
                  <span className="detail-value">
                    {product.shipping?.weight || "N/A"}{" "}
                    {product.shipping?.weightUnit || ""}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Dimensions:</span>
                  <span className="detail-value">
                    {product.shipping?.dimensions?.length || "N/A"} ×
                    {product.shipping?.dimensions?.width || "N/A"} ×
                    {product.shipping?.dimensions?.height || "N/A"}
                    {product.shipping?.dimensions?.unit || ""}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Shipping Class:</span>
                  <span className="detail-value">
                    {product.shipping?.shippingClass || "standard"}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-card-header">
                <DollarSign size={18} />
                <h3>Tax</h3>
              </div>
              <div className="detail-card-body">
                <div className="detail-item">
                  <span className="detail-label">Taxable:</span>
                  <span className="detail-value">
                    {product.taxable ? "Yes" : "No"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tax Class:</span>
                  <span className="detail-value">
                    {product.taxClass || "standard"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tax Rate:</span>
                  <span className="detail-value">{product.taxRate || 0}%</span>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-card-header">
                <Info size={18} />
                <h3>Additional Info</h3>
              </div>
              <div className="detail-card-body">
                <div className="detail-item">
                  <span className="detail-label">Catalog:</span>
                  <span className="detail-value">
                    {product.catalogId?.name || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">
                    {formatDate(product.createdAt)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">
                    {formatDate(product.updatedAt)}
                  </span>
                </div>
                <div className="detail-item notes">
                  <span className="detail-label">Admin Notes:</span>
                  <span className="detail-value notes-value">
                    {product.adminNotes || "No notes"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
