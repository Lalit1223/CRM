// src/pages/BotBuilder/components/nodes/ApiNode.jsx
import React from "react";
import * as Icons from "lucide-react";
import { getNodeTypeById } from "../../constants/nodeTypes";
import NodeConnector from "../shared/NodeConnector";

const ApiNode = ({
  node,
  isSelected,
  onSelect,
  onRemove,
  onStartConnection,
  onCompleteConnection,
}) => {
  // Get node type information
  const nodeType = getNodeTypeById(node.type);

  // Helper to render icons
  const renderIcon = (iconName, size = 16) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={size} strokeWidth={2} /> : null;
  };

  // Format API details for display
  const formatApiDetails = () => {
    if (!node.data.apiDetails) return "No API details";

    const { method, url } = node.data.apiDetails;
    return `${method || "GET"} ${url || "https://api.example.com"}`;
  };

  return (
    <div
      className={`canvas-node ${isSelected ? "selected" : ""}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        borderTop: `3px solid ${nodeType.color}`,
      }}
      onClick={onSelect}
    >
      <div
        className="node-header"
        style={{ backgroundColor: nodeType.color + "10" }}
      >
        <div
          className="node-icon-small"
          style={{
            backgroundColor: nodeType.color + "20",
            color: nodeType.color,
          }}
        >
          {renderIcon(nodeType.icon)}
        </div>
        <span>{node.data.label}</span>
        <button
          className="node-action"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(node.id);
          }}
        >
          {renderIcon("X", 14)}
        </button>
      </div>

      <div className="node-content">
        <div className="node-preview api-preview">
          <div>{formatApiDetails()}</div>
        </div>
      </div>

      {/* Node connection points */}
      <div className="node-connections">
        {/* Input connection point */}
        <NodeConnector
          type="input"
          onConnect={(e) => onCompleteConnection(e, node)}
        />

        {/* Output connection points */}
        <div className="node-outputs">
          {nodeType.outputLabels &&
            nodeType.outputLabels.map((label, index) => (
              <NodeConnector
                key={index}
                type="output"
                index={index}
                label={label}
                onConnect={(e) => onStartConnection(e, node, index)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ApiNode;
