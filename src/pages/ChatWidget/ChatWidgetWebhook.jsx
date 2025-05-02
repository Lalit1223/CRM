// src/pages/ChatWidget/ChatWidgetWebhook.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Plus, Trash2, CheckCircle } from "lucide-react";
import "./ChatWidgetWebhook.css";

const ChatWidgetWebhook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [widget, setWidget] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [newWebhook, setNewWebhook] = useState({
    url: "",
    triggerEvent: "form_submitted", // form_submitted, session_completed
    active: true,
  });

  useEffect(() => {
    fetchWidgetDetails();
    fetchWebhooks();
  }, [id]);

  const fetchWidgetDetails = async () => {
    try {
      // In a real app, this would be an API call
      const mockWidget = {
        id: parseInt(id),
        name: "Store Support Widget",
        domain: "mystore.com",
      };

      setTimeout(() => {
        setWidget(mockWidget);
      }, 500);
    } catch (error) {
      console.error("Error fetching widget details:", error);
    }
  };

  const fetchWebhooks = async () => {
    try {
      // In a real app, this would be an API call
      const mockWebhooks = [
        {
          id: 1,
          url: "https://example.com/webhooks/chatwidget",
          triggerEvent: "form_submitted",
          active: true,
          createdAt: "2025-03-20T14:30:00",
        },
      ];

      setTimeout(() => {
        setWebhooks(mockWebhooks);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
      setIsLoading(false);
    }
  };

  const handleNewWebhookChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewWebhook({
      ...newWebhook,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddWebhook = () => {
    if (!newWebhook.url) {
      alert("Please enter a webhook URL");
      return;
    }

    const webhook = {
      id: Date.now(),
      ...newWebhook,
      createdAt: new Date().toISOString(),
    };

    setWebhooks([...webhooks, webhook]);
    setNewWebhook({
      url: "",
      triggerEvent: "form_submitted",
      active: true,
    });
  };

  const handleDeleteWebhook = (webhookId) => {
    if (window.confirm("Are you sure you want to delete this webhook?")) {
      setWebhooks(webhooks.filter((wh) => wh.id !== webhookId));
    }
  };

  const handleToggleStatus = (webhookId) => {
    setWebhooks(
      webhooks.map((wh) =>
        wh.id === webhookId ? { ...wh, active: !wh.active } : wh
      )
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="chat-widget-webhook-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading webhook configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-widget-webhook-container">
      <div className="webhook-header">
        <button
          className="back-button"
          onClick={() => navigate("/chat-widget")}
        >
          <ChevronLeft size={18} />
          <span>Back to Widgets</span>
        </button>
        <h1>Webhook Configuration</h1>
      </div>

      <div className="widget-details">
        <h2>{widget.name}</h2>
        <div className="widget-domain">{widget.domain}</div>
      </div>

      <div className="webhook-info-card">
        <div className="info-icon">
          <CheckCircle size={24} />
        </div>
        <div className="info-content">
          <h3>About Webhooks</h3>
          <p>
            Webhooks allow you to send pre-chat form data to external systems or
            your automation builder. When a visitor submits the pre-chat form or
            when a chat session completes, the data will be sent to the URL you
            specify.
          </p>
        </div>
      </div>

      <div className="webhook-form-container">
        <h3>Add Webhook</h3>
        <div className="webhook-form">
          <div className="form-group">
            <label htmlFor="url">Webhook URL</label>
            <input
              type="text"
              id="url"
              name="url"
              value={newWebhook.url}
              onChange={handleNewWebhookChange}
              placeholder="https://example.com/webhook"
              required
            />
            <span className="field-hint">
              Enter the URL that will receive the webhook data
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="triggerEvent">Trigger Event</label>
            <select
              id="triggerEvent"
              name="triggerEvent"
              value={newWebhook.triggerEvent}
              onChange={handleNewWebhookChange}
            >
              <option value="form_submitted">
                When Pre-Chat Form is Submitted
              </option>
              <option value="session_completed">
                When Chat Session Completes
              </option>
            </select>
            <span className="field-hint">
              Choose when to send the webhook data
            </span>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={newWebhook.active}
              onChange={handleNewWebhookChange}
            />
            <label htmlFor="active">Active</label>
          </div>

          <button className="add-webhook-button" onClick={handleAddWebhook}>
            <Plus size={18} />
            <span>Add Webhook</span>
          </button>
        </div>
      </div>

      {webhooks.length > 0 ? (
        <div className="webhooks-table-container">
          <h3>Configured Webhooks</h3>
          <table className="webhooks-table">
            <thead>
              <tr>
                <th>Webhook URL</th>
                <th>Trigger Event</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((webhook) => (
                <tr key={webhook.id}>
                  <td className="webhook-url">{webhook.url}</td>
                  <td>
                    {webhook.triggerEvent === "form_submitted"
                      ? "Pre-Chat Form Submission"
                      : "Session Completion"}
                  </td>
                  <td>
                    <div className="toggle-container">
                      <input
                        type="checkbox"
                        id={`toggle-${webhook.id}`}
                        className="toggle-input"
                        checked={webhook.active}
                        onChange={() => handleToggleStatus(webhook.id)}
                      />
                      <label
                        htmlFor={`toggle-${webhook.id}`}
                        className="toggle-label"
                      ></label>
                    </div>
                  </td>
                  <td>{formatDate(webhook.createdAt)}</td>
                  <td>
                    <button
                      className="delete-webhook-button"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-webhooks">
          <p>No webhooks configured yet. Add your first webhook above.</p>
        </div>
      )}

      <div className="webhook-data-preview">
        <h3>Sample Webhook Payload</h3>
        <div className="code-container">
          <pre>
            <code>
              {`{
  "event": "form_submitted",
  "widget_id": ${id},
  "widget_name": "${widget.name}",
  "timestamp": "${new Date().toISOString()}",
  "visitor": {
    "ip": "192.168.1.1",
    "url": "https://${widget.domain}/products/1234",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
  },
  "form_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "custom_field": "Custom response"
  }
}`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetWebhook;
