// src/pages/Ecommerce/Ecommerce.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Tag,
  Box,
  List,
  Settings,
  Database,
  ShoppingCart,
  Check,
  PlusCircle,
  RefreshCw,
  Download,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react";
import "./Ecommerce.css";

const Ecommerce = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [setupComplete, setSetupComplete] = useState({
    catalogIcon: true,
    metaCatalog: true,
    catalogLinked: true,
    storefrontConnected: true,
    apiEnabled: true,
    systemFieldsSync: false,
    categoriesUpdated: false,
    complianceSet: false,
  });

  // Dummy products data
  const products = [
    {
      id: 1,
      sku: "PRD001",
      name: "Premium T-Shirt",
      description: "High quality cotton t-shirt with logo",
      price: 24.99,
      salePrice: 19.99,
      currency: "USD",
      stock: 100,
      category: "Apparel",
      status: "Active",
      pushStatus: "Synced",
      image: "https://via.placeholder.com/100x100",
    },
    {
      id: 2,
      sku: "PRD002",
      name: "Canvas Tote Bag",
      description: "Eco-friendly canvas bag for shopping",
      price: 15.99,
      salePrice: null,
      currency: "USD",
      stock: 75,
      category: "Accessories",
      status: "Active",
      pushStatus: "Synced",
      image: "https://via.placeholder.com/100x100",
    },
    {
      id: 3,
      sku: "PRD003",
      name: "Coffee Mug",
      description: "Ceramic coffee mug with logo",
      price: 12.99,
      salePrice: 9.99,
      currency: "USD",
      stock: 50,
      category: "Homeware",
      status: "Draft",
      pushStatus: "Not Synced",
      image: "https://via.placeholder.com/100x100",
    },
    {
      id: 4,
      sku: "PRD004",
      name: "Wireless Earbuds",
      description: "Bluetooth wireless earbuds with charging case",
      price: 89.99,
      salePrice: 79.99,
      currency: "USD",
      stock: 30,
      category: "Electronics",
      status: "Active",
      pushStatus: "Failed",
      image: "https://via.placeholder.com/100x100",
    },
    {
      id: 5,
      sku: "PRD005",
      name: "Notebook Set",
      description: "Set of 3 premium notebooks with different designs",
      price: 18.99,
      salePrice: null,
      currency: "USD",
      stock: 120,
      category: "Stationery",
      status: "Inactive",
      pushStatus: "Not Synced",
      image: "https://via.placeholder.com/100x100",
    },
  ];

  // Dummy orders data
  const orders = [
    {
      id: "ORD12345",
      customer: "John Doe",
      date: "2023-12-14",
      total: 44.98,
      currency: "USD",
      status: "Confirmed",
      payment: "Paid",
      items: 2,
    },
    {
      id: "ORD12344",
      customer: "Jane Smith",
      date: "2023-12-13",
      total: 15.99,
      currency: "USD",
      status: "Processing",
      payment: "Paid",
      items: 1,
    },
    {
      id: "ORD12343",
      customer: "Mike Johnson",
      date: "2023-12-12",
      total: 89.99,
      currency: "USD",
      status: "Shipped",
      payment: "Paid",
      items: 1,
    },
    {
      id: "ORD12342",
      customer: "Sarah Williams",
      date: "2023-12-11",
      total: 34.97,
      currency: "USD",
      status: "Delivered",
      payment: "Paid",
      items: 3,
    },
    {
      id: "ORD12341",
      customer: "Robert Brown",
      date: "2023-12-10",
      total: 129.98,
      currency: "USD",
      status: "Pending",
      payment: "Awaiting",
      items: 2,
    },
  ];

  // Filter products based on search and filter
  const filteredProducts = products.filter((product) => {
    // Filter by search query
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && product.status === "Active") ||
      (filterStatus === "draft" && product.status === "Draft") ||
      (filterStatus === "inactive" && product.status === "Inactive");

    return matchesSearch && matchesStatus;
  });

  // Filter orders based on search
  const filteredOrders = orders.filter((order) => {
    return (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderSetupGuide = () => (
    <div className="setup-guide">
      <h2>WhatsApp Commerce Setup Guide</h2>

      <div className="setup-steps">
        <div
          className={`setup-step ${
            setupComplete.catalogIcon ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {setupComplete.catalogIcon ? (
              <CheckCircle size={24} />
            ) : (
              <span>1</span>
            )}
          </div>
          <div className="step-content">
            <h3>Enable Catalog Icon</h3>
            <p>Enable the catalog icon for your WhatsApp API number.</p>
            {setupComplete.catalogIcon ? (
              <span className="status-completed">Completed</span>
            ) : (
              <button className="setup-button">Enable Now</button>
            )}
          </div>
        </div>

        <div
          className={`setup-step ${
            setupComplete.metaCatalog ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {setupComplete.metaCatalog ? (
              <CheckCircle size={24} />
            ) : (
              <span>2</span>
            )}
          </div>
          <div className="step-content">
            <h3>Create Meta Catalog</h3>
            <p>Create a catalog in Meta Commerce Manager.</p>
            {setupComplete.metaCatalog ? (
              <span className="status-completed">Completed</span>
            ) : (
              <button className="setup-button">Create Catalog</button>
            )}
          </div>
        </div>

        <div
          className={`setup-step ${
            setupComplete.catalogLinked ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {setupComplete.catalogLinked ? (
              <CheckCircle size={24} />
            ) : (
              <span>3</span>
            )}
          </div>
          <div className="step-content">
            <h3>Link Meta Catalog With WhatsApp API</h3>
            <p>Connect your Meta catalog with your WhatsApp API number.</p>
            {setupComplete.catalogLinked ? (
              <span className="status-completed">Completed</span>
            ) : (
              <button className="setup-button">Link Now</button>
            )}
          </div>
        </div>

        <div
          className={`setup-step ${
            setupComplete.storefrontConnected ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {setupComplete.storefrontConnected ? (
              <CheckCircle size={24} />
            ) : (
              <span>4</span>
            )}
          </div>
          <div className="step-content">
            <h3>Connect Meta Catalog With Ecommerce Section</h3>
            <p>
              Link your Meta catalog as a storefront in the Ecommerce section.
            </p>
            {setupComplete.storefrontConnected ? (
              <span className="status-completed">Completed</span>
            ) : (
              <button className="setup-button">Connect Now</button>
            )}
          </div>
        </div>

        <div
          className={`setup-step ${
            setupComplete.apiEnabled ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {setupComplete.apiEnabled ? (
              <CheckCircle size={24} />
            ) : (
              <span>5</span>
            )}
          </div>
          <div className="step-content">
            <h3>Enable Ecommerce APIs</h3>
            <p>Enable APIs for Ecommerce functionality.</p>
            {setupComplete.apiEnabled ? (
              <span className="status-completed">Completed</span>
            ) : (
              <button className="setup-button">Enable APIs</button>
            )}
          </div>
        </div>

        <div
          className={`setup-step ${
            setupComplete.systemFieldsSync ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {setupComplete.systemFieldsSync ? (
              <CheckCircle size={24} />
            ) : (
              <span>6</span>
            )}
          </div>
          <div className="step-content">
            <h3>Sync System Fields</h3>
            <p>Synchronize product and order system fields.</p>
            {setupComplete.systemFieldsSync ? (
              <span className="status-completed">Completed</span>
            ) : (
              <button
                className="setup-button"
                onClick={() =>
                  setSetupComplete({ ...setupComplete, systemFieldsSync: true })
                }
              >
                Sync Fields
              </button>
            )}
          </div>
        </div>

        <div
          className={`setup-step ${
            setupComplete.categoriesUpdated ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {setupComplete.categoriesUpdated ? (
              <CheckCircle size={24} />
            ) : (
              <span>7</span>
            )}
          </div>
          <div className="step-content">
            <h3>Update Product Categories</h3>
            <p>Create and update product categories.</p>
            {setupComplete.categoriesUpdated ? (
              <span className="status-completed">Completed</span>
            ) : (
              <button
                className="setup-button"
                onClick={() =>
                  setSetupComplete({
                    ...setupComplete,
                    categoriesUpdated: true,
                  })
                }
              >
                Update Categories
              </button>
            )}
          </div>
        </div>

        <div
          className={`setup-step ${
            setupComplete.complianceSet ? "completed" : ""
          }`}
        >
          <div className="step-number">
            {setupComplete.complianceSet ? (
              <CheckCircle size={24} />
            ) : (
              <span>8</span>
            )}
          </div>
          <div className="step-content">
            <h3>Set Compliance (Indian Businesses Only)</h3>
            <p>For Indian businesses, set business compliance information.</p>
            {setupComplete.complianceSet ? (
              <span className="status-completed">Completed</span>
            ) : (
              <button
                className="setup-button"
                onClick={() =>
                  setSetupComplete({ ...setupComplete, complianceSet: true })
                }
              >
                Set Compliance
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="products-tab">
      <div className="tab-actions">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </select>
          <Link to="/ecommerce/products/new" className="add-product-button">
            <PlusCircle size={18} />
            <span>Add Product</span>
          </Link>
          <button className="push-products-button">
            <Upload size={18} />
            <span>Push Products</span>
          </button>
          <button className="bulk-import-button">
            <Download size={18} />
            <span>Bulk Import</span>
          </button>
        </div>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sale Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Push Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.sku}</td>
                  <td className="product-name">
                    <span>{product.name}</span>
                    <span className="product-description">
                      {product.description}
                    </span>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    {product.currency} {product.price.toFixed(2)}
                  </td>
                  <td>
                    {product.salePrice
                      ? `${product.currency} ${product.salePrice.toFixed(2)}`
                      : "-"}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <span
                      className={`status-badge status-${product.status.toLowerCase()}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`push-status-badge ${product.pushStatus
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {product.pushStatus}
                    </span>
                  </td>
                  <td>
                    <div className="product-actions">
                      <button className="edit-button" title="Edit Product">
                        <Settings size={16} />
                      </button>
                      <button
                        className="view-button"
                        title="View in Meta Catalog"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-results">
                  No products found. Try a different search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="orders-tab">
      <div className="tab-actions">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <button className="filter-button">
            <Filter size={18} />
            <span>Filter</span>
          </button>
          <button className="refresh-button">
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.items}</td>
                  <td>
                    {order.currency} {order.total.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`payment-status ${order.payment.toLowerCase()}`}
                    >
                      {order.payment}
                    </span>
                  </td>
                  <td>
                    <div className="order-actions">
                      <button
                        className="view-button"
                        title="View Order Details"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No orders found. Try a different search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="categories-tab">
      <div className="tab-actions">
        <button className="add-category-button">
          <PlusCircle size={18} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="categories-grid">
        <div className="category-card">
          <div className="category-icon">
            <ShoppingBag size={24} />
          </div>
          <h3>Apparel</h3>
          <span className="category-count">12 products</span>
          <div className="category-actions">
            <button className="edit-button" title="Edit Category">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="category-card">
          <div className="category-icon">
            <Box size={24} />
          </div>
          <h3>Accessories</h3>
          <span className="category-count">8 products</span>
          <div className="category-actions">
            <button className="edit-button" title="Edit Category">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="category-card">
          <div className="category-icon">
            <ShoppingCart size={24} />
          </div>
          <h3>Homeware</h3>
          <span className="category-count">5 products</span>
          <div className="category-actions">
            <button className="edit-button" title="Edit Category">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="category-card">
          <div className="category-icon">
            <Database size={24} />
          </div>
          <h3>Electronics</h3>
          <span className="category-count">3 products</span>
          <div className="category-actions">
            <button className="edit-button" title="Edit Category">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="category-card">
          <div className="category-icon">
            <List size={24} />
          </div>
          <h3>Stationery</h3>
          <span className="category-count">7 products</span>
          <div className="category-actions">
            <button className="edit-button" title="Edit Category">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemFieldsTab = () => (
    <div className="system-fields-tab">
      <div className="tab-header">
        <h2>System Fields Configuration</h2>
        <p>
          Configure and sync system fields for your product catalog and orders.
        </p>
      </div>

      <div className="fields-types-tabs">
        <button className="fields-tab-button active">Product Fields</button>
        <button className="fields-tab-button">Order Fields</button>
      </div>

      <div className="system-fields-content">
        <div className="system-fields-actions">
          <button className="sync-fields-button">
            <RefreshCw size={18} />
            <span>Sync System Fields</span>
          </button>
        </div>

        <div className="system-fields-list">
          <div className="system-field-item">
            <div className="field-info">
              <h3>Brand</h3>
              <div className="field-attributes">
                <span className="field-type">Text</span>
                <span className="field-required">Required</span>
              </div>
            </div>
            <button className="edit-field-button">
              <Settings size={16} />
            </button>
          </div>

          <div className="system-field-item">
            <div className="field-info">
              <h3>Category</h3>
              <div className="field-attributes">
                <span className="field-type">Dropdown</span>
                <span className="field-required">Required</span>
              </div>
            </div>
            <button className="edit-field-button">
              <Settings size={16} />
            </button>
          </div>

          <div className="system-field-item">
            <div className="field-info">
              <h3>External Product Link</h3>
              <div className="field-attributes">
                <span className="field-type">URL</span>
                <span className="field-required">Required</span>
              </div>
            </div>
            <button className="edit-field-button">
              <Settings size={16} />
            </button>
          </div>

          <div className="system-field-item">
            <div className="field-info">
              <h3>Origin Country</h3>
              <div className="field-attributes">
                <span className="field-type">Text</span>
                <span className="field-required">
                  Required for Indian businesses
                </span>
              </div>
            </div>
            <button className="edit-field-button">
              <Settings size={16} />
            </button>
          </div>

          <div className="system-field-item">
            <div className="field-info">
              <h3>Importer Name</h3>
              <div className="field-attributes">
                <span className="field-type">Text</span>
                <span className="field-required">
                  Required for Indian businesses
                </span>
              </div>
            </div>
            <button className="edit-field-button">
              <Settings size={16} />
            </button>
          </div>

          <div className="system-field-item">
            <div className="field-info">
              <h3>WhatsApp Compliance Category</h3>
              <div className="field-attributes">
                <span className="field-type">Dropdown</span>
                <span className="field-required">
                  Required for Indian businesses
                </span>
              </div>
            </div>
            <button className="edit-field-button">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ecommerce-container">
      <div className="ecommerce-header">
        <h1>E-commerce Management</h1>
        <div className="ecommerce-stats">
          <div className="stat-card">
            <div className="stat-icon products-icon">
              <Tag size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Products</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orders-icon">
              <ShoppingBag size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{orders.length}</span>
              <span className="stat-label">Orders</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon revenue-icon">
              <ShoppingCart size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">$316.91</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon setup-icon">
              <Check size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">5/8</span>
              <span className="stat-label">Setup Steps</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ecommerce-tabs">
        <button
          className={`tab-button ${activeTab === "setup" ? "active" : ""}`}
          onClick={() => setActiveTab("setup")}
        >
          <Settings size={16} />
          <span>Setup Guide</span>
        </button>
        <button
          className={`tab-button ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <Tag size={16} />
          <span>Products</span>
        </button>
        <button
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <ShoppingBag size={16} />
          <span>Orders</span>
        </button>
        <button
          className={`tab-button ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          <List size={16} />
          <span>Categories</span>
        </button>
        <button
          className={`tab-button ${
            activeTab === "systemfields" ? "active" : ""
          }`}
          onClick={() => setActiveTab("systemfields")}
        >
          <Database size={16} />
          <span>System Fields</span>
        </button>
      </div>

      <div className="ecommerce-content">
        {activeTab === "setup" && renderSetupGuide()}
        {activeTab === "products" && renderProductsTab()}
        {activeTab === "orders" && renderOrdersTab()}
        {activeTab === "categories" && renderCategoriesTab()}
        {activeTab === "systemfields" && renderSystemFieldsTab()}
      </div>
    </div>
  );
};

export default Ecommerce;
