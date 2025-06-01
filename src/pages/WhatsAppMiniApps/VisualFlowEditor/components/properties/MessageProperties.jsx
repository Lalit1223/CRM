import React from "react";
import { Info } from "lucide-react";

const MessageProperties = ({ nodeData, onUpdate }) => {
  // Handle text change
  const handleMessageChange = (e) => {
    onUpdate({ message: e.target.value });
  };

  // Handle wait for reply toggle
  const handleWaitToggle = (e) => {
    onUpdate({ waitForReply: e.target.checked });
  };

  return (
    <div className="property-group">
      <h4>Message Settings</h4>

      <div className="property-field">
        <label>Message Text</label>
        <textarea
          placeholder="Enter your message here..."
          value={nodeData.message || ""}
          onChange={handleMessageChange}
          rows="4"
        />
        <div className="field-hint">
          <Info size={12} />
          <span>You can use variables like {{ variable_name }}</span>
        </div>
      </div>

      <div className="property-field checkbox">
        <label>
          <input
            type="checkbox"
            checked={nodeData.waitForReply || false}
            onChange={handleWaitToggle}
          />
          Wait for reply
        </label>
        <div className="field-hint">
          <span>
            If checked, the workflow will pause after sending this message until
            the user responds
          </span>
        </div>
      </div>

      {nodeData.waitForReply && (
        <div className="property-field">
          <label>Response Variable</label>
          <input
            type="text"
            placeholder="e.g., user_response"
            value={nodeData.responseField || ""}
            onChange={(e) => onUpdate({ responseField: e.target.value })}
          />
          <div className="field-hint">
            <span>
              Name of the variable where the user's response will be stored
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageProperties;
