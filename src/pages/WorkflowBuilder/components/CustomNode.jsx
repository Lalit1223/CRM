// src/pages/WorkflowBuilder/components/CustomNode.jsx
import React from "react";
import { Handle, Position } from "reactflow";
import {
  MessageSquare,
  Edit3,
  GitBranch,
  Globe,
  User,
  Clock,
  CheckCircle,
  Settings,
  Trash2,
  Zap,
} from "lucide-react";
import { NODE_TYPES } from "../../../types/workflow";

const iconMap = {
  MessageSquare,
  Edit3,
  GitBranch,
  Globe,
  User,
  Clock,
  CheckCircle,
};

const CustomNode = ({ data, selected }) => {
  const nodeConfig = NODE_TYPES[data.type] || NODE_TYPES.message;
  const IconComponent = iconMap[nodeConfig.icon] || MessageSquare;

  const isActive =
    data.isSimulating && data.simulationData?.currentNodeId === data.nodeId;
  const hasExecuted = data.simulationData?.executedNodes?.includes(data.nodeId);

  const handleEdit = (e) => {
    e.stopPropagation();
    if (data.onEdit) {
      data.onEdit(data);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this node?")) {
      if (data.onDelete) {
        data.onDelete(data.nodeId);
      }
    }
  };

  const getNodeClassName = () => {
    let className = "custom-node";
    if (selected) className += " selected";
    if (isActive) className += " active";
    if (hasExecuted) className += " executed";
    return className;
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const renderNodeContent = () => {
    switch (data.type) {
      case "condition":
        return (
          <div className="node-content">
            <div className="condition-text">
              {data.condition || "No condition set"}
            </div>
          </div>
        );

      case "api":
        return (
          <div className="node-content">
            <div className="api-info">
              <div className="api-method">{data.apiMethod || "POST"}</div>
              <div className="api-endpoint">
                {truncateText(data.apiEndpoint || "No endpoint", 30)}
              </div>
            </div>
            {data.surePassConfig && (
              <div className="surepass-indicator">
                <Zap className="w-3 h-3" />
                <span>SurePass</span>
              </div>
            )}
          </div>
        );

      case "interactive":
        return (
          <div className="node-content">
            <div className="options-count">
              {data.options?.length || 0} options
            </div>
            {data.options?.slice(0, 2).map((option, index) => (
              <div key={index} className="option-preview">
                {truncateText(option.text, 25)}
              </div>
            ))}
            {data.options?.length > 2 && (
              <div className="option-preview">
                +{data.options.length - 2} more...
              </div>
            )}
          </div>
        );

      case "input":
        return (
          <div className="node-content">
            <div className="variable-name">
              Variable: {data.variableName || "Not set"}
            </div>
          </div>
        );

      case "delay":
        return (
          <div className="node-content">
            <div className="delay-time">{data.delay || 1} seconds</div>
          </div>
        );

      case "end":
        return (
          <div className="node-content">
            <div className="end-message">Workflow ends here</div>
          </div>
        );

      default:
        return (
          <div className="node-content">
            <div className="message-preview">
              {truncateText(data.content || "No content")}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={getNodeClassName()}>
      {/* Status indicators */}
      {data.isSimulating && (
        <div className="simulation-status">
          {isActive && <div className="status-indicator active"></div>}
          {hasExecuted && !isActive && (
            <div className="status-indicator executed"></div>
          )}
        </div>
      )}

      {/* Node header */}
      <div className="node-header">
        <div className={`node-icon ${nodeConfig.color}`}>
          <IconComponent className="w-4 h-4 text-white" />
        </div>
        <div className="node-title">
          <div className="node-name" title={data.name}>
            {truncateText(data.name, 20)}
          </div>
          <div className="node-type">{nodeConfig.label}</div>
        </div>
        <div className="node-actions">
          <button className="action-btn" onClick={handleEdit} title="Edit Node">
            <Settings className="w-3 h-3" />
          </button>
          <button
            className="action-btn delete"
            onClick={handleDelete}
            title="Delete Node"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Node body */}
      <div className="node-body">{renderNodeContent()}</div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="node-handle node-handle-left"
      />

      {data.type !== "end" && (
        <Handle
          type="source"
          position={Position.Right}
          className="node-handle node-handle-right"
        />
      )}

      {/* Conditional node handles */}
      {data.type === "condition" && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="node-handle node-handle-true"
            style={{ left: "30%" }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="node-handle node-handle-false"
            style={{ left: "70%" }}
          />
        </>
      )}

      {/* API node error handle */}
      {data.type === "api" && (
        <Handle
          type="source"
          position={Position.Top}
          id="error"
          className="node-handle node-handle-error"
        />
      )}
    </div>
  );
};

export default CustomNode;
