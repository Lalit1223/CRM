import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Edit, Trash } from "lucide-react";

// Import property editors
import MessageProperties from "./properties/MessageProperties";
import InputProperties from "./properties/InputProperties";
import ConditionProperties from "./properties/ConditionProperties";
import ApiProperties from "./properties/ApiProperties";
import TriggerProperties from "./properties/TriggerProperties";

const FlowEditorProperties = ({
  node,
  updateNodeData,
  nodes,
  isEditing,
  setIsEditing,
  onNodeEdit,
  isPanelExpanded,
  setIsPanelExpanded,
}) => {
  const [localData, setLocalData] = useState({});

  useEffect(() => {
    if (node && node.data) {
      setLocalData({ ...node.data });
    }
  }, [node]);

  const handleInputChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    updateNodeData(node.id, { [field]: value });
  };

  const renderNodeProperties = () => {
    if (!node || !localData) return null;

    switch (node.type) {
      case "messageNode":
        return (
          <MessageProperties
            nodeData={localData}
            onUpdate={(data) => updateNodeData(node.id, data)}
          />
        );

      case "inputNode":
        return (
          <InputProperties
            nodeData={localData}
            onUpdate={(data) => updateNodeData(node.id, data)}
          />
        );

      case "conditionNode":
        return (
          <ConditionProperties
            nodeData={localData}
            onUpdate={(data) => updateNodeData(node.id, data)}
            nodes={nodes}
          />
        );

      case "apiNode":
        return (
          <ApiProperties
            nodeData={localData}
            onUpdate={(data) => updateNodeData(node.id, data)}
          />
        );

      case "triggerNode":
        return (
          <TriggerProperties
            nodeData={localData}
            onUpdate={(data) => updateNodeData(node.id, data)}
          />
        );

      case "endNode":
        return (
          <div className="property-group">
            <h4>End Node</h4>
            <p>This node marks the end of the workflow path.</p>
          </div>
        );

      default:
        return (
          <div className="property-group">
            <h4>Node Properties</h4>
            <p>No specific properties for this node type.</p>
          </div>
        );
    }
  };

  if (!node) {
    return (
      <div className={`properties-panel ${!isPanelExpanded ? "" : "expanded"}`}>
        <div
          className="panel-toggle"
          onClick={() => setIsPanelExpanded(!isPanelExpanded)}
        >
          {isPanelExpanded ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </div>

        <div className="properties-header">
          <h3 className="properties-title">No Node Selected</h3>
        </div>

        <div className="properties-content">
          <div className="empty-properties">
            <p>Select a node to view and edit its properties.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`properties-panel ${isPanelExpanded ? "expanded" : ""}`}>
      <div
        className="panel-toggle"
        onClick={() => setIsPanelExpanded(!isPanelExpanded)}
      >
        {isPanelExpanded ? (
          <ChevronRight size={16} />
        ) : (
          <ChevronLeft size={16} />
        )}
      </div>

      <div className="properties-header">
        <h3 className="properties-title">
          {isEditing ? "Edit Node" : "Node Properties"}
        </h3>

        <div className="properties-actions">
          <button
            className="properties-action-btn edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit size={16} />
          </button>

          {node.type !== "triggerNode" && node.type !== "endNode" && (
            <button
              className="properties-action-btn delete"
              onClick={() => {
                /* Handle delete */
              }}
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="properties-content">
        {/* Basic properties for all nodes */}
        <div className="property-group">
          <h4>Basic Settings</h4>
          <div className="property-field">
            <label>Node Label</label>
            <input
              type="text"
              value={localData.label || ""}
              onChange={(e) => handleInputChange("label", e.target.value)}
              placeholder="Enter node label"
            />
          </div>
        </div>

        {/* Node-specific properties */}
        {renderNodeProperties()}
      </div>
    </div>
  );
};

export default FlowEditorProperties;
