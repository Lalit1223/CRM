// src/pages/WorkflowBuilder/components/SimulationPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  RotateCcw,
  Download,
  User,
  Bot,
  Play,
  Square,
} from "lucide-react";
import { workflowAPI } from "../../../utils/api";

const SimulationPanel = ({
  isOpen,
  onClose,
  workflow,
  workflowId,
  isSimulating,
  onStartSimulation,
  onStopSimulation,
}) => {
  const PAYMENT_PENDING = false; // Set to false after payment

  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [sessionData, setSessionData] = useState({
    variables: {},
    currentNodeId: null,
    executedNodes: [],
    executionDepth: 0,
  });
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const startNewSession = async () => {
    if (!workflowId && !workflow.startNodeId) {
      alert("Please save the workflow first before testing");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (workflowId) {
        // Use existing workflow
        response = await workflowAPI.previewWorkflow(workflowId, {});
      } else {
        // Create temporary workflow session for unsaved workflow
        const tempWorkflow = {
          ...workflow,
          nodes: workflow.nodes,
          startNodeId: workflow.startNodeId,
        };

        // For testing, we'll simulate the session locally
        response = {
          success: true,
          data: {
            workflowId: "temp_" + Date.now(),
            sessionId: "session_" + Date.now(),
            currentNodeId: workflow.startNodeId,
            executedNodes: [],
            variables: {},
            messages: [],
          },
        };
      }

      if (response.success) {
        const data = response.data;
        setSessionId(data.sessionId || "temp_session");
        setSessionData({
          currentNodeId: data.currentNodeId || workflow.startNodeId,
          executedNodes: data.executedNodes || [],
          variables: data.variables || {},
        });

        // Find the start node and process it
        const startNode = workflow.nodes.find(
          (n) => n.nodeId === (data.currentNodeId || workflow.startNodeId)
        );
        if (startNode) {
          await processNode(startNode, {});
        }

        onStartSimulation();
      } else {
        alert("Failed to start simulation: " + response.message);
      }
    } catch (error) {
      console.error("Error starting simulation:", error);

      // Fallback to local simulation
      const startNode = workflow.nodes.find(
        (n) => n.nodeId === workflow.startNodeId
      );
      if (startNode) {
        setSessionId("local_session_" + Date.now());
        setSessionData({
          currentNodeId: workflow.startNodeId,
          executedNodes: [],
          variables: {},
        });
        await processNode(startNode, {});
        onStartSimulation();
      } else {
        alert("Failed to start simulation - no start node found");
      }
    } finally {
      setLoading(false);
    }
  };
  const processNode = async (node, variables = {}) => {
    if (!node) return;

    // PAYMENT PENDING - Show demo message instead of real processing
    if (PAYMENT_PENDING) {
      const demoMessage = {
        id: Date.now(),
        type: "bot",
        content:
          "⚠️ Demo Mode: Workflow simulation is limited in demo version. Contact administrator for full access.",
        timestamp: new Date().toISOString(),
        nodeId: node.nodeId,
        nodeName: node.name,
      };
      setChatHistory((prev) => [...prev, demoMessage]);
      setIsWaitingForInput(false);
      return;
    }

    // Check for maximum execution depth to prevent infinite loops
    if (sessionData.executionDepth >= 20) {
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content:
          "⚠️ Maximum execution depth reached. Workflow may have an infinite loop.",
        timestamp: new Date().toISOString(),
        nodeId: node.nodeId,
        nodeName: node.name,
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      setIsWaitingForInput(false);
      return;
    }

    // Merge current variables with new ones
    const currentVariables = {
      ...(sessionData?.variables || {}),
      ...variables,
    };

    // Update session data with safe array handling
    setSessionData((prev) => {
      const currentExecutedNodes = Array.isArray(prev.executedNodes)
        ? prev.executedNodes
        : [];
      return {
        ...prev,
        currentNodeId: node.nodeId,
        variables: currentVariables,
        executedNodes: [...currentExecutedNodes, node.nodeId],
        executionDepth: (prev.executionDepth || 0) + 1,
      };
    });

    setCurrentNode(node);

    // Add bot message for the current node with processed content
    const botMessage = {
      id: Date.now(),
      type: "bot",
      content: processMessageContent(
        node.content || `Executing ${node.name}`,
        currentVariables
      ),
      timestamp: new Date().toISOString(),
      nodeId: node.nodeId,
      nodeName: node.name,
    };

    setChatHistory((prev) => [...prev, botMessage]);

    // Determine if we need to wait for user input
    const needsInput = node.type === "input" || node.type === "interactive";
    setIsWaitingForInput(needsInput);

    if (!needsInput) {
      // Auto-advance for non-input nodes
      setTimeout(() => {
        advanceToNextNode(node, currentVariables);
      }, 1000);
    }
  };

  const processMessageContent = (content, variables) => {
    if (!content) return "";

    // Replace variable placeholders like {{variable_name}}
    let processedContent = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      processedContent = processedContent.replace(regex, value);
    });

    return processedContent;
  };

  const advanceToNextNode = async (currentNode, variables = {}) => {
    let nextNodeId = null;

    // Get the latest variables from state
    let latestVariables = { ...(sessionData?.variables || {}), ...variables };

    switch (currentNode.type) {
      case "condition":
        // Evaluate condition (simplified)
        const conditionResult = evaluateCondition(
          currentNode.condition,
          latestVariables
        );
        nextNodeId = conditionResult
          ? currentNode.trueNodeId
          : currentNode.falseNodeId;
        break;

      case "api":
        // Simulate API call
        try {
          const apiResult = await simulateAPICall(currentNode, latestVariables);
          const updatedVariables = { ...latestVariables, ...apiResult };
          nextNodeId = apiResult.success
            ? currentNode.nextNodeId
            : currentNode.errorNodeId;

          // Update session data with API results
          setSessionData((prev) => ({ ...prev, variables: updatedVariables }));

          // Use updated variables for next node
          latestVariables = updatedVariables;
        } catch (error) {
          console.error("API simulation error:", error);
          nextNodeId = currentNode.errorNodeId || currentNode.nextNodeId;
        }
        break;

      default:
        nextNodeId = currentNode.nextNodeId;
    }

    if (nextNodeId) {
      const nextNode = workflow.nodes.find((n) => n.nodeId === nextNodeId);
      if (nextNode && nextNode.type !== "end") {
        await processNode(nextNode, latestVariables);
      } else if (nextNode && nextNode.type === "end") {
        // Handle end node
        const endMessage = {
          id: Date.now(),
          type: "bot",
          content: "🎉 Workflow completed successfully!",
          timestamp: new Date().toISOString(),
          nodeId: nextNode.nodeId,
          nodeName: nextNode.name,
        };
        setChatHistory((prev) => [...prev, endMessage]);
        setIsWaitingForInput(false);
        setCurrentNode(nextNode);
      }
    }
  };

  const evaluateCondition = (condition, variables) => {
    if (!condition) return false;

    try {
      // Create a safe evaluation context with all variables
      const context = { ...variables };

      //   console.log(
      //     "Evaluating condition:",
      //     condition,
      //     "with variables:",
      //     context
      //   );

      // Handle common condition patterns
      if (condition.includes("isAadhaarVerified")) {
        // Check if we have the variable directly or need to derive it
        if (context.hasOwnProperty("isAadhaarVerified")) {
          return context.isAadhaarVerified === true;
        }
        // Fallback: check if verification was successful
        if (context.hasOwnProperty("verified")) {
          return context.verified === true;
        }
        if (context.hasOwnProperty("success")) {
          return context.success === true;
        }
        return false;
      }

      if (condition.includes("isPanVerified")) {
        if (context.hasOwnProperty("isPanVerified")) {
          return context.isPanVerified === true;
        }
        if (context.hasOwnProperty("verified")) {
          return context.verified === true;
        }
        return false;
      }

      if (condition.includes("isBankVerified")) {
        if (context.hasOwnProperty("isBankVerified")) {
          return context.isBankVerified === true;
        }
        if (context.hasOwnProperty("verified")) {
          return context.verified === true;
        }
        return false;
      }

      // Replace variable references in the condition
      let evalCondition = condition;

      Object.entries(context).forEach(([key, value]) => {
        const regex = new RegExp(`\\b${key}\\b`, "g");
        if (typeof value === "string") {
          evalCondition = evalCondition.replace(regex, `"${value}"`);
        } else if (typeof value === "boolean") {
          evalCondition = evalCondition.replace(regex, String(value));
        } else if (typeof value === "number") {
          evalCondition = evalCondition.replace(regex, String(value));
        } else {
          evalCondition = evalCondition.replace(regex, JSON.stringify(value));
        }
      });

      //console.log("Processed condition:", evalCondition);

      // Basic evaluation (use a proper evaluator in production)
      return eval(evalCondition);
    } catch (error) {
      console.error("Error evaluating condition:", error);
      // Default to false for safety
      return false;
    }
  };

  const simulateAPICall = async (node, variables) => {
    // PAYMENT PENDING - Return demo responses
    if (PAYMENT_PENDING) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: false,
        message: "Demo mode - API calls disabled until payment confirmation",
        verified: false,
        demo: true,
      };
    }
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock API responses based on endpoint
    const endpoint = node.apiEndpoint;
    const mockResponses = {
      "/api/verification/aadhaar": {
        success: true,
        isAadhaarVerified: true,
        aadhaarName: "John Doe",
        verified: true,
      },
      "/api/verification/pan": {
        success: true,
        isPanVerified: true,
        panName: "John Doe",
        verified: true,
      },
      "/api/verification/bank-account": {
        success: true,
        isBankVerified: true,
        accountHolderName: "John Doe",
        verified: true,
      },
    };

    return mockResponses[endpoint] || { success: true, verified: true };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isWaitingForInput || !currentNode) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);

    // Update variables based on node type
    let updatedVariables = { ...(sessionData?.variables || {}) };

    if (currentNode.type === "input" && currentNode.variableName) {
      updatedVariables[currentNode.variableName] = inputValue;
    } else if (currentNode.type === "interactive") {
      const selectedOption = currentNode.options?.find(
        (opt) => opt.value === inputValue
      );
      if (selectedOption && currentNode.variableName) {
        updatedVariables[currentNode.variableName] = inputValue;
      }
    }

    // Update session data immediately
    setSessionData((prev) => ({
      ...prev,
      variables: updatedVariables,
    }));

    setInputValue("");
    setIsWaitingForInput(false);

    // Advance to next node with updated variables
    setTimeout(() => {
      advanceToNextNode(currentNode, updatedVariables);
    }, 500);
  };

  const handleOptionClick = async (optionValue) => {
    if (!isWaitingForInput || !currentNode) return;

    setInputValue(optionValue);

    // Add user message to chat immediately
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: optionValue,
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);

    // Update variables for interactive node
    let updatedVariables = { ...(sessionData?.variables || {}) };

    if (currentNode.type === "interactive" && currentNode.variableName) {
      updatedVariables[currentNode.variableName] = optionValue;
    }

    // Update session data immediately
    setSessionData((prev) => ({
      ...prev,
      variables: updatedVariables,
    }));

    setInputValue("");
    setIsWaitingForInput(false);

    // Advance to next node with updated variables
    setTimeout(() => {
      advanceToNextNode(currentNode, updatedVariables);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetSimulation = () => {
    setChatHistory([]);
    setInputValue("");
    setIsWaitingForInput(false);
    setCurrentNode(null);
    setSessionData({
      variables: {},
      currentNodeId: null,
      executedNodes: [],
      executionDepth: 0,
    });
    setSessionId(null);
    onStopSimulation();
  };

  // Reset simulation when panel closes
  useEffect(() => {
    if (!isOpen) {
      resetSimulation();
    }
  }, [isOpen]);

  const exportChatHistory = () => {
    const chatText = chatHistory
      .map(
        (msg) =>
          `[${new Date(msg.timestamp).toLocaleTimeString()}] ${
            msg.type === "user" ? "User" : "Bot"
          }: ${msg.content}`
      )
      .join("\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workflow-simulation-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="simulation-panel">
      <div className="simulation-header">
        <div className="header-info">
          <h3>Workflow Simulation</h3>
          <div className="simulation-status">
            {isSimulating ? (
              <span className="status-indicator running">
                <div className="pulse-dot"></div>
                Running
              </span>
            ) : (
              <span className="status-indicator stopped">Stopped</span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button
            className="action-btn"
            onClick={exportChatHistory}
            title="Export Chat History"
            disabled={chatHistory.length === 0}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            className="action-btn"
            onClick={resetSimulation}
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="action-btn" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="simulation-info">
        {currentNode && (
          <div className="current-node-info">
            <div className="node-indicator">
              <div className="node-type">{currentNode.type}</div>
              <div className="node-name">{currentNode.name}</div>
            </div>
            {/* Temporarily removed variables display to improve chat visibility */}
            {/* Variables are working correctly in the background */}
          </div>
        )}
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        {chatHistory.length === 0 ? (
          <div className="chat-empty-state">
            <div className="empty-message">
              <Bot className="w-8 h-8" style={{ color: "#9ca3af" }} />
              <h4
                style={{
                  margin: "1rem 0 0.5rem 0",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Workflow Simulation
              </h4>
              <p
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }}
              >
                Test your workflow by simulating user interactions
              </p>
              {!isSimulating && (
                <button
                  className="btn btn-primary"
                  onClick={startNewSession}
                  disabled={loading || !workflow.startNodeId}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  <Play className="w-4 h-4" />
                  {loading ? "Starting..." : "Start Simulation"}
                </button>
              )}
              {!workflow.startNodeId && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#ef4444",
                    marginTop: "0.75rem",
                    padding: "0.5rem",
                    background: "#fef2f2",
                    borderRadius: "0.375rem",
                    border: "1px solid #fecaca",
                  }}
                >
                  ⚠️ Add nodes and set a start node to begin testing
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.type === "user" ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-avatar">
                  {message.type === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <div className="message-timestamp">
                    {formatTimestamp(message.timestamp)}
                    {message.nodeName && (
                      <span className="node-info"> • {message.nodeName}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isWaitingForInput && currentNode && (
        <div className="input-section">
          <div className="input-prompt">
            {currentNode.type === "interactive" ? (
              <div className="interactive-options">
                <div className="options-prompt">Please select an option:</div>
                <div className="options-list">
                  {currentNode.options?.map((option, index) => (
                    <button
                      key={index}
                      className="option-button"
                      onClick={() => handleOptionClick(option.value)}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-input-area">
                <div className="input-label">
                  {currentNode.variableName && (
                    <span className="variable-hint">
                      Enter {currentNode.variableName}:
                    </span>
                  )}
                </div>
                <div className="input-controls">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="message-input"
                    disabled={!isSimulating}
                    autoFocus
                  />
                  <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || !isSimulating}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isSimulating && chatHistory.length > 0 && (
        <div className="simulation-footer">
          <div className="simulation-summary">
            <p>Simulation completed with {chatHistory.length} messages</p>
            <p>
              Variables collected:{" "}
              {Object.keys(sessionData?.variables || {}).length}
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={startNewSession}
              disabled={loading}
            >
              <Play className="w-4 h-4" />
              Restart Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;
