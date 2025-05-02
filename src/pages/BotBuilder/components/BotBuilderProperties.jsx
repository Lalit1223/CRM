// src/pages/BotBuilder/components/BotBuilderProperties.jsx
import React from "react";
import * as Icons from "lucide-react";
import { getNodeTypeById } from "../constants/nodeTypes";

const BotBuilderProperties = ({
  selectedNode,
  onUpdateNodeProperties,
  onRemoveNode,
}) => {
  // Helper to render icons
  const renderIcon = (iconName, size = 16) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={size} strokeWidth={2} /> : null;
  };

  // Render properties based on node type
  const renderNodeProperties = () => {
    if (!selectedNode) return null;

    const nodeType = getNodeTypeById(selectedNode.type);

    // Common properties (for all node types)
    const commonProperties = (
      <div className="property-field">
        <label>Node Name</label>
        <input
          type="text"
          value={selectedNode.data.label || ""}
          onChange={(e) => {
            onUpdateNodeProperties({ label: e.target.value });
          }}
        />
      </div>
    );

    // Type-specific properties
    let specificProperties = null;

    switch (selectedNode.type) {
      case "message":
        specificProperties = (
          <div className="property-field">
            <label>Message Content</label>
            <textarea
              placeholder="Enter your message"
              rows={6}
              value={selectedNode.data.content || ""}
              onChange={(e) => {
                onUpdateNodeProperties({ content: e.target.value });
              }}
            />

            <div className="message-format-controls">
              <button className="format-button" title="Bold">
                {renderIcon("Bold", 16)}
              </button>
              <button className="format-button" title="Italic">
                {renderIcon("Italic", 16)}
              </button>
              <button className="format-button" title="Add Link">
                {renderIcon("Link", 16)}
              </button>
              <button className="format-button" title="Add Variable">
                {renderIcon("Variable", 16)}
              </button>
            </div>

            <div className="message-options">
              <label className="checkbox-field">
                <input type="checkbox" /> Include link preview
              </label>
            </div>
          </div>
        );
        break;

      case "input":
        specificProperties = (
          <>
            <div className="property-field">
              <label>Question Text</label>
              <textarea
                placeholder="Enter your question"
                rows={3}
                value={selectedNode.data.content || ""}
                onChange={(e) => {
                  onUpdateNodeProperties({ content: e.target.value });
                }}
              />
            </div>

            <div className="property-field">
              <label>Input Type</label>
              <select>
                <option value="options">Button Options</option>
                <option value="text">Free Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="file">File Upload</option>
              </select>
            </div>

            <div className="property-field">
              <label>
                Button Options
                <button
                  className="add-option-button"
                  onClick={() => {
                    const newOptions = [
                      ...(selectedNode.data.options || []),
                      {
                        id: `opt_${Date.now()}`,
                        text: `Option ${
                          (selectedNode.data.options || []).length + 1
                        }`,
                      },
                    ];
                    onUpdateNodeProperties({ options: newOptions });
                  }}
                >
                  {renderIcon("Plus", 14)} Add Option
                </button>
              </label>

              <div className="options-list">
                {(selectedNode.data.options || []).map((option, index) => (
                  <div key={option.id} className="option-row">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...selectedNode.data.options];
                        newOptions[index] = {
                          ...newOptions[index],
                          text: e.target.value,
                        };
                        onUpdateNodeProperties({ options: newOptions });
                      }}
                    />
                    <button
                      className="remove-option"
                      onClick={() => {
                        const newOptions = selectedNode.data.options.filter(
                          (_, i) => i !== index
                        );
                        onUpdateNodeProperties({ options: newOptions });
                      }}
                    >
                      {renderIcon("X", 14)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
        break;

      case "condition":
        specificProperties = (
          <div className="property-field condition-fields">
            <label>Condition Expression</label>

            <input
              type="text"
              placeholder="Variable name or {{placeholder}}"
              value={selectedNode.data.condition?.variable || ""}
              onChange={(e) => {
                onUpdateNodeProperties({
                  condition: {
                    ...selectedNode.data.condition,
                    variable: e.target.value,
                  },
                });
              }}
            />

            <select
              value={selectedNode.data.condition?.operator || "=="}
              onChange={(e) => {
                onUpdateNodeProperties({
                  condition: {
                    ...selectedNode.data.condition,
                    operator: e.target.value,
                  },
                });
              }}
            >
              <option value="==">equals (==)</option>
              <option value="!=">not equals (!=)</option>
              <option value=">">greater than (&gt;)</option>
              <option value="<">less than (&lt;)</option>
              <option value=">=">greater or equal (&gt;=)</option>
              <option value="<=">less or equal (&lt;=)</option>
              <option value="contains">contains</option>
              <option value="startsWith">starts with</option>
              <option value="endsWith">ends with</option>
            </select>

            <input
              type="text"
              placeholder="Value to compare with"
              value={selectedNode.data.condition?.value || ""}
              onChange={(e) => {
                onUpdateNodeProperties({
                  condition: {
                    ...selectedNode.data.condition,
                    value: e.target.value,
                  },
                });
              }}
            />

            <div className="condition-paths">
              <div className="condition-path">
                <span className="path-label yes">Yes path:</span>
                <span className="path-description">If condition is true</span>
              </div>
              <div className="condition-path">
                <span className="path-label no">No path:</span>
                <span className="path-description">If condition is false</span>
              </div>
            </div>
          </div>
        );
        break;

      case "api":
        specificProperties = (
          <div className="property-field api-fields">
            <label>API Endpoint</label>
            <input
              type="text"
              placeholder="https://api.example.com/endpoint"
              value={selectedNode.data.apiDetails?.url || ""}
              onChange={(e) => {
                onUpdateNodeProperties({
                  apiDetails: {
                    ...selectedNode.data.apiDetails,
                    url: e.target.value,
                  },
                });
              }}
            />

            <div className="method-selector">
              <label>Method</label>
              <select
                value={selectedNode.data.apiDetails?.method || "GET"}
                onChange={(e) => {
                  onUpdateNodeProperties({
                    apiDetails: {
                      ...selectedNode.data.apiDetails,
                      method: e.target.value,
                    },
                  });
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <label>Headers (JSON format)</label>
            <textarea
              placeholder='{"Content-Type": "application/json", "Authorization": "Bearer {{token}}"}'
              rows={3}
              value={JSON.stringify(
                selectedNode.data.apiDetails?.headers || {},
                null,
                2
              )}
              onChange={(e) => {
                try {
                  const headers = JSON.parse(e.target.value);
                  onUpdateNodeProperties({
                    apiDetails: {
                      ...selectedNode.data.apiDetails,
                      headers,
                    },
                  });
                } catch (error) {
                  // Allow invalid JSON during typing, but don't update state
                }
              }}
            />

            <label>Body (JSON format)</label>
            <textarea
              placeholder='{"key": "value", "user": "{{user_name}}"}'
              rows={4}
              value={selectedNode.data.apiDetails?.body || "{}"}
              onChange={(e) => {
                onUpdateNodeProperties({
                  apiDetails: {
                    ...selectedNode.data.apiDetails,
                    body: e.target.value,
                  },
                });
              }}
            />
          </div>
        );
        break;

      case "template":
        specificProperties = (
          <div className="property-field template-fields">
            <label>Template Name</label>
            <input
              type="text"
              placeholder="my_template_name"
              value={selectedNode.data.templateDetails?.name || ""}
              onChange={(e) => {
                onUpdateNodeProperties({
                  templateDetails: {
                    ...selectedNode.data.templateDetails,
                    name: e.target.value,
                  },
                });
              }}
            />

            <label>Language</label>
            <select
              value={selectedNode.data.templateDetails?.language || "en"}
              onChange={(e) => {
                onUpdateNodeProperties({
                  templateDetails: {
                    ...selectedNode.data.templateDetails,
                    language: e.target.value,
                  },
                });
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="pt">Portuguese</option>
              <option value="ar">Arabic</option>
              <option value="hi">Hindi</option>
              <option value="zh">Chinese</option>
            </select>

            <label>
              Template Parameters
              <button
                className="add-param-button"
                onClick={() => {
                  const newParams = [
                    ...(selectedNode.data.templateDetails?.parameters || []),
                    {
                      id: `param_${Date.now()}`,
                      key: "",
                      value: "",
                    },
                  ];
                  onUpdateNodeProperties({
                    templateDetails: {
                      ...selectedNode.data.templateDetails,
                      parameters: newParams,
                    },
                  });
                }}
              >
                {renderIcon("Plus", 14)} Add Parameter
              </button>
            </label>

            <div className="params-list">
              {(selectedNode.data.templateDetails?.parameters || []).map(
                (param, index) => (
                  <div key={param.id} className="param-row">
                    <input
                      type="text"
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) => {
                        const newParams = [
                          ...selectedNode.data.templateDetails.parameters,
                        ];
                        newParams[index] = {
                          ...newParams[index],
                          key: e.target.value,
                        };
                        onUpdateNodeProperties({
                          templateDetails: {
                            ...selectedNode.data.templateDetails,
                            parameters: newParams,
                          },
                        });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Value or {{variable}}"
                      value={param.value}
                      onChange={(e) => {
                        const newParams = [
                          ...selectedNode.data.templateDetails.parameters,
                        ];
                        newParams[index] = {
                          ...newParams[index],
                          value: e.target.value,
                        };
                        onUpdateNodeProperties({
                          templateDetails: {
                            ...selectedNode.data.templateDetails,
                            parameters: newParams,
                          },
                        });
                      }}
                    />
                    <button
                      className="remove-param"
                      onClick={() => {
                        const newParams =
                          selectedNode.data.templateDetails.parameters.filter(
                            (_, i) => i !== index
                          );
                        onUpdateNodeProperties({
                          templateDetails: {
                            ...selectedNode.data.templateDetails,
                            parameters: newParams,
                          },
                        });
                      }}
                    >
                      {renderIcon("X", 14)}
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        );
        break;

      case "delay":
        specificProperties = (
          <div className="property-field delay-fields">
            <label>Delay Duration</label>
            <div className="delay-input-group">
              <input
                type="number"
                min="1"
                value={selectedNode.data.delayTime?.value || 5}
                onChange={(e) => {
                  onUpdateNodeProperties({
                    delayTime: {
                      ...selectedNode.data.delayTime,
                      value: parseInt(e.target.value, 10) || 1,
                    },
                  });
                }}
              />
              <select
                value={selectedNode.data.delayTime?.unit || "minutes"}
                onChange={(e) => {
                  onUpdateNodeProperties({
                    delayTime: {
                      ...selectedNode.data.delayTime,
                      unit: e.target.value,
                    },
                  });
                }}
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        );
        break;

      case "webhook":
        specificProperties = (
          <div className="property-field webhook-fields">
            <label>Webhook URL</label>
            <input
              type="text"
              placeholder="https://webhooks.example.com/trigger"
              value={selectedNode.data.webhookDetails?.url || ""}
              onChange={(e) => {
                onUpdateNodeProperties({
                  webhookDetails: {
                    ...selectedNode.data.webhookDetails,
                    url: e.target.value,
                  },
                });
              }}
            />

            <div className="method-selector">
              <label>Method</label>
              <select
                value={selectedNode.data.webhookDetails?.method || "POST"}
                onChange={(e) => {
                  onUpdateNodeProperties({
                    webhookDetails: {
                      ...selectedNode.data.webhookDetails,
                      method: e.target.value,
                    },
                  });
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
              </select>
            </div>

            <label>Headers (JSON format)</label>
            <textarea
              placeholder='{"Content-Type": "application/json"}'
              rows={3}
              value={JSON.stringify(
                selectedNode.data.webhookDetails?.headers || {},
                null,
                2
              )}
              onChange={(e) => {
                try {
                  const headers = JSON.parse(e.target.value);
                  onUpdateNodeProperties({
                    webhookDetails: {
                      ...selectedNode.data.webhookDetails,
                      headers,
                    },
                  });
                } catch (error) {
                  // Allow invalid JSON during typing, but don't update state
                }
              }}
            />

            <label>Payload (JSON format)</label>
            <textarea
              placeholder='{"event": "flow_triggered", "data": {{flow_data}}}'
              rows={4}
              value={selectedNode.data.webhookDetails?.payload || "{}"}
              onChange={(e) => {
                onUpdateNodeProperties({
                  webhookDetails: {
                    ...selectedNode.data.webhookDetails,
                    payload: e.target.value,
                  },
                });
              }}
            />
          </div>
        );
        break;

      case "start":
      case "end":
        specificProperties = (
          <div className="property-field">
            <p className="node-description">
              {selectedNode.type === "start"
                ? "This node represents the starting point of your bot flow. Users will begin their journey here."
                : "This node represents the end of a conversation path. The bot flow will terminate when it reaches this point."}
            </p>
          </div>
        );
        break;

      default:
        specificProperties = (
          <div className="property-field">
            <p>No specific properties for this node type.</p>
          </div>
        );
    }

    return (
      <>
        {commonProperties}
        {specificProperties}
        <button
          className="action-button danger full-width"
          onClick={() => onRemoveNode(selectedNode.id)}
        >
          {renderIcon("Trash", 16)}
          <span>Delete Node</span>
        </button>
      </>
    );
  };

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>Properties</h3>
      </div>

      <div className="panel-content">
        {selectedNode ? (
          <div className="property-fields">{renderNodeProperties()}</div>
        ) : (
          <div className="empty-state">
            <p>Select a node to view and edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotBuilderProperties;
