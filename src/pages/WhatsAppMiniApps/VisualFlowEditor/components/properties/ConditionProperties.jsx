import React from "react";
import { Info } from "lucide-react";

const ConditionProperties = ({ nodeData, onUpdate, nodes }) => {
  // Current condition state
  const condition = nodeData.condition || {
    variable: "",
    operator: "==",
    value: "",
  };

  // Handle condition field changes
  const handleConditionChange = (field, value) => {
    const updatedCondition = {
      ...condition,
      [field]: value,
    };

    onUpdate({ condition: updatedCondition });
  };

  return (
    <div className="property-group">
      <h4>Condition Settings</h4>

      <div className="property-field condition-fields">
        <label>If</label>
        <input
          type="text"
          placeholder="Variable name (e.g., user_response)"
          value={condition.variable || ""}
          onChange={(e) => handleConditionChange("variable", e.target.value)}
        />

        <select
          value={condition.operator || "=="}
          onChange={(e) => handleConditionChange("operator", e.target.value)}
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
          value={condition.value || ""}
          onChange={(e) => handleConditionChange("value", e.target.value)}
        />
      </div>

      <div className="condition-hint">
        <Info size={14} />
        <span>
          The condition controls which path is taken. You can compare variables
          with values.
        </span>
      </div>

      <div className="condition-paths">
        <div className="condition-path">
          <span className="path-label yes">Yes path</span>
          <span className="path-description">
            This path is taken if the condition is true
          </span>
        </div>

        <div className="condition-path">
          <span className="path-label no">No path</span>
          <span className="path-description">
            This path is taken if the condition is false
          </span>
        </div>
      </div>

      <div className="property-field">
        <label>Variable Reference</label>
        <div className="variable-reference">
          <div className="reference-item">
            <code>user_response</code> - User's last message or selection
          </div>
          <div className="reference-item">
            <code>api_response</code> - Data from API node
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionProperties;
