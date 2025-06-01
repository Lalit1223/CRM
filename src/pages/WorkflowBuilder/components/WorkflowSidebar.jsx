// src/pages/WorkflowBuilder/components/WorkflowSidebar.jsx
import React, { useState } from "react";
import {
  MessageSquare,
  Edit3,
  GitBranch,
  Globe,
  User,
  Clock,
  CheckCircle,
  Search,
  Layers,
  Zap,
  ChevronDown,
  FileText,
  Headphones,
  BarChart3,
} from "lucide-react";

// Define NODE_TYPES directly in this file
const NODE_TYPES = {
  message: {
    label: "Message",
    description: "Send a text message to the user",
    icon: "MessageSquare",
    color: "message-node",
    category: "basic",
  },
  input: {
    label: "Input",
    description: "Get text input from the user",
    icon: "Edit3",
    color: "input-node",
    category: "basic",
  },
  condition: {
    label: "Condition",
    description: "Branch the flow based on conditions",
    icon: "GitBranch",
    color: "condition-node",
    category: "logic",
  },
  interactive: {
    label: "Interactive Menu",
    description: "Show multiple choice options",
    icon: "CheckCircle",
    color: "menu-node",
    category: "logic",
  },
  api: {
    label: "API Call",
    description: "Make HTTP requests to external APIs",
    icon: "Globe",
    color: "api-node",
    category: "integration",
  },
  delay: {
    label: "Delay",
    description: "Add a time delay before next action",
    icon: "Clock",
    color: "delay-node",
    category: "advanced",
  },
  variable: {
    label: "Set Variable",
    description: "Store or modify workflow variables",
    icon: "User",
    color: "variable-node",
    category: "advanced",
  },
  webhook: {
    label: "Webhook",
    description: "Send data to external webhook URLs",
    icon: "Globe",
    color: "webhook-node",
    category: "integration",
  },
  end: {
    label: "End",
    description: "End the workflow conversation",
    icon: "CheckCircle",
    color: "end-node",
    category: "basic",
  },
};

const iconMap = {
  MessageSquare,
  Edit3,
  GitBranch,
  Globe,
  User,
  Clock,
  CheckCircle,
};

