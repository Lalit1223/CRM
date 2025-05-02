// src/pages/AutomationBuilder/AutomationBuilder.jsx
import React, { useState } from "react";
import "./AutomationBuilder.css";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MessageSquare,
  Send,
  Table,
  ShoppingBag,
  ShoppingCart,
  Truck,
  PhoneMissed,
  CreditCard,
  Calendar,
  Gift,
  Users,
  MessageCircle,
} from "lucide-react";

const AutomationBuilder = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const automationTemplates = [
    {
      id: 1,
      title: "Trigger Workflow Via Inbound Messages",
      description:
        "Send WhatsApp messages when an inbound webhook is triggered",
      category: "messaging",
      icon: "MessageSquare",
    },
    {
      id: 2,
      title: "Create Drip Campaigns",
      description: "Schedule a series of messages to be sent over time",
      category: "marketing",
      icon: "Send",
    },
    {
      id: 3,
      title: "Trigger Automations from Google Sheet",
      description: "Send WhatsApp messages based on Google Sheet changes",
      category: "integration",
      icon: "Table",
    },
    {
      id: 4,
      title: "Send Message on New Order",
      description: "Notify customers when a new order is received in Shopify",
      category: "ecommerce",
      icon: "ShoppingBag",
    },
    {
      id: 5,
      title: "Recover Abandoned Carts",
      description: "Send WhatsApp follow-up for abandoned carts in Shopify",
      category: "ecommerce",
      icon: "ShoppingCart",
    },
    {
      id: 6,
      title: "Send Tracking Links to Customers",
      description: "Send order tracking information via WhatsApp",
      category: "ecommerce",
      icon: "Truck",
    },
    {
      id: 7,
      title: "Handle Missed Call Webhooks",
      description: "Trigger WhatsApp messages for missed calls",
      category: "integration",
      icon: "PhoneMissed",
    },
    {
      id: 8,
      title: "Stripe Payment Processing",
      description: "Process payments via Stripe integration",
      category: "payments",
      icon: "CreditCard",
    },
    {
      id: 9,
      title: "Send Payment Reminders",
      description: "Automate invoice reminders via WhatsApp",
      category: "finance",
      icon: "Calendar",
    },
    {
      id: 10,
      title: "Birthday and Anniversary Greetings",
      description: "Send automated greetings on special occasions",
      category: "marketing",
      icon: "Gift",
    },
    {
      id: 11,
      title: "Lead Generation from WhatsApp",
      description: "Collect and process leads from WhatsApp conversations",
      category: "marketing",
      icon: "Users",
    },
    {
      id: 12,
      title: "Customer Feedback Collection",
      description: "Automate feedback collection after purchase",
      category: "customer-service",
      icon: "MessageCircle",
    },
  ];

  const myAutomations = [
    {
      id: 101,
      title: "New Order Notification",
      description: "Sends WhatsApp notifications to customers on new orders",
      status: "active",
      lastRun: "2 hours ago",
      totalRuns: 156,
    },
    {
      id: 102,
      title: "Abandoned Cart Recovery",
      description: "Follows up on abandoned carts after 3 hours",
      status: "active",
      lastRun: "30 minutes ago",
      totalRuns: 89,
    },
    {
      id: 103,
      title: "Weekly Newsletter",
      description: "Sends weekly product updates to subscribed customers",
      status: "paused",
      lastRun: "5 days ago",
      totalRuns: 24,
    },
  ];

  const filteredTemplates = automationTemplates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAutomations = myAutomations.filter(
    (automation) =>
      automation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to render correct icon component
  const renderIcon = (iconName) => {
    // Map of icon name to component
    const iconMap = {
      MessageSquare,
      Send,
      Table,
      ShoppingBag,
      ShoppingCart,
      Truck,
      PhoneMissed,
      CreditCard,
      Calendar,
      Gift,
      Users,
      MessageCircle,
    };

    const IconComponent = iconMap[iconName];
    return IconComponent ? (
      <IconComponent size={24} className="template-icon" />
    ) : null;
  };

  return (
    <div className="automation-builder-container">
      <div className="automation-builder-header">
        <div className="left-section">
          <button className="back-button">
            <ArrowLeft size={20} />
          </button>
          <h1>Automation Builder</h1>
        </div>
        <div className="right-section">
          <Link to="/automation-builder/create" className="create-button">
            <Plus size={20} />
            <span>Create Automation</span>
          </Link>
        </div>
      </div>

      <div className="automation-tabs">
        <button
          className={`tab-button ${activeTab === "templates" ? "active" : ""}`}
          onClick={() => setActiveTab("templates")}
        >
          Templates
        </button>
        <button
          className={`tab-button ${
            activeTab === "my-automations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("my-automations")}
        >
          My Automations
        </button>
      </div>

      <div className="automation-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search automations..."
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

      {activeTab === "templates" && (
        <div className={`automation-templates ${viewMode}`}>
          {filteredTemplates.length === 0 ? (
            <div className="no-results">
              <p>No automation templates found. Try a different search term.</p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div className="template-card" key={template.id}>
                <div className="template-header">
                  {renderIcon(template.icon)}
                  <span className="template-category">{template.category}</span>
                </div>
                <h3 className="template-title">{template.title}</h3>
                <p className="template-description">{template.description}</p>
                <Link
                  to={`/automation-builder/create?template=${template.id}`}
                  className="use-template-button"
                >
                  Use Template
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "my-automations" && (
        <div className={`my-automations ${viewMode}`}>
          {filteredAutomations.length === 0 ? (
            <div className="no-results">
              <p>
                No automations found. Try a different search term or create a
                new automation.
              </p>
            </div>
          ) : (
            filteredAutomations.map((automation) => (
              <div className="automation-card" key={automation.id}>
                <div className="automation-status">
                  <span
                    className={`status-indicator ${automation.status}`}
                  ></span>
                  <span className="status-text">{automation.status}</span>
                </div>
                <h3 className="automation-title">{automation.title}</h3>
                <p className="automation-description">
                  {automation.description}
                </p>
                <div className="automation-stats">
                  <span className="stat">Last run: {automation.lastRun}</span>
                  <span className="stat">
                    Total runs: {automation.totalRuns}
                  </span>
                </div>
                <div className="automation-actions">
                  <Link
                    to={`/automation-builder/edit/${automation.id}`}
                    className="edit-button"
                  >
                    Edit
                  </Link>
                  <button className="toggle-button">
                    {automation.status === "active" ? "Pause" : "Activate"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AutomationBuilder;
