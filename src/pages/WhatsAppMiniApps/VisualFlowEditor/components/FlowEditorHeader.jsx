import React, { useState } from "react";
import { ChevronLeft, Save, Play, Pause } from "lucide-react";

const FlowEditorHeader = ({
  workflowName,
  setWorkflowName,
  isActive,
  onToggleActive,
  onSave,
  onSimulate,
  isSimulating,
  onStopSimulation,
  onBackToManagement,
  isExistingWorkflow,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(workflowName);

  const handleNameClick = () => {
    setEditName(workflowName);
    setIsEditing(true);
  };

  const handleNameSave = () => {
    if (editName.trim()) {
      setWorkflowName(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditName(workflowName);
    }
  };

  return (
    <div className="editor-header">
      <div className="header-left">
        <button className="back-button" onClick={onBackToManagement}>
          <ChevronLeft size={16} />
          Back to Workflows
        </button>

        <div className="workflow-name-container">
          {isEditing ? (
            <input
              type="text"
              className="workflow-name-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <h1 className="workflow-name" onClick={handleNameClick}>
              {workflowName}
            </h1>
          )}
        </div>
      </div>

      <div className="header-right">
        <label className="toggle-button">
          <span>{isActive ? "Active" : "Inactive"}</span>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={isActive}
              onChange={onToggleActive}
            />
            <span className="toggle-slider"></span>
          </div>
        </label>

        <button
          className="header-button simulate-button"
          onClick={isSimulating ? onStopSimulation : onSimulate}
        >
          {isSimulating ? (
            <>
              <Pause size={16} />
              Stop Simulation
            </>
          ) : (
            <>
              <Play size={16} />
              Test Workflow
            </>
          )}
        </button>

        <button className="header-button save-button" onClick={onSave}>
          <Save size={16} />
          Save {isExistingWorkflow ? "Changes" : "Workflow"}
        </button>
      </div>
    </div>
  );
};

export default FlowEditorHeader;
