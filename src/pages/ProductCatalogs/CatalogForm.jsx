// src/pages/ProductCatalogs/CatalogForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Type,
  Package,
  Settings,
  Globe,
  Palette,
  Search as SearchIcon,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  Truck,
  RotateCcw,
  Shield,
  Facebook,
  Instagram,
  MessageCircle,
  Tag,
} from "lucide-react";
import { productAPI } from "../../utils/api";
import "./CatalogForm.css";

const CatalogForm = () => {
  const navigate = useNavigate();
  const { catalogId } = useParams();
  const isEditMode = Boolean(catalogId);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "electronics",
    settings: {
      currencyCode: "INR",
      locale: "en_IN",
      timezone: "Asia/Kolkata",
      isDigitalOnly: false,
      hasVariants: true,
      allowBackorders: false,
      taxRate: 18,
      taxIncluded: false,
      shippingRequired: true,
      returnsAllowed: true,
      returnPeriodDays: 30,
      warrantyPeriodMonths: 12,
    },
    integrations: {
      facebookPage: "",
      instagramAccount: "",
      whatsappBusinessAccount: "",
      googleMerchantId: "",
      enableFacebookShop: true,
      enableInstagramShopping: true,
      enableWhatsAppCatalog: true,
      enableGoogleShopping: false,
    },
    branding: {
      logoUrl: "",
      bannerUrl: "",
      primaryColor: "#007bff",
      secondaryColor: "#6c757d",
      accentColor: "#28a745",
    },
    seoSettings: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      canonicalUrl: "",
    },
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // Categories for dropdown
  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Home & Garden" },
    { value: "books", label: "Books" },
    { value: "sports", label: "Sports" },
    { value: "beauty", label: "Beauty & Health" },
    { value: "toys", label: "Toys & Games" },
    { value: "automotive", label: "Automotive" },
  ];

  // Currency options
  const currencies = [
    { value: "INR", label: "INR (₹)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
  ];

  // Load catalog data if editing
  useEffect(() => {
    if (isEditMode && catalogId) {
      fetchCatalogData();
    }
  }, [catalogId, isEditMode]);

  const fetchCatalogData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await productAPI.getProductCatalogById(
        catalogId,
        false,
        false
      );

      if (response.success) {
        const catalog = response.data;

        // Populate form with existing data
        setFormData({
          name: catalog.name || "",
          description: catalog.description || "",
          category: catalog.category || "electronics",
          settings: {
            currencyCode: catalog.settings?.currencyCode || "INR",
            locale: catalog.settings?.locale || "en_IN",
            timezone: catalog.settings?.timezone || "Asia/Kolkata",
            isDigitalOnly: catalog.settings?.isDigitalOnly || false,
            hasVariants: catalog.settings?.hasVariants || true,
            allowBackorders: catalog.settings?.allowBackorders || false,
            taxRate: catalog.settings?.taxRate || 18,
            taxIncluded: catalog.settings?.taxIncluded || false,
            shippingRequired: catalog.settings?.shippingRequired || true,
            returnsAllowed: catalog.settings?.returnsAllowed || true,
            returnPeriodDays: catalog.settings?.returnPeriodDays || 30,
            warrantyPeriodMonths: catalog.settings?.warrantyPeriodMonths || 12,
          },
          integrations: {
            facebookPage: catalog.integrations?.facebookPage || "",
            instagramAccount: catalog.integrations?.instagramAccount || "",
            whatsappBusinessAccount:
              catalog.integrations?.whatsappBusinessAccount || "",
            googleMerchantId: catalog.integrations?.googleMerchantId || "",
            enableFacebookShop:
              catalog.integrations?.enableFacebookShop ?? true,
            enableInstagramShopping:
              catalog.integrations?.enableInstagramShopping ?? true,
            enableWhatsAppCatalog:
              catalog.integrations?.enableWhatsAppCatalog ?? true,
            enableGoogleShopping:
              catalog.integrations?.enableGoogleShopping ?? false,
          },
          branding: {
            logoUrl: catalog.branding?.logoUrl || "",
            bannerUrl: catalog.branding?.bannerUrl || "",
            primaryColor: catalog.branding?.primaryColor || "#007bff",
            secondaryColor: catalog.branding?.secondaryColor || "#6c757d",
            accentColor: catalog.branding?.accentColor || "#28a745",
          },
          seoSettings: {
            metaTitle: catalog.seoSettings?.metaTitle || "",
            metaDescription: catalog.seoSettings?.metaDescription || "",
            keywords: catalog.seoSettings?.keywords || [],
            canonicalUrl: catalog.seoSettings?.canonicalUrl || "",
          },
        });
      } else {
        setError(response.message || "Failed to fetch catalog data");
      }
    } catch (error) {
      console.error("Error fetching catalog:", error);
      setError("Failed to fetch catalog data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      // Handle nested properties
      const keys = name.split(".");
      setFormData((prev) => {
        const newData = { ...prev };
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] =
          type === "checkbox"
            ? checked
            : type === "number"
            ? parseFloat(value) || 0
            : value;

        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle keyword input
  const handleKeywordAdd = () => {
    if (
      keywordInput.trim() &&
      !formData.seoSettings.keywords.includes(keywordInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        seoSettings: {
          ...prev.seoSettings,
          keywords: [...prev.seoSettings.keywords, keywordInput.trim()],
        },
      }));
      setKeywordInput("");
    }
  };

  const handleKeywordRemove = (keyword) => {
    setFormData((prev) => ({
      ...prev,
      seoSettings: {
        ...prev.seoSettings,
        keywords: prev.seoSettings.keywords.filter((k) => k !== keyword),
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name.trim()) {
      setError("Catalog name is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Catalog description is required");
      return;
    }

    try {
      setIsLoading(true);

      let response;
      if (isEditMode) {
        response = await productAPI.updateProductCatalog(catalogId, formData);
      } else {
        response = await productAPI.createProductCatalog(formData);
      }

      if (response.success) {
        setSuccess(
          response.message ||
            `Catalog ${isEditMode ? "updated" : "created"} successfully!`
        );
        setTimeout(() => {
          navigate("/product-catalogs");
        }, 2000);
      } else {
        setError(
          response.message ||
            `Failed to ${isEditMode ? "update" : "create"} catalog`
        );
      }
    } catch (error) {
      console.error("Error submitting catalog:", error);
      setError(
        error.message ||
          `An error occurred while ${
            isEditMode ? "updating" : "creating"
          } the catalog`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/product-catalogs");
  };

  return (
    <div className="catalog-form-container">
      {/* Header */}
      <div className="catalog-form-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Back to Catalogs</span>
          </button>
          <div className="title-section">
            <h1>{isEditMode ? "Edit Catalog" : "Create Catalog"}</h1>
            <p>
              {isEditMode
                ? "Update your catalog settings"
                : "Create a new product catalog"}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Form */}
      <form className="catalog-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h2 className="section-title">
            <Package size={20} />
            Basic Information
          </h2>

          <div className="form-group">
            <label htmlFor="name">Catalog Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter catalog name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your catalog and the products it will contain"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>
        </div>

        {/* Catalog Settings */}
        <div className="form-section">
          <h2 className="section-title">
            <Settings size={20} />
            Catalog Settings
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="settings.currencyCode">Currency</label>
              <div className="input-with-icon">
                <DollarSign size={18} className="input-icon" />
                <select
                  id="settings.currencyCode"
                  name="settings.currencyCode"
                  value={formData.settings.currencyCode}
                  onChange={handleChange}
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="settings.taxRate">Tax Rate (%)</label>
              <div className="input-with-icon">
                <DollarSign size={18} className="input-icon" />
                <input
                  type="number"
                  id="settings.taxRate"
                  name="settings.taxRate"
                  placeholder="18"
                  value={formData.settings.taxRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="settings.returnPeriodDays">
                Return Period (Days)
              </label>
              <div className="input-with-icon">
                <RotateCcw size={18} className="input-icon" />
                <input
                  type="number"
                  id="settings.returnPeriodDays"
                  name="settings.returnPeriodDays"
                  placeholder="30"
                  value={formData.settings.returnPeriodDays}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="settings.warrantyPeriodMonths">
                Warranty Period (Months)
              </label>
              <div className="input-with-icon">
                <Shield size={18} className="input-icon" />
                <input
                  type="number"
                  id="settings.warrantyPeriodMonths"
                  name="settings.warrantyPeriodMonths"
                  placeholder="12"
                  value={formData.settings.warrantyPeriodMonths}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="settings.locale">Locale</label>
              <div className="input-with-icon">
                <Globe size={18} className="input-icon" />
                <select
                  id="settings.locale"
                  name="settings.locale"
                  value={formData.settings.locale}
                  onChange={handleChange}
                >
                  <option value="en_IN">English (India)</option>
                  <option value="en_US">English (US)</option>
                  <option value="hi_IN">Hindi (India)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="settings.timezone">Timezone</label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <select
                  id="settings.timezone"
                  name="settings.timezone"
                  value={formData.settings.timezone}
                  onChange={handleChange}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
            </div>
          </div>

          {/* Settings Checkboxes */}
          <div className="checkbox-section">
            <h3>Features</h3>
            <div className="checkbox-grid">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="settings.hasVariants"
                  name="settings.hasVariants"
                  checked={formData.settings.hasVariants}
                  onChange={handleChange}
                />
                <label htmlFor="settings.hasVariants">
                  Has Product Variants
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="settings.allowBackorders"
                  name="settings.allowBackorders"
                  checked={formData.settings.allowBackorders}
                  onChange={handleChange}
                />
                <label htmlFor="settings.allowBackorders">
                  Allow Backorders
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="settings.shippingRequired"
                  name="settings.shippingRequired"
                  checked={formData.settings.shippingRequired}
                  onChange={handleChange}
                />
                <label htmlFor="settings.shippingRequired">
                  Shipping Required
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="settings.returnsAllowed"
                  name="settings.returnsAllowed"
                  checked={formData.settings.returnsAllowed}
                  onChange={handleChange}
                />
                <label htmlFor="settings.returnsAllowed">Returns Allowed</label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="settings.isDigitalOnly"
                  name="settings.isDigitalOnly"
                  checked={formData.settings.isDigitalOnly}
                  onChange={handleChange}
                />
                <label htmlFor="settings.isDigitalOnly">
                  Digital Products Only
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="settings.taxIncluded"
                  name="settings.taxIncluded"
                  checked={formData.settings.taxIncluded}
                  onChange={handleChange}
                />
                <label htmlFor="settings.taxIncluded">
                  Tax Included in Price
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Integrations */}
        <div className="form-section">
          <h2 className="section-title">
            <Globe size={20} />
            Platform Integrations
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="integrations.facebookPage">Facebook Page</label>
              <div className="input-with-icon">
                <Facebook size={18} className="input-icon" />
                <input
                  type="text"
                  id="integrations.facebookPage"
                  name="integrations.facebookPage"
                  placeholder="your-facebook-page"
                  value={formData.integrations.facebookPage}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="integrations.instagramAccount">
                Instagram Account
              </label>
              <div className="input-with-icon">
                <Instagram size={18} className="input-icon" />
                <input
                  type="text"
                  id="integrations.instagramAccount"
                  name="integrations.instagramAccount"
                  placeholder="@your_instagram"
                  value={formData.integrations.instagramAccount}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="integrations.whatsappBusinessAccount">
                WhatsApp Business Number
              </label>
              <div className="input-with-icon">
                <MessageCircle size={18} className="input-icon" />
                <input
                  type="text"
                  id="integrations.whatsappBusinessAccount"
                  name="integrations.whatsappBusinessAccount"
                  placeholder="+919876543210"
                  value={formData.integrations.whatsappBusinessAccount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="integrations.googleMerchantId">
                Google Merchant ID
              </label>
              <div className="input-with-icon">
                <SearchIcon size={18} className="input-icon" />
                <input
                  type="text"
                  id="integrations.googleMerchantId"
                  name="integrations.googleMerchantId"
                  placeholder="123456789"
                  value={formData.integrations.googleMerchantId}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Integration Checkboxes */}
          <div className="checkbox-section">
            <h3>Enable Platforms</h3>
            <div className="checkbox-grid">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="integrations.enableFacebookShop"
                  name="integrations.enableFacebookShop"
                  checked={formData.integrations.enableFacebookShop}
                  onChange={handleChange}
                />
                <label htmlFor="integrations.enableFacebookShop">
                  Facebook Shop
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="integrations.enableInstagramShopping"
                  name="integrations.enableInstagramShopping"
                  checked={formData.integrations.enableInstagramShopping}
                  onChange={handleChange}
                />
                <label htmlFor="integrations.enableInstagramShopping">
                  Instagram Shopping
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="integrations.enableWhatsAppCatalog"
                  name="integrations.enableWhatsAppCatalog"
                  checked={formData.integrations.enableWhatsAppCatalog}
                  onChange={handleChange}
                />
                <label htmlFor="integrations.enableWhatsAppCatalog">
                  WhatsApp Catalog
                </label>
              </div>

              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="integrations.enableGoogleShopping"
                  name="integrations.enableGoogleShopping"
                  checked={formData.integrations.enableGoogleShopping}
                  onChange={handleChange}
                />
                <label htmlFor="integrations.enableGoogleShopping">
                  Google Shopping
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="form-section">
          <h2 className="section-title">
            <Palette size={20} />
            Branding
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="branding.logoUrl">Logo URL</label>
              <input
                type="url"
                id="branding.logoUrl"
                name="branding.logoUrl"
                placeholder="https://example.com/logo.png"
                value={formData.branding.logoUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="branding.bannerUrl">Banner URL</label>
              <input
                type="url"
                id="branding.bannerUrl"
                name="branding.bannerUrl"
                placeholder="https://example.com/banner.jpg"
                value={formData.branding.bannerUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="branding.primaryColor">Primary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  id="branding.primaryColor"
                  name="branding.primaryColor"
                  value={formData.branding.primaryColor}
                  onChange={handleChange}
                  className="color-input"
                />
                <input
                  type="text"
                  value={formData.branding.primaryColor}
                  onChange={handleChange}
                  name="branding.primaryColor"
                  className="color-text-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="branding.secondaryColor">Secondary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  id="branding.secondaryColor"
                  name="branding.secondaryColor"
                  value={formData.branding.secondaryColor}
                  onChange={handleChange}
                  className="color-input"
                />
                <input
                  type="text"
                  value={formData.branding.secondaryColor}
                  onChange={handleChange}
                  name="branding.secondaryColor"
                  className="color-text-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="branding.accentColor">Accent Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  id="branding.accentColor"
                  name="branding.accentColor"
                  value={formData.branding.accentColor}
                  onChange={handleChange}
                  className="color-input"
                />
                <input
                  type="text"
                  value={formData.branding.accentColor}
                  onChange={handleChange}
                  name="branding.accentColor"
                  className="color-text-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="form-section">
          <h2 className="section-title">
            <SearchIcon size={20} />
            SEO Settings
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seoSettings.metaTitle">Meta Title</label>
              <input
                type="text"
                id="seoSettings.metaTitle"
                name="seoSettings.metaTitle"
                placeholder="Your catalog title for search engines"
                value={formData.seoSettings.metaTitle}
                onChange={handleChange}
                maxLength="60"
              />
              <div className="help-text">
                {formData.seoSettings.metaTitle.length}/60 characters
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="seoSettings.canonicalUrl">Canonical URL</label>
              <input
                type="url"
                id="seoSettings.canonicalUrl"
                name="seoSettings.canonicalUrl"
                placeholder="https://example.com/catalog"
                value={formData.seoSettings.canonicalUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="seoSettings.metaDescription">
                Meta Description
              </label>
              <textarea
                id="seoSettings.metaDescription"
                name="seoSettings.metaDescription"
                placeholder="Brief description of your catalog for search engines"
                value={formData.seoSettings.metaDescription}
                onChange={handleChange}
                rows="3"
                maxLength="160"
              ></textarea>
              <div className="help-text">
                {formData.seoSettings.metaDescription.length}/160 characters
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SEO Keywords</label>
              <div className="tag-input-container">
                <div className="tag-input-field">
                  <input
                    type="text"
                    placeholder="Add keyword and press Enter"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleKeywordAdd();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="tag-add-button"
                    onClick={handleKeywordAdd}
                  >
                    Add
                  </button>
                </div>

                <div className="tags-container">
                  {formData.seoSettings.keywords.map((keyword, index) => (
                    <div key={index} className="tag">
                      <span>{keyword}</span>
                      <button
                        type="button"
                        className="tag-remove-button"
                        onClick={() => handleKeywordRemove(keyword)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleBack}>
            Cancel
          </button>
          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>{isEditMode ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <span>{isEditMode ? "Update Catalog" : "Create Catalog"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CatalogForm;
