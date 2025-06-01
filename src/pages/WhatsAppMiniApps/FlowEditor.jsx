import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Plus,
  Edit,
  Copy,
  Trash2,
  Play,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Check,
  X,
  AlertCircle,
  MessageSquare,
  Users,
  Terminal,
  Database,
  Send,
  CheckCircle,
  Circle,
  ArrowRight,
  PanelRight,
  Settings,
  Layers,
  Info,
  Search,
  Filter,
  FileText,
} from "lucide-react";
import { workflowAPI } from "../../utils/api";
import WorkflowSimulator from "./WorkflowSimulator";
import "./FlowEditor.css";

// Node type constants
const NODE_TYPES = {
  MESSAGE: "message",
  INPUT: "input",
  INTERACTIVE: "interactive",
  CONDITION: "condition",
  API: "api",
  END: "end",
};

// Node type icon mapping
const NODE_ICONS = {
  [NODE_TYPES.MESSAGE]: <MessageSquare size={16} />,
  [NODE_TYPES.INPUT]: <Terminal size={16} />,
  [NODE_TYPES.INTERACTIVE]: <Users size={16} />,
  [NODE_TYPES.CONDITION]: <Settings size={16} />,
  [NODE_TYPES.API]: <Database size={16} />,
  [NODE_TYPES.END]: <CheckCircle size={16} />,
};

