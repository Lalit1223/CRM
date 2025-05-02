// src/pages/BotBuilder/components/shared/NodeConnector.jsx
import React from "react";

/**
 * Component representing a connection point (input/output) on a node
 */
const NodeConnector = ({
  type, // "input" or "output"
  index = 0,
  label,
  onConnect,
}) => {
  return (
    <div className={`node-${type}`} data-index={index} onClick={onConnect}>
      {label && <span className="output-label">{label}</span>}
    </div>
  );
};

export default NodeConnector;
