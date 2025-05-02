// src/pages/BotBuilder/constants/nodeTypes.js

/**
 * Node types configuration for the bot builder
 * Each node type has specific properties, appearance, and behavior
 */
export const nodeTypes = [
  {
    id: "start",
    label: "Start Flow",
    icon: "Play",
    description: "Entry point for your bot flow",
    color: "#4CAF50",
    outputs: 1,
    inputs: 0,
  },
  {
    id: "message",
    label: "Send Message",
    icon: "MessageSquare",
    description: "Send a message to the user",
    color: "#2196F3",
    outputs: 1,
    inputs: 1,
  },
  {
    id: "input",
    label: "Get User Input",
    icon: "User",
    description: "Collect input from the user",
    color: "#9C27B0",
    outputs: 1,
    inputs: 1,
  },
  {
    id: "condition",
    label: "Condition",
    icon: "GitBranch",
    description: "Add branching logic based on conditions",
    color: "#FF9800",
    outputs: 2,
    inputs: 1,
    outputLabels: ["Yes", "No"],
  },
  {
    id: "api",
    label: "API Call",
    icon: "Database",
    description: "Make external API calls",
    color: "#795548",
    outputs: 2,
    inputs: 1,
    outputLabels: ["Success", "Error"],
  },
  {
    id: "template",
    label: "WhatsApp Template",
    icon: "FileText",
    description: "Send a WhatsApp template message",
    color: "#25D366",
    outputs: 1,
    inputs: 1,
  },
  {
    id: "delay",
    label: "Delay",
    icon: "Clock",
    description: "Add a timed delay",
    color: "#607D8B",
    outputs: 1,
    inputs: 1,
  },
  {
    id: "webhook",
    label: "Webhook",
    icon: "Link",
    description: "Trigger a webhook",
    color: "#E91E63",
    outputs: 1,
    inputs: 1,
  },
  {
    id: "end",
    label: "End Flow",
    icon: "Square",
    description: "End point for a bot flow path",
    color: "#F44336",
    outputs: 0,
    inputs: 1,
  },
];

/**
 * Get node type information by ID
 * @param {string} typeId - The node type ID
 * @returns {Object} Node type information
 */
export const getNodeTypeById = (typeId) => {
  return (
    nodeTypes.find((type) => type.id === typeId) || {
      label: "Unknown Node",
      icon: "HelpCircle",
      color: "#999",
      outputs: 1,
      inputs: 1,
    }
  );
};

/**
 * Get default data for a new node based on type
 * @param {string} nodeType - The node type ID
 * @returns {Object} Default data for the node
 */
export const getDefaultNodeData = (nodeType) => {
  switch (nodeType) {
    case "message":
      return {
        content: "Enter your message here",
      };

    case "input":
      return {
        content: "Ask a question...",
        options: [
          { id: "opt_1", text: "Option 1" },
          { id: "opt_2", text: "Option 2" },
        ],
      };

    case "condition":
      return {
        condition: {
          variable: "{{user_input}}",
          operator: "==",
          value: "yes",
        },
      };

    case "api":
      return {
        apiDetails: {
          url: "https://api.example.com/endpoint",
          method: "GET",
          headers: {},
          body: "{}",
        },
      };

    case "template":
      return {
        templateDetails: {
          name: "sample_template",
          language: "en",
          parameters: [],
        },
      };

    case "delay":
      return {
        delayTime: {
          value: 5,
          unit: "minutes",
        },
      };

    case "webhook":
      return {
        webhookDetails: {
          url: "https://webhooks.example.com/trigger",
          method: "POST",
          headers: {},
          payload: "{}",
        },
      };

    default:
      return {};
  }
};
