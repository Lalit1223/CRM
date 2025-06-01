import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { Terminal } from "lucide-react";

const InputNode = ({ data, isConnectable, selected }) => {
  return (
    <div className={`node input-node ${selected ? "selected" : ""}`}>
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="node-handle input-handle"
      />

      <div className="node-header">
        <div className="node-icon">
          <Terminal size={16} />
        </div>
        <div className="node-title">{data.label || "Ask Question"}</div>
      </div>

      <div className="node-content">
        <div className="question-content">
          {data.question || "No question content"}
        </div>

        <div className="options-preview">
          {data.buttons && data.buttons.length > 0 ? (
            <div className="buttons-list">
              {data.buttons.slice(0, 3).map((button, index) => (
                <span key={button.id || index} className="button-preview">
                  {button.text}
                </span>
              ))}
              {data.buttons.length > 3 && (
                <span className="button-preview more">
                  +{data.buttons.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <div className="no-buttons">No buttons defined</div>
          )}
        </div>

        {data.responseField && (
          <div className="response-field">
            Saves to: <code>{data.responseField}</code>
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

export default memo(InputNode);
