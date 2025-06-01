// src/pages/WorkflowBuilder/components/NodeEditor.jsx
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Info, Zap } from "lucide-react";
import { NODE_TYPES, SUREPASS_ENDPOINTS } from "../../../types/workflow";
import { workflowAPI } from "../../../utils/api";

const LOCAL_SUREPASS_ENDPOINTS = [
  {
    endpoint: "/api/verification/aadhaar-v2/generate-otp",
    name: "Aadhaar Verification",
    method: "POST",
    requiredParams: ["aadhaar_number"],
    description: "Verify Aadhaar number using SurePass API",
  },
  {
    endpoint: "/api/verification/aadhaar-v2/submit-otp",
    name: "Aadhaar OTP Verification",
    method: "POST",
    requiredParams: ["client_id", "otp"],
    description: "Verify Aadhaar OTP using SurePass API",
  },
  {
    endpoint: "/api/verification/pan",
    name: "PAN Verification",
    method: "POST",
    requiredParams: ["pan_number"],
    description: "Verify PAN number using SurePass API",
  },
  {
    endpoint: "/api/verification/aadhaar-pan-link",
    name: "Aadhaar-PAN Link Check",
    method: "POST",
    requiredParams: ["aadhaar_number", "pan_number"],
    description: "Check if Aadhaar and PAN are linked",
  },
  {
    endpoint: "/api/verification/bank-verification",
    name: "Bank Account Verification",
    method: "POST",
    requiredParams: ["account_number", "ifsc"],
    description: "Verify bank account using SurePass API",
  },
  {
    endpoint: "/api/verification/chassis-to-rc-details",
    name: "Chassis to RC Details",
    method: "POST",
    requiredParams: ["chassis_number"],
    description: "Get RC details by vehicle chassis number using SurePass API",
  },
  {
    endpoint: "/api/verification/company-details",
    name: "Company Details Verification",
    method: "POST",
    requiredParams: ["cin_number"],
    description: "Get company details by CIN using SurePass API",
  },
  {
    endpoint: "/api/verification/din-verification",
    name: "DIN Verification",
    method: "POST",
    requiredParams: ["din_number"],
    description: "Verify Director Identification Number using SurePass API",
  },
  {
    endpoint: "/api/verification/fssai",
    name: "FSSAI License Verification",
    method: "POST",
    requiredParams: ["id_number"],
    description: "Verify FSSAI license details using SurePass API",
  },
  {
    endpoint: "/api/verification/gstin",
    name: "GSTIN Verification",
    method: "POST",
    requiredParams: ["id_number"],
    description: "Verify GSTIN details using SurePass API",
  },
  {
    endpoint: "/api/verification/icai",
    name: "ICAI Membership Verification",
    method: "POST",
    requiredParams: ["membership_number"],
    description: "Verify ICAI membership details using SurePass API",
  },
];

