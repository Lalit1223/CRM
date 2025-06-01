// src/pages/WorkflowBuilder/components/WorkflowHeader.jsx
import React from "react";
import {
  Save,
  ArrowLeft,
  Play,
  Square,
  Settings,
  Eye,
  Download,
  Upload,
} from "lucide-react";

const WorkflowHeader = ({
  workflow,
  onWorkflowChange,
  onSave,
  onBack,
  isSimulating,
  onStartSimulation,
  onStopSimulation,
  onOpenSimulation,
  saving = false,
}) => {
  const handleNameChange = (e) => {
    onWorkflowChange({
      ...workflow,
      name: e.target.value,
    });
  };

  const handleDescriptionChange = (e) => {
    onWorkflowChange({
      ...workflow,
      description: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    onWorkflowChange({
      ...workflow,
      category: e.target.value,
    });
  };

  const toggleActive = () => {
    onWorkflowChange({
      ...workflow,
      isActive: !workflow.isActive,
    });
  };

  return (
    <div className="workflow-header">
      <div className="workflow-header-left">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="workflow-title-section">
          <input
            type="text"
            value={workflow.name}
            onChange={handleNameChange}
            className="workflow-title-input"
            placeholder="Workflow Name"
          />
          <input
            type="text"
            value={workflow.description}
            onChange={handleDescriptionChange}
            className="workflow-description-input"
            placeholder="Workflow Description"
          />
        </div>
      </div>

      <div className="workflow-header-center">
        <select
          value={workflow.category}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="general">General</option>
          <option value="kyc">KYC</option>
          <option value="onboarding">Onboarding</option>
          <option value="sales">Sales</option>
          <option value="support">Support</option>
          <option value="property-sales">Property Sales</option>
          <option value="finance">Finance</option>
        </select>

        <label className="status-toggle">
          <input
            type="checkbox"
            checked={workflow.isActive}
            onChange={toggleActive}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            {workflow.isActive ? "Active" : "Inactive"}
          </span>
        </label>
      </div>

      <div className="workflow-header-right">
        {!isSimulating ? (
          <>
            <button
              className="btn btn-secondary"
              onClick={onOpenSimulation}
              title="Open Simulation Panel"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              className="btn btn-success"
              onClick={onStartSimulation}
              disabled={!workflow.startNodeId}
              title="Start Simulation"
            >
              <Play className="w-4 h-4" />
              Test
            </button>
          </>
        ) : (
          <button
            className="btn btn-danger"
            onClick={onStopSimulation}
            title="Stop Simulation"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        )}

        <button
          className="btn btn-primary"
          onClick={onSave}
          disabled={saving}
          title="Save Workflow"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default WorkflowHeader;
