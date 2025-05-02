// src/pages/ChatWidget/ChatWidget.jsx
import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Database,
  Webhook,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ChatWidget.css";

const ChatWidget = () => {
  const [widgets, setWidgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch widgets data
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    // Simulate API call with mock data
    const mockWidgets = [
      {
        id: 1,
        name: "Store Support Widget",
        category: "Support",
        domain: "mystore.com",
        destination: "WhatsApp Number",
        destinationValue: "+1234567890",
        active: true,
        createdAt: "2025-03-15T09:30:00",
        leads: 24,
      },
      {
        id: 2,
        name: "Product Inquiry",
        category: "Sales",
        domain: "myproducts.net",
        destination: "WhatsApp Channel",
        destinationValue: "Sales Team",
        active: true,
        createdAt: "2025-03-18T14:45:00",
        leads: 37,
      },
      {
        id: 3,
        name: "Feedback Form",
        category: "Feedback",
        domain: "feedbackportal.org",
        destination: "Chat Widget Only",
        destinationValue: null,
        active: false,
        createdAt: "2025-03-20T11:15:00",
        leads: 12,
      },
    ];

    // Simulate loading time
    setTimeout(() => {
      setWidgets(mockWidgets);
      setIsLoading(false);
    }, 800);
  };

  const handleToggleStatus = (id) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, active: !widget.active } : widget
      )
    );
  };

  const handleDeleteWidget = (id) => {
    if (window.confirm("Are you sure you want to delete this widget?")) {
      setWidgets(widgets.filter((widget) => widget.id !== id));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="chat-widget-container">
      <div className="chat-widget-header">
        <h1>Chat Widgets</h1>
        <Link to="/chat-widget/create" className="create-widget-button">
          <PlusCircle size={18} />
          <span>Create New Widget</span>
        </Link>
      </div>

      <div className="widgets-info-card">
        <div className="info-item">
          <h3>What are Chat Widgets?</h3>
          <p>
            Chat widgets allow your website visitors to initiate WhatsApp
            conversations with your business directly from your website. You can
            customize the appearance, add pre-chat forms to collect leads, and
            route chats to specific destinations.
          </p>
        </div>
        <div className="info-item">
          <h3>Getting Started</h3>
          <ol>
            <li>Create a new widget and customize its appearance</li>
            <li>Set up pre-chat forms to collect visitor information</li>
            <li>Copy the generated code to your website</li>
            <li>Start collecting leads and engaging with visitors</li>
          </ol>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading widgets...</p>
        </div>
      ) : widgets.length > 0 ? (
        <div className="widgets-table-container">
          <table className="widgets-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Domain</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Created</th>
                <th>Leads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {widgets.map((widget) => (
                <tr key={widget.id}>
                  <td>{widget.name}</td>
                  <td>{widget.category}</td>
                  <td>{widget.domain}</td>
                  <td>
                    <div className="destination-info">
                      <span className="destination-type">
                        {widget.destination}
                      </span>
                      {widget.destinationValue && (
                        <span className="destination-value">
                          {widget.destinationValue}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="toggle-container">
                      <input
                        type="checkbox"
                        id={`toggle-${widget.id}`}
                        className="toggle-input"
                        checked={widget.active}
                        onChange={() => handleToggleStatus(widget.id)}
                      />
                      <label
                        htmlFor={`toggle-${widget.id}`}
                        className="toggle-label"
                      ></label>
                    </div>
                  </td>
                  <td>{formatDate(widget.createdAt)}</td>
                  <td>
                    <span className="leads-count">{widget.leads}</span>
                  </td>
                  <td>
                    <div className="widget-actions">
                      <button className="action-btn" title="View Leads">
                        <Database size={16} />
                      </button>
                      <button className="action-btn" title="Setup Webhook">
                        <Webhook size={16} />
                      </button>
                      <button className="action-btn" title="Get Embed Code">
                        <Copy size={16} />
                      </button>
                      <Link
                        to={`/chat-widget/edit/${widget.id}`}
                        className="action-btn"
                        title="Edit Widget"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        className="action-btn delete-btn"
                        title="Delete Widget"
                        onClick={() => handleDeleteWidget(widget.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                      <a
                        href={`https://${widget.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn"
                        title="Visit Site"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-widgets">
          <div className="no-data-message">
            <div className="icon-container">
              <PlusCircle size={48} />
            </div>
            <h3>No widgets created yet</h3>
            <p>
              Create your first chat widget to help website visitors connect
              with you on WhatsApp.
            </p>
            <Link
              to="/chat-widget/create"
              className="create-first-widget-button"
            >
              Create Your First Widget
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
