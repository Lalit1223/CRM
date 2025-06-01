import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { CheckCircle } from "lucide-react";

const EndNode = ({ data, isConnectable, selected }) => {
  return (
    <div className={`node end-node ${selected ? "selected" : ""}`}>
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="node-handle input-handle"
      />

      <div className="node-header">
        <div className="node-icon">
          <CheckCircle size={16} />
        </div>
        <div className="node-title">{data.label || "End"}</div>
      </div>

      <div className="node-content">
        <div className="end-content">
          <div className="end-message">Workflow ends here</div>
        </div>
      </div>
    </div>
  );
};

export default memo(EndNode);
