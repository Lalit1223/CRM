import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { MessageSquare } from "lucide-react";

const MessageNode = ({ data, isConnectable, selected }) => {
  return (
    <div className={`node message-node ${selected ? "selected" : ""}`}>
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="node-handle input-handle"
      />

      <div className="node-header">
        <div className="node-icon">
          <MessageSquare size={16} />
        </div>
        <div className="node-title">{data.label || "Send Message"}</div>
      </div>

      <div className="node-content">
        <div className="message-content">
          {data.message || "No message content"}
        </div>

        <div className="node-options">
          {data.waitForReply && (
            <div className="node-option">
              <span className="option-badge">Wait for reply</span>
            </div>
          )}
        </div>
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

export default memo(MessageNode);
