// src/pages/BotBuilder/components/BotBuilderSidebar.jsx
import React, { useState } from "react";

const BotBuilderSidebar = ({
  activeTrigger,
  onTriggerChange,
  savedWorkflows = [],
  onLoadWorkflow,
}) => {
  const [showSavedWorkflows, setShowSavedWorkflows] = useState(false);

  const nodeTypes = [
    { type: "messageNode", name: "Send Message" },
    { type: "questionNode", name: "Ask a Question" },
    { type: "routerNode", name: "Router" },
    { type: "assignNode", name: "Assign to Agent" },
    { type: "webhookNode", name: "API Request" },
    { type: "googleSheetNode", name: "Google Sheet Lookup" },
    { type: "stayInSessionNode", name: "Stay In Session" },
  ];

  const triggerTypes = [
    "New Message Received",
    "Message Match Keyword Condition",
    "Hot Keyword",
    "Inbound Webhook Trigger",
    "Click to WhatsApp Ads",
  ];

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bot-builder-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${!showSavedWorkflows ? "active" : ""}`}
          onClick={() => setShowSavedWorkflows(false)}
        >
          Builder
        </button>
        <button
          className={`sidebar-tab ${showSavedWorkflows ? "active" : ""}`}
          onClick={() => setShowSavedWorkflows(true)}
        >
          Saved Flows
        </button>
      </div>

      {!showSavedWorkflows ? (
        <>
          <div className="sidebar-section">
            <h3>Trigger Type</h3>
            <select
              value={activeTrigger}
              onChange={(e) => onTriggerChange(e.target.value)}
              className="trigger-select"
            >
              {triggerTypes.map((trigger) => (
                <option key={trigger} value={trigger}>
                  {trigger}
                </option>
              ))}
            </select>

            {activeTrigger === "Message Match Keyword Condition" && (
              <div className="trigger-options">
                <label>Keywords (separated by comma)</label>
                <input type="text" placeholder="hello, hi, hey" />
              </div>
            )}

            {activeTrigger === "Hot Keyword" && (
              <div className="trigger-options">
                <label>Hot Keywords (separated by comma)</label>
                <input type="text" placeholder="urgent, help, support" />
              </div>
            )}

            {activeTrigger === "Inbound Webhook Trigger" && (
              <div className="trigger-options">
                <label>Webhook URL</label>
                <input
                  type="text"
                  disabled
                  value="https://api.example.com/webhook/XYZ123"
                />
                <button className="copy-button">Copy URL</button>
              </div>
            )}

            {activeTrigger === "Click to WhatsApp Ads" && (
              <div className="trigger-options">
                <label>Facebook Ad ID</label>
                <input type="text" placeholder="Enter Facebook Ad ID" />
              </div>
            )}
          </div>

          <div className="sidebar-section">
            <h3>Bot Nodes</h3>
            <div className="node-list">
              {nodeTypes.map((node) => (
                <div
                  key={node.type}
                  className="draggable-node"
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type)}
                >
                  {node.name}
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Tips</h3>
            <ul className="tips-list">
              <li>Drag nodes from the sidebar into the canvas</li>
              <li>Connect nodes by dragging from one handle to another</li>
              <li>Click on a node to edit its properties</li>
              <li>Test your bot with the simulation tool</li>
            </ul>
          </div>
        </>
      ) : (
        <div className="sidebar-section saved-workflows">
          <h3>Saved Bot Flows</h3>
          {savedWorkflows.length === 0 ? (
            <div className="no-workflows">
              No saved workflows yet. Build and save your bot flow to see it
              here.
            </div>
          ) : (
            <div className="workflow-list">
              {savedWorkflows.map((workflow) => (
                <div key={workflow.id} className="workflow-item">
                  <div className="workflow-info">
                    <div className="workflow-name">{workflow.name}</div>
                    <div className="workflow-trigger">
                      Trigger: {workflow.trigger || "Unknown"}
                    </div>
                    <div className="workflow-date">
                      Created: {formatDate(workflow.timestamp)}
                    </div>
                    <div
                      className={`workflow-status ${
                        workflow.enabled ? "enabled" : "disabled"
                      }`}
                    >
                      {workflow.enabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                  <div className="workflow-actions">
                    <button
                      className="load-button"
                      onClick={() => onLoadWorkflow(workflow.id)}
                    >
                      Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BotBuilderSidebar;
