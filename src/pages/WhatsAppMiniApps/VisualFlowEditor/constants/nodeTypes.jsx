// Node type definitions and metadata
import React from "react";

// Import node components
import MessageNode from "../components/nodes/MessageNode";
import InputNode from "../components/nodes/InputNode";
import ConditionNode from "../components/nodes/ConditionNode";
import ApiNode from "../components/nodes/ApiNode";
import TriggerNode from "../components/nodes/TriggerNode";
import EndNode from "../components/nodes/EndNode";

// Define node types for ReactFlow
export const nodeTypes = {
  messageNode: MessageNode,
  inputNode: InputNode,
  conditionNode: ConditionNode,
  apiNode: ApiNode,
  triggerNode: TriggerNode,
  endNode: EndNode,
};

// Node type metadata
export const nodeTypeInfo = {
  messageNode: {
    type: "messageNode",
    label: "Message",
    description: "Send a message to the user",
    icon: "MessageSquare",
    color: "#818cf8",
    inputs: 1,
    outputs: 1,
    canDelete: true,
  },

  inputNode: {
    type: "inputNode",
    label: "Question",
    description: "Ask a question with buttons",
    icon: "Terminal",
    color: "#6366f1",
    inputs: 1,
    outputs: 1,
    canDelete: true,
  },

  conditionNode: {
    type: "conditionNode",
    label: "Condition",
    description: "Branch based on conditions",
    icon: "GitBranch",
    color: "#f59e0b",
    inputs: 1,
    outputs: 2,
    outputLabels: ["Yes", "No"],
    canDelete: true,
  },

  apiNode: {
    type: "apiNode",
    label: "API Request",
    description: "Call external API",
    icon: "Database",
    color: "#10b981",
    inputs: 1,
    outputs: 2,
    outputLabels: ["Success", "Error"],
    canDelete: true,
  },

  triggerNode: {
    type: "triggerNode",
    label: "Trigger",
    description: "Workflow trigger point",
    icon: "Play",
    color: "#3b82f6",
    inputs: 0,
    outputs: 1,
    canDelete: false,
  },

  endNode: {
    type: "endNode",
    label: "End",
    description: "End of workflow",
    icon: "CheckCircle",
    color: "#ef4444",
    inputs: 1,
    outputs: 0,
    canDelete: false,
  },
};

// Get node type info by type
export const getNodeTypeById = (typeId) => {
  return (
    nodeTypeInfo[typeId] || {
      type: typeId,
      label: "Unknown Node",
      description: "Unknown node type",
      icon: "HelpCircle",
      color: "#64748b",
      inputs: 1,
      outputs: 1,
      canDelete: true,
    }
  );
};

// Get all node types as an array
export const getAllNodeTypes = () => {
  return Object.values(nodeTypeInfo);
};

// Get draggable node types (exclude trigger and end)
export const getDraggableNodeTypes = () => {
  return Object.values(nodeTypeInfo).filter(
    (nodeType) => nodeType.canDelete === true
  );
};
