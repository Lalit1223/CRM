import React from "react";
import {
  MessageSquare,
  Terminal,
  GitBranch,
  Database,
  Play,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

// Define node types with colors and descriptions
const nodeTypePalette = [
  {
    type: "messageNode",
    icon: <MessageSquare size={16} />,
    color: "#818cf8",
    label: "Message",
    description: "Send a message to the user",
  },
  {
    type: "inputNode",
    icon: <Terminal size={16} />,
    color: "#6366f1",
    label: "Question",
    description: "Ask a question with buttons",
  },
  {
    type: "conditionNode",
    icon: <GitBranch size={16} />,
    color: "#f59e0b",
    label: "Condition",
    description: "Branch based on conditions",
  },
  {
    type: "apiNode",
    icon: <Database size={16} />,
    color: "#10b981",
    label: "API Request",
    description: "Call external API",
  },
  {
    type: "endNode",
    icon: <CheckCircle size={16} />,
    color: "#ef4444",
    label: "End",
    description: "End the workflow",
  },
];

// Trigger types
const triggerTypes = [
  "New Message Received",
  "Message Match Keyword",
  "Hot Keyword",
  "Inbound Webhook",
  "Click to WhatsApp Ads",
];

const FlowEditorSidebar = ({
  activeTrigger,
  onTriggerChange,
  showSidePanel,
  setShowSidePanel,
}) => {
  // Handle dragging a node from the palette
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={`editor-sidebar ${!showSidePanel ? "hidden" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">Node Palette</div>
        <div className="sidebar-description">Drag nodes to the canvas</div>
        <button
          className="sidebar-close"
          onClick={() => setShowSidePanel(false)}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="sidebar-content">
        <div className="nodes-palette">
          <div className="palette-section">
            <div className="palette-section-title">Flow Nodes</div>
            {nodeTypePalette.map((node) => (
              <div
                key={node.type}
                className="palette-item"
                draggable
                onDragStart={(e) => onDragStart(e, node.type)}
              >
                <div
                  className="palette-item-icon"
                  style={{
                    backgroundColor: `${node.color}20`,
                    color: node.color,
                  }}
                >
                  {node.icon}
                </div>
                <div className="palette-item-info">
                  <div className="palette-item-title">{node.label}</div>
                  <div className="palette-item-description">
                    {node.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="trigger-settings">
            <div className="trigger-label">Trigger Type</div>
            <select
              className="trigger-select"
              value={activeTrigger}
              onChange={(e) => onTriggerChange(e.target.value)}
            >
              {triggerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {activeTrigger === "Message Match Keyword" && (
              <div className="trigger-keywords">
                <div className="trigger-label">Keywords</div>
                <input
                  type="text"
                  className="trigger-input"
                  placeholder="Enter keywords separated by commas"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowEditorSidebar;
