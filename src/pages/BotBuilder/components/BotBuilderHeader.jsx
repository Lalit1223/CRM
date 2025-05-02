// src/pages/BotBuilder/components/BotBuilderHeader.jsx
import React from "react";
import * as Icons from "lucide-react";

const BotBuilderHeader = ({
  botName,
  setBotName,
  isEditingBotName,
  setIsEditingBotName,
  lastSaved,
  isSaving,
  zoomLevel,
  handleZoom,
  handleResetView,
  handleUndo,
  handleRedo,
  handleSaveBot,
  handleNewBot,
  handleExportBot,
  handleImportBot,
  undoStack,
  redoStack,
}) => {
  // Render icon using the Icons namespace
  const renderIcon = (iconName, size = 20, strokeWidth = 2) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? (
      <IconComponent size={size} strokeWidth={strokeWidth} />
    ) : null;
  };

  // Handle file input change for import
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImportBot(file);
    // Reset the file input
    e.target.value = null;
  };

  return (
    <div className="bot-builder-header">
      <div className="left-actions">
        <button className="icon-button">{renderIcon("ArrowLeft", 18)}</button>

        {isEditingBotName ? (
          <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            onBlur={() => setIsEditingBotName(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditingBotName(false)}
            className="bot-name-input"
            autoFocus
          />
        ) : (
          <h2 onClick={() => setIsEditingBotName(true)}>{botName}</h2>
        )}

        {lastSaved && (
          <span className="last-saved">
            Last saved: {new Date(lastSaved).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="right-actions">
        <div className="zoom-controls">
          <button
            className="icon-button"
            onClick={() => handleZoom(false)}
            title="Zoom Out"
          >
            {renderIcon("ZoomOut", 16)}
          </button>
          <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
          <button
            className="icon-button"
            onClick={() => handleZoom(true)}
            title="Zoom In"
          >
            {renderIcon("ZoomIn", 16)}
          </button>
          <button
            className="icon-button"
            onClick={handleResetView}
            title="Reset View"
          >
            {renderIcon("Maximize", 16)}
          </button>
        </div>

        <div className="history-controls">
          <button
            className={`icon-button ${
              undoStack.length === 0 ? "disabled" : ""
            }`}
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            title="Undo"
          >
            {renderIcon("Undo", 16)}
          </button>
          <button
            className={`icon-button ${
              redoStack.length === 0 ? "disabled" : ""
            }`}
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo"
          >
            {renderIcon("Redo", 16)}
          </button>
        </div>

        <button
          className="action-button"
          onClick={() => alert("Bot test mode would launch here")}
        >
          {renderIcon("Play", 16)}
          <span>Test Bot</span>
        </button>

        <button
          className="action-button primary"
          onClick={handleSaveBot}
          disabled={isSaving}
        >
          {isSaving ? renderIcon("Loader", 16) : renderIcon("Save", 16)}
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>

        <div className="dropdown">
          <button className="icon-button">{renderIcon("Settings", 18)}</button>
          <div className="dropdown-content">
            <button onClick={handleNewBot}>
              {renderIcon("File", 16)}
              <span>New Bot</span>
            </button>
            <button onClick={handleExportBot}>
              {renderIcon("Download", 16)}
              <span>Export Bot</span>
            </button>
            <label className="import-button">
              {renderIcon("Upload", 16)}
              <span>Import Bot</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotBuilderHeader;
