import React, { useState, useCallback, useRef, useEffect } from "react";
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
import "./VisualFlowEditor.css";

// Import node types
import MessageNode from "./components/nodes/MessageNode";
import InputNode from "./components/nodes/InputNode";
import ConditionNode from "./components/nodes/ConditionNode";
import ApiNode from "./components/nodes/ApiNode";
import TriggerNode from "./components/nodes/TriggerNode";
import EndNode from "./components/nodes/EndNode";

// Import UI components
import FlowEditorHeader from "./components/FlowEditorHeader";
import FlowEditorSidebar from "./components/FlowEditorSidebar";
import FlowEditorProperties from "./components/FlowEditorProperties";
import FlowEditorSimulator from "./components/FlowEditorSimulator";

// Node types definition
const nodeTypes = {
  messageNode: MessageNode,
  inputNode: InputNode,
  conditionNode: ConditionNode,
  apiNode: ApiNode,
  triggerNode: TriggerNode,
  endNode: EndNode,
};

// Initial nodes setup
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
  {
    id: "end-1",
    type: "endNode",
    position: { x: 250, y: 300 },
    data: {
      label: "End",
    },
  },
];

const initialEdges = [
  {
    id: "trigger-to-end",
    source: "trigger-1",
    target: "end-1",
    type: "default",
    animated: true,
    style: { stroke: "#4f46e5", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#4f46e5",
    },
  },
];

