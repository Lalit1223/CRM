import React, { useState } from "react";
import { Info, AlertCircle } from "lucide-react";

const ApiProperties = ({ nodeData, onUpdate }) => {
  // Local state for JSON validation
  const [headersError, setHeadersError] = useState(null);
  const [bodyError, setBodyError] = useState(null);

  // API details state
  const apiDetails = nodeData.apiDetails || {
    url: "",
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: {},
  };

  // Handle API details changes
  const handleApiDetailChange = (field, value) => {
    const updatedApiDetails = {
      ...apiDetails,
      [field]: value,
    };

    onUpdate({ apiDetails: updatedApiDetails });
  };

  // Handle JSON input for headers
  const handleHeadersChange = (e) => {
    try {
      const headersObj = JSON.parse(e.target.value);
      setHeadersError(null);
      handleApiDetailChange("headers", headersObj);
    } catch (error) {
      setHeadersError("Invalid JSON format");
      // Don't update the state with invalid JSON
    }
  };

  // Handle JSON input for body
  const handleBodyChange = (e) => {
    try {
      const bodyObj = JSON.parse(e.target.value);
      setBodyError(null);
      handleApiDetailChange("body", bodyObj);
    } catch (error) {
      setBodyError("Invalid JSON format");
      // Don't update the state with invalid JSON
    }
  };

  // Handle response field change
  const handleResponseFieldChange = (e) => {
    onUpdate({ responseField: e.target.value });
  };

  return (
    <div className="property-group">
      <h4>API Request Settings</h4>

      <div className="property-field">
        <label>URL</label>
        <input
          type="text"
          placeholder="https://api.example.com/endpoint"
          value={apiDetails.url || ""}
          onChange={(e) => handleApiDetailChange("url", e.target.value)}
        />
      </div>

      <div className="property-field">
        <label>Method</label>
        <select
          value={apiDetails.method || "GET"}
          onChange={(e) => handleApiDetailChange("method", e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div className="property-field">
        <label>Headers (JSON)</label>
        <textarea
          placeholder={'{\n  "Content-Type": "application/json"\n}'}
          value={JSON.stringify(apiDetails.headers || {}, null, 2)}
          onChange={handleHeadersChange}
          rows="4"
          className={headersError ? "error" : ""}
        />
        {headersError && (
          <div className="field-error">
            <AlertCircle size={12} />
            <span>{headersError}</span>
          </div>
        )}
      </div>

      <div className="property-field">
        <label>Body (JSON)</label>
        <textarea
          placeholder={'{\n  "key": "value"\n}'}
          value={JSON.stringify(apiDetails.body || {}, null, 2)}
          onChange={handleBodyChange}
          rows="4"
          className={bodyError ? "error" : ""}
          disabled={apiDetails.method === "GET"}
        />
        {bodyError && (
          <div className="field-error">
            <AlertCircle size={12} />
            <span>{bodyError}</span>
          </div>
        )}
        {apiDetails.method === "GET" && (
          <div className="field-hint">
            <Info size={12} />
            <span>GET requests cannot have a body</span>
          </div>
        )}
      </div>

      <div className="property-field">
        <label>Response Field</label>
        <input
          type="text"
          placeholder="e.g., api_response"
          value={nodeData.responseField || ""}
          onChange={handleResponseFieldChange}
        />
        <div className="field-hint">
          <span>
            Name of the variable where the API response will be stored
          </span>
        </div>
      </div>

      <div className="api-paths">
        <div className="api-path">
          <span className="path-label success">Success path</span>
          <span className="path-description">
            This path is taken if the API request is successful
          </span>
        </div>

        <div className="api-path">
          <span className="path-label error">Error path</span>
          <span className="path-description">
            This path is taken if the API request fails
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApiProperties;
