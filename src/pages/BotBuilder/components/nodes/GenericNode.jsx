// src/pages/BotBuilder/components/nodes/GenericNode.jsx
import React from "react";
import * as Icons from "lucide-react";
import { getNodeTypeById } from "../../constants/nodeTypes";
import NodeConnector from "../shared/NodeConnector";

const GenericNode = ({
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

  // Render node content based on type
  const renderNodeContent = () => {
    switch (node.type) {
      case "message":
        return (
          <div className="node-preview message-preview">
            {node.data.content || "No message content"}
          </div>
        );

      case "input":
        return (
          <div className="node-preview input-preview">
            <div className="input-question">
              {node.data.content || "Ask a question..."}
            </div>
            {node.data.options && node.data.options.length > 0 && (
              <div className="input-options">
                {node.data.options
                  .map((option, index) => (
                    <div key={option.id || index} className="option-chip">
                      {option.text}
                    </div>
                  ))
                  .slice(0, 2)}
                {node.data.options.length > 2 && (
                  <div className="option-chip more">
                    +{node.data.options.length - 2}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case "condition":
        return (
          <div className="node-preview condition-preview">
            <code>
              {node.data.condition
                ? `${node.data.condition.variable || "?"} ${
                    node.data.condition.operator || "=="
                  } ${node.data.condition.value || "?"}`
                : "No condition set"}
            </code>
          </div>
        );

      case "api":
        return (
          <div className="node-preview api-preview">
            <div>
              {node.data.apiDetails
                ? `${node.data.apiDetails.method || "GET"} ${
                    node.data.apiDetails.url || "https://api.example.com"
                  }`
                : "No API details"}
            </div>
          </div>
        );

      case "template":
        return (
          <div className="node-preview template-preview">
            <div>{node.data.templateDetails?.name || "No template set"}</div>
            <div className="template-lang">
              {node.data.templateDetails?.language || "en"}
            </div>
          </div>
        );

      case "delay":
        return (
          <div className="node-preview delay-preview">
            <div>
              {node.data.delayTime
                ? `Wait for ${node.data.delayTime.value || 5} ${
                    node.data.delayTime.unit || "minutes"
                  }`
                : "No delay set"}
            </div>
          </div>
        );

      case "webhook":
        return (
          <div className="node-preview webhook-preview">
            <div>
              {node.data.webhookDetails
                ? `${node.data.webhookDetails.method || "POST"} ${
                    node.data.webhookDetails.url ||
                    "https://webhooks.example.com"
                  }`
                : "No webhook details"}
            </div>
          </div>
        );

      case "start":
      case "end":
        return (
          <div className="node-preview simple-preview">
            {node.type === "start" ? "Start of flow" : "End of flow"}
          </div>
        );

      default:
        return (
          <div className="node-preview">Unknown node type: {node.type}</div>
        );
    }
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

      <div className="node-content">{renderNodeContent()}</div>

      {/* Node connection points */}
      <div className="node-connections">
        {/* Input connection point */}
        {nodeType.inputs > 0 && (
          <NodeConnector
            type="input"
            onConnect={(e) => onCompleteConnection(e, node)}
          />
        )}

        {/* Output connection points */}
        {nodeType.outputs > 0 && (
          <div className="node-outputs">
            {Array.from({ length: nodeType.outputs }).map((_, index) => (
              <NodeConnector
                key={index}
                type="output"
                index={index}
                label={nodeType.outputLabels && nodeType.outputLabels[index]}
                onConnect={(e) => onStartConnection(e, node, index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericNode;
