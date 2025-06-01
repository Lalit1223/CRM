// src/pages/BotBuilder/components/BotBuilderHeader.jsx
import React from "react";

const BotBuilderHeader = ({
  botName,
  setBotName,
  onSave,
  isEnabled,
  onToggleEnabled,
  onSimulate,
  isSimulating,
  onStopSimulation,
  onBackToManagement,
  isExistingBot = false,
}) => {
  return (
    <div className="bot-builder-header">
      <div className="bot-header-left">
        <button
          className="back-button"
          onClick={onBackToManagement}
          title="Back to Bot Management"
        >
          ← Back
        </button>

        <div className="bot-name-container">
          <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="bot-name-input"
            placeholder="Enter Bot Name"
          />
        </div>
      </div>

      <div className="bot-controls">
        <div className="toggle-container">
          <span>Status:</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={onToggleEnabled}
            />
            <span className="toggle-slider"></span>
          </label>
          <span>{isEnabled ? "Enabled" : "Disabled"}</span>
        </div>

        <button className="save-button" onClick={onSave}>
          {isExistingBot ? "Update Bot" : "Save Bot"}
        </button>

        {!isSimulating ? (
          <button className="simulate-button" onClick={onSimulate}>
            Test Bot
          </button>
        ) : (
          <button className="stop-button" onClick={onStopSimulation}>
            Stop Test
          </button>
        )}
      </div>
    </div>
  );
};

export default BotBuilderHeader;
