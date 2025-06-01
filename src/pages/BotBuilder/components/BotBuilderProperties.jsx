// src/pages/BotBuilder/components/BotBuilderProperties.jsx
import React, { useState, useEffect } from "react";

const BotBuilderProperties = ({ node, updateNodeData, nodes }) => {
  // Add state to track editable values
  const [localData, setLocalData] = useState({});

  // Update local state when the selected node changes
  useEffect(() => {
    if (node && node.data) {
      setLocalData({ ...node.data });
    }
  }, [node]);

  // Handle input changes and update both local state and node data
  const handleInputChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    updateNodeData(node.id, { [field]: value });
  };

  // Handle changes to button items
  const handleButtonChange = (index, field, value) => {
    if (!localData.buttons) return;

    const updatedButtons = [...localData.buttons];
    updatedButtons[index] = {
      ...updatedButtons[index],
      [field]: value,
    };

    setLocalData({ ...localData, buttons: updatedButtons });
    updateNodeData(node.id, { buttons: updatedButtons });
  };

  // Add a new button
  const addButton = () => {
    const newButton = {
      id: Date.now().toString(),
      text: "New Button",
      value: "new_value",
    };

    const updatedButtons = localData.buttons
      ? [...localData.buttons, newButton]
      : [newButton];
    setLocalData({ ...localData, buttons: updatedButtons });
    updateNodeData(node.id, { buttons: updatedButtons });
  };

  // Remove a button
  const removeButton = (index) => {
    const updatedButtons = localData.buttons.filter((_, i) => i !== index);
    setLocalData({ ...localData, buttons: updatedButtons });
    updateNodeData(node.id, { buttons: updatedButtons });
  };

  // Handle changes to condition items
  const handleConditionChange = (index, field, value) => {
    if (!localData.conditions) return;

    const updatedConditions = [...localData.conditions];
    updatedConditions[index] = {
      ...updatedConditions[index],
      [field]: value,
    };

    setLocalData({ ...localData, conditions: updatedConditions });
    updateNodeData(node.id, { conditions: updatedConditions });
  };

  // Add a new condition
  const addCondition = () => {
    const newCondition = {
      id: Date.now().toString(),
      field: "",
      operator: "equals",
      value: "",
      targetNode: "",
    };

    const updatedConditions = localData.conditions
      ? [...localData.conditions, newCondition]
      : [newCondition];
    setLocalData({ ...localData, conditions: updatedConditions });
    updateNodeData(node.id, { conditions: updatedConditions });
  };

  // Remove a condition
  const removeCondition = (index) => {
    const updatedConditions = localData.conditions.filter(
      (_, i) => i !== index
    );
    setLocalData({ ...localData, conditions: updatedConditions });
    updateNodeData(node.id, { conditions: updatedConditions });
  };

  const renderNodeProperties = () => {
    if (!node || !localData) return null;

    switch (node.type) {
      case "triggerNode":
        return (
          <>
            <div className="property-group">
              <h4>Trigger Settings</h4>
              <div className="property-field">
                <label>Trigger Type</label>
                <select
                  value={localData.triggerType || ""}
                  onChange={(e) =>
                    handleInputChange("triggerType", e.target.value)
                  }
                >
                  <option value="New Message Received">
                    New Message Received
                  </option>
                  <option value="Message Match Keyword Condition">
                    Message Match Keyword
                  </option>
                  <option value="Hot Keyword">Hot Keyword</option>
                  <option value="Inbound Webhook Trigger">
                    Inbound Webhook
                  </option>
                  <option value="Click to WhatsApp Ads">
                    Click to WhatsApp Ads
                  </option>
                </select>
              </div>

              {(localData.triggerType || "").includes("Keyword") && (
                <div className="property-field">
                  <label>Keywords</label>
                  <input
                    type="text"
                    placeholder="Enter keywords separated by commas"
                    value={localData.condition || ""}
                    onChange={(e) =>
                      handleInputChange("condition", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </>
        );

      case "messageNode":
        return (
          <>
            <div className="property-group">
              <h4>Message Settings</h4>
              <div className="property-field">
                <label>Message Text</label>
                <textarea
                  placeholder="Enter your message here"
                  value={localData.message || ""}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows="4"
                />
              </div>

              <div className="property-field checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={localData.waitForReply || false}
                    onChange={(e) =>
                      handleInputChange("waitForReply", e.target.checked)
                    }
                  />
                  Wait for reply
                </label>
              </div>
            </div>
          </>
        );

      case "questionNode":
        return (
          <>
            <div className="property-group">
              <h4>Question Settings</h4>
              <div className="property-field">
                <label>Question Text</label>
                <textarea
                  placeholder="Enter your question here"
                  value={localData.question || ""}
                  onChange={(e) =>
                    handleInputChange("question", e.target.value)
                  }
                  rows="3"
                />
              </div>

              <div className="property-field">
                <label>Response Field</label>
                <input
                  type="text"
                  placeholder="Field name to store response"
                  value={localData.responseField || ""}
                  onChange={(e) =>
                    handleInputChange("responseField", e.target.value)
                  }
                />
              </div>

              <div className="property-field">
                <label>Wait Time (seconds)</label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={localData.waitTime || 180}
                  onChange={(e) =>
                    handleInputChange("waitTime", parseInt(e.target.value))
                  }
                />
              </div>

              <div className="property-field">
                <label>Buttons</label>
                <div className="buttons-container">
                  {(localData.buttons || []).map((button, index) => (
                    <div key={button.id || index} className="button-item">
                      <input
                        type="text"
                        placeholder="Button text"
                        value={button.text || ""}
                        onChange={(e) =>
                          handleButtonChange(index, "text", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={button.value || ""}
                        onChange={(e) =>
                          handleButtonChange(index, "value", e.target.value)
                        }
                      />
                      <button
                        className="remove-button"
                        onClick={() => removeButton(index)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    className="add-button"
                    onClick={addButton}
                    type="button"
                  >
                    Add Button
                  </button>
                </div>
              </div>
            </div>
          </>
        );

      case "routerNode":
        return (
          <>
            <div className="property-group">
              <h4>Router Settings</h4>
              <div className="conditions-container">
                {(localData.conditions || []).map((condition, index) => (
                  <div key={condition.id || index} className="condition-item">
                    <div className="condition-row">
                      <select
                        value={condition.field || ""}
                        onChange={(e) =>
                          handleConditionChange(index, "field", e.target.value)
                        }
                      >
                        <option value="">Select Field</option>
                        <option value="user_response">User Response</option>
                        <option value="user_name">User Name</option>
                        <option value="user_phone">User Phone</option>
                        <option value="custom_field">Custom Field</option>
                      </select>

                      <select
                        value={condition.operator || "equals"}
                        onChange={(e) =>
                          handleConditionChange(
                            index,
                            "operator",
                            e.target.value
                          )
                        }
                      >
                        <option value="equals">equals</option>
                        <option value="contains">contains</option>
                        <option value="startsWith">starts with</option>
                        <option value="endsWith">ends with</option>
                        <option value="greaterThan">greater than</option>
                        <option value="lessThan">less than</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Value"
                        value={condition.value || ""}
                        onChange={(e) =>
                          handleConditionChange(index, "value", e.target.value)
                        }
                      />

                      <button
                        className="remove-button"
                        onClick={() => removeCondition(index)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>

                    <div className="target-row">
                      <label>Target Node:</label>
                      <select
                        value={condition.targetNode || ""}
                        onChange={(e) =>
                          handleConditionChange(
                            index,
                            "targetNode",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Target Node</option>
                        {nodes
                          .filter((n) => n.id !== node.id)
                          .map((n) => (
                            <option key={n.id} value={n.id}>
                              {n.data.label || n.type} (ID: {n.id})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}

                <button
                  className="add-button"
                  onClick={addCondition}
                  type="button"
                >
                  Add Condition
                </button>
              </div>

              <div className="property-field">
                <label>Default Target Node</label>
                <select
                  value={localData.defaultTargetNode || ""}
                  onChange={(e) =>
                    handleInputChange("defaultTargetNode", e.target.value)
                  }
                >
                  <option value="">Select Default Target</option>
                  {nodes
                    .filter((n) => n.id !== node.id)
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.data.label || n.type} (ID: {n.id})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </>
        );

      case "assignNode":
        return (
          <>
            <div className="property-group">
              <h4>Assign Settings</h4>
              <div className="property-field">
                <label>Agent ID / Name</label>
                <input
                  type="text"
                  placeholder="Enter agent ID or name"
                  value={localData.agentId || ""}
                  onChange={(e) => handleInputChange("agentId", e.target.value)}
                />
              </div>

              <div className="property-field">
                <label>Team</label>
                <select
                  value={localData.team || ""}
                  onChange={(e) => handleInputChange("team", e.target.value)}
                >
                  <option value="">Select Team</option>
                  <option value="sales">Sales</option>
                  <option value="support">Support</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                </select>
              </div>

              <div className="property-field">
                <label>Handover Message</label>
                <textarea
                  placeholder="Message to display when assigning to agent"
                  value={localData.message || ""}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          </>
        );

      case "webhookNode":
        return (
          <>
            <div className="property-group">
              <h4>API Request Settings</h4>
              <div className="property-field">
                <label>URL</label>
                <input
                  type="text"
                  placeholder="https://api.example.com/endpoint"
                  value={localData.url || ""}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                />
              </div>

              <div className="property-field">
                <label>Method</label>
                <select
                  value={localData.method || "GET"}
                  onChange={(e) => handleInputChange("method", e.target.value)}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div className="property-field">
                <label>Headers (JSON)</label>
                <textarea
                  placeholder='{"Content-Type": "application/json"}'
                  value={
                    localData.headers
                      ? JSON.stringify(localData.headers, null, 2)
                      : ""
                  }
                  onChange={(e) => {
                    try {
                      const headers = JSON.parse(e.target.value);
                      handleInputChange("headers", headers);
                    } catch (error) {
                      // Invalid JSON, don't update
                      console.error("Invalid JSON for headers:", error);
                    }
                  }}
                  rows="3"
                />
              </div>

              <div className="property-field">
                <label>Body (JSON)</label>
                <textarea
                  placeholder='{"key": "value"}'
                  value={
                    localData.body
                      ? JSON.stringify(localData.body, null, 2)
                      : ""
                  }
                  onChange={(e) => {
                    try {
                      const body = JSON.parse(e.target.value);
                      handleInputChange("body", body);
                    } catch (error) {
                      // Invalid JSON, don't update
                      console.error("Invalid JSON for body:", error);
                    }
                  }}
                  rows="3"
                />
              </div>

              <div className="property-field">
                <label>Response Field</label>
                <input
                  type="text"
                  placeholder="Field to store API response"
                  value={localData.responseField || ""}
                  onChange={(e) =>
                    handleInputChange("responseField", e.target.value)
                  }
                />
              </div>
            </div>
          </>
        );

      case "googleSheetNode":
        return (
          <>
            <div className="property-group">
              <h4>Google Sheet Settings</h4>
              <div className="property-field">
                <label>Sheet ID</label>
                <input
                  type="text"
                  placeholder="Google Sheet ID"
                  value={localData.sheetId || ""}
                  onChange={(e) => handleInputChange("sheetId", e.target.value)}
                />
              </div>

              <div className="property-field">
                <label>Range</label>
                <input
                  type="text"
                  placeholder="e.g., Sheet1!A1:D10"
                  value={localData.range || ""}
                  onChange={(e) => handleInputChange("range", e.target.value)}
                />
              </div>

              <div className="property-field">
                <label>Lookup Column</label>
                <input
                  type="text"
                  placeholder="Column to search in (e.g., A or 1)"
                  value={localData.lookupColumn || ""}
                  onChange={(e) =>
                    handleInputChange("lookupColumn", e.target.value)
                  }
                />
              </div>

              <div className="property-field">
                <label>Lookup Value</label>
                <input
                  type="text"
                  placeholder="Value to search for"
                  value={localData.lookupValue || ""}
                  onChange={(e) =>
                    handleInputChange("lookupValue", e.target.value)
                  }
                />
              </div>

              <div className="property-field">
                <label>Result Field</label>
                <input
                  type="text"
                  placeholder="Field to store result"
                  value={localData.resultField || ""}
                  onChange={(e) =>
                    handleInputChange("resultField", e.target.value)
                  }
                />
              </div>
            </div>
          </>
        );

      case "stayInSessionNode":
        return (
          <>
            <div className="property-group">
              <h4>Stay In Session Settings</h4>
              <div className="property-field">
                <label>Message</label>
                <textarea
                  placeholder="Message to display when keeping session active"
                  value={localData.message || ""}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="property-group">
            <h4>Node Properties</h4>
            <p>Properties not available for this node type.</p>
          </div>
        );
    }
  };

  if (!node)
    return (
      <div className="bot-builder-properties">
        <div className="properties-header">
          <h3>No Node Selected</h3>
        </div>
      </div>
    );

  return (
    <div className="bot-builder-properties">
      <div className="properties-header">
        <h3>Properties: {localData.label || node.type}</h3>
      </div>

      <div className="properties-content">
        <div className="property-group">
          <h4>Basic Settings</h4>
          <div className="property-field">
            <label>Node Label</label>
            <input
              type="text"
              value={localData.label || ""}
              onChange={(e) => handleInputChange("label", e.target.value)}
              placeholder="Enter node label"
            />
          </div>
        </div>

        {renderNodeProperties()}
      </div>
    </div>
  );
};

export default BotBuilderProperties;
