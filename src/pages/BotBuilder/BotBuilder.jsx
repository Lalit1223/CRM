// src/pages/BotBuilder/BotBuilder.jsx
import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import "./BotBuilder.css";
import BotBuilderHeader from "./components/BotBuilderHeader.jsx";
import BotBuilderSidebar from "./components/BotBuilderSidebar.jsx";
import BotBuilderProperties from "./components/BotBuilderProperties.jsx";
import { nodeTypes } from "./constants/nodeTypes.jsx";

const initialNodes = [
  {
    id: "trigger-1",
    type: "triggerNode",
    position: { x: 250, y: 50 },
    data: {
      label: "Message Trigger",
      triggerType: "New Message Received",
      condition: "",
    },
  },
];

const BotBuilder = ({
  savedWorkflows = [],
  currentBotId = null,
  onSaveWorkflow,
  onBackToManagement,
}) => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const effectiveId = botId || currentBotId;

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [botName, setBotName] = useState("New Bot Flow");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMessages, setSimulationMessages] = useState([]);
  const [currentSimNode, setCurrentSimNode] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [processingInput, setProcessingInput] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState("New Message Received");
  const [workflowEnabled, setWorkflowEnabled] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);

  // Load workflow data either from URL param or prop
  useEffect(() => {
    if (effectiveId) {
      const workflow = savedWorkflows.find((w) => w.id === effectiveId);
      if (workflow) {
        setCurrentWorkflow(workflow);
        loadWorkflow(workflow);
      } else {
        console.error("Workflow not found:", effectiveId);
        navigate("/bot-builder"); // Redirect to list if bot not found
      }
    } else {
      // New bot
      resetToNewBot();
    }
  }, [effectiveId, savedWorkflows, navigate]);

  const resetToNewBot = () => {
    setCurrentWorkflow(null);
    setBotName("New Bot Flow");
    setActiveTrigger("New Message Received");
    setWorkflowEnabled(false);
    setNodes(initialNodes);
    setEdges([]);
    setSelectedNode(null);
  };

  const loadWorkflow = (workflow) => {
    try {
      setBotName(workflow.name);
      setActiveTrigger(workflow.trigger || "New Message Received");
      setWorkflowEnabled(workflow.enabled || false);

      if (workflow.flow) {
        setNodes(workflow.flow.nodes || initialNodes);
        setEdges(workflow.flow.edges || []);
      } else {
        // Fallback for older saved workflows
        setNodes(workflow.nodes || initialNodes);
        setEdges(workflow.edges || []);
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      alert("Failed to load workflow. The saved data might be corrupted.");
    }
  };

  // Enhanced onConnect function for better edge creation
  const onConnect = useCallback(
    (params) => {
      ////console.log("Connection params:", params);

      // Create a new edge with custom styling
      const newEdge = {
        ...params,
        type: "default", // or 'smoothstep', 'straight', etc.
        animated: true,
        style: { stroke: "#007bff", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#007bff",
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!rfInstance) {
        console.error("ReactFlow instance not initialized");
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        console.error("Invalid node type:", type);
        return;
      }

      try {
        const position = rfInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Create a new node based on the type
        const newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: getDefaultDataForNodeType(type),
        };

        ////console.log("Created new node:", newNode);
        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error("Error adding node:", error);
      }
    },
    [rfInstance, setNodes]
  );

  const getDefaultDataForNodeType = (type) => {
    switch (type) {
      case "messageNode":
        return {
          label: "Send Message",
          message: "Hello! How can I help you today?",
          waitForReply: false,
        };
      case "questionNode":
        return {
          label: "Ask a Question",
          question: "What would you like to do?",
          waitForReply: true,
          waitTime: 180, // 3 minutes
          buttons: [
            { id: "1", text: "Option 1", value: "option1" },
            { id: "2", text: "Option 2", value: "option2" },
          ],
          responseField: "user_response",
        };
      case "routerNode":
        return {
          label: "Router",
          conditions: [
            {
              id: "1",
              field: "user_response",
              operator: "equals",
              value: "",
              targetNode: "",
            },
          ],
          defaultTargetNode: "",
        };
      case "assignNode":
        return {
          label: "Assign to Agent",
          agentId: "",
          team: "support",
          message: "You will be connected with an agent shortly.",
        };
      case "webhookNode":
        return {
          label: "API Request",
          url: "https://api.example.com/endpoint",
          method: "GET",
          headers: { "Content-Type": "application/json" },
          body: {},
          responseField: "api_response",
        };
      case "googleSheetNode":
        return {
          label: "Google Sheet Lookup",
          sheetId: "1abc123xyz456",
          range: "Sheet1!A1:D10",
          lookupColumn: "A",
          lookupValue: "",
          resultField: "sheet_data",
        };
      case "stayInSessionNode":
        return {
          label: "Stay In Session",
          message: "Your session is still active. Type something to continue.",
        };
      default:
        return { label: "New Node" };
    }
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  };

  const onTriggerChange = (triggerType) => {
    setActiveTrigger(triggerType);
    // Update the first node (trigger) with the new type
    updateNodeData("trigger-1", { triggerType });
  };

  const saveWorkflow = () => {
    try {
      if (!botName.trim()) {
        alert("Please enter a name for your bot flow.");
        return;
      }

      const flow = rfInstance ? rfInstance.toObject() : { nodes, edges };

      const workflow = {
        id: currentWorkflow?.id || Date.now().toString(),
        name: botName,
        flow,
        trigger: activeTrigger,
        enabled: workflowEnabled,
        timestamp: Date.now(),
      };

      // Call the parent component's save handler
      onSaveWorkflow(workflow);

      // Navigate back to the bot management page
      handleBackToManagement();
    } catch (error) {
      console.error("Error saving workflow:", error);
      alert("Failed to save workflow. Please try again.");
    }
  };

  const toggleWorkflowEnabled = () => {
    setWorkflowEnabled(!workflowEnabled);
  };

  const resetFlow = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the flow? All nodes and connections will be lost."
      )
    ) {
      // Keep only the trigger node
      const triggerNode = nodes.find((node) => node.id === "trigger-1");
      if (triggerNode) {
        setNodes([triggerNode]);
      } else {
        // If no trigger node exists, create a default one
        const defaultTrigger = {
          id: "trigger-1",
          type: "triggerNode",
          position: { x: 250, y: 50 },
          data: {
            label: "Message Trigger",
            triggerType: activeTrigger,
            condition: "",
          },
        };
        setNodes([defaultTrigger]);
      }
      setEdges([]);
      setSelectedNode(null);
    }
  };

  const handleBackToManagement = () => {
    if (onBackToManagement) {
      onBackToManagement();
    }
    navigate("/bot-builder");
  };

  // Debug function to log the current state
  const debugFlow = () => {
    ////console.log("Bot Name:", botName);
    ////console.log("Trigger Type:", activeTrigger);
    ////console.log("Workflow Enabled:", workflowEnabled);
    ////console.log("Nodes:", nodes);
    ////console.log("Edges:", edges);
    ////console.log("ReactFlow Instance:", rfInstance);

    setShowDebugPanel(!showDebugPanel);
  };

  // Simulation functions
  const startSimulation = () => {
    ////console.log("Starting simulation...");
    setIsSimulating(true);
    setSimulationMessages([]);
    setProcessingInput(false);

    // Start with the trigger node
    const triggerNode = nodes.find((node) => node.id === "trigger-1");
    if (!triggerNode) {
      console.error("Trigger node not found!");
      setSimulationMessages([
        {
          id: Date.now(),
          sender: "system",
          text: "Error: Trigger node not found",
        },
      ]);
      return;
    }

    setCurrentSimNode(triggerNode);

    // Add initial system message
    setSimulationMessages([
      {
        id: Date.now(),
        sender: "system",
        text: `Simulation started with trigger: ${triggerNode.data.triggerType}`,
      },
    ]);

    // Process the first node after a short delay
    setTimeout(() => {
      processNode(triggerNode);
    }, 500);
  };

  const stopSimulation = () => {
    ////console.log("Stopping simulation...");
    setIsSimulating(false);
    setCurrentSimNode(null);
    setSimulationMessages([]);
    setUserInput("");
    setProcessingInput(false);
  };

  const processNode = (node) => {
    //console.log("Processing node:", node);
    if (!node) {
      console.error("Attempted to process undefined node");
      return;
    }

    // Highlight the current node in the simulation
    setCurrentSimNode(node);

    // Add a small delay to make the simulation more realistic
    setTimeout(() => {
      switch (node.type) {
        case "triggerNode":
          // For trigger node, find the next connected node and process it
          const triggerOutgoingEdges = edges.filter(
            (edge) => edge.source === node.id
          );
          //console.log("Trigger outgoing edges:", triggerOutgoingEdges);

          if (triggerOutgoingEdges.length > 0) {
            const nextNodeId = triggerOutgoingEdges[0].target;
            const nextNode = nodes.find((n) => n.id === nextNodeId);
            if (nextNode) {
              setTimeout(() => processNode(nextNode), 1000);
            } else {
              console.error("Next node not found:", nextNodeId);
              setSimulationMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  sender: "system",
                  text: `Error: Next node not found (ID: ${nextNodeId})`,
                },
              ]);
            }
          } else {
            setSimulationMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                sender: "system",
                text: "No next node connected to trigger",
              },
            ]);
          }
          break;

        case "messageNode":
          // Add a bot message to the simulation
          setSimulationMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "bot",
              text: node.data.message || "Empty message",
            },
          ]);

          // If this node doesn't wait for reply, move to the next node
          if (!node.data.waitForReply) {
            const messageOutgoingEdges = edges.filter(
              (edge) => edge.source === node.id
            );
            //console.log("Message outgoing edges:", messageOutgoingEdges);

            if (messageOutgoingEdges.length > 0) {
              const nextNodeId = messageOutgoingEdges[0].target;
              const nextNode = nodes.find((n) => n.id === nextNodeId);
              if (nextNode) {
                // Add a small delay before moving to next node
                setTimeout(() => processNode(nextNode), 1500);
              } else {
                console.error("Next node not found:", nextNodeId);
              }
            } else {
              setSimulationMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  sender: "system",
                  text: "End of conversation flow (no next node)",
                },
              ]);
            }
          }
          break;

        case "questionNode":
          // For questions, show buttons or list options
          let messageText = node.data.question || "Empty question";
          if (node.data.buttons && node.data.buttons.length > 0) {
            messageText += "\n\nOptions:";
            node.data.buttons.forEach((button) => {
              messageText += `\n- ${button.text}`;
            });
          }

          setSimulationMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "bot",
              text: messageText,
              options: node.data.buttons || [],
              isQuestion: true,
              nodeId: node.id,
            },
          ]);
          // The user will need to respond, so we stop automatic progression here
          break;

        case "routerNode":
          // Add a system message showing the routing logic
          setSimulationMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "system",
              text: `Router evaluating conditions...`,
            },
          ]);

          // In a real implementation, we would evaluate conditions here
          // For simulation, we'll just follow the default path
          setTimeout(() => {
            setSimulationMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                sender: "system",
                text: `Routing to default path`,
              },
            ]);

            // Find the default connection
            const routerOutgoingEdges = edges.filter(
              (edge) => edge.source === node.id
            );
            //console.log("Router outgoing edges:", routerOutgoingEdges);

            if (routerOutgoingEdges.length > 0) {
              const nextNodeId = routerOutgoingEdges[0].target;
              const nextNode = nodes.find((n) => n.id === nextNodeId);
              if (nextNode) {
                processNode(nextNode);
              } else {
                console.error("Next node not found:", nextNodeId);
              }
            } else {
              setSimulationMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  sender: "system",
                  text: "No next node connected to router",
                },
              ]);
            }
          }, 1500);
          break;

        case "assignNode":
          // Simulate assignment to an agent
          setSimulationMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "bot",
              text:
                node.data.message || "You are being connected to an agent...",
            },
            {
              id: Date.now() + 1,
              sender: "system",
              text: `Chat assigned to ${
                node.data.agentId || "an agent"
              } in team ${node.data.team || "general"}`,
            },
          ]);

          // In a real chat, the agent would take over, but in our simulation
          // we can continue to the next node after a delay
          setTimeout(() => {
            const assignOutgoingEdges = edges.filter(
              (edge) => edge.source === node.id
            );
            //console.log("Assign outgoing edges:", assignOutgoingEdges);

            if (assignOutgoingEdges.length > 0) {
              const nextNodeId = assignOutgoingEdges[0].target;
              const nextNode = nodes.find((n) => n.id === nextNodeId);
              if (nextNode) {
                processNode(nextNode);
              } else {
                console.error("Next node not found:", nextNodeId);
              }
            } else {
              setSimulationMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  sender: "system",
                  text: "End of conversation flow (no next node)",
                },
              ]);
            }
          }, 2000);
          break;

        case "webhookNode":
          // Simulate an API call
          setSimulationMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "system",
              text: `Making ${node.data.method || "GET"} request to ${
                node.data.url || "API endpoint"
              }...`,
            },
          ]);

          // Simulate API response after a delay
          setTimeout(() => {
            setSimulationMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                sender: "system",
                text: `API response received and stored in ${
                  node.data.responseField || "a field"
                }`,
              },
            ]);

            // Move to next node
            const webhookOutgoingEdges = edges.filter(
              (edge) => edge.source === node.id
            );
            //console.log("Webhook outgoing edges:", webhookOutgoingEdges);

            if (webhookOutgoingEdges.length > 0) {
              const nextNodeId = webhookOutgoingEdges[0].target;
              const nextNode = nodes.find((n) => n.id === nextNodeId);
              if (nextNode) {
                processNode(nextNode);
              } else {
                console.error("Next node not found:", nextNodeId);
              }
            } else {
              setSimulationMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  sender: "system",
                  text: "End of conversation flow (no next node)",
                },
              ]);
            }
          }, 2000);
          break;

        case "googleSheetNode":
          // Simulate Google Sheets lookup
          setSimulationMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "system",
              text: `Looking up data in Google Sheet (${
                node.data.sheetId || "Sheet ID"
              })...`,
            },
          ]);

          // Simulate finding data after a delay
          setTimeout(() => {
            setSimulationMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                sender: "system",
                text: `Data found and stored in ${
                  node.data.resultField || "a field"
                }`,
              },
            ]);

            // Move to next node
            const sheetOutgoingEdges = edges.filter(
              (edge) => edge.source === node.id
            );
            //console.log("Sheet outgoing edges:", sheetOutgoingEdges);

            if (sheetOutgoingEdges.length > 0) {
              const nextNodeId = sheetOutgoingEdges[0].target;
              const nextNode = nodes.find((n) => n.id === nextNodeId);
              if (nextNode) {
                processNode(nextNode);
              } else {
                console.error("Next node not found:", nextNodeId);
              }
            } else {
              setSimulationMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  sender: "system",
                  text: "End of conversation flow (no next node)",
                },
              ]);
            }
          }, 2000);
          break;

        case "stayInSessionNode":
          // Simulate staying in session
          setSimulationMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "bot",
              text: node.data.message || "Your session is still active.",
            },
          ]);

          // This is typically a terminal node, so we don't automatically proceed
          break;

        default:
          // For unhandled node types, add a system message
          setSimulationMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "system",
              text: `Processing ${node.type || "unknown node type"}`,
            },
          ]);

          // Try to find the next node
          const outgoingEdges = edges.filter((edge) => edge.source === node.id);
          //console.log("Generic outgoing edges:", outgoingEdges);

          if (outgoingEdges.length > 0) {
            const nextNodeId = outgoingEdges[0].target;
            const nextNode = nodes.find((n) => n.id === nextNodeId);
            if (nextNode) {
              setTimeout(() => processNode(nextNode), 1500);
            } else {
              console.error("Next node not found:", nextNodeId);
            }
          } else {
            setSimulationMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                sender: "system",
                text: "End of conversation flow (no next node)",
              },
            ]);
          }
      }
    }, 500);
  };

  const handleUserInput = (e) => {
    e.preventDefault();
    if (!userInput.trim() || processingInput) return;

    setProcessingInput(true);

    // Add user message to simulation
    setSimulationMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userInput },
    ]);

    // Process user input based on current state
    if (currentSimNode && currentSimNode.type === "questionNode") {
      // Save the user's response (in a real bot, this would update a field)
      setSimulationMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "system",
          text: `Response saved to field: ${
            currentSimNode.data.responseField || "user_response"
          }`,
        },
      ]);

      // Find the next node connected to the question node
      const nextEdges = edges.filter(
        (edge) => edge.source === currentSimNode.id
      );
      //console.log("User input - question node outgoing edges:", nextEdges);

      if (nextEdges.length > 0) {
        const nextNodeId = nextEdges[0].target;
        const nextNode = nodes.find((n) => n.id === nextNodeId);
        if (nextNode) {
          setTimeout(() => {
            processNode(nextNode);
            setProcessingInput(false);
          }, 1000);
        } else {
          console.error("Next node not found:", nextNodeId);
          setProcessingInput(false);
        }
      } else {
        setSimulationMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "system",
            text: "End of conversation flow (no next node)",
          },
        ]);
        setProcessingInput(false);
      }
    } else {
      // If we're not in a question node, just acknowledge the message
      setSimulationMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "system",
          text: "Message received, but bot is not expecting input at this point",
        },
      ]);
      setProcessingInput(false);
    }

    // Clear the input
    setUserInput("");
  };

  const handleOptionClick = (option, nodeId) => {
    if (processingInput) return;
    setProcessingInput(true);

    //console.log("Option clicked:", option, "on node:", nodeId);

    // Add user selection to simulation
    setSimulationMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: option.text },
    ]);

    // Process selection (in a real bot, this would update a field)
    setSimulationMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "system",
        text: `Selected option: ${option.value}`,
      },
    ]);

    // Find the node that this option should lead to
    // In a real implementation, different options could lead to different nodes
    // For this simulation, we'll just find the first outgoing edge
    const nextEdges = edges.filter((edge) => edge.source === nodeId);
    //console.log("Option click - outgoing edges:", nextEdges);

    if (nextEdges.length > 0) {
      const nextNodeId = nextEdges[0].target;
      const nextNode = nodes.find((n) => n.id === nextNodeId);
      if (nextNode) {
        setTimeout(() => {
          processNode(nextNode);
          setProcessingInput(false);
        }, 1000);
      } else {
        console.error("Next node not found:", nextNodeId);
        setProcessingInput(false);
      }
    } else {
      setSimulationMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "system",
          text: "End of conversation flow (no next node)",
        },
      ]);
      setProcessingInput(false);
    }
  };

  return (
    <div className="bot-builder-container">
      <BotBuilderHeader
        botName={botName}
        setBotName={setBotName}
        onSave={saveWorkflow}
        isEnabled={workflowEnabled}
        onToggleEnabled={toggleWorkflowEnabled}
        onSimulate={startSimulation}
        isSimulating={isSimulating}
        onStopSimulation={stopSimulation}
        onBackToManagement={handleBackToManagement}
        isExistingBot={!!effectiveId}
      />

      <div className="bot-builder-content">
        <BotBuilderSidebar
          activeTrigger={activeTrigger}
          onTriggerChange={onTriggerChange}
        />

        <div className="bot-builder-main">
          <div className="flow-container" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              connectionLineType={ConnectionLineType.Bezier}
              defaultEdgeOptions={{
                animated: true,
                type: "default",
              }}
              fitView
              onInit={setRfInstance}
              attributionPosition="bottom-left"
            >
              <Controls />
              <Background color="#f8f8f8" gap={16} size={1} />
              <Panel position="top-right">
                <div className="flow-panel">
                  <button onClick={resetFlow} className="panel-button reset">
                    Reset Flow
                  </button>
                  <button onClick={debugFlow} className="panel-button debug">
                    Debug Flow
                  </button>
                </div>
              </Panel>
            </ReactFlow>
          </div>

          {showDebugPanel && (
            <div className="debug-panel">
              <h3>Debug Information</h3>
              <div className="debug-info">
                <div>
                  <strong>Bot ID:</strong> {effectiveId || "New Bot"}
                </div>
                <div>
                  <strong>Nodes:</strong> {nodes.length}
                </div>
                <div>
                  <strong>Edges:</strong> {edges.length}
                </div>
                <div>
                  <strong>Selected Node:</strong>{" "}
                  {selectedNode ? selectedNode.id : "None"}
                </div>
                <div>
                  <strong>Trigger Type:</strong> {activeTrigger}
                </div>
                <div>
                  <strong>Workflow Enabled:</strong>{" "}
                  {workflowEnabled ? "Yes" : "No"}
                </div>
              </div>
              <button
                onClick={() => setShowDebugPanel(false)}
                className="close-debug"
              >
                Close
              </button>
            </div>
          )}

          {isSimulating && (
            <div className="simulation-panel">
              <div className="simulation-header">
                <h3>Bot Simulation</h3>
                <button onClick={stopSimulation}>Stop Simulation</button>
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

                      {msg.isQuestion &&
                        msg.options &&
                        msg.options.length > 0 && (
                          <div className="message-options">
                            {msg.options.map((option) => (
                              <button
                                key={option.id}
                                onClick={() =>
                                  handleOptionClick(option, msg.nodeId)
                                }
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
              </div>

              <form onSubmit={handleUserInput} className="simulation-input">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your message here..."
                  disabled={processingInput}
                />
                <button
                  type="submit"
                  disabled={processingInput || !userInput.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        {selectedNode && !isSimulating && (
          <BotBuilderProperties
            node={selectedNode}
            updateNodeData={updateNodeData}
            nodes={nodes}
          />
        )}
      </div>
    </div>
  );
};

export default BotBuilder;
