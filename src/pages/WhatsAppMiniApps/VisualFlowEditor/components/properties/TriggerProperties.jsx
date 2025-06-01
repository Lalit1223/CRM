import React from "react";
import { Info } from "lucide-react";

const TriggerProperties = ({ nodeData, onUpdate }) => {
  // Handle trigger type change
  const handleTriggerTypeChange = (e) => {
    onUpdate({ triggerType: e.target.value });
  };

  // Handle condition change
  const handleConditionChange = (e) => {
    onUpdate({ condition: e.target.value });
  };

  // Helper to copy webhook URL to clipboard
  const copyWebhookUrl = () => {
    const webhookUrl = `https://api.example.com/webhook/${
      nodeData.webhookId || "[webhook-id]"
    }`;
    navigator.clipboard
      .writeText(webhookUrl)
      .then(() => {
        alert("Webhook URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err);
      });
  };

  return (
    <div className="property-group">
      <h4>Trigger Settings</h4>

      <div className="property-field">
        <label>Trigger Type</label>
        <select
          value={nodeData.triggerType || "New Message Received"}
          onChange={handleTriggerTypeChange}
        >
          <option value="New Message Received">New Message Received</option>
          <option value="Message Match Keyword">Message Match Keyword</option>
          <option value="Hot Keyword">Hot Keyword</option>
          <option value="Inbound Webhook">Inbound Webhook</option>
          <option value="Click to WhatsApp Ads">Click to WhatsApp Ads</option>
        </select>
        <div className="field-hint">
          <span>The event that will start this workflow</span>
        </div>
      </div>

      {(nodeData.triggerType === "Message Match Keyword" ||
        nodeData.triggerType === "Hot Keyword") && (
        <div className="property-field">
          <label>Keywords</label>
          <input
            type="text"
            placeholder="Enter keywords separated by commas"
            value={nodeData.condition || ""}
            onChange={handleConditionChange}
          />
          <div className="field-hint">
            <Info size={12} />
            <span>
              Enter keywords that will trigger this flow. Separate multiple
              keywords with commas.
            </span>
          </div>
        </div>
      )}

      {nodeData.triggerType === "Inbound Webhook" && (
        <div className="webhook-info">
          <div className="property-field">
            <label>Webhook URL</label>
            <div className="webhook-url-container">
              <code className="webhook-url">
                https://api.example.com/webhook/
                {nodeData.webhookId || "[webhook-id]"}
              </code>
              <button
                className="copy-button"
                onClick={copyWebhookUrl}
                type="button"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="property-field">
            <label>Webhook ID</label>
            <input
              type="text"
              value={nodeData.webhookId || ""}
              onChange={(e) => onUpdate({ webhookId: e.target.value })}
              placeholder="Enter webhook ID"
            />
            <div className="field-hint">
              <span>A unique identifier for this webhook</span>
            </div>
          </div>

          <div className="webhook-instructions">
            <h5>How to use webhooks</h5>
            <ol>
              <li>Copy the webhook URL above</li>
              <li>
                Configure your external system to send a POST request to this
                URL
              </li>
              <li>
                The payload should include the data you want to process in your
                workflow
              </li>
            </ol>
          </div>
        </div>
      )}

      <div className="trigger-note">
        <Info size={14} />
        <div className="note-content">
          <p>
            This is the starting point of your workflow. Connect other nodes to
            build the conversation flow.
          </p>
          <p>You can only have one trigger node per workflow.</p>
        </div>
      </div>
    </div>
  );
};

export default TriggerProperties;
