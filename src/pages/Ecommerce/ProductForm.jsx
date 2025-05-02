// src/pages/Ecommerce/ProductForm.jsx
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Trash2,
  Image,
  Upload,
  AlertCircle,
} from "lucide-react";
import "./ProductForm.css";

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  // Initial product state
  const [product, setProduct] = useState({
    title: "",
    description: "",
    sku: "",
    stock: "",
    price: "",
    salePrice: "",
    currencyCode: "USD",
    brand: "",
    category: "",
    externalLink: "",
    images: [],
    importerName: "",
    originCountry: "",
    originCountryCode: "",
    complianceCategory: "",
  });

  // Track form errors
  const [errors, setErrors] = useState({});

  // Available product categories
  const categories = [
    "Apparel",
    "Accessories",
    "Homeware",
    "Electronics",
    "Stationery",
  ];

  // WhatsApp compliance categories
  const complianceCategories = [
    "Food",
    "Household",
    "Health & Beauty",
    "Apparel & Accessories",
    "Education",
    "Entertainment",
    "Other",
  ];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });

    // Clear error for this field if exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    // In a real app, you would handle file upload to a server here
    // For now, we'll just create a fake URL for the image
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProduct({
        ...product,
        images: [...product.images, imageUrl],
      });
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const updatedImages = [...product.images];
    updatedImages.splice(index, 1);
    setProduct({
      ...product,
      images: updatedImages,
    });
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!product.title) newErrors.title = "Product title is required";
    if (!product.sku) newErrors.sku = "SKU is required";
    if (!product.price) newErrors.price = "Price is required";
    if (!product.stock) newErrors.stock = "Stock quantity is required";
    if (!product.brand) newErrors.brand = "Brand is required";
    if (!product.category) newErrors.category = "Category is required";
    if (!product.externalLink)
      newErrors.externalLink = "External product link is required";

    // Specific validations
    if (product.sku && !/^\d+$/.test(product.sku)) {
      newErrors.sku = "SKU must be numeric";
    }

    if (product.price && isNaN(Number(product.price))) {
      newErrors.price = "Price must be a number";
    }

    if (product.salePrice && isNaN(Number(product.salePrice))) {
      newErrors.salePrice = "Sale price must be a number";
    }

    if (product.stock && isNaN(Number(product.stock))) {
      newErrors.stock = "Stock must be a number";
    }

    // Check for Indian businesses (just for demonstration)
    const isIndianBusiness = true;

    if (isIndianBusiness) {
      if (!product.importerName)
        newErrors.importerName =
          "Importer name is required for Indian businesses";
      if (!product.originCountry)
        newErrors.originCountry =
          "Origin country is required for Indian businesses";
      if (!product.complianceCategory)
        newErrors.complianceCategory =
          "WhatsApp compliance category is required for Indian businesses";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, you would save the product to your backend here
      console.log("Saving product:", product);

      // Navigate back to the products page
      navigate("/ecommerce");
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector(".field-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-header">
        <Link to="/ecommerce" className="back-button">
          <ArrowLeft size={20} />
        </Link>
        <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        <div className="header-actions">
          <button className="delete-button" type="button">
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
          <button className="save-button" type="button" onClick={handleSubmit}>
            <Save size={18} />
            <span>Save Product</span>
          </button>
        </div>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="title">
                Product Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={product.title}
                onChange={handleInputChange}
                className={errors.title ? "has-error" : ""}
              />
              {errors.title && (
                <div className="field-error">{errors.title}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Product Description</label>
              <textarea
                id="description"
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={5}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sku">
                SKU <span className="required">*</span>
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={product.sku}
                onChange={handleInputChange}
                className={errors.sku ? "has-error" : ""}
                placeholder="Numeric SKU"
              />
              {errors.sku && <div className="field-error">{errors.sku}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">
                  Price <span className="required">*</span>
                </label>
                <div className="price-input">
                  <select
                    id="currencyCode"
                    name="currencyCode"
                    value={product.currencyCode}
                    onChange={handleInputChange}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleInputChange}
                    className={errors.price ? "has-error" : ""}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <div className="field-error">{errors.price}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="salePrice">Sale Price</label>
                <input
                  type="text"
                  id="salePrice"
                  name="salePrice"
                  value={product.salePrice}
                  onChange={handleInputChange}
                  className={errors.salePrice ? "has-error" : ""}
                  placeholder="0.00"
                />
                {errors.salePrice && (
                  <div className="field-error">{errors.salePrice}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="stock">
                Stock <span className="required">*</span>
              </label>
              <input
                type="text"
                id="stock"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                className={errors.stock ? "has-error" : ""}
                placeholder="Quantity available"
              />
              {errors.stock && (
                <div className="field-error">{errors.stock}</div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Product Images</h2>

            <div className="image-uploader">
              <div className="image-preview-container">
                {product.images.length > 0 ? (
                  <div className="image-preview-grid">
                    {product.images.map((image, index) => (
                      <div className="image-preview" key={index}>
                        <img src={image} alt={`Product ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-images">
                    <Image size={48} />
                    <p>No images uploaded yet</p>
                  </div>
                )}
              </div>

              <div className="upload-control">
                <label htmlFor="imageUpload" className="upload-button">
                  <Upload size={16} />
                  <span>Upload Image</span>
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <p className="upload-info">
                  Recommended size: 800x800px, max size: 2MB. PNG or JPG format.
                </p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Categories & Attributes</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">
                  Brand <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={product.brand}
                  onChange={handleInputChange}
                  className={errors.brand ? "has-error" : ""}
                />
                {errors.brand && (
                  <div className="field-error">{errors.brand}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className={errors.category ? "has-error" : ""}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="field-error">{errors.category}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="externalLink">
                External Product Link <span className="required">*</span>
              </label>
              <input
                type="text"
                id="externalLink"
                name="externalLink"
                value={product.externalLink}
                onChange={handleInputChange}
                className={errors.externalLink ? "has-error" : ""}
                placeholder="https://yourdomain.com/product"
              />
              {errors.externalLink && (
                <div className="field-error">{errors.externalLink}</div>
              )}
              <div className="field-help">
                <AlertCircle size={14} />
                <span>
                  Link to your product page on your website or online store.
                </span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Compliance Information</h2>
            <div className="info-box">
              <AlertCircle size={20} />
              <p>
                The following fields are mandatory for Indian businesses using
                WhatsApp Commerce.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="importerName">
                Importer Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="importerName"
                name="importerName"
                value={product.importerName}
                onChange={handleInputChange}
                className={errors.importerName ? "has-error" : ""}
              />
              {errors.importerName && (
                <div className="field-error">{errors.importerName}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="originCountry">
                  Origin Country <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="originCountry"
                  name="originCountry"
                  value={product.originCountry}
                  onChange={handleInputChange}
                  className={errors.originCountry ? "has-error" : ""}
                />
                {errors.originCountry && (
                  <div className="field-error">{errors.originCountry}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="originCountryCode">Country Code</label>
                <input
                  type="text"
                  id="originCountryCode"
                  name="originCountryCode"
                  value={product.originCountryCode}
                  onChange={handleInputChange}
                  placeholder="e.g., IN for India"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="complianceCategory">
                WhatsApp Compliance Category <span className="required">*</span>
              </label>
              <select
                id="complianceCategory"
                name="complianceCategory"
                value={product.complianceCategory}
                onChange={handleInputChange}
                className={errors.complianceCategory ? "has-error" : ""}
              >
                <option value="">Select a compliance category</option>
                {complianceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.complianceCategory && (
                <div className="field-error">{errors.complianceCategory}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/ecommerce" className="cancel-button">
            Cancel
          </Link>
          <button className="save-button" type="submit">
            <Save size={18} />
            <span>Save Product</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