const FlowEditor = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [workflow, setWorkflow] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNode, setEditedNode] = useState(null);
  const [surePassEndpoints, setSurePassEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [workflowMeta, setWorkflowMeta] = useState({
    name: "",
    description: "",
    category: "general",
    tags: [],
    isActive: true,
  });

  // New states for improved interaction
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [connectionSource, setConnectionSource] = useState(null);
  const [connectionType, setConnectionType] = useState("default");
  const [mousePosition, setMousePosition] = useState([0, 0]);

  // Get auth token from localStorage
  const authToken = localStorage.getItem("token");

  // Load workflow data
  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        setLoading(true);
        if (workflowId && workflowId !== "new") {
          const response = await workflowAPI.getWorkflowById(workflowId);
          if (response.success) {
            const { workflow } = response.data;
            setWorkflow(workflow);
            setWorkflowMeta({
              name: workflow.name,
              description: workflow.description,
              category: workflow.category || "general",
              tags: workflow.tags || [],
              isActive: workflow.isActive,
            });

            // Transform nodes for the canvas
            const canvasNodes = workflow.nodes.map((node) => ({
              ...node,
              position: calculateNodePosition(node, workflow.nodes),
              width: getNodeWidth(node.type),
              height: getNodeHeight(node.type, node.options?.length || 0),
            }));

            setNodes(canvasNodes);

            // Create connections
            const edgeConnections = [];
            workflow.nodes.forEach((node) => {
              if (node.nextNodeId) {
                edgeConnections.push({
                  id: `${node.nodeId}-${node.nextNodeId}`,
                  source: node.nodeId,
                  target: node.nextNodeId,
                  type: "default",
                });
              }

              if (node.trueNodeId) {
                edgeConnections.push({
                  id: `${node.nodeId}-${node.trueNodeId}`,
                  source: node.nodeId,
                  target: node.trueNodeId,
                  type: "true",
                });
              }

              if (node.falseNodeId) {
                edgeConnections.push({
                  id: `${node.nodeId}-${node.falseNodeId}`,
                  source: node.nodeId,
                  target: node.falseNodeId,
                  type: "false",
                });
              }

              if (node.errorNodeId) {
                edgeConnections.push({
                  id: `${node.nodeId}-${node.errorNodeId}`,
                  source: node.nodeId,
                  target: node.errorNodeId,
                  type: "error",
                });
              }
            });

            setConnections(edgeConnections);

            // Check if SurePass integration exists
            if (response.data.surePassIntegration) {
              setSurePassEndpoints(
                response.data.surePassIntegration.endpoints || []
              );
            }
          } else {
            setError(response.message || "Failed to load workflow");
          }
        } else {
          // New workflow, initialize with start and end nodes
          const startNode = {
            nodeId: "welcome",
            name: "Welcome Message",
            type: NODE_TYPES.MESSAGE,
            content: "Welcome to our service! How can I help you today?",
            nextNodeId: "end_node",
            options: [],
            buttons: [],
            position: { x: 100, y: 100 },
            width: 250,
            height: 150,
          };

          const endNode = {
            nodeId: "end_node",
            name: "End",
            type: NODE_TYPES.END,
            options: [],
            buttons: [],
            position: { x: 100, y: 300 },
            width: 150,
            height: 80,
          };

          setNodes([startNode, endNode]);
          setConnections([
            {
              id: "welcome-end_node",
              source: "welcome",
              target: "end_node",
              type: "default",
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading workflow:", err);
        setError("Failed to load workflow. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch SurePass endpoints
    const fetchSurePassEndpoints = async () => {
      try {
        const response = await workflowAPI.getSurePassEndpoints();
        if (response.success) {
          setSurePassEndpoints(response.data.endpoints || []);
        }
      } catch (err) {
        console.error("Error loading SurePass endpoints:", err);
      }
    };

    fetchWorkflow();
    fetchSurePassEndpoints();
  }, [workflowId]);

  // Calculate node position based on node relationships
  const calculateNodePosition = (node, allNodes) => {
    // If this is a new workflow or we have no idea, use a default grid layout
    const nodeIndex = allNodes.findIndex((n) => n.nodeId === node.nodeId);
    const row = Math.floor(nodeIndex / 3);
    const col = nodeIndex % 3;

    return {
      x: 100 + col * 300,
      y: 100 + row * 200,
    };
  };

  // Get node width based on type
  const getNodeWidth = (type) => {
    switch (type) {
      case NODE_TYPES.MESSAGE:
      case NODE_TYPES.INPUT:
      case NODE_TYPES.API:
        return 250;
      case NODE_TYPES.INTERACTIVE:
        return 280;
      case NODE_TYPES.CONDITION:
        return 220;
      case NODE_TYPES.END:
        return 150;
      default:
        return 200;
    }
  };

  // Get node height based on type and content
  const getNodeHeight = (type, optionsLength = 0) => {
    switch (type) {
      case NODE_TYPES.MESSAGE:
        return 150;
      case NODE_TYPES.INPUT:
        return 130;
      case NODE_TYPES.INTERACTIVE:
        return 130 + optionsLength * 30;
      case NODE_TYPES.CONDITION:
        return 120;
      case NODE_TYPES.API:
        return 180;
      case NODE_TYPES.END:
        return 80;
      default:
        return 120;
    }
  };

  // Handle canvas mouse down for panning
  const handleCanvasMouseDown = (e) => {
    // Only start panning if not clicking on a node
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle canvas mouse move for panning and other interactions
  const handleCanvasMouseMove = (e) => {
    // Update mouse position for connection drawing
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / scale - position.x;
    const mouseY = (e.clientY - canvasRect.top) / scale - position.y;
    setMousePosition([mouseX, mouseY]);

    if (isDragging) {
      // Handle canvas panning
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (draggingNodeId) {
      // Handle node dragging
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;

      // Update the node position
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.nodeId === draggingNodeId
            ? { ...node, position: { x: newX, y: newY } }
            : node
        )
      );
    }
  };

  // Handle canvas mouse up to stop panning or dragging
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDraggingNodeId(null);

    // Also cancel connection creation if clicking on empty canvas
    if (isCreatingConnection && !isDragging) {
      setIsCreatingConnection(false);
      setConnectionSource(null);
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.1, 2));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.5));
  };

  // Reset zoom and position
  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle node selection
  const handleNodeSelect = (node) => {
    // Don't select if we're creating a connection
    if (!isCreatingConnection) {
      setSelectedNode(node);
      setEditedNode(null);
      setIsEditing(false);
    }
  };

  // Handle node editing
  const handleNodeEdit = (node) => {
    setEditedNode({ ...node });
    setIsEditing(true);
  };

  // Improved node dragging
  const handleNodeDragStart = (e, nodeId) => {
    e.stopPropagation();

    // Find the node
    const node = nodes.find((n) => n.nodeId === nodeId);
    if (!node) return;

    // Get canvas position information
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Calculate drag offset (where within the node the user clicked)
    const mouseX = (e.clientX - canvasRect.left) / scale - position.x;
    const mouseY = (e.clientY - canvasRect.top) / scale - position.y;
    const offsetX = mouseX - node.position.x;
    const offsetY = mouseY - node.position.y;

    setDraggingNodeId(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
    setSelectedNode(node);
  };

  // Handle node property update
  const handleNodeUpdate = (updatedNode) => {
    //console.log("Updating node:", updatedNode); // Debug log

    // Make sure to include width and height based on type
    const finalNode = {
      ...updatedNode,
      width: getNodeWidth(updatedNode.type),
      height: getNodeHeight(updatedNode.type, updatedNode.options?.length || 0),
    };

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.nodeId === finalNode.nodeId ? finalNode : node
      )
    );

    setEditedNode(null);
    setIsEditing(false);
    setSelectedNode(finalNode);
  };

  // Handle adding a new node
  const handleAddNode = (type) => {
    const nodeId = `node_${Date.now()}`;
    const newNode = {
      nodeId,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      type,
      content: type === NODE_TYPES.MESSAGE ? "Enter your message here" : "",
      options: type === NODE_TYPES.INTERACTIVE ? [] : [],
      buttons: [],
      position: { x: 300, y: 200 },
      width: getNodeWidth(type),
      height: getNodeHeight(type),
    };

    if (type === NODE_TYPES.INPUT) {
      newNode.variableName = "new_variable";
    }

    if (type === NODE_TYPES.CONDITION) {
      newNode.condition = "true";
    }

    if (type === NODE_TYPES.INTERACTIVE) {
      newNode.variableName = "selection";
    }

    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
  };

  // Handle node deletion
  const handleDeleteNode = (nodeId) => {
    // Don't allow deleting the end node
    if (nodeId === "end_node") {
      setError("Cannot delete the end node");
      return;
    }

    // Remove the node and its connections
    setNodes(nodes.filter((node) => node.nodeId !== nodeId));
    setConnections(
      connections.filter(
        (conn) => conn.source !== nodeId && conn.target !== nodeId
      )
    );

    if (selectedNode && selectedNode.nodeId === nodeId) {
      setSelectedNode(null);
    }
  };

  // Connection creation functions
  const handleStartConnection = (nodeId, type = "default") => {
    setIsCreatingConnection(true);
    setConnectionSource(nodeId);
    setConnectionType(type);
  };

  const handleCompleteConnection = (targetNodeId) => {
    if (isCreatingConnection && connectionSource && targetNodeId) {
      // Don't connect a node to itself
      if (connectionSource !== targetNodeId) {
        handleCreateConnection(connectionSource, targetNodeId, connectionType);
      }

      // Reset connection creation state
      setIsCreatingConnection(false);
      setConnectionSource(null);
    }
  };

  // Handle creating a connection between nodes
  const handleCreateConnection = (sourceId, targetId, connType = "default") => {
    const connectionId = `${sourceId}-${targetId}`;

    // Check if connection already exists
    if (connections.some((conn) => conn.id === connectionId)) {
      return;
    }

    // When creating a new connection, remove existing connections of the same type
    // from the same source node
    let updatedConnections = [...connections];

    if (connType === "default") {
      // For default connections, remove any existing default connection from this source
      updatedConnections = updatedConnections.filter(
        (conn) => !(conn.source === sourceId && conn.type === "default")
      );
    } else if (connType === "true") {
      // For true connections, remove any existing true connection from this source
      updatedConnections = updatedConnections.filter(
        (conn) => !(conn.source === sourceId && conn.type === "true")
      );
    } else if (connType === "false") {
      // For false connections, remove any existing false connection from this source
      updatedConnections = updatedConnections.filter(
        (conn) => !(conn.source === sourceId && conn.type === "false")
      );
    } else if (connType === "error") {
      // For error connections, remove any existing error connection from this source
      updatedConnections = updatedConnections.filter(
        (conn) => !(conn.source === sourceId && conn.type === "error")
      );
    }

    const newConnection = {
      id: connectionId,
      source: sourceId,
      target: targetId,
      type: connType,
    };

    setConnections([...updatedConnections, newConnection]);

    // Update the source node's next node reference
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.nodeId === sourceId) {
          const updatedNode = { ...node };

          if (connType === "default") {
            updatedNode.nextNodeId = targetId;
          } else if (connType === "true") {
            updatedNode.trueNodeId = targetId;
          } else if (connType === "false") {
            updatedNode.falseNodeId = targetId;
          } else if (connType === "error") {
            updatedNode.errorNodeId = targetId;
          }

          return updatedNode;
        }
        return node;
      })
    );
  };

  // Handle deleting a connection
  const handleDeleteConnection = (connectionId) => {
    const conn = connections.find((c) => c.id === connectionId);
    if (!conn) return;

    setConnections(connections.filter((c) => c.id !== connectionId));

    // Update the source node to remove the reference
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.nodeId === conn.source) {
          const updatedNode = { ...node };

          if (node.nextNodeId === conn.target && conn.type === "default") {
            delete updatedNode.nextNodeId;
          }

          if (node.trueNodeId === conn.target && conn.type === "true") {
            delete updatedNode.trueNodeId;
          }

          if (node.falseNodeId === conn.target && conn.type === "false") {
            delete updatedNode.falseNodeId;
          }

          if (node.errorNodeId === conn.target && conn.type === "error") {
            delete updatedNode.errorNodeId;
          }

          return updatedNode;
        }
        return node;
      })
    );
  };

  // Handle saving the workflow
  const handleSaveWorkflow = async () => {
    try {
      if (!workflowMeta.name) {
        setError("Workflow name is required");
        return;
      }

      // Convert canvas nodes to API format
      const apiNodes = nodes.map((node) => {
        const { position, width, height, ...apiNode } = node;
        return apiNode;
      });

      const workflowData = {
        name: workflowMeta.name,
        description: workflowMeta.description,
        category: workflowMeta.category,
        tags: workflowMeta.tags,
        isActive: workflowMeta.isActive,
        nodes: apiNodes,
        startNodeId: workflow?.startNodeId || "welcome",
      };

      let response;

      if (workflowId && workflowId !== "new") {
        // Update existing workflow
        response = await workflowAPI.updateWorkflow(workflowId, workflowData);
      } else {
        // Create new workflow
        response = await workflowAPI.createWorkflow(workflowData);
      }

      if (response.success) {
        setSuccess("Workflow saved successfully");

        // If creating a new workflow, redirect to the edit page
        if (workflowId === "new") {
          const newWorkflowId = response.data.workflow._id;
          navigate(`/whatsapp-mini-apps/flow-editor/${newWorkflowId}`, {
            replace: true,
          });
        } else {
          // Update local state with the latest data
          setWorkflow(response.data.workflow);
        }
      } else {
        setError(response.message || "Failed to save workflow");
      }
    } catch (err) {
      console.error("Error saving workflow:", err);
      setError("Failed to save workflow. Please try again.");
    }
  };

  // Handle testing the workflow
  const handleTestWorkflow = async () => {
    try {
      if (!workflowId || workflowId === "new") {
        setError("Please save the workflow before testing");
        return;
      }

      setShowSimulator(true);
    } catch (err) {
      console.error("Error testing workflow:", err);
      setError("Failed to test workflow. Please try again.");
    }
  };

  // Handle cloning the workflow
  const handleCloneWorkflow = async () => {
    try {
      if (!workflowId || workflowId === "new") {
        setError("Please save the workflow before cloning");
        return;
      }

      const cloneName = `${workflowMeta.name} (Copy)`;
      const response = await workflowAPI.cloneWorkflow(workflowId, {
        name: cloneName,
      });

      if (response.success) {
        setSuccess("Workflow cloned successfully");
        navigate(`/whatsapp-mini-apps/flow-editor/${response.data._id}`);
      } else {
        setError(response.message || "Failed to clone workflow");
      }
    } catch (err) {
      console.error("Error cloning workflow:", err);
      setError("Failed to clone workflow. Please try again.");
    }
  };

  // Render connection lines between nodes
  const renderConnections = () => {
    return connections.map((connection) => {
      const sourceNode = nodes.find(
        (node) => node.nodeId === connection.source
      );
      const targetNode = nodes.find(
        (node) => node.nodeId === connection.target
      );

      if (!sourceNode || !targetNode) return null;

      // Calculate connection points
      const sourceX = sourceNode.position.x + sourceNode.width / 2;
      const sourceY = sourceNode.position.y + sourceNode.height;
      const targetX = targetNode.position.x + targetNode.width / 2;
      const targetY = targetNode.position.y;

      // For different connection types, adjust the source point
      let adjustedSourceX = sourceX;
      if (sourceNode.type === NODE_TYPES.CONDITION) {
        if (connection.type === "true") {
          adjustedSourceX = sourceNode.position.x + sourceNode.width * 0.25;
        } else if (connection.type === "false") {
          adjustedSourceX = sourceNode.position.x + sourceNode.width * 0.75;
        }
      } else if (
        sourceNode.type === NODE_TYPES.API &&
        connection.type === "error"
      ) {
        adjustedSourceX = sourceNode.position.x + sourceNode.width * 0.75;
      }

      // Create a bezier curve path
      const dx = Math.abs(targetX - adjustedSourceX) * 0.5;
      const dy = Math.abs(targetY - sourceY) * 0.5;
      const controlPoint1X = adjustedSourceX;
      const controlPoint1Y = sourceY + dy;
      const controlPoint2X = targetX;
      const controlPoint2Y = targetY - dy;

      const path = `M ${adjustedSourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`;

      // Determine connection style based on type
      let strokeColor = "#6366f1"; // default connection
      let strokeWidth = 2;
      let strokeDasharray = "none";
      let labelText = "";

      if (connection.type === "true") {
        strokeColor = "#10b981"; // green for true
        labelText = "Yes";
      } else if (connection.type === "false") {
        strokeColor = "#ef4444"; // red for false
        labelText = "No";
      } else if (connection.type === "error") {
        strokeColor = "#f59e0b"; // amber for error
        strokeDasharray = "5,5";
        labelText = "Error";
      }

      // Calculate midpoint for label
      const midX = (adjustedSourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;

      return (
        <g key={connection.id} className="connection">
          <path
            d={path}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            markerEnd="url(#arrowhead)"
            onClick={() => handleDeleteConnection(connection.id)}
          />
          {labelText && (
            <g transform={`translate(${midX}, ${midY})`}>
              <rect
                x="-20"
                y="-10"
                width="40"
                height="20"
                rx="4"
                fill="white"
                stroke={strokeColor}
                strokeWidth="1"
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill={strokeColor}
                fontSize="10"
              >
                {labelText}
              </text>
            </g>
          )}
        </g>
      );
    });
  };

  // Render the temporary connection line when creating a connection
  const renderTemporaryConnection = () => {
    if (!isCreatingConnection || !connectionSource) return null;

    const sourceNode = nodes.find((node) => node.nodeId === connectionSource);
    if (!sourceNode) return null;

    // Calculate source point
    let sourceX = sourceNode.position.x + sourceNode.width / 2;
    let sourceY = sourceNode.position.y + sourceNode.height;

    // Adjust source point based on connection type for condition nodes
    if (sourceNode.type === NODE_TYPES.CONDITION) {
      if (connectionType === "true") {
        sourceX = sourceNode.position.x + sourceNode.width * 0.25;
      } else if (connectionType === "false") {
        sourceX = sourceNode.position.x + sourceNode.width * 0.75;
      }
    } else if (
      sourceNode.type === NODE_TYPES.API &&
      connectionType === "error"
    ) {
      sourceX = sourceNode.position.x + sourceNode.width * 0.75;
    }

    // Get current mouse position
    const [mouseX, mouseY] = mousePosition;

    // Determine color based on connection type
    let strokeColor = "#6366f1"; // default
    if (connectionType === "true") strokeColor = "#10b981";
    if (connectionType === "false") strokeColor = "#ef4444";
    if (connectionType === "error") strokeColor = "#f59e0b";

    return (
      <path
        d={`M ${sourceX} ${sourceY} L ${mouseX} ${mouseY}`}
        stroke={strokeColor}
        strokeWidth="2"
        strokeDasharray="5,5"
        fill="none"
      />
    );
  };

  // Render node component based on type
  const renderNode = (node) => {
    const isSelected = selectedNode && selectedNode.nodeId === node.nodeId;
    const isConnectionSource = connectionSource === node.nodeId;
    const nodeClasses = `node node-${node.type} ${
      isSelected ? "selected" : ""
    } ${isConnectionSource ? "connection-source" : ""}`;

    return (
      <g
        key={node.nodeId}
        className={nodeClasses}
        transform={`translate(${node.position.x}, ${node.position.y})`}
        onClick={(e) => {
          e.stopPropagation();

          // If we're creating a connection, complete it when clicking on a node
          if (isCreatingConnection && connectionSource !== node.nodeId) {
            handleCompleteConnection(node.nodeId);
          } else {
            handleNodeSelect(node);
          }
        }}
      >
        {/* Node body */}
        <rect
          width={node.width}
          height={node.height}
          rx="6"
          className="node-body"
          onMouseDown={(e) => handleNodeDragStart(e, node.nodeId)}
        />

        {/* Node header */}
        <rect
          width={node.width}
          height="28"
          rx="6"
          className={`node-header node-header-${node.type}`}
        />

        {/* Node type icon */}
        <g transform="translate(10, 14)">{NODE_ICONS[node.type]}</g>

        {/* Node title */}
        <text
          x="32"
          y="18"
          textAnchor="start"
          dominantBaseline="middle"
          className="node-title"
        >
          {node.name}
        </text>

        {/* Node content */}
        <foreignObject
          x="10"
          y="34"
          width={node.width - 20}
          height={node.height - 44}
          className="node-content"
        >
          <div>
            {node.type === NODE_TYPES.MESSAGE && (
              <div className="message-content">
                <p>{node.content}</p>
                <div className="options-list">
                  {node.options && node.options.length > 0 ? (
                    node.options.map((option, index) => (
                      <div key={index} className="option-item">
                        <span className="option-text">{option.text}</span>
                      </div>
                    ))
                  ) : (
                    <span className="no-options">No options defined</span>
                  )}
                </div>
              </div>
            )}

            {node.type === NODE_TYPES.CONDITION && (
              <div className="condition-content">
                <div className="condition-expression">
                  <code>{node.condition || "true"}</code>
                </div>
              </div>
            )}

            {node.type === NODE_TYPES.API && (
              <div className="api-content">
                <div className="api-endpoint">
                  <span>Endpoint:</span> {node.apiEndpoint || "Not set"}
                </div>
                <div className="api-method">
                  <span>Method:</span> {node.apiMethod || "GET"}
                </div>
              </div>
            )}

            {node.type === NODE_TYPES.END && (
              <div className="end-content">
                <div className="end-icon">
                  <CheckCircle size={24} />
                </div>
              </div>
            )}
          </div>
        </foreignObject>

        {/* Connection points - improved */}
        {node.type !== NODE_TYPES.END && (
          <g className="connection-points">
            {/* Default output connection point */}
            <circle
              cx={node.width / 2}
              cy={node.height}
              r="6"
              className="connection-point output-point"
              onClick={(e) => {
                e.stopPropagation();
                handleStartConnection(node.nodeId, "default");
              }}
            />

            {/* Conditional output points (for condition nodes) */}
            {node.type === NODE_TYPES.CONDITION && (
              <>
                <circle
                  cx={node.width * 0.25}
                  cy={node.height}
                  r="6"
                  className="connection-point true-point"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartConnection(node.nodeId, "true");
                  }}
                />
                <circle
                  cx={node.width * 0.75}
                  cy={node.height}
                  r="6"
                  className="connection-point false-point"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartConnection(node.nodeId, "false");
                  }}
                />
              </>
            )}

            {/* Error output point (for API nodes) */}
            {node.type === NODE_TYPES.API && (
              <circle
                cx={node.width * 0.75}
                cy={node.height}
                r="6"
                className="connection-point error-point"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartConnection(node.nodeId, "error");
                }}
              />
            )}
          </g>
        )}

        {/* Input connection point */}
        <circle
          cx={node.width / 2}
          cy="0"
          r="6"
          className="connection-point input-point"
          onClick={(e) => {
            e.stopPropagation();
            if (isCreatingConnection) {
              handleCompleteConnection(node.nodeId);
            }
          }}
        />

        {/* Edit button */}
        <g
          transform={`translate(${node.width - 24}, 14)`}
          className="node-edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleNodeEdit(node);
          }}
        >
          <circle cx="0" cy="0" r="10" fill="#ffffff" fillOpacity="0.2" />
          <Edit size={12} />
        </g>
      </g>
    );
  };

  // Render node edit form
  const renderNodeEditForm = () => {
    if (!editedNode) return null;

    const handleChange = (field, value) => {
      setEditedNode({ ...editedNode, [field]: value });
    };

    const handleOptionChange = (index, field, value) => {
      const newOptions = [...editedNode.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      setEditedNode({ ...editedNode, options: newOptions });
    };

    const handleAddOption = () => {
      const newOption = { text: "New Option", value: `option_${Date.now()}` };
      setEditedNode({
        ...editedNode,
        options: [...(editedNode.options || []), newOption],
      });
    };

    const handleRemoveOption = (index) => {
      const newOptions = [...editedNode.options];
      newOptions.splice(index, 1);
      setEditedNode({ ...editedNode, options: newOptions });
    };

    // For the end node, we shouldn't allow changing its type
    const isEndNode = editedNode.nodeId === "end_node";

    return (
      <div className="node-edit-form">
        <h3>Edit Node</h3>

        <div className="form-group">
          <label>Node Name</label>
          <input
            type="text"
            value={editedNode.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* Allow changing node type except for end_node */}
        {!isEndNode && (
          <div className="form-group">
            <label>Node Type</label>
            <select
              value={editedNode.type}
              onChange={(e) => {
                // Handle type change with special care
                const newType = e.target.value;
                const updatedNode = {
                  ...editedNode,
                  type: newType,
                  // Reset type-specific properties
                  content:
                    newType === NODE_TYPES.MESSAGE
                      ? "Enter your message here"
                      : "",
                  options: newType === NODE_TYPES.INTERACTIVE ? [] : undefined,
                  condition:
                    newType === NODE_TYPES.CONDITION ? "true" : undefined,
                  apiEndpoint: newType === NODE_TYPES.API ? "" : undefined,
                  apiMethod: newType === NODE_TYPES.API ? "POST" : undefined,
                  apiParams: newType === NODE_TYPES.API ? {} : undefined,
                  variableName: ["input", "interactive"].includes(newType)
                    ? "variable_name"
                    : undefined,
                };
                setEditedNode(updatedNode);
              }}
            >
              <option value={NODE_TYPES.MESSAGE}>Message</option>
              <option value={NODE_TYPES.INPUT}>Input</option>
              <option value={NODE_TYPES.INTERACTIVE}>Interactive</option>
              <option value={NODE_TYPES.CONDITION}>Condition</option>
              <option value={NODE_TYPES.API}>API</option>
            </select>
          </div>
        )}

        {editedNode.type === NODE_TYPES.MESSAGE && (
          <div className="form-group">
            <label>Message Content</label>
            <textarea
              value={editedNode.content}
              onChange={(e) => handleChange("content", e.target.value)}
              rows="4"
            />
          </div>
        )}

        {editedNode.type === NODE_TYPES.INPUT && (
          <>
            <div className="form-group">
              <label>Prompt Text</label>
              <textarea
                value={editedNode.content}
                onChange={(e) => handleChange("content", e.target.value)}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Variable Name</label>
              <input
                type="text"
                value={editedNode.variableName}
                onChange={(e) => handleChange("variableName", e.target.value)}
              />
              <small>This is where the user's input will be stored</small>
            </div>
          </>
        )}

        {editedNode.type === NODE_TYPES.INTERACTIVE && (
          <>
            <div className="form-group">
              <label>Question Text</label>
              <textarea
                value={editedNode.content}
                onChange={(e) => handleChange("content", e.target.value)}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Variable Name</label>
              <input
                type="text"
                value={editedNode.variableName}
                onChange={(e) => handleChange("variableName", e.target.value)}
              />
              <small>
                This is where the selected option value will be stored
              </small>
            </div>
            <div className="form-group">
              <label>Options</label>
              <div className="options-editor">
                {editedNode.options &&
                  editedNode.options.map((option, index) => (
                    <div key={index} className="option-item-editor">
                      <div className="option-inputs">
                        <input
                          type="text"
                          placeholder="Display Text"
                          value={option.text}
                          onChange={(e) =>
                            handleOptionChange(index, "text", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={option.value}
                          onChange={(e) =>
                            handleOptionChange(index, "value", e.target.value)
                          }
                        />
                      </div>
                      <button
                        className="remove-option-btn"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                <button className="add-option-btn" onClick={handleAddOption}>
                  <Plus size={14} /> Add Option
                </button>
              </div>
            </div>
          </>
        )}

        {editedNode.type === NODE_TYPES.CONDITION && (
          <div className="form-group">
            <label>Condition Expression</label>
            <input
              type="text"
              value={editedNode.condition}
              onChange={(e) => handleChange("condition", e.target.value)}
            />
            <small>JavaScript expression that evaluates to true/false</small>
          </div>
        )}

        {editedNode.type === NODE_TYPES.API && (
          <>
            <div className="form-group">
              <label>API Endpoint</label>
              <select
                value={editedNode.apiEndpoint || ""}
                onChange={(e) => handleChange("apiEndpoint", e.target.value)}
              >
                <option value="">Select an endpoint</option>
                {surePassEndpoints.map((endpoint) => (
                  <option key={endpoint.endpoint} value={endpoint.endpoint}>
                    {endpoint.name} ({endpoint.endpoint})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>API Method</label>
              <select
                value={editedNode.apiMethod || "POST"}
                onChange={(e) => handleChange("apiMethod", e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="form-group">
              <label>API Parameters</label>
              <textarea
                value={JSON.stringify(editedNode.apiParams || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const params = JSON.parse(e.target.value);
                    handleChange("apiParams", params);
                  } catch (err) {
                    // Ignore parse errors while typing
                  }
                }}
                rows="4"
              />
              <small>JSON object with parameter names and values</small>
            </div>
          </>
        )}

        <div className="form-actions">
          <button
            className="cancel-btn"
            onClick={() => {
              setIsEditing(false);
              setEditedNode(null);
            }}
          >
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={() => handleNodeUpdate(editedNode)}
          >
            Update Node
          </button>
        </div>
      </div>
    );
  };

  // Render node properties panel
  const renderNodeProperties = () => {
    if (!selectedNode) {
      return (
        <div className="no-selection-message">
          <div className="empty-state">
            <Layers size={48} />
            <h3>No Node Selected</h3>
            <p>Select a node to view and edit its properties</p>
          </div>
        </div>
      );
    }

    return (
      <div className="node-properties">
        <h3>{selectedNode.name}</h3>
        <div className="node-type">
          <span className="label">Type:</span>
          <span className="value">
            {NODE_ICONS[selectedNode.type]}
            {selectedNode.type.charAt(0).toUpperCase() +
              selectedNode.type.slice(1)}
          </span>
        </div>

        <div className="properties-content">
          {selectedNode.type === NODE_TYPES.MESSAGE && (
            <div className="property-group">
              <h4>Message Content</h4>
              <div className="content-preview">{selectedNode.content}</div>
            </div>
          )}

          {selectedNode.type === NODE_TYPES.INPUT && (
            <>
              <div className="property-group">
                <h4>Input Prompt</h4>
                <div className="content-preview">{selectedNode.content}</div>
              </div>
              <div className="property-group">
                <h4>Variable Name</h4>
                <div className="variable-display">
                  <code>{selectedNode.variableName}</code>
                </div>
              </div>
            </>
          )}

          {selectedNode.type === NODE_TYPES.INTERACTIVE && (
            <>
              <div className="property-group">
                <h4>Question</h4>
                <div className="content-preview">{selectedNode.content}</div>
              </div>
              <div className="property-group">
                <h4>Variable Name</h4>
                <div className="variable-display">
                  <code>{selectedNode.variableName}</code>
                </div>
              </div>
              <div className="property-group">
                <h4>Options</h4>
                <div className="options-list-display">
                  {selectedNode.options && selectedNode.options.length > 0 ? (
                    selectedNode.options.map((option, index) => (
                      <div key={index} className="option-item-display">
                        <div className="option-text">
                          <span className="label">Text:</span> {option.text}
                        </div>
                        <div className="option-value">
                          <span className="label">Value:</span>
                          <code>{option.value}</code>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-options">No options defined</div>
                  )}
                </div>
              </div>
            </>
          )}

          {selectedNode.type === NODE_TYPES.CONDITION && (
            <div className="property-group">
              <h4>Condition Expression</h4>
              <div className="condition-display">
                <code>{selectedNode.condition || "true"}</code>
              </div>
              <div className="condition-paths">
                <div className="path">
                  <span className="path-label true">If True:</span>
                  <span className="path-value">
                    {selectedNode.trueNodeId
                      ? nodes.find((n) => n.nodeId === selectedNode.trueNodeId)
                          ?.name || selectedNode.trueNodeId
                      : "Not set"}
                  </span>
                </div>
                <div className="path">
                  <span className="path-label false">If False:</span>
                  <span className="path-value">
                    {selectedNode.falseNodeId
                      ? nodes.find((n) => n.nodeId === selectedNode.falseNodeId)
                          ?.name || selectedNode.falseNodeId
                      : "Not set"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedNode.type === NODE_TYPES.API && (
            <>
              <div className="property-group">
                <h4>API Endpoint</h4>
                <div className="api-endpoint-display">
                  <code>{selectedNode.apiEndpoint || "Not set"}</code>
                </div>
              </div>
              <div className="property-group">
                <h4>API Method</h4>
                <div className="api-method-display">
                  <span
                    className={`method ${
                      selectedNode.apiMethod?.toLowerCase() || "get"
                    }`}
                  >
                    {selectedNode.apiMethod || "GET"}
                  </span>
                </div>
              </div>
              <div className="property-group">
                <h4>API Parameters</h4>
                <div className="api-params-display">
                  <pre>
                    {JSON.stringify(selectedNode.apiParams || {}, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="property-group">
                <h4>Error Handling</h4>
                <div className="error-path">
                  <span className="path-label error">On Error:</span>
                  <span className="path-value">
                    {selectedNode.errorNodeId
                      ? nodes.find((n) => n.nodeId === selectedNode.errorNodeId)
                          ?.name || selectedNode.errorNodeId
                      : "Not set"}
                  </span>
                </div>
              </div>
            </>
          )}

          {selectedNode.type !== NODE_TYPES.END && (
            <div className="property-group">
              <h4>Next Node</h4>
              <div className="next-node-display">
                {selectedNode.nextNodeId
                  ? nodes.find((n) => n.nodeId === selectedNode.nextNodeId)
                      ?.name || selectedNode.nextNodeId
                  : "Not set"}
              </div>
            </div>
          )}
        </div>

        <div className="property-actions">
          <button
            className="edit-btn"
            onClick={() => handleNodeEdit(selectedNode)}
          >
            <Edit size={14} />
            Edit Node
          </button>
          {selectedNode.nodeId !== "welcome" &&
            selectedNode.nodeId !== "end_node" && (
              <button
                className="delete-btn"
                onClick={() => handleDeleteNode(selectedNode.nodeId)}
              >
                <Trash2 size={14} />
                Delete Node
              </button>
            )}
        </div>
      </div>
    );
  };

  // Render workflow metadata form
  const renderWorkflowMetaForm = () => {
    return (
      <div className="workflow-meta-form">
        <h3>Workflow Properties</h3>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={workflowMeta.name}
            onChange={(e) =>
              setWorkflowMeta({ ...workflowMeta, name: e.target.value })
            }
            placeholder="Enter workflow name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={workflowMeta.description}
            onChange={(e) =>
              setWorkflowMeta({ ...workflowMeta, description: e.target.value })
            }
            placeholder="Enter workflow description"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={workflowMeta.category}
            onChange={(e) =>
              setWorkflowMeta({ ...workflowMeta, category: e.target.value })
            }
          >
            <option value="general">General</option>
            <option value="kyc">KYC</option>
            <option value="onboarding">Onboarding</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
            <option value="finance">Finance</option>
            <option value="property-sales">Property Sales</option>
          </select>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            value={workflowMeta.tags.join(", ")}
            onChange={(e) => {
              const tagsString = e.target.value;
              const tagsArray = tagsString
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag);
              setWorkflowMeta({ ...workflowMeta, tags: tagsArray });
            }}
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div className="form-group">
          <label>Active</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="active-toggle"
              checked={workflowMeta.isActive}
              onChange={(e) =>
                setWorkflowMeta({ ...workflowMeta, isActive: e.target.checked })
              }
            />
            <label htmlFor="active-toggle"></label>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flow-editor-container">
      {/* Top toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button
            className="back-button"
            onClick={() => navigate("/whatsapp-mini-apps")}
          >
            <ChevronLeft size={16} />
            Back to WhatsApp Mini Apps
          </button>
          <h2>{workflowMeta.name || "New Workflow"}</h2>
        </div>

        <div className="toolbar-actions">
          <button className="save-button" onClick={handleSaveWorkflow}>
            <Save size={16} />
            Save
          </button>

          {workflowId && workflowId !== "new" && (
            <>
              <button className="test-button" onClick={handleTestWorkflow}>
                <Play size={16} />
                Test
              </button>

              <button className="clone-button" onClick={handleCloneWorkflow}>
                <Copy size={16} />
                Clone
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alert messages */}
      {error && (
        <div className="alert error">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="close-alert" onClick={() => setError("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div className="alert success">
          <Check size={16} />
          <span>{success}</span>
          <button className="close-alert" onClick={() => setSuccess("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main editor area with canvas and side panel */}
      <div className="editor-main">
        {/* Canvas toolbar */}
        <div className="canvas-toolbar">
          <div className="zoom-controls">
            <button onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOut size={16} />
            </button>
            <span>{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomIn} disabled={scale >= 2}>
              <ZoomIn size={16} />
            </button>
            <button onClick={handleResetView} className="reset-view">
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          <div className="add-node-controls">
            <span>Add Node:</span>
            <button onClick={() => handleAddNode(NODE_TYPES.MESSAGE)}>
              {NODE_ICONS[NODE_TYPES.MESSAGE]}
              Message
            </button>
            <button onClick={() => handleAddNode(NODE_TYPES.INPUT)}>
              {NODE_ICONS[NODE_TYPES.INPUT]}
              Input
            </button>
            <button onClick={() => handleAddNode(NODE_TYPES.INTERACTIVE)}>
              {NODE_ICONS[NODE_TYPES.INTERACTIVE]}
              Options
            </button>
            <button onClick={() => handleAddNode(NODE_TYPES.CONDITION)}>
              {NODE_ICONS[NODE_TYPES.CONDITION]}
              Condition
            </button>
            <button onClick={() => handleAddNode(NODE_TYPES.API)}>
              {NODE_ICONS[NODE_TYPES.API]}
              API
            </button>
          </div>
        </div>

        {/* Editor content area */}
        <div className="editor-content">
          {/* Canvas area */}
          <div
            className="canvas-container"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {loading ? (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>Loading workflow...</p>
              </div>
            ) : (
              <div className="canvas" ref={canvasRef}>
                <svg width="100%" height="100%" className="canvas-svg">
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                    </marker>
                  </defs>

                  <g
                    className="canvas-content"
                    transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
                  >
                    {/* Render connections first so they appear behind nodes */}
                    {renderConnections()}

                    {/* Render temporary connection if creating one */}
                    {renderTemporaryConnection()}

                    {/* Render nodes */}
                    {nodes.map((node) => renderNode(node))}
                  </g>
                </svg>
              </div>
            )}
          </div>

          {/* Side panel */}
          <div
            className={`side-panel ${showSidePanel ? "visible" : "hidden"} ${
              isPanelExpanded ? "expanded" : ""
            }`}
          >
            <div
              className="side-panel-toggle"
              onClick={() => setShowSidePanel(!showSidePanel)}
            >
              {showSidePanel ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </div>

            <div className="side-panel-content">
              <div className="panel-tabs">
                <button
                  className={isEditing ? "" : "active"}
                  onClick={() => {
                    setIsEditing(false);
                    setEditedNode(null);
                  }}
                >
                  <Info size={16} />
                  Properties
                </button>
                <button
                  className={isEditing ? "active" : ""}
                  disabled={!selectedNode && !isEditing}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  className={isPanelExpanded ? "active" : ""}
                  onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                >
                  <PanelRight size={16} />
                  {isPanelExpanded ? "Collapse" : "Expand"}
                </button>
              </div>

              <div className="panel-content">
                {isEditing ? (
                  renderNodeEditForm()
                ) : (
                  <>
                    {renderWorkflowMetaForm()}
                    <div className="divider"></div>
                    {renderNodeProperties()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Simulator Modal */}
      {showSimulator && (
        <WorkflowSimulator
          workflowId={workflowId}
          onClose={() => setShowSimulator(false)}
          authToken={authToken}
        />
      )}
    </div>
  );
};

export default FlowEditor;
