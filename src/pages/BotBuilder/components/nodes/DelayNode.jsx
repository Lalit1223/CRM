// src/pages/BotBuilder/components/nodes/DelayNode.jsx
import React from "react";
import * as Icons from "lucide-react";
import { getNodeTypeById } from "../../constants/nodeTypes";
import NodeConnector from "../shared/NodeConnector";

const DelayNode = ({
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

  // Format delay time for display
  const formatDelayTime = () => {
    if (!node.data.delayTime) return "No delay set";

    const { value, unit } = node.data.delayTime;
    return `Wait for ${value || 5} ${unit || "minutes"}`;
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
        <div className="node-preview delay-preview">
          <div>{formatDelayTime()}</div>
        </div>
      </div>

      {/* Node connection points */}
      <div className="node-connections">
        {/* Input connection point */}
        <NodeConnector
          type="input"
          onConnect={(e) => onCompleteConnection(e, node)}
        />

        {/* Output connection point */}
        <div className="node-outputs">
          <NodeConnector
            type="output"
            index={0}
            onConnect={(e) => onStartConnection(e, node, 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default DelayNode;
