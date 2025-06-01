import React from "react";
import { Plus, Trash2, Info } from "lucide-react";

const InputProperties = ({ nodeData, onUpdate }) => {
  // Handle question text change
  const handleQuestionChange = (e) => {
    onUpdate({ question: e.target.value });
  };

  // Handle response field change
  const handleResponseFieldChange = (e) => {
    onUpdate({ responseField: e.target.value });
  };

  // Handle wait time change
  const handleWaitTimeChange = (e) => {
    onUpdate({ waitTime: parseInt(e.target.value) || 180 });
  };

  // Handle button changes
  const handleButtonChange = (index, field, value) => {
    const updatedButtons = [...(nodeData.buttons || [])];
    updatedButtons[index] = {
      ...updatedButtons[index],
      [field]: value,
    };
    onUpdate({ buttons: updatedButtons });
  };

  // Add a new button
  const addButton = () => {
    const newButton = {
      id: Date.now().toString(),
      text: "New Button",
      value: `button_${Date.now()}`,
    };

    const updatedButtons = nodeData.buttons
      ? [...nodeData.buttons, newButton]
      : [newButton];

    onUpdate({ buttons: updatedButtons });
  };

  // Remove a button
  const removeButton = (index) => {
    const updatedButtons = (nodeData.buttons || []).filter(
      (_, i) => i !== index
    );
    onUpdate({ buttons: updatedButtons });
  };

  return (
    <div className="property-group">
      <h4>Question Settings</h4>

      <div className="property-field">
        <label>Question Text</label>
        <textarea
          placeholder="Enter your question here..."
          value={nodeData.question || ""}
          onChange={handleQuestionChange}
          rows="3"
        />
      </div>

      <div className="property-field">
        <label>Response Field</label>
        <input
          type="text"
          placeholder="e.g., user_choice"
          value={nodeData.responseField || ""}
          onChange={handleResponseFieldChange}
        />
        <div className="field-hint">
          <Info size={12} />
          <span>
            Name of the variable where the user's selection will be stored
          </span>
        </div>
      </div>

      <div className="property-field">
        <label>Wait Time (seconds)</label>
        <input
          type="number"
          min="10"
          max="300"
          value={nodeData.waitTime || 180}
          onChange={handleWaitTimeChange}
        />
        <div className="field-hint">
          <Info size={12} />
          <span>How long to wait for a response before timing out</span>
        </div>
      </div>

      <div className="property-field">
        <label>Buttons</label>
        <div className="buttons-container">
          {(nodeData.buttons || []).map((button, index) => (
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
                aria-label="Remove button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button className="add-button" onClick={addButton} type="button">
            <Plus size={14} /> Add Button
          </button>
        </div>
      </div>

      {/* Example buttons preview */}
      {nodeData.buttons && nodeData.buttons.length > 0 && (
        <div className="property-field">
          <label>Preview</label>
          <div className="buttons-preview">
            {nodeData.buttons.map((button, index) => (
              <div key={button.id || index} className="preview-button">
                {button.text || "Button"}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="property-field">
        <div className="field-hint important">
          <Info size={14} />
          <span>
            After adding buttons, connect this node to another node to define
            where the conversation should continue after the user responds.
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputProperties;
