import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Play } from "lucide-react";

const TriggerNode = ({ data, isConnectable, selected }) => {
  return (
    <div className={`node trigger-node ${selected ? "selected" : ""}`}>
      <div className="node-header">
        <div className="node-icon">
          <Play size={16} />
        </div>
        <div className="node-title">{data.label || "Trigger"}</div>
      </div>

      <div className="node-content">
        <div className="trigger-type">
          {data.triggerType || "New Message Received"}
        </div>

        {data.condition && (
          <div className="trigger-condition">
            <div className="condition-label">Condition:</div>
            <code>{data.condition}</code>
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="node-handle output-handle"
      />
    </div>
  );
};

export default memo(TriggerNode);