const WorkflowSidebar = ({ onCreateNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [templatesExpanded, setTemplatesExpanded] = useState(false);

  const categories = [
    { value: "all", label: "All Nodes" },
    { value: "basic", label: "Basic" },
    { value: "logic", label: "Logic" },
    { value: "integration", label: "Integration" },
    { value: "advanced", label: "Advanced" },
  ];

  const templates = [
    {
      id: "kyc",
      name: "Basic KYC Flow",
      description: "Identity verification workflow",
      icon: FileText,
      type: "kyc",
    },
    {
      id: "support",
      name: "Customer Support",
      description: "Help desk conversation flow",
      icon: Headphones,
      type: "support",
    },
    {
      id: "survey",
      name: "Simple Survey",
      description: "Data collection workflow",
      icon: BarChart3,
      type: "survey",
    },
  ];

  const filteredNodes = Object.entries(NODE_TYPES).filter(([type, config]) => {
    const matchesSearch =
      config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategory === "all") return matchesSearch;

    return matchesSearch && config.category === selectedCategory;
  });

  const handleNodeDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleNodeClick = (nodeType) => {
    // Generate a random position for the node
    const position = {
      x: Math.random() * 400 + 200,
      y: Math.random() * 300 + 100,
    };

    if (onCreateNode) {
      onCreateNode(nodeType, position);
    }
  };

  const toggleTemplates = () => {
    setTemplatesExpanded(!templatesExpanded);
  };

  const createTemplateNodes = (template) => {
    const templateConfigs = {
      kyc: [
        {
          type: "message",
          position: { x: 100, y: 100 },
          content: "Welcome to KYC verification",
        },
        {
          type: "input",
          position: { x: 300, y: 100 },
          content: "Please enter your Aadhaar number",
          variableName: "aadhaar_number",
        },
        {
          type: "api",
          position: { x: 500, y: 100 },
          apiEndpoint: "/api/verification/aadhaar",
          apiMethod: "POST",
        },
        {
          type: "condition",
          position: { x: 700, y: 100 },
          condition: "isVerified === true",
        },
        {
          type: "message",
          position: { x: 900, y: 50 },
          content: "Verification successful!",
        },
        {
          type: "message",
          position: { x: 900, y: 150 },
          content: "Verification failed. Please try again.",
        },
        { type: "end", position: { x: 1100, y: 100 } },
      ],
      support: [
        {
          type: "message",
          position: { x: 100, y: 100 },
          content: "Hello! How can I help you today?",
        },
        {
          type: "interactive",
          position: { x: 300, y: 100 },
          content: "Please select your issue:",
          options: [
            { text: "Technical Support", value: "tech" },
            { text: "Billing Question", value: "billing" },
            { text: "General Inquiry", value: "general" },
          ],
        },
        {
          type: "condition",
          position: { x: 500, y: 100 },
          condition: 'userChoice === "tech"',
        },
        {
          type: "message",
          position: { x: 700, y: 50 },
          content: "Connecting you to technical support...",
        },
        {
          type: "message",
          position: { x: 700, y: 150 },
          content: "Let me help you with that...",
        },
        { type: "end", position: { x: 900, y: 100 } },
      ],
      survey: [
        {
          type: "message",
          position: { x: 100, y: 100 },
          content: "Thank you for taking our survey!",
        },
        {
          type: "input",
          position: { x: 300, y: 100 },
          content: "What is your name?",
          variableName: "user_name",
        },
        {
          type: "input",
          position: { x: 500, y: 100 },
          content: "How would you rate our service (1-5)?",
          variableName: "rating",
        },
        {
          type: "message",
          position: { x: 700, y: 100 },
          content: "Thank you {{user_name}} for rating us {{rating}} stars!",
        },
        { type: "end", position: { x: 900, y: 100 } },
      ],
    };

    const templateNodes = templateConfigs[template] || [];
    templateNodes.forEach((nodeConfig, index) => {
      setTimeout(() => {
        if (onCreateNode) {
          onCreateNode(nodeConfig.type, nodeConfig.position, nodeConfig);
        }
      }, index * 300);
    });
  };

  return (
    <div className="workflow-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Layers size={20} />
          <span>Node Library</span>
        </div>
      </div>

      <div className="sidebar-search">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* <div className="sidebar-categories">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`category-btn ${
              selectedCategory === category.value ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div> */}

      <div className="sidebar-nodes">
        {filteredNodes.map(([type, config]) => {
          const IconComponent = iconMap[config.icon] || MessageSquare;
          return (
            <div
              key={type}
              className="node-item"
              draggable
              onDragStart={(event) => handleNodeDragStart(event, type)}
              onClick={() => handleNodeClick(type)}
            >
              <div className={`node-icon ${config.color}`}>
                <IconComponent size={16} />
              </div>
              <div className="node-details">
                <div className="node-name">{config.label}</div>
                <div className="node-description">{config.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNodes.length === 0 && (
        <div className="no-nodes-found">
          <p>No nodes found</p>
          <small>Try adjusting your search or category filter</small>
        </div>
      )}

      {/* Toggle Templates Section */}
      <div className="sidebar-templates">
        <div className="templates-toggle-header" onClick={toggleTemplates}>
          <div className="templates-header-content">
            <Zap size={16} />
            <span>Quick Templates</span>
          </div>
          <ChevronDown
            size={16}
            className={`templates-toggle-icon ${
              templatesExpanded ? "expanded" : ""
            }`}
          />
        </div>

        <div className={`template-list ${templatesExpanded ? "show" : ""}`}>
          {templates.map((template) => {
            const TemplateIcon = template.icon;
            return (
              <button
                key={template.id}
                className="template-item"
                onClick={() => createTemplateNodes(template.id)}
                title={template.description}
              >
                <TemplateIcon size={14} className="template-icon" />
                <span>{template.name}</span>
                <span className={`template-badge ${template.type}`}>
                  {template.type.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar-help">
        <div className="help-text">
          <strong>Tip:</strong> Drag nodes to the canvas or click to add them at
          a random position.
        </div>
      </div>
    </div>
  );
};

export default WorkflowSidebar;
