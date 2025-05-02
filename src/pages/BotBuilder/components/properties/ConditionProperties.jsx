// src/pages/BotBuilder/components/properties/ConditionProperties.jsx
import React from "react";
import * as Icons from "lucide-react";

/**
 * Property editor for Condition node type
 */
const ConditionProperties = ({ nodeData, onUpdate }) => {
  // Render icon helper
  const renderIcon = (iconName, size = 16) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={size} strokeWidth={2} /> : null;
  };

  // Current condition state
  const condition = nodeData.condition || {
    variable: "",
    operator: "==",
    value: "",
  };

  // Handle updating the condition
  const handleConditionChange = (field, value) => {
    onUpdate({
      condition: {
        ...condition,
        [field]: value,
      },
    });
  };

  return (
    <div className="property-field condition-fields">
      <label>Condition Expression</label>

      <input
        type="text"
        placeholder="Variable name or {{placeholder}}"
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

      <div className="condition-hint">
        {renderIcon("Info", 14)}
        <span>
          Example: <code>{{ user_input }} contains "yes"</code> will check if
          the user's input contains the word "yes".
        </span>
      </div>

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
};

export default ConditionProperties;