const VisualFlowEditor = ({
  savedWorkflows = [],
  currentWorkflowId = null,
  onSaveWorkflow,
  onBackToManagement,
}) => {
  // Get workflowId from URL params or props
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const effectiveId = workflowId || currentWorkflowId;

  // ReactFlow refs and states
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);

  // UI states
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [workflowCategory, setWorkflowCategory] = useState("general");
  const [workflowTags, setWorkflowTags] = useState([]);
  const [isWorkflowActive, setIsWorkflowActive] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [activeTrigger, setActiveTrigger] = useState("New Message Received");

  // Load workflow data either from URL param or prop
  useEffect(() => {
    if (effectiveId) {
      const workflow = savedWorkflows.find((w) => w.id === effectiveId);
      if (workflow) {
        setCurrentWorkflow(workflow);
        loadWorkflow(workflow);
      } else {
        console.error("Workflow not found:", effectiveId);
        setError("Workflow not found. Creating a new one.");
        navigate("/flow-editor/new"); // Redirect to new workflow if not found
      }
    } else {
      // New workflow
      resetToNewWorkflow();
    }
  }, [effectiveId, savedWorkflows, navigate]);

  // Reset to a new workflow
  const resetToNewWorkflow = () => {
    setCurrentWorkflow(null);
    setWorkflowName("New Workflow");
    setWorkflowDescription("");
    setWorkflowCategory("general");
    setWorkflowTags([]);
    setIsWorkflowActive(true);
    setActiveTrigger("New Message Received");
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
    setIsEditing(false);
  };

  // Load existing workflow
  const loadWorkflow = (workflow) => {
    try {
      setWorkflowName(workflow.name);
      setWorkflowDescription(workflow.description || "");
      setWorkflowCategory(workflow.category || "general");
      setWorkflowTags(workflow.tags || []);
      setIsWorkflowActive(workflow.isActive || false);
      setActiveTrigger(workflow.trigger || "New Message Received");

      if (workflow.flow) {
        setNodes(workflow.flow.nodes || initialNodes);
        setEdges(workflow.flow.edges || initialEdges);
      } else {
        // Fallback for older saved workflows
        setNodes(workflow.nodes || initialNodes);
        setEdges(workflow.edges || initialEdges);
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      setError("Failed to load workflow. The saved data might be corrupted.");
    }
  };

  // Handle node connection
  const onConnect = useCallback(
    (params) => {
      //console.log("Connection params:", params);

      // Create a new edge with custom styling
      const newEdge = {
        ...params,
        type: "default", // or 'smoothstep', 'straight', etc.
        animated: true,
        style: { stroke: "#4f46e5", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#4f46e5",
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle node dropping from palette
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

        //console.log("Created new node:", newNode);
        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error("Error adding node:", error);
      }
    },
    [rfInstance, setNodes]
  );

  // Get default data for node types
  const getDefaultDataForNodeType = (type) => {
    switch (type) {
      case "messageNode":
        return {
          label: "Send Message",
          message: "Hello! How can I help you today?",
          waitForReply: false,
        };
      case "inputNode":
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
      case "conditionNode":
        return {
          label: "Router",
          condition: {
            variable: "user_response",
            operator: "==",
            value: "",
          },
        };
      case "apiNode":
        return {
          label: "API Request",
          apiDetails: {
            url: "https://api.example.com/endpoint",
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: {},
          },
          responseField: "api_response",
        };
      case "triggerNode":
        return {
          label: "Message Trigger",
          triggerType: activeTrigger,
          condition: "",
        };
      case "endNode":
        return {
          label: "End",
        };
      default:
        return { label: "New Node" };
    }
  };

  // Handle node click
  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setIsEditing(false);
  };

  // Update node data
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

  // Handle node editing
  const handleNodeEdit = (node) => {
    setSelectedNode(node);
    setIsEditing(true);
  };

  // Handle trigger type change
  const onTriggerChange = (triggerType) => {
    setActiveTrigger(triggerType);
    // Update the first node (trigger) with the new type
    const triggerNode = nodes.find((node) => node.type === "triggerNode");
    if (triggerNode) {
      updateNodeData(triggerNode.id, { triggerType });
    }
  };

  // Save the workflow
  const saveWorkflow = () => {
    try {
      if (!workflowName.trim()) {
        setError("Please enter a name for your workflow.");
        return;
      }

      // Get the flow object from ReactFlow instance
      const flow = rfInstance ? rfInstance.toObject() : { nodes, edges };

      const workflow = {
        id: currentWorkflow?.id || Date.now().toString(),
        name: workflowName,
        description: workflowDescription,
        category: workflowCategory,
        tags: workflowTags,
        isActive: isWorkflowActive,
        flow,
        trigger: activeTrigger,
        timestamp: Date.now(),
      };

      // Call the parent component's save handler
      if (onSaveWorkflow) {
        onSaveWorkflow(workflow);
      }

      setSuccess("Workflow saved successfully!");
      setCurrentWorkflow(workflow);

      // If this is a new workflow, update the URL
      if (!effectiveId) {
        navigate(`/flow-editor/${workflow.id}`, { replace: true });
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      setError("Failed to save workflow. Please try again.");
    }
  };

  // Toggle workflow active state
  const toggleWorkflowActive = () => {
    setIsWorkflowActive(!isWorkflowActive);
  };

  // Reset the flow
  const resetFlow = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the flow? All nodes and connections will be lost."
      )
    ) {
      // Keep only the trigger and end nodes
      const triggerNode = nodes.find((node) => node.type === "triggerNode");
      const endNode = nodes.find((node) => node.type === "endNode");

      if (triggerNode && endNode) {
        // Reset positions
        const resetNodes = [
          {
            ...triggerNode,
            position: { x: 250, y: 50 },
          },
          {
            ...endNode,
            position: { x: 250, y: 300 },
          },
        ];

        setNodes(resetNodes);

        // Create a connection between trigger and end
        const resetEdges = [
          {
            id: `${triggerNode.id}-${endNode.id}`,
            source: triggerNode.id,
            target: endNode.id,
            type: "default",
            animated: true,
            style: { stroke: "#4f46e5", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#4f46e5",
            },
          },
        ];

        setEdges(resetEdges);
      } else {
        // If no trigger or end node exists, reset to initial state
        setNodes(initialNodes);
        setEdges(initialEdges);
      }

      setSelectedNode(null);
    }
  };

  // Handle back to management
  const handleBackToManagement = () => {
    if (onBackToManagement) {
      onBackToManagement();
    }
    navigate("/workflows");
  };

  // Start simulation
  const startSimulation = () => {
    setIsSimulating(true);
  };

  // Stop simulation
  const stopSimulation = () => {
    setIsSimulating(false);
  };

  return (
    <div className="visual-flow-editor-container">
      <FlowEditorHeader
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        isActive={isWorkflowActive}
        onToggleActive={toggleWorkflowActive}
        onSave={saveWorkflow}
        onSimulate={startSimulation}
        isSimulating={isSimulating}
        onStopSimulation={stopSimulation}
        onBackToManagement={handleBackToManagement}
        isExistingWorkflow={!!effectiveId}
      />

      {/* Alert messages */}
      {error && (
        <div className="alert error">
          <span>{error}</span>
          <button className="close-alert" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="alert success">
          <span>{success}</span>
          <button className="close-alert" onClick={() => setSuccess("")}>
            ×
          </button>
        </div>
      )}

      <div className="editor-content">
        <FlowEditorSidebar
          activeTrigger={activeTrigger}
          onTriggerChange={onTriggerChange}
          showSidePanel={showSidePanel}
          setShowSidePanel={setShowSidePanel}
        />

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
          >
            <Controls />
            <Background color="#f8f8f8" gap={16} size={1} />
            <Panel position="top-right">
              <div className="flow-panel">
                <button onClick={resetFlow} className="panel-button reset">
                  Reset Flow
                </button>
                <button
                  onClick={() => setShowSidePanel(!showSidePanel)}
                  className="panel-button"
                >
                  {showSidePanel ? "Hide Sidebar" : "Show Sidebar"}
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {selectedNode && !isSimulating && (
          <FlowEditorProperties
            node={selectedNode}
            updateNodeData={updateNodeData}
            nodes={nodes}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onNodeEdit={handleNodeEdit}
            isPanelExpanded={isPanelExpanded}
            setIsPanelExpanded={setIsPanelExpanded}
          />
        )}

        {isSimulating && (
          <FlowEditorSimulator
            nodes={nodes}
            edges={edges}
            onClose={stopSimulation}
          />
        )}
      </div>
    </div>
  );
};

export default VisualFlowEditor;
