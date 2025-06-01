import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { GitBranch } from "lucide-react";

const ConditionNode = ({ data, isConnectable, selected }) => {
  // Format condition for display
  const formatCondition = () => {
    if (!data.condition) return "No condition set";

    const { variable, operator, value } = data.condition;
    return `${variable || "?"} ${operator || "=="} ${value || "?"}`;
  };

  return (
    <div className={`node condition-node ${selected ? "selected" : ""}`}>
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="node-handle input-handle"
      />

      <div className="node-header">
        <div className="node-icon">
          <GitBranch size={16} />
        </div>
        <div className="node-title">{data.label || "Condition"}</div>
      </div>

      <div className="node-content">
        <div className="condition-content">
          <code>{formatCondition()}</code>
        </div>
      </div>

      {/* True output handle */}
      <div className="true-handle-label">Yes</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        isConnectable={isConnectable}
        className="node-handle output-handle true-handle"
        style={{ left: "25%" }}
      />

      {/* False output handle */}
      <div className="false-handle-label">No</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        isConnectable={isConnectable}
        className="node-handle output-handle false-handle"
        style={{ left: "75%" }}
      />
    </div>
  );
};

export default memo(ConditionNode);
