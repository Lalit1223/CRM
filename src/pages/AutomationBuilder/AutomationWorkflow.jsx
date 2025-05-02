// src/pages/AutomationBuilder/AutomationWorkflow.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  PlayCircle,
  Settings,
  Plus,
  Trash2,
  ChevronDown,
  MessageCircle,
  Globe,
  Table,
  CheckSquare,
  GitBranch,
  Clock,
} from "lucide-react";
import "./AutomationWorkflow.css";

const AutomationWorkflow = () => {
  const [automationName, setAutomationName] = useState("New Automation");
  const [isSaving, setIsSaving] = useState(false);
  const [showTriggerOptions, setShowTriggerOptions] = useState(false);

  const triggerTypes = [
    {
      id: "webhook",
      name: "Webhook",
      description: "Trigger when a webhook is received",
    },
    {
      id: "googleSheet",
      name: "Google Sheet",
      description: "Trigger on Google Sheet changes",
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "Trigger on Shopify events",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Trigger on WhatsApp events",
    },
    { id: "schedule", name: "Schedule", description: "Trigger on a schedule" },
  ];

  const actionTypes = [
    { id: "sendMessage", name: "Send WhatsApp Message", icon: MessageCircle },
    { id: "makeApiCall", name: "Make API Call", icon: Globe },
    { id: "updateSheet", name: "Update Google Sheet", icon: Table },
    { id: "createTask", name: "Create Task", icon: CheckSquare },
    { id: "conditional", name: "Conditional Logic", icon: GitBranch },
    { id: "delay", name: "Add Delay", icon: Clock },
  ];

  const handleSave = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Automation saved successfully!");
    }, 1000);
  };

  const handleTest = () => {
    alert("Test mode: This would run your automation with test data");
  };

  return (
    <div className="automation-workflow-container">
      <div className="workflow-header">
        <div className="left-section">
          <Link to="/automation-builder" className="back-button">
            <ArrowLeft size={20} />
          </Link>
          <input
            type="text"
            className="automation-name-input"
            value={automationName}
            onChange={(e) => setAutomationName(e.target.value)}
          />
        </div>
        <div className="right-section">
          <button className="settings-button">
            <Settings size={18} />
          </button>
          <button className="test-button" onClick={handleTest}>
            <PlayCircle size={18} />
            <span>Test</span>
          </button>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={18} />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>

      <div className="workflow-editor">
        <div className="workflow-sidebar">
          <div className="sidebar-section">
            <h3>Actions</h3>
            <div className="action-list">
              {actionTypes.map((action) => (
                <div className="action-item" key={action.id} draggable>
                  <div className="action-icon">
                    <action.icon size={18} />
                  </div>
                  <span>{action.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="workflow-canvas">
          <div className="workflow-steps">
            <div className="workflow-step trigger">
              <div
                className="step-header"
                onClick={() => setShowTriggerOptions(!showTriggerOptions)}
              >
                <span>Select a Trigger</span>
                <ChevronDown
                  size={18}
                  className={showTriggerOptions ? "rotate" : ""}
                />
              </div>

              {showTriggerOptions && (
                <div className="trigger-options">
                  {triggerTypes.map((trigger) => (
                    <div className="trigger-option" key={trigger.id}>
                      <div className="trigger-name">{trigger.name}</div>
                      <div className="trigger-description">
                        {trigger.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="connector">
              <div className="connector-line"></div>
            </div>

            <div className="workflow-step empty-step">
              <div className="empty-step-content">
                <Plus size={24} className="plus-icon" />
                <p>Drag and drop actions here</p>
                <span>or</span>
                <button className="add-action-button">Add Action</button>
              </div>
            </div>
          </div>
        </div>

        <div className="workflow-properties">
          <div className="properties-header">
            <h3>Properties</h3>
          </div>
          <div className="properties-content">
            <div className="property-placeholder">
              <p>Select a step to view and edit its properties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationWorkflow;
