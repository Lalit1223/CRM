import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  MessageSquare,
  Terminal,
  Users,
  Database,
  FileText,
  Send,
  Download,
  Smartphone,
} from "lucide-react";
import "./WorkflowSimulator.css";

// Node type icon mapping
const NODE_ICONS = {
  message: <MessageSquare size={16} />,
  input: <Terminal size={16} />,
  interactive: <Users size={16} />,
  condition: <FileText size={16} />,
  api: <Database size={16} />,
  end: <CheckCircle size={16} />,
};

const WorkflowSimulator = ({ workflowId, onClose, authToken }) => {
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x speed
  const messagesEndRef = useRef(null);
  const [testData, setTestData] = useState({});
  const [showTestDataForm, setShowTestDataForm] = useState(false);

  // Run simulation when component mounts
  useEffect(() => {
    runSimulation();
  }, [workflowId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [simulation, activeStep]);

  // AutoPlay effect
  useEffect(() => {
    let timer;
    if (
      autoPlay &&
      simulation &&
      activeStep < simulation.executionPath.length - 1
    ) {
      const delay = 1000 / speed; // Adjust delay based on speed
      timer = setTimeout(() => {
        setActiveStep((prev) => prev + 1);
      }, delay);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoPlay, activeStep, simulation, speed]);

  // Run workflow simulation
  const runSimulation = async (customTestData = null) => {
    try {
      setLoading(true);
      setError(null);
      setActiveStep(0);

      const apiUrl = `https://pixe-backend-tkrb.onrender.com/api/workflows/${workflowId}/preview`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testData: customTestData || testData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to run simulation");
      }

      const data = await response.json();

      if (data.success) {
        setSimulation(data.data);
      } else {
        throw new Error(data.message || "Simulation failed");
      }
    } catch (err) {
      console.error("Simulation error:", err);
      setError(err.message || "Failed to run simulation");
    } finally {
      setLoading(false);
    }
  };

  // Handle step navigation
  const handleStepChange = (step) => {
    if (step >= 0 && step < simulation.executionPath.length) {
      setActiveStep(step);
    }
  };

  // Toggle autoplay
  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  // Handle speed change
  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  // Handle test data input change
  const handleTestDataChange = (e) => {
    const { name, value } = e.target;
    setTestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle test data submit
  const handleTestDataSubmit = () => {
    setShowTestDataForm(false);
    runSimulation(testData);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Get visible messages based on current step
  const getVisibleMessages = () => {
    if (!simulation) return [];

    const currentDepth = simulation.executionPath[activeStep].depth;
    return simulation.messages.filter((msg, index) => {
      const msgDepth = simulation.executionPath.find(
        (p) => p.nodeId === msg.nodeId
      )?.depth;
      return msgDepth !== undefined && msgDepth <= currentDepth;
    });
  };

  // Get node status class
  const getNodeStatusClass = (nodeId) => {
    if (!simulation) return "";

    const nodeDepth = simulation.executionPath.find(
      (p) => p.nodeId === nodeId
    )?.depth;
    const currentDepth = simulation.executionPath[activeStep].depth;

    if (nodeDepth === undefined) return "";

    if (nodeDepth < currentDepth) return "completed";
    if (nodeDepth === currentDepth) return "current";
    return "pending";
  };

  // Get node by ID
  const getNodeById = (nodeId) => {
    if (!simulation) return null;
    return simulation.executionPath.find((node) => node.nodeId === nodeId);
  };

  // Download simulation report
  const downloadReport = () => {
    if (!simulation) return;

    const reportData = {
      workflowName: simulation.workflowName,
      workflowId: simulation.workflowId,
      timestamp: new Date().toISOString(),
      executionPath: simulation.executionPath,
      messages: simulation.messages,
      variables: simulation.variables,
      conditions: simulation.conditions,
      apiCalls: simulation.apiCalls,
      warnings: simulation.warnings,
      errors: simulation.errors,
      summary: simulation.summary,
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-simulation-${simulation.workflowId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="simulator-overlay">
        <div className="simulator-container loading">
          <div className="simulator-header">
            <h3>Running Workflow Simulation</h3>
            <button className="close-simulator" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <div className="simulator-loading">
            <div className="spinner"></div>
            <p>Running simulation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="simulator-overlay">
        <div className="simulator-container error">
          <div className="simulator-header">
            <h3>Simulation Failed</h3>
            <button className="close-simulator" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <div className="simulator-error">
            <AlertCircle size={48} />
            <p>{error}</p>
            <button className="retry-button" onClick={() => runSimulation()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!simulation) {
    return (
      <div className="simulator-overlay">
        <div className="simulator-container error">
          <div className="simulator-header">
            <h3>No Simulation Data</h3>
            <button className="close-simulator" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <div className="simulator-error">
            <AlertCircle size={48} />
            <p>No simulation data available</p>
            <button className="retry-button" onClick={() => runSimulation()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="simulator-overlay">
      <div className="simulator-container">
        <div className="simulator-header">
          <h3>Workflow Simulation: {simulation.workflowName}</h3>
          <div className="simulator-actions">
            <button
              className="simulator-action"
              onClick={() => setShowTestDataForm(true)}
              title="Configure Test Data"
            >
              <Database size={16} />
            </button>
            <button
              className="simulator-action"
              onClick={downloadReport}
              title="Download Report"
            >
              <Download size={16} />
            </button>
            <button className="close-simulator" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="simulator-content">
          {/* Flow diagram */}
          <div className="flow-diagram">
            <div className="flow-nodes">
              {simulation.executionPath.map((node, index) => (
                <div
                  key={node.nodeId}
                  className={`flow-node ${getNodeStatusClass(node.nodeId)}`}
                  onClick={() => handleStepChange(index)}
                >
                  <div className="node-icon">
                    {NODE_ICONS[node.nodeType] || <MessageSquare size={16} />}
                  </div>
                  <div className="node-info">
                    <div className="node-name">{node.nodeName}</div>
                    <div className="node-type">{node.nodeType}</div>
                  </div>
                  {index < simulation.executionPath.length - 1 && (
                    <div className="node-connector">
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat preview */}
          <div className="chat-preview">
            <div className="chat-header">
              <Smartphone size={16} />
              <span>WhatsApp Preview</span>
            </div>
            <div className="chat-messages">
              {getVisibleMessages().map((message, index) => {
                // Skip system messages and end node
                if (message.messageType === "system" || message.isEndNode)
                  return null;

                return (
                  <div
                    key={`${message.nodeId}-${index}`}
                    className={`chat-message ${
                      message.messageType === "input_prompt"
                        ? "input-message"
                        : ""
                    }`}
                  >
                    <div className="message-content">
                      {message.content}

                      {message.waitingForInput && (
                        <div className="simulated-input">
                          <div className="input-value">
                            {Object.entries(simulation.variables).find(
                              ([key, value]) => {
                                const node = getNodeById(message.nodeId);
                                return (
                                  node?.variables &&
                                  node.variables[key] === undefined
                                );
                              }
                            )?.[1] || "Simulated user input"}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="message-time">
                      {formatTimestamp(getNodeById(message.nodeId)?.timestamp)}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Variables and Details */}
          <div className="simulation-details">
            <div className="details-header">
              <h4>Current Step Details</h4>
            </div>
            <div className="details-content">
              <div className="detail-section">
                <h5>Current Node</h5>
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">
                    {simulation.executionPath[activeStep].nodeName}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">
                    {simulation.executionPath[activeStep].nodeType}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">
                    {simulation.executionPath[activeStep].nodeId}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h5>Variables</h5>
                {Object.keys(
                  simulation.executionPath[activeStep].variables || {}
                ).length === 0 ? (
                  <div className="empty-detail">No variables at this step</div>
                ) : (
                  Object.entries(
                    simulation.executionPath[activeStep].variables || {}
                  ).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <span className="detail-label">{key}:</span>
                      <span className="detail-value">{value}</span>
                    </div>
                  ))
                )}
              </div>

              {simulation.warnings && simulation.warnings.length > 0 && (
                <div className="detail-section warnings">
                  <h5>Warnings</h5>
                  {simulation.warnings
                    .filter(
                      (w) =>
                        w.nodeId === simulation.executionPath[activeStep].nodeId
                    )
                    .map((warning, idx) => (
                      <div key={idx} className="warning-item">
                        <AlertTriangle size={14} />
                        <span>{warning.message}</span>
                      </div>
                    ))}
                </div>
              )}

              {simulation.errors && simulation.errors.length > 0 && (
                <div className="detail-section errors">
                  <h5>Errors</h5>
                  {simulation.errors
                    .filter(
                      (e) =>
                        e.nodeId === simulation.executionPath[activeStep].nodeId
                    )
                    .map((error, idx) => (
                      <div key={idx} className="error-item">
                        <AlertCircle size={14} />
                        <span>{error.message}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="simulator-controls">
          <div className="step-controls">
            <button
              disabled={activeStep === 0}
              onClick={() => handleStepChange(0)}
              className="control-button"
            >
              First
            </button>
            <button
              disabled={activeStep === 0}
              onClick={() => handleStepChange(activeStep - 1)}
              className="control-button"
            >
              Previous
            </button>
            <div className="step-indicator">
              Step {activeStep + 1} of {simulation.executionPath.length}
            </div>
            <button
              disabled={activeStep === simulation.executionPath.length - 1}
              onClick={() => handleStepChange(activeStep + 1)}
              className="control-button"
            >
              Next
            </button>
            <button
              disabled={activeStep === simulation.executionPath.length - 1}
              onClick={() =>
                handleStepChange(simulation.executionPath.length - 1)
              }
              className="control-button"
            >
              Last
            </button>
          </div>

          <div className="playback-controls">
            <button
              onClick={toggleAutoPlay}
              className={`control-button ${autoPlay ? "active" : ""}`}
            >
              {autoPlay ? "Pause" : "Auto Play"}
            </button>
            <div className="speed-control">
              <span>Speed:</span>
              <select value={speed} onChange={handleSpeedChange}>
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="3">3x</option>
              </select>
            </div>
            <button onClick={() => runSimulation()} className="control-button">
              Restart
            </button>
          </div>
        </div>

        {/* Test Data Form Modal */}
        {showTestDataForm && (
          <div className="test-data-modal">
            <div className="test-data-container">
              <div className="test-data-header">
                <h3>Configure Test Data</h3>
                <button onClick={() => setShowTestDataForm(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="test-data-content">
                <p>Provide custom values for the workflow variables:</p>

                {simulation.variables &&
                Object.keys(simulation.variables).length > 0 ? (
                  <div className="test-data-form">
                    {Object.entries(simulation.variables).map(
                      ([key, value]) => (
                        <div key={key} className="form-group">
                          <label>{key}</label>
                          <input
                            type="text"
                            name={key}
                            value={testData[key] || value}
                            onChange={handleTestDataChange}
                            placeholder={`Enter value for ${key}`}
                          />
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="no-variables">
                    <p>No variables found in this workflow</p>
                  </div>
                )}
              </div>
              <div className="test-data-footer">
                <button
                  className="cancel-button"
                  onClick={() => setShowTestDataForm(false)}
                >
                  Cancel
                </button>
                <button className="apply-button" onClick={handleTestDataSubmit}>
                  Apply & Run
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowSimulator;
