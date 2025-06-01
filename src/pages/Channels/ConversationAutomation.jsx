// src/pages/Channels/ConversationAutomation.jsx

import React, { useState, useEffect } from "react";
import "./ConversationAutomation.css";

const ConversationAutomation = () => {
  // State for ice breakers (up to 4, 80 characters each)
  const [iceBreakers, setIceBreakers] = useState(["", "", "", ""]);

  // State for commands (up to 30)
  const [commands, setCommands] = useState([{ text: "", hint: "" }]);

  // State for saving status
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("icebreakers"); // "icebreakers" or "commands"

  // Simulating data loading
  useEffect(() => {
    // Fetch existing ice breakers and commands
    // This would be an API call in a real implementation

    // Simulate API call with setTimeout
    const loadingTimeout = setTimeout(() => {
      setIceBreakers([
        "👋 Welcome! How can we help you today?",
        "🛒 Explore our products and services",
        "❓ Get answers to frequently asked questions",
        "🔍 Learn more about our company",
      ]);

      setCommands([
        { text: "menu", hint: "Show available options" },
        { text: "products", hint: "Browse our product catalog" },
        { text: "support", hint: "Get customer support" },
        { text: "hours", hint: "See our business hours" },
        { text: "location", hint: "Find our store locations" },
      ]);
    }, 1000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  // Handle ice breaker change
  const handleIceBreakerChange = (index, value) => {
    const updatedIceBreakers = [...iceBreakers];
    updatedIceBreakers[index] = value;
    setIceBreakers(updatedIceBreakers);
  };

  // Handle command change
  const handleCommandChange = (index, field, value) => {
    const updatedCommands = [...commands];
    updatedCommands[index] = {
      ...updatedCommands[index],
      [field]: value,
    };
    setCommands(updatedCommands);
  };

  // Add new command
  const addCommand = () => {
    if (commands.length < 30) {
      setCommands([...commands, { text: "", hint: "" }]);
    }
  };

  // Remove command
  const removeCommand = (index) => {
    const updatedCommands = [...commands];
    updatedCommands.splice(index, 1);
    setCommands(updatedCommands);
  };

  // Save changes
  const saveChanges = () => {
    // Validate ice breakers
    const invalidIceBreakers = iceBreakers.filter(
      (ib) => ib.trim() !== "" && ib.length > 80
    );

    if (invalidIceBreakers.length > 0) {
      alert("Ice breakers must be 80 characters or less");
      return;
    }

    // Validate commands
    const invalidCommandTexts = commands.filter(
      (cmd) => cmd.text.trim() !== "" && cmd.text.length > 32
    );

    if (invalidCommandTexts.length > 0) {
      alert("Command text must be 32 characters or less");
      return;
    }

    const invalidCommandHints = commands.filter(
      (cmd) => cmd.hint.trim() !== "" && cmd.hint.length > 256
    );

    if (invalidCommandHints.length > 0) {
      alert("Command hints must be 256 characters or less");
      return;
    }

    // Filter out empty commands
    const filteredCommands = commands.filter(
      (cmd) => cmd.text.trim() !== "" && cmd.hint.trim() !== ""
    );

    // Filter out empty ice breakers
    const filteredIceBreakers = iceBreakers.filter((ib) => ib.trim() !== "");

    // Prepare data for submission
    const submissionData = {
      iceBreakers: filteredIceBreakers,
      commands: filteredCommands,
    };

    //console.log("Submitting data:", submissionData);

    // Simulate API call
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("success");

      // Clear status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="conversation-automation-container">
      <h1>Conversation Automation</h1>

      <div className="automation-tabs">
        <button
          className={`tab-button ${
            activeTab === "icebreakers" ? "active" : ""
          }`}
          onClick={() => setActiveTab("icebreakers")}
        >
          Ice Breakers
        </button>
        <button
          className={`tab-button ${activeTab === "commands" ? "active" : ""}`}
          onClick={() => setActiveTab("commands")}
        >
          Commands
        </button>
      </div>

      <div className="automation-content">
        {/* Ice Breakers Section */}
        {activeTab === "icebreakers" && (
          <section className="automation-section">
            <div className="section-header">
              <h2>Ice Breakers</h2>
              <p className="section-description">
                Ice breakers are shown to users when they first message your
                business. You can set up to 4 ice breakers, each limited to 80
                characters.
              </p>
            </div>

            <div className="ice-breakers-list">
              {iceBreakers.map((iceBreaker, index) => (
                <div key={index} className="form-group">
                  <label htmlFor={`ice-breaker-${index}`}>
                    Ice Breaker {index + 1}
                  </label>
                  <div className="input-with-counter">
                    <input
                      type="text"
                      id={`ice-breaker-${index}`}
                      value={iceBreaker}
                      onChange={(e) =>
                        handleIceBreakerChange(index, e.target.value)
                      }
                      maxLength={80}
                      placeholder={`Enter ice breaker text (optional)`}
                    />
                    <div
                      className={`character-count ${
                        iceBreaker.length > 70 ? "warning" : ""
                      }`}
                    >
                      {iceBreaker.length}/80
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ice-breaker-preview">
              <h3>Preview</h3>
              <div className="preview-container">
                <div className="preview-chat">
                  <div className="preview-header">
                    <div className="preview-business-name">Your Business</div>
                  </div>
                  <div className="preview-message-area">
                    <div className="preview-ice-breakers">
                      {iceBreakers
                        .filter((ib) => ib.trim() !== "")
                        .map((iceBreaker, index) => (
                          <div key={index} className="preview-ice-breaker">
                            {iceBreaker}
                          </div>
                        ))}
                      {iceBreakers.filter((ib) => ib.trim() !== "").length ===
                        0 && (
                        <div className="preview-empty">
                          No ice breakers configured
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Commands Section */}
        {activeTab === "commands" && (
          <section className="automation-section">
            <div className="section-header">
              <h2>Commands</h2>
              <p className="section-description">
                Commands are text strings that users can see by typing a forward
                slash (/) in a message. You can set up to 30 commands, each with
                a hint explaining its purpose.
              </p>
            </div>

            <div className="commands-list">
              {commands.map((command, index) => (
                <div key={index} className="command-item">
                  <div className="command-fields">
                    <div className="form-group">
                      <label htmlFor={`command-text-${index}`}>
                        Command (max 32 chars)
                      </label>
                      <div className="input-with-counter">
                        <input
                          type="text"
                          id={`command-text-${index}`}
                          value={command.text}
                          onChange={(e) =>
                            handleCommandChange(index, "text", e.target.value)
                          }
                          maxLength={32}
                          placeholder="e.g., menu, help, products"
                        />
                        <div
                          className={`character-count ${
                            command.text.length > 25 ? "warning" : ""
                          }`}
                        >
                          {command.text.length}/32
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`command-hint-${index}`}>
                        Hint (max 256 chars)
                      </label>
                      <div className="input-with-counter">
                        <input
                          type="text"
                          id={`command-hint-${index}`}
                          value={command.hint}
                          onChange={(e) =>
                            handleCommandChange(index, "hint", e.target.value)
                          }
                          maxLength={256}
                          placeholder="e.g., Show available options"
                        />
                        <div
                          className={`character-count ${
                            command.hint.length > 200 ? "warning" : ""
                          }`}
                        >
                          {command.hint.length}/256
                        </div>
                      </div>
                    </div>
                  </div>

                  {commands.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCommand(index)}
                      className="remove-command-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {commands.length < 30 && (
              <button
                type="button"
                onClick={addCommand}
                className="add-command-btn"
              >
                Add Command
              </button>
            )}

            <div className="command-preview">
              <h3>Preview</h3>
              <div className="preview-container">
                <div className="preview-chat">
                  <div className="preview-header">
                    <div className="preview-business-name">Your Business</div>
                  </div>
                  <div className="preview-message-area">
                    <div className="preview-input">
                      <span className="preview-slash">/</span>
                      <div className="preview-commands">
                        {commands
                          .filter((cmd) => cmd.text.trim() !== "")
                          .map((command, index) => (
                            <div key={index} className="preview-command">
                              <span className="preview-command-text">
                                {command.text}
                              </span>
                              <span className="preview-command-hint">
                                {command.hint}
                              </span>
                            </div>
                          ))}
                        {commands.filter((cmd) => cmd.text.trim() !== "")
                          .length === 0 && (
                          <div className="preview-empty">
                            No commands configured
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="save-btn"
          onClick={saveChanges}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>

        {saveStatus === "success" && (
          <div className="save-status success">Changes saved successfully!</div>
        )}
      </div>
    </div>
  );
};

export default ConversationAutomation;
