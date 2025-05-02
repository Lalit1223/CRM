import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import "./WhatsAppMiniApps.css";

const WhatsAppMiniApps = () => {
  const [activeTab, setActiveTab] = useState("my-flows");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for flows
  const sampleFlows = [
    {
      id: 1,
      title: "Customer Feedback Survey",
      description: "A simple flow to collect product feedback from customers",
      screens: 4,
      status: "published",
      lastEdited: "2023-12-15",
      usageCount: 243,
    },
    {
      id: 2,
      title: "Product Registration Form",
      description:
        "Form for customers to register new products and activate warranty",
      screens: 6,
      status: "draft",
      lastEdited: "2023-12-18",
      usageCount: 0,
    },
    {
      id: 3,
      title: "Event Registration",
      description:
        "Registration flow for upcoming online workshop with payment calculation",
      screens: 8,
      status: "published",
      lastEdited: "2023-12-10",
      usageCount: 156,
    },
    {
      id: 4,
      title: "Order Customization",
      description: "Flow for customers to customize their orders with options",
      screens: 5,
      status: "draft",
      lastEdited: "2023-12-20",
      usageCount: 0,
    },
  ];

  // Sample templates
  const templates = [
    {
      id: 101,
      title: "Basic Feedback Form",
      description: "Simple feedback collection with rating and comments",
      category: "Feedback",
      screens: 3,
    },
    {
      id: 102,
      title: "Product Registration",
      description: "Template for customer product registration",
      category: "Registration",
      screens: 4,
    },
    {
      id: 103,
      title: "Event RSVP",
      description: "RSVP form for events with attendee information",
      category: "Events",
      screens: 5,
    },
    {
      id: 104,
      title: "Customer Satisfaction Survey",
      description: "Detailed survey to measure customer satisfaction",
      category: "Feedback",
      screens: 7,
    },
    {
      id: 105,
      title: "Order Customization",
      description: "Flow for product customization and ordering",
      category: "Orders",
      screens: 6,
    },
    {
      id: 106,
      title: "User Onboarding",
      description: "Guide new users through account setup",
      category: "Onboarding",
      screens: 4,
    },
  ];

  // Filter flows based on search query
  const filteredFlows = sampleFlows.filter(
    (flow) =>
      flow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "#25D366";
      case "draft":
        return "#FFC107";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="whatsapp-miniapps-container">
      <div className="miniapps-header">
        <div className="left-section">
          <button className="back-button">
            <ArrowLeft size={20} />
          </button>
          <h1>WhatsApp Mini Apps</h1>
        </div>
        <div className="right-section">
          <Link to="/whatsapp-miniapps/create" className="create-button">
            <Plus size={20} />
            <span>Create Flow</span>
          </Link>
        </div>
      </div>

      <div className="miniapps-tabs">
        <button
          className={`tab-button ${activeTab === "my-flows" ? "active" : ""}`}
          onClick={() => setActiveTab("my-flows")}
        >
          My Flows
        </button>
        <button
          className={`tab-button ${activeTab === "templates" ? "active" : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          Templates
        </button>
      </div>

      <div className="miniapps-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder={
              activeTab === "my-flows"
                ? "Search flows..."
                : "Search templates..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <button className="filter-button">
            <Filter size={20} />
            <span>Filter</span>
          </button>
          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={20} />
            </button>
            <button
              className={`view-button ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* My Flows Tab */}
      {activeTab === "my-flows" && (
        <div className={`miniapps-flows ${viewMode}`}>
          {filteredFlows.length === 0 ? (
            <div className="no-results">
              <p>
                No flows found. Try a different search term or create a new
                flow.
              </p>
            </div>
          ) : (
            filteredFlows.map((flow) => (
              <div className="flow-card" key={flow.id}>
                <div className="flow-header">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(flow.status) }}
                  >
                    {flow.status}
                  </span>
                  <span className="screens-count">{flow.screens} screens</span>
                </div>
                <h3 className="flow-title">{flow.title}</h3>
                <p className="flow-description">{flow.description}</p>
                <div className="flow-stats">
                  <span className="stat">Last edited: {flow.lastEdited}</span>
                  {flow.status === "published" && (
                    <span className="stat">Usage: {flow.usageCount}</span>
                  )}
                </div>
                <div className="flow-actions">
                  {flow.status === "draft" ? (
                    <Link
                      to={`/whatsapp-miniapps/edit/${flow.id}`}
                      className="edit-button"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </Link>
                  ) : (
                    <Link
                      to={`/whatsapp-miniapps/view/${flow.id}`}
                      className="view-button"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </Link>
                  )}
                  <button className="duplicate-button">
                    <Copy size={16} />
                    <span>Duplicate</span>
                  </button>
                  <button className="delete-button">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className={`miniapps-templates ${viewMode}`}>
          {filteredTemplates.length === 0 ? (
            <div className="no-results">
              <p>No templates found. Try a different search term.</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div className="template-card" key={template.id}>
                <div className="template-header">
                  <span className="template-category">{template.category}</span>
                  <span className="screens-count">
                    {template.screens} screens
                  </span>
                </div>
                <h3 className="template-title">{template.title}</h3>
                <p className="template-description">{template.description}</p>
                <Link
                  to={`/whatsapp-miniapps/create?template=${template.id}`}
                  className="use-template-button"
                >
                  Use Template
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Help information at the bottom */}
      <div className="help-section">
        <h3>How to Create WhatsApp Mini Apps / Native Flows</h3>
        <ol>
          <li>
            Click on <strong>Create Flow</strong> to design a new mini app
          </li>
          <li>
            Add multiple screens with components like text fields, dropdowns,
            and buttons
          </li>
          <li>Configure routing between screens and set conditions</li>
          <li>
            Save as draft to test or publish to make available for templates
          </li>
          <li>
            Use with Bot Builder to send forms and collect data in your CRM
          </li>
        </ol>
        <p>
          <strong>Note:</strong> Published flows cannot be edited. Test
          thoroughly before publishing.
        </p>
      </div>
    </div>
  );
};

export default WhatsAppMiniApps;
