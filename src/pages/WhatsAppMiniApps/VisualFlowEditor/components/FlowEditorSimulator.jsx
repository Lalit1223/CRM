import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Send } from "lucide-react";

const FlowEditorSimulator = ({ nodes, edges, onClose }) => {
  const [simulationMessages, setSimulationMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [processingInput, setProcessingInput] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const messagesEndRef = useRef(null);

  // Start simulation when component mounts
  useEffect(() => {
    startSimulation();

    // Cleanup when component unmounts
    return () => {
      setSimulationMessages([]);
      setCurrentNode(null);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [simulationMessages]);

  const startSimulation = () => {
    setSimulationMessages([]);
    setProcessingInput(false);

    // Find the trigger node to start
    const triggerNode = nodes.find((node) => node.type === "triggerNode");

    if (!triggerNode) {
      setSimulationMessages([
        {
          id: Date.now(),
          sender: "system",
          text: "Error: No trigger node found in the workflow",
        },
      ]);
      return;
    }

    setCurrentNode(triggerNode);

    // Add initial system message
    setSimulationMessages([
      {
        id: Date.now(),
        sender: "system",
        text: `Simulation started with trigger: ${
          triggerNode.data.triggerType || "New Message"
        }`,
      },
    ]);

    // Process the trigger node after a short delay
    setTimeout(() => processNode(triggerNode), 500);
  };

  const processNode = (node) => {
    //console.log("Processing node:", node);
    if (!node) return;

    // Set as current node in simulation
    setCurrentNode(node);

    // Add a small delay for realism
    setTimeout(() => {
      switch (node.type) {
        case "triggerNode":
          // Find the next connected node and process it
          const nextNodeId = findNextNodeId(node.id);
          if (nextNodeId) {
            const nextNode = nodes.find((n) => n.id === nextNodeId);
            if (nextNode) {
              setTimeout(() => processNode(nextNode), 1000);
            } else {
              addSystemMessage(
                `Error: Next node not found (ID: ${nextNodeId})`
              );
            }
          } else {
            addSystemMessage("Trigger has no connected nodes");
          }
          break;

        case "messageNode":
          // Add a bot message
          addBotMessage(node.data.message || "Empty message");

          // If message doesn't wait for reply, proceed to next node
          if (!node.data.waitForReply) {
            const nextNodeId = findNextNodeId(node.id);
            if (nextNodeId) {
              const nextNode = nodes.find((n) => n.id === nextNodeId);
              if (nextNode) {
                setTimeout(() => processNode(nextNode), 1500);
              } else {
                addSystemMessage(
                  `Error: Next node not found (ID: ${nextNodeId})`
                );
              }
            } else {
              addSystemMessage("End of conversation flow (no next node)");
            }
          }
          break;

        case "inputNode":
          // For questions, show the question and options
          let messageText = node.data.question || "Empty question";

          addBotMessage(messageText, node.data.buttons || [], true, node.id);
          // The user will need to respond, so flow stops here
          break;

        case "conditionNode":
          // Show condition evaluation
          addSystemMessage(
            `Evaluating condition: ${formatCondition(node.data.condition)}`
          );

          // For simulation, randomly choose true or false path
          const isTrue = Math.random() > 0.5;
          setTimeout(() => {
            addSystemMessage(
              `Condition evaluated to: ${isTrue ? "TRUE" : "FALSE"}`
            );

            // Find the next node on the appropriate path
            const nextNodeId = findNextNodeId(
              node.id,
              isTrue ? "true" : "false"
            );

            if (nextNodeId) {
              const nextNode = nodes.find((n) => n.id === nextNodeId);
              if (nextNode) {
                setTimeout(() => processNode(nextNode), 1000);
              } else {
                addSystemMessage(
                  `Error: Next node not found (ID: ${nextNodeId})`
                );
              }
            } else {
              addSystemMessage(
                `No connected node found for ${isTrue ? "TRUE" : "FALSE"} path`
              );
            }
          }, 1500);
          break;

        case "apiNode":
          // Simulate API call
          addSystemMessage(
            `Making ${node.data.apiDetails?.method || "GET"} request to ${
              node.data.apiDetails?.url || "API endpoint"
            }...`
          );

          // Simulate API response after a delay
          setTimeout(() => {
            // Randomly simulate success or error
            const isSuccess = Math.random() > 0.3;

            if (isSuccess) {
              addSystemMessage(`API request successful`);
              if (node.data.responseField) {
                addSystemMessage(
                  `Response saved to: ${node.data.responseField}`
                );
              }

              // Find the next node on success path
              const nextNodeId = findNextNodeId(node.id, "success");
              if (nextNodeId) {
                const nextNode = nodes.find((n) => n.id === nextNodeId);
                if (nextNode) {
                  setTimeout(() => processNode(nextNode), 1000);
                } else {
                  addSystemMessage(
                    `Error: Next node not found (ID: ${nextNodeId})`
                  );
                }
              } else {
                addSystemMessage(
                  "End of conversation flow (no next node for success)"
                );
              }
            } else {
              addSystemMessage(`API request failed with error`);

              // Find the next node on error path
              const nextNodeId = findNextNodeId(node.id, "error");
              if (nextNodeId) {
                const nextNode = nodes.find((n) => n.id === nextNodeId);
                if (nextNode) {
                  setTimeout(() => processNode(nextNode), 1000);
                } else {
                  addSystemMessage(
                    `Error: Next node not found (ID: ${nextNodeId})`
                  );
                }
              } else {
                addSystemMessage(
                  "End of conversation flow (no next node for error)"
                );
              }
            }
          }, 2000);
          break;

        case "endNode":
          // Mark the end of the flow
          addSystemMessage("Workflow completed");
          break;

        default:
          addSystemMessage(`Unknown node type: ${node.type}`);
      }
    }, 500);
  };

  // Helper function to format condition for display
  const formatCondition = (condition) => {
    if (!condition) return "No condition set";

    const { variable, operator, value } = condition;
    return `${variable || "?"} ${operator || "=="} ${value || "?"}`;
  };

  // Helper to find next node ID based on connections
  const findNextNodeId = (nodeId, handleId = null) => {
    const relevantEdges = edges.filter((edge) => {
      // If no specific handle is requested, return any connection from this source
      if (!handleId) return edge.source === nodeId;

      // Otherwise, match both source and sourceHandle
      return (
        edge.source === nodeId &&
        (edge.sourceHandle === handleId ||
          (!edge.sourceHandle && handleId === "default"))
      );
    });

    if (relevantEdges.length > 0) {
      return relevantEdges[0].target;
    }

    return null;
  };

  // Add a system message to the simulation
  const addSystemMessage = (text) => {
    setSimulationMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "system",
        text,
      },
    ]);
  };

  // Add a bot message to the simulation
  const addBotMessage = (
    text,
    options = [],
    isQuestion = false,
    nodeId = null
  ) => {
    setSimulationMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "bot",
        text,
        options,
        isQuestion,
        nodeId,
      },
    ]);
  };

  // Handle user input submission
  const handleUserInput = (e) => {
    e.preventDefault();
    if (!userInput.trim() || processingInput) return;

    setProcessingInput(true);

    // Add user message
    setSimulationMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: userInput,
      },
    ]);

    // Process user input based on current state
    if (currentNode && currentNode.type === "inputNode") {
      // Simulate saving the response
      addSystemMessage(
        `Response saved to field: ${
          currentNode.data.responseField || "user_response"
        }`
      );

      // Find the next node
      const nextNodeId = findNextNodeId(currentNode.id);
      if (nextNodeId) {
        const nextNode = nodes.find((n) => n.id === nextNodeId);
        if (nextNode) {
          setTimeout(() => {
            processNode(nextNode);
            setProcessingInput(false);
          }, 1000);
        } else {
          addSystemMessage(`Error: Next node not found (ID: ${nextNodeId})`);
          setProcessingInput(false);
        }
      } else {
        addSystemMessage("End of conversation flow (no next node)");
        setProcessingInput(false);
      }
    } else {
      // Handle unexpected input
      addSystemMessage(
        "Message received, but bot is not expecting input at this point"
      );
      setProcessingInput(false);
    }

    // Clear the input
    setUserInput("");
  };

  // Handle option button click
  const handleOptionClick = (option, nodeId) => {
    if (processingInput) return;
    setProcessingInput(true);

    // Add user selection
    setSimulationMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: option.text,
      },
    ]);

    // Process the selection
    addSystemMessage(`Selected option: ${option.value}`);

    // Find the next node
    const nextNodeId = findNextNodeId(nodeId);
    if (nextNodeId) {
      const nextNode = nodes.find((n) => n.id === nextNodeId);
      if (nextNode) {
        setTimeout(() => {
          processNode(nextNode);
          setProcessingInput(false);
        }, 1000);
      } else {
        addSystemMessage(`Error: Next node not found (ID: ${nextNodeId})`);
        setProcessingInput(false);
      }
    } else {
      addSystemMessage("End of conversation flow (no next node)");
      setProcessingInput(false);
    }
  };

  return (
    <div className="simulation-panel">
      <div className="simulation-header">
        <h3>Workflow Simulation</h3>
        <button onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="simulation-messages">
        {simulationMessages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <span className="sender">
              {msg.sender === "bot"
                ? "🤖 Bot"
                : msg.sender === "user"
                ? "👤 User"
                : "⚙️ System"}
            </span>
            <div className="message-content">
              {msg.text}

              {msg.isQuestion && msg.options && msg.options.length > 0 && (
                <div className="message-options">
                  {msg.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option, msg.nodeId)}
                      disabled={processingInput}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleUserInput} className="simulation-input">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={processingInput}
        />
        <button type="submit" disabled={processingInput || !userInput.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default FlowEditorSimulator;
