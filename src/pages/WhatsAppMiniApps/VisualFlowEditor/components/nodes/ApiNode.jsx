import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Database } from "lucide-react";

const ApiNode = ({ data, isConnectable, selected }) => {
  // Format API details for display
  const formatApiDetails = () => {
    if (!data.apiDetails) return "No API details set";

    const { method, url } = data.apiDetails;
    return `${method || "GET"} ${url || "https://api.example.com/endpoint"}`;
  };

  return (
    <div className={`node api-node ${selected ? "selected" : ""}`}>
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="node-handle input-handle"
      />

      <div className="node-header">
        <div className="node-icon">
          <Database size={16} />
        </div>
        <div className="node-title">{data.label || "API Request"}</div>
      </div>

      <div className="node-content">
        <div className="api-content">
          <code>{formatApiDetails()}</code>

          {data.responseField && (
            <div className="response-field">
              Saves to: <code>{data.responseField}</code>
            </div>
          )}
        </div>
      </div>

      {/* Success output handle */}
      <div className="success-handle-label">Success</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="success"
        isConnectable={isConnectable}
        className="node-handle output-handle success-handle"
        style={{ left: "35%" }}
      />

      {/* Error output handle */}
      <div className="error-handle-label">Error</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="error"
        isConnectable={isConnectable}
        className="node-handle output-handle error-handle"
        style={{ left: "65%" }}
      />
    </div>
  );
};

export default memo(ApiNode);
