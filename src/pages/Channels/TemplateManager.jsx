// src/pages/Channels/TemplateManager.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TemplateManager.css";

const TemplateManager = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch templates on component mount
  useEffect(() => {
    // This would be an API call in production
    // Mock data for development
    setTimeout(() => {
      setTemplates([
        {
          id: 1,
          name: "welcome_message",
          category: "MARKETING",
          status: "APPROVED",
          language: "en_US",
          components: {
            header: { type: "TEXT", text: "Welcome!" },
            body: { text: "Hello {{1}}, welcome to our service!" },
            footer: { text: "Reply for more info" },
            buttons: [
              { type: "QUICK_REPLY", text: "Get Started" },
              { type: "QUICK_REPLY", text: "Learn More" },
            ],
          },
          createdAt: "2023-05-15T10:30:00Z",
        },
        {
          id: 2,
          name: "order_confirmation",
          category: "UTILITY",
          status: "APPROVED",
          language: "en_US",
          components: {
            header: { type: "TEXT", text: "Order Confirmed" },
            body: {
              text: "Your order #{{1}} has been confirmed and will be shipped on {{2}}.",
            },
            footer: { text: "Thank you for shopping with us!" },
            buttons: [
              { type: "QUICK_REPLY", text: "Track Order" },
              {
                type: "URL",
                text: "View Order",
                url: "https://example.com/orders/{{1}}",
              },
            ],
          },
          createdAt: "2023-06-22T15:45:00Z",
        },
        {
          id: 3,
          name: "appointment_reminder",
          category: "UTILITY",
          status: "PENDING",
          language: "en_US",
          components: {
            header: { type: "TEXT", text: "Appointment Reminder" },
            body: {
              text: "Reminder: You have an appointment scheduled for {{1}} at {{2}}. Please arrive 10 minutes early.",
            },
            footer: { text: "Reply CONFIRM to confirm your appointment" },
            buttons: [
              { type: "QUICK_REPLY", text: "Confirm" },
              { type: "QUICK_REPLY", text: "Reschedule" },
              { type: "QUICK_REPLY", text: "Cancel" },
            ],
          },
          createdAt: "2023-07-05T09:15:00Z",
        },
        {
          id: 4,
          name: "payment_reminder",
          category: "UTILITY",
          status: "REJECTED",
          language: "en_US",
          components: {
            header: { type: "TEXT", text: "Payment Due" },
            body: {
              text: "Your payment of {{1}} is due on {{2}}. Please ensure timely payment to avoid late fees.",
            },
            footer: { text: "Thank you for your business" },
            buttons: [
              {
                type: "URL",
                text: "Pay Now",
                url: "https://example.com/pay/{{3}}",
              },
            ],
          },
          createdAt: "2023-07-10T11:20:00Z",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter templates based on search and filters
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || template.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || template.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Navigate to template creation
  const handleCreateTemplate = () => {
    navigate("/channels/templates/create");
  };

  // Send test message using template
  const handleSendTestMessage = (templateId) => {
    navigate(`/channels/templates/${templateId}/test`);
  };

  // Edit template
  const handleEditTemplate = (templateId) => {
    navigate(`/channels/templates/${templateId}/edit`);
  };

  // Delete template
  const handleDeleteTemplate = (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      // API call to delete template would go here

      // Update UI after deletion
      setTemplates((prevTemplates) =>
        prevTemplates.filter((template) => template.id !== templateId)
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="template-manager-container">
      <div className="template-manager-header">
        <h1>Template Manager</h1>
        <button className="create-template-btn" onClick={handleCreateTemplate}>
          Create Template
        </button>
      </div>

      <div className="template-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-dropdowns">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="MARKETING">Marketing</option>
            <option value="UTILITY">Utility</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="CAROUSEL">Carousel</option>
            <option value="MPM">Multi-Product Message</option>
            <option value="LTO">Limited Time Offer</option>
            <option value="CATALOG">Catalog</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading templates...</p>
        </div>
      ) : (
        <div className="templates-list">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <div key={template.id} className="template-card">
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <span
                    className={`template-status ${template.status.toLowerCase()}`}
                  >
                    {template.status}
                  </span>
                  <div className="template-meta">
                    <span>Category: {template.category}</span>
                    <span>Language: {template.language}</span>
                    <span>Created: {formatDate(template.createdAt)}</span>
                  </div>
                  <p className="template-preview">
                    {template.components.body.text}
                  </p>
                </div>

                <div className="template-actions">
                  <button
                    onClick={() => handleSendTestMessage(template.id)}
                    className="test-template-btn"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template.id)}
                    className="edit-template-btn"
                    disabled={template.status === "PENDING"}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="delete-template-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-templates">
              <p>No templates found. Create your first template!</p>
            </div>
          )}
        </div>
      )}

      <div className="template-help">
        <h3>About WhatsApp Templates</h3>
        <p>
          WhatsApp templates are pre-approved message formats that allow you to
          send notifications outside the 24-hour messaging window.
        </p>
        <div className="template-tips">
          <h4>Tips for template approval:</h4>
          <ul>
            <li>Be clear and concise in your messaging</li>
            <li>Avoid promotional language in utility templates</li>
            <li>
              Include all necessary variables with placeholders like {"{"}
              {"{"}"1"{"}"}
              {"}"},", {"{"}
              {"{"}"2"{"}"}
              {"}"},", etc.
            </li>
            <li>Provide accurate example values for all variables</li>
            <li>Review WhatsApp's commerce policy before submission</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;
