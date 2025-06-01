// src/pages/WorkflowBuilder/components/WorkflowProperties.jsx
import React, { useState, useEffect } from "react";
import { Settings, X, Edit, Link } from "lucide-react";
import { NODE_TYPES } from "../../../types/workflow";

const WorkflowProperties = ({ node, workflow, onUpdateNode, onClose }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (node) {
      const workflowNode = workflow.nodes.find((n) => n.nodeId === node.id);
      setSelectedNode(workflowNode);
    }
  }, [node, workflow.nodes]);

  if (!selectedNode) return null;

  const nodeConfig = NODE_TYPES[selectedNode.type] || NODE_TYPES.message;

  const handleQuickEdit = (field, value) => {
    const updatedNode = { ...selectedNode, [field]: value };
    setSelectedNode(updatedNode);
    onUpdateNode(updatedNode);
  };

  const getAvailableNodes = () => {
    return workflow.nodes.filter((n) => n.nodeId !== selectedNode.nodeId);
  };

  return (
    <div className="workflow-properties">
      <div className="properties-header">
        <div className="header-title">
          <Settings className="w-4 h-4" />
          <span>Node Properties</span>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="properties-content">
        <div className="node-overview">
          <div className={`node-icon ${nodeConfig.color}`}>
            <span>{nodeConfig.label[0]}</span>
          </div>
          <div className="node-info">
            <h3>{selectedNode.name}</h3>
            <p>{nodeConfig.label}</p>
          </div>
        </div>

        <div className="properties-sections">
          <div className="property-section">
            <h4>Basic Information</h4>

            <div className="property-group">
              <label>Node Name</label>
              <input
                type="text"
                value={selectedNode.name || ""}
                onChange={(e) => handleQuickEdit("name", e.target.value)}
                className="property-input"
              />
            </div>

            <div className="property-group">
              <label>Node ID</label>
              <input
                type="text"
                value={selectedNode.nodeId}
                disabled
                className="property-input readonly"
              />
            </div>

            <div className="property-group">
              <label>Node Type</label>
              <div className="type-display">
                <span className="type-badge">{nodeConfig.label}</span>
              </div>
            </div>
          </div>

          <div className="property-section">
            <h4>Position</h4>

            <div className="position-controls">
              <div className="position-input">
                <label>X</label>
                <input
                  type="number"
                  value={Math.round(node.position?.x || 0)}
                  onChange={(e) => {
                    const newPosition = {
                      ...selectedNode.position,
                      x: parseInt(e.target.value) || 0,
                    };
                    handleQuickEdit("position", newPosition);
                  }}
                  className="property-input small"
                />
              </div>
              <div className="position-input">
                <label>Y</label>
                <input
                  type="number"
                  value={Math.round(node.position?.y || 0)}
                  onChange={(e) => {
                    const newPosition = {
                      ...selectedNode.position,
                      y: parseInt(e.target.value) || 0,
                    };
                    handleQuickEdit("position", newPosition);
                  }}
                  className="property-input small"
                />
              </div>
            </div>
          </div>

          <div className="property-section">
            <h4>Connections</h4>

            {selectedNode.type !== "end" && (
              <div className="property-group">
                <label>Next Node</label>
                <select
                  value={selectedNode.nextNodeId || ""}
                  onChange={(e) =>
                    handleQuickEdit("nextNodeId", e.target.value || null)
                  }
                  className="property-select"
                >
                  <option value="">No connection</option>
                  {getAvailableNodes().map((node) => (
                    <option key={node.nodeId} value={node.nodeId}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedNode.type === "condition" && (
              <>
                <div className="property-group">
                  <label>True Branch</label>
                  <select
                    value={selectedNode.trueNodeId || ""}
                    onChange={(e) =>
                      handleQuickEdit("trueNodeId", e.target.value || null)
                    }
                    className="property-select"
                  >
                    <option value="">No connection</option>
                    {getAvailableNodes().map((node) => (
                      <option key={node.nodeId} value={node.nodeId}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="property-group">
                  <label>False Branch</label>
                  <select
                    value={selectedNode.falseNodeId || ""}
                    onChange={(e) =>
                      handleQuickEdit("falseNodeId", e.target.value || null)
                    }
                    className="property-select"
                  >
                    <option value="">No connection</option>
                    {getAvailableNodes().map((node) => (
                      <option key={node.nodeId} value={node.nodeId}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {selectedNode.type === "api" && (
              <div className="property-group">
                <label>Error Node</label>
                <select
                  value={selectedNode.errorNodeId || ""}
                  onChange={(e) =>
                    handleQuickEdit("errorNodeId", e.target.value || null)
                  }
                  className="property-select"
                >
                  <option value="">No error handling</option>
                  {getAvailableNodes().map((node) => (
                    <option key={node.nodeId} value={node.nodeId}>
                      {node.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="property-section">
            <h4>Content Preview</h4>

            {selectedNode.type === "message" && (
              <div className="content-preview">
                <p>{selectedNode.content || "No content"}</p>
              </div>
            )}

            {selectedNode.type === "input" && (
              <div className="content-preview">
                <p>
                  <strong>Prompt:</strong> {selectedNode.content || "No prompt"}
                </p>
                <p>
                  <strong>Variable:</strong>{" "}
                  {selectedNode.variableName || "Not set"}
                </p>
              </div>
            )}

            {selectedNode.type === "condition" && (
              <div className="content-preview">
                <p>
                  <strong>Condition:</strong>{" "}
                  {selectedNode.condition || "Not set"}
                </p>
              </div>
            )}

            {selectedNode.type === "api" && (
              <div className="content-preview">
                <p>
                  <strong>Method:</strong> {selectedNode.apiMethod || "POST"}
                </p>
                <p>
                  <strong>Endpoint:</strong>{" "}
                  {selectedNode.apiEndpoint || "Not set"}
                </p>
                {selectedNode.surePassConfig && (
                  <div className="surepass-info">
                    <p>
                      <strong>SurePass:</strong>{" "}
                      {selectedNode.surePassConfig.endpointName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedNode.type === "interactive" && (
              <div className="content-preview">
                <p>
                  <strong>Options:</strong>
                </p>
                <ul>
                  {(selectedNode.options || []).map((option, index) => (
                    <li key={index}>
                      {option.text} → {option.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedNode.type === "delay" && (
              <div className="content-preview">
                <p>
                  <strong>Duration:</strong> {selectedNode.delay || 1} seconds
                </p>
              </div>
            )}
          </div>

          <div className="property-section">
            <h4>Workflow Information</h4>

            <div className="workflow-stats">
              <div className="stat-item">
                <span className="stat-label">Total Nodes:</span>
                <span className="stat-value">{workflow.nodes.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Start Node:</span>
                <span className="stat-value">
                  {workflow.startNodeId
                    ? workflow.nodes.find(
                        (n) => n.nodeId === workflow.startNodeId
                      )?.name || "Unknown"
                    : "Not set"}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Category:</span>
                <span className="stat-value">
                  {workflow.category || "General"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="properties-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              // This would open the full node editor
              //   console.log("Open full editor for node:", selectedNode.nodeId);
            }}
          >
            <Edit className="w-4 h-4" />
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowProperties;