const NodeEditor = ({ node, isOpen, onClose, onSave }) => {
  // DEBUG: Add console logs
  //   console.log("🔍 NodeEditor props:", {
  //     node: !!node,
  //     isOpen,
  //     onSave: typeof onSave,
  //   });

  const [editedNode, setEditedNode] = useState(node || {});
  const [activeTab, setActiveTab] = useState("basic");
  const [surePassEndpoints, setSurePassEndpoints] = useState(
    LOCAL_SUREPASS_ENDPOINTS
  );
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (node) {
      //console.log("🔄 Setting node:", node);
      setEditedNode({ ...node });
      setValidationErrors({});
    }
  }, [node]);

  useEffect(() => {
    if (isOpen && editedNode.type === "api") {
      setSurePassEndpoints(LOCAL_SUREPASS_ENDPOINTS);
      loadSurePassEndpoints();
    }
  }, [isOpen, editedNode.type]);

  const loadSurePassEndpoints = async () => {
    try {
      const response = await workflowAPI.getSurePassEndpoints();
      if (
        response.success &&
        response.data.endpoints &&
        response.data.endpoints.length > 0
      ) {
        const backendEndpoints = response.data.endpoints.filter(
          (ep) => ep.endpoint && ep.endpoint.includes("/v1/")
        );
        if (backendEndpoints.length > 0) {
          setSurePassEndpoints(backendEndpoints);
        }
      }
    } catch (error) {
      console.error("Error loading SurePass endpoints:", error);
    }
  };

  const validateNode = () => {
    //console.log("✅ Validating node:", editedNode);
    const errors = {};

    if (!editedNode.name?.trim()) {
      errors.name = "Node name is required";
    }

    if (editedNode.type === "input" && !editedNode.variableName?.trim()) {
      errors.variableName = "Variable name is required for input nodes";
    }

    if (editedNode.type === "condition" && !editedNode.condition?.trim()) {
      errors.condition = "Condition is required";
    }

    if (editedNode.type === "api") {
      if (!editedNode.apiEndpoint?.trim()) {
        errors.apiEndpoint = "API endpoint is required";
      }
      if (!editedNode.apiMethod) {
        errors.apiMethod = "API method is required";
      }
    }

    if (editedNode.type === "delay") {
      const delay = parseInt(editedNode.delay);
      if (!delay || delay < 1 || delay > 300) {
        errors.delay = "Delay must be between 1 and 300 seconds";
      }
    }

    //console.log("❌ Validation errors:", errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    //console.log("💾 Save button clicked!");
    //console.log("📝 Current editedNode:", editedNode);
    //console.log("🔧 onSave function:", typeof onSave);

    if (!onSave) {
      console.error("❌ onSave function is not provided!");
      alert("Error: Save function is not available. Check parent component.");
      return;
    }

    if (!validateNode()) {
      //console.log("❌ Validation failed");
      return;
    }

    //console.log("✅ Validation passed, processing...");

    // Create a copy to avoid mutations
    const nodeToSave = { ...editedNode };

    // Process options for interactive nodes
    if (nodeToSave.type === "interactive" && nodeToSave.optionsText) {
      const options = nodeToSave.optionsText
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [text, value] = line.split("|");
          return {
            text: text?.trim() || "",
            value: value?.trim() || text?.trim() || "",
          };
        });
      nodeToSave.options = options;
    }

    // Process API parameters
    if (nodeToSave.type === "api" && nodeToSave.apiParamsText) {
      try {
        nodeToSave.apiParams = JSON.parse(nodeToSave.apiParamsText);
      } catch (error) {
        console.error("❌ JSON parse error:", error);
        setValidationErrors({ apiParamsText: "Invalid JSON format" });
        return;
      }
    }

    // Ensure surePassConfig exists for API nodes
    if (nodeToSave.type === "api" && !nodeToSave.surePassConfig) {
      nodeToSave.surePassConfig = {
        isKycVerification: true,
        requiredParams: [],
        endpointName: "API Verification",
        description: "API call for verification",
      };
    }

    //console.log("📤 Final node to save:", nodeToSave);

    try {
      //console.log("🚀 Calling onSave...");
      onSave(nodeToSave);
      //console.log("✅ onSave called successfully");

      //console.log("🚪 Calling onClose...");
      onClose();
      //console.log("✅ onClose called successfully");
    } catch (error) {
      console.error("❌ Error during save:", error);
      alert(`Error saving node: ${error.message}`);
    }
  };

  const handleFieldChange = (field, value) => {
    //console.log(`🔄 Field changed: ${field} = ${value}`);
    setEditedNode((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const addOption = () => {
    const options = editedNode.options || [];
    setEditedNode((prev) => ({
      ...prev,
      options: [
        ...options,
        {
          text: `Option ${options.length + 1}`,
          value: `option${options.length + 1}`,
        },
      ],
    }));
  };

  const removeOption = (index) => {
    const options = editedNode.options || [];
    setEditedNode((prev) => ({
      ...prev,
      options: options.filter((_, i) => i !== index),
    }));
  };

  const updateOption = (index, field, value) => {
    const options = [...(editedNode.options || [])];
    options[index] = { ...options[index], [field]: value };
    setEditedNode((prev) => ({ ...prev, options }));
  };

  const handleSurePassEndpointSelect = (endpoint) => {
    //console.log("🔧 SurePass endpoint selected:", endpoint);
    const verificationStep = endpoint.endpoint
      .split("/")
      .pop()
      .replace("-", "_");

    setEditedNode((prev) => ({
      ...prev,
      apiEndpoint: endpoint.endpoint,
      apiMethod: endpoint.method,
      surePassConfig: {
        endpointName: endpoint.name,
        description: endpoint.description,
        isKycVerification: true,
        verificationStep: verificationStep,
        requiredParams: endpoint.requiredParams || [],
        responseMapping: {
          success: "data.verified",
          name: "data.name",
          status: "data.status",
        },
      },
    }));
  };

  if (!isOpen || !node) {
    //console.log("🚫 Modal not rendering:", { isOpen, node: !!node });
    return null;
  }

  const nodeConfig = NODE_TYPES[editedNode.type] || NODE_TYPES.message;

  return (
    <div className="node-editor-overlay">
      <div className="node-editor">
        <div className="node-editor-header">
          <div className="editor-title">
            <div className={`node-icon ${nodeConfig.color}`}>
              <span className="icon-placeholder">{nodeConfig.label[0]}</span>
            </div>
            <div>
              <h3>Edit {nodeConfig.label} Node</h3>
              <p>Configure node properties and behavior</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="node-editor-tabs">
          <button
            className={`tab ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic
          </button>
          {editedNode.type === "api" && (
            <button
              className={`tab ${activeTab === "api" ? "active" : ""}`}
              onClick={() => setActiveTab("api")}
            >
              API Settings
            </button>
          )}
          {editedNode.type === "condition" && (
            <button
              className={`tab ${activeTab === "logic" ? "active" : ""}`}
              onClick={() => setActiveTab("logic")}
            >
              Logic
            </button>
          )}
          <button
            className={`tab ${activeTab === "advanced" ? "active" : ""}`}
            onClick={() => setActiveTab("advanced")}
          >
            Advanced
          </button>
        </div>

        <div className="node-editor-content">
          {activeTab === "basic" && (
            <div className="editor-section">
              <div className="form-group">
                <label>Node Name *</label>
                <input
                  type="text"
                  value={editedNode.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className={validationErrors.name ? "error" : ""}
                  placeholder="Enter node name"
                />
                {validationErrors.name && (
                  <div className="error-message">{validationErrors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label>Node Type</label>
                <select
                  value={editedNode.type || "message"}
                  onChange={(e) => handleFieldChange("type", e.target.value)}
                  className="type-select"
                >
                  {Object.entries(NODE_TYPES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {editedNode.type !== "end" && editedNode.type !== "condition" && (
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={editedNode.content || ""}
                    onChange={(e) =>
                      handleFieldChange("content", e.target.value)
                    }
                    rows={3}
                    placeholder={`Enter ${nodeConfig.label.toLowerCase()} content...`}
                  />
                </div>
              )}

              {editedNode.type === "input" && (
                <div className="form-group">
                  <label>Variable Name *</label>
                  <input
                    type="text"
                    value={editedNode.variableName || ""}
                    onChange={(e) =>
                      handleFieldChange("variableName", e.target.value)
                    }
                    className={validationErrors.variableName ? "error" : ""}
                    placeholder="e.g., aadhaar_number, pan_number"
                  />
                  {validationErrors.variableName && (
                    <div className="error-message">
                      {validationErrors.variableName}
                    </div>
                  )}
                  <div className="help-text">
                    This variable will store the user's input
                  </div>
                </div>
              )}

              {editedNode.type === "delay" && (
                <div className="form-group">
                  <label>Delay Duration (seconds) *</label>
                  <input
                    type="number"
                    value={editedNode.delay || 1}
                    onChange={(e) =>
                      handleFieldChange("delay", parseInt(e.target.value))
                    }
                    className={validationErrors.delay ? "error" : ""}
                    min="1"
                    max="300"
                  />
                  {validationErrors.delay && (
                    <div className="error-message">
                      {validationErrors.delay}
                    </div>
                  )}
                </div>
              )}

              {editedNode.type === "interactive" && (
                <div className="form-group">
                  <label>Options</label>
                  <div className="options-list">
                    {(editedNode.options || []).map((option, index) => (
                      <div key={index} className="option-item">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            updateOption(index, "text", e.target.value)
                          }
                          placeholder="Option text"
                          className="option-text"
                        />
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) =>
                            updateOption(index, "value", e.target.value)
                          }
                          placeholder="Option value"
                          className="option-value"
                        />
                        <button
                          className="remove-option"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button className="add-option" onClick={addOption}>
                      <Plus className="w-4 h-4" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              {editedNode.type === "condition" && (
                <div className="form-group">
                  <label>Condition Expression *</label>
                  <input
                    type="text"
                    value={editedNode.condition || ""}
                    onChange={(e) =>
                      handleFieldChange("condition", e.target.value)
                    }
                    className={validationErrors.condition ? "error" : ""}
                    placeholder="e.g., api_response.data.verified === true"
                  />
                  {validationErrors.condition && (
                    <div className="error-message">
                      {validationErrors.condition}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "api" && editedNode.type === "api" && (
            <div className="editor-section">
              <div className="surepass-section">
                <div className="section-header">
                  <Zap className="w-4 h-4" />
                  <span>SurePass Integration</span>
                </div>
                <div className="surepass-endpoints">
                  {surePassEndpoints.map((endpoint, index) => (
                    <div
                      key={index}
                      className={`endpoint-item ${
                        editedNode.apiEndpoint === endpoint.endpoint
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleSurePassEndpointSelect(endpoint)}
                    >
                      <div className="endpoint-name">{endpoint.name}</div>
                      <div className="endpoint-details">
                        <span className="method">{endpoint.method}</span>
                        <span className="path">{endpoint.endpoint}</span>
                      </div>
                      <div className="endpoint-description">
                        {endpoint.description}
                      </div>
                      {endpoint.requiredParams &&
                        endpoint.requiredParams.length > 0 && (
                          <div className="endpoint-params">
                            <small>
                              Required: {endpoint.requiredParams.join(", ")}
                            </small>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>API Endpoint *</label>
                <input
                  type="text"
                  value={editedNode.apiEndpoint || ""}
                  onChange={(e) =>
                    handleFieldChange("apiEndpoint", e.target.value)
                  }
                  className={validationErrors.apiEndpoint ? "error" : ""}
                  placeholder="/api/v1/verification/aadhaar"
                />
                {validationErrors.apiEndpoint && (
                  <div className="error-message">
                    {validationErrors.apiEndpoint}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>HTTP Method *</label>
                <select
                  value={editedNode.apiMethod || "POST"}
                  onChange={(e) =>
                    handleFieldChange("apiMethod", e.target.value)
                  }
                  className={validationErrors.apiMethod ? "error" : ""}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div className="form-group">
                <label>API Parameters (JSON)</label>
                <textarea
                  value={
                    editedNode.apiParamsText ||
                    JSON.stringify(editedNode.apiParams || {}, null, 2)
                  }
                  onChange={(e) =>
                    handleFieldChange("apiParamsText", e.target.value)
                  }
                  className={validationErrors.apiParamsText ? "error" : ""}
                  rows={4}
                  placeholder='{"aadhaar_number": "{{aadhaar_number}}"}'
                />
                {validationErrors.apiParamsText && (
                  <div className="error-message">
                    {validationErrors.apiParamsText}
                  </div>
                )}
                <div className="help-text">
                  Use {`{{variable_name}}`} to reference workflow variables
                </div>
              </div>

              {/* SurePass Configuration Display */}
              {editedNode.surePassConfig && (
                <div className="form-group">
                  <label>SurePass Configuration</label>
                  <div className="surepass-config-display">
                    <div className="config-item">
                      <strong>Verification Step:</strong>{" "}
                      {editedNode.surePassConfig.verificationStep ||
                        "Not specified"}
                    </div>
                    <div className="config-item">
                      <strong>Required Parameters:</strong>{" "}
                      {editedNode.surePassConfig.requiredParams &&
                      editedNode.surePassConfig.requiredParams.length > 0
                        ? editedNode.surePassConfig.requiredParams.join(", ")
                        : "None"}
                    </div>
                    <div className="config-item">
                      <strong>KYC Verification:</strong>{" "}
                      {editedNode.surePassConfig.isKycVerification
                        ? "Yes"
                        : "No"}
                    </div>
                    {editedNode.surePassConfig.endpointName && (
                      <div className="config-item">
                        <strong>Endpoint Name:</strong>{" "}
                        {editedNode.surePassConfig.endpointName}
                      </div>
                    )}
                    {editedNode.surePassConfig.description && (
                      <div className="config-item">
                        <strong>Description:</strong>{" "}
                        {editedNode.surePassConfig.description}
                      </div>
                    )}
                    {editedNode.surePassConfig.responseMapping && (
                      <div className="config-item">
                        <strong>Response Mapping:</strong>
                        <div className="response-mapping">
                          {Object.entries(
                            editedNode.surePassConfig.responseMapping
                          ).map(([key, value]) => (
                            <div key={key} className="mapping-item">
                              <code>{key}</code> → <code>{value}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="help-text">
                    This configuration is automatically set when you select a
                    SurePass endpoint above.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "logic" && editedNode.type === "condition" && (
            <div className="editor-section">
              <div className="form-group">
                <label>Condition Expression *</label>
                <input
                  type="text"
                  value={editedNode.condition || ""}
                  onChange={(e) =>
                    handleFieldChange("condition", e.target.value)
                  }
                  className={validationErrors.condition ? "error" : ""}
                  placeholder="e.g., api_response.data.verified === true"
                />
                {validationErrors.condition && (
                  <div className="error-message">
                    {validationErrors.condition}
                  </div>
                )}
              </div>

              <div className="condition-help">
                <div className="help-section">
                  <h4>Available Operators:</h4>
                  <ul>
                    <li>
                      <code>===</code> - Equal to
                    </li>
                    <li>
                      <code>!==</code> - Not equal to
                    </li>
                    <li>
                      <code>&gt;</code> - Greater than
                    </li>
                    <li>
                      <code>&lt;</code> - Less than
                    </li>
                    <li>
                      <code>&gt;=</code> - Greater than or equal
                    </li>
                    <li>
                      <code>&lt;=</code> - Less than or equal
                    </li>
                  </ul>
                </div>
                <div className="help-section">
                  <h4>Examples for SurePass:</h4>
                  <ul>
                    <li>
                      <code>api_response.data.verified === true</code>
                    </li>
                    <li>
                      <code>api_response.data.status === "success"</code>
                    </li>
                    <li>
                      <code>verify_bank === "yes"</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="editor-section">
              <div className="form-group">
                <label>Node ID</label>
                <input
                  type="text"
                  value={editedNode.nodeId || ""}
                  disabled
                  className="readonly"
                />
              </div>

              <div className="form-group">
                <label>Error Handling</label>
                <select
                  value={editedNode.errorHandling || "continue"}
                  onChange={(e) =>
                    handleFieldChange("errorHandling", e.target.value)
                  }
                >
                  <option value="continue">Continue on error</option>
                  <option value="stop">Stop workflow on error</option>
                  <option value="retry">Retry on error</option>
                </select>
              </div>

              {editedNode.type === "api" && (
                <div className="form-group">
                  <label>Timeout (seconds)</label>
                  <input
                    type="number"
                    value={editedNode.timeout || 30}
                    onChange={(e) =>
                      handleFieldChange("timeout", parseInt(e.target.value))
                    }
                    min="1"
                    max="300"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={editedNode.notes || ""}
                  onChange={(e) => handleFieldChange("notes", e.target.value)}
                  rows={3}
                  placeholder="Add notes about this node..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="node-editor-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeEditor;
