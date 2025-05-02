// src/pages/BotBuilder/components/BotBuilderSidebar.jsx
import React from "react";
import * as Icons from "lucide-react";

const BotBuilderSidebar = ({ setShowSidebar, nodeTypes, onAddNode }) => {
  // Helper to render icons
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={size} strokeWidth={2} /> : null;
  };

  return (
    <div className="builder-sidebar">
      <div className="sidebar-header">
        <h3>Building Blocks</h3>
        <button
          className="icon-button small"
          onClick={() => setShowSidebar(false)}
        >
          {renderIcon("ArrowLeft", 16)}
        </button>
      </div>

      <div className="node-types">
        {nodeTypes.map((node) => (
          <div
            key={node.id}
            className="node-item"
            onClick={() => onAddNode(node.id)}
          >
            <div
              className="node-icon"
              style={{ backgroundColor: node.color + "20", color: node.color }}
            >
              {renderIcon(node.icon)}
            </div>
            <div className="node-info">
              <div className="node-label">{node.label}</div>
              <div className="node-description">{node.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BotBuilderSidebar;
