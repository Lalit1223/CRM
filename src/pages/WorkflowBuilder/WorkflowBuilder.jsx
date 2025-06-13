// src/pages/WorkflowBuilder/WorkflowBuilder.jsx - Updated simulation integration
import React, { useState, useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

import WorkflowHeader from "./components/WorkflowHeader";
import WorkflowSidebar from "./components/WorkflowSidebar";
import WorkflowProperties from "./components/WorkflowProperties";
import NodeEditor from "./components/NodeEditor";
import SimulationPanel from "./components/SimulationPanel";
import CustomNode from "./components/CustomNode";
import { workflowAPI } from "../../utils/api";
import { NODE_TYPES } from "../../types/workflow";
import "./WorkflowBuilder.css";
import "./components/WorkflowComponents.css";

// Define nodeTypes outside component to avoid React Flow warnings
const nodeTypes = {
  customNode: CustomNode,
};

const WorkflowBuilder = ({ workflowId, onBackToManagement }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflow, setWorkflow] = useState({
    name: "New Workflow",
    description: "A new workflow",
    category: "general",
    isActive: false,
    nodes: [],
    startNodeId: null,
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [showNodeEditor, setShowNodeEditor] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const PAYMENT_PENDING = false; // Set to false after payment

  // Memoize nodeTypes to prevent React Flow warnings
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  // Load workflow if editing existing one
  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  }, [workflowId]);

  // Update nodes when simulation state changes
  useEffect(() => {
    updateNodesSimulationState();
  }, [isSimulating]);

  const updateNodesSimulationState = () => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSimulating: isSimulating,
        },
      }))
    );
  };

  const loadWorkflow = async (id) => {
    setLoading(true);
    try {
      const response = await workflowAPI.getWorkflowById(id);
      if (response.success) {
        const workflowData = response.data.workflow;
        setWorkflow(workflowData);

        // Convert workflow nodes to React Flow format
        const flowNodes = workflowData.nodes.map((node, index) => ({
          id: node.nodeId,
          type: "customNode",
          position: node.position || {
            x: 100 + (index % 4) * 300,
            y: 100 + Math.floor(index / 4) * 200,
          },
          data: {
            ...node,
            onEdit: handleEditNode,
            onDelete: handleDeleteNode,
            isSimulating: isSimulating,
          },
        }));

        // Create edges from node connections
        const flowEdges = [];
        workflowData.nodes.forEach((node) => {
          if (node.nextNodeId) {
            flowEdges.push({
              id: `${node.nodeId}-${node.nextNodeId}`,
              source: node.nodeId,
              target: node.nextNodeId,
              type: "default",
            });
          }
          if (node.trueNodeId) {
            flowEdges.push({
              id: `${node.nodeId}-true-${node.trueNodeId}`,
              source: node.nodeId,
              target: node.trueNodeId,
              sourceHandle: "true",
              type: "default",
              label: "True",
              style: { stroke: "#10b981" },
            });
          }
          if (node.falseNodeId) {
            flowEdges.push({
              id: `${node.nodeId}-false-${node.falseNodeId}`,
              source: node.nodeId,
              target: node.falseNodeId,
              sourceHandle: "false",
              type: "default",
              label: "False",
              style: { stroke: "#ef4444" },
            });
          }
          if (node.errorNodeId) {
            flowEdges.push({
              id: `${node.nodeId}-error-${node.errorNodeId}`,
              source: node.nodeId,
              target: node.errorNodeId,
              sourceHandle: "error",
              type: "default",
              label: "Error",
              style: { stroke: "#f59e0b" },
            });
          }
        });

        setNodes(flowNodes);
        setEdges(flowEdges);
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      alert("Failed to load workflow");
    } finally {
      setLoading(false);
    }
  };

  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        type: "default",
      };
      setEdges((eds) => addEdge(edge, eds));

      // Update workflow nodes
      updateNodeConnection(params.source, params.target, params.sourceHandle);
    },
    [setEdges]
  );

  const updateNodeConnection = (sourceId, targetId, handle = null) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => {
        if (node.nodeId === sourceId) {
          if (handle === "true") {
            return { ...node, trueNodeId: targetId };
          } else if (handle === "false") {
            return { ...node, falseNodeId: targetId };
          } else if (handle === "error") {
            return { ...node, errorNodeId: targetId };
          } else {
            return { ...node, nextNodeId: targetId };
          }
        }
        return node;
      }),
    }));
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const createNode = (type, position = null) => {
    const nodeId = `node_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const nodeConfig = NODE_TYPES[type];

    // Generate position if not provided
    const nodePosition = position || {
      x: 250 + Math.random() * 400,
      y: 100 + Math.random() * 400,
    };

    const newNode = {
      nodeId,
      name: `${nodeConfig.label} Node`,
      type,
      content: nodeConfig.defaultContent,
      position: nodePosition,
      nextNodeId: null,
      trueNodeId: null,
      falseNodeId: null,
      errorNodeId: null,
      options:
        type === "interactive" ? [{ text: "Option 1", value: "option1" }] : [],
      buttons: [],
      variableName: type === "input" ? "user_input" : null,
      condition: type === "condition" ? 'variable === "value"' : null,
      apiEndpoint: type === "api" ? "/api/example" : null,
      apiMethod: type === "api" ? "POST" : null,
      apiParams: type === "api" ? {} : null,
      delay: type === "delay" ? 1 : null,
    };

    // Add to workflow
    setWorkflow((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      startNodeId: prev.startNodeId || nodeId,
    }));

    // Add to React Flow
    const flowNode = {
      id: nodeId,
      type: "customNode",
      position: nodePosition,
      data: {
        ...newNode,
        onEdit: handleEditNode,
        onDelete: handleDeleteNode,
        isSimulating: isSimulating,
      },
    };

    setNodes((nds) => [...nds, flowNode]);
  };

  const handleEditNode = (node) => {
    setEditingNode(node);
    setShowNodeEditor(true);
  };

  const handleSaveNode = (editedNode) => {
    // Update workflow
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.nodeId === editedNode.nodeId ? editedNode : node
      ),
    }));

    // Update React Flow nodes
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editedNode.nodeId
          ? {
              ...node,
              data: {
                ...editedNode,
                onEdit: handleEditNode,
                onDelete: handleDeleteNode,
                isSimulating: isSimulating,
              },
            }
          : node
      )
    );
  };

  const handleDeleteNode = (nodeId) => {
    // Remove from workflow
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.nodeId !== nodeId),
      startNodeId:
        prev.startNodeId === nodeId
          ? prev.nodes.find((n) => n.nodeId !== nodeId)?.nodeId || null
          : prev.startNodeId,
    }));

    // Remove from React Flow
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );

    // Clear selection if deleted node was selected
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const saveWorkflow = async () => {
    if (PAYMENT_PENDING) {
      alert(
        "⚠️ Demo Mode: Workflow saving is disabled in demo version. Please contact administrator for full access."
      );
      return;
    }
    setSaving(true);
    try {
      // Update positions from React Flow nodes
      const updatedNodes = workflow.nodes.map((workflowNode) => {
        const flowNode = nodes.find((n) => n.id === workflowNode.nodeId);
        return {
          ...workflowNode,
          position: flowNode?.position || workflowNode.position,
        };
      });

      const workflowData = {
        ...workflow,
        nodes: updatedNodes,
        version: 1,
        tags: [workflow.category],
        isActive: workflow.isActive || false,
      };

      let response;
      if (workflowId) {
        response = await workflowAPI.updateWorkflow(workflowId, workflowData);
      } else {
        response = await workflowAPI.createWorkflow(workflowData);
      }

      if (response.success) {
        alert("Workflow saved successfully!");
        if (!workflowId && response.data?.workflow?._id) {
          // If creating new workflow, redirect to edit mode
          window.location.href = `/workflow-builder/edit/${response.data.workflow._id}`;
        }
      } else {
        alert(
          "Failed to save workflow: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error saving workflow:", error);
      alert("Failed to save workflow");
    } finally {
      setSaving(false);
    }
  };

  const startSimulation = () => {
    if (!workflow.startNodeId) {
      alert(
        "Please set a start node for the workflow by connecting nodes or saving the workflow first"
      );
      return;
    }
    setShowSimulation(true);
    setIsSimulating(true);
  };

  const openSimulation = () => {
    setShowSimulation(true);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  if (loading) {
    return (
      <div className="workflow-builder-loading">
        <div className="loading-spinner"></div>
        <p>Loading workflow...</p>
      </div>
    );
  }

  return (
    <div className={`workflow-builder ${isSimulating ? "simulating" : ""}`}>
      <WorkflowHeader
        workflow={workflow}
        onWorkflowChange={setWorkflow}
        onSave={saveWorkflow}
        onBack={onBackToManagement}
        isSimulating={isSimulating}
        onStartSimulation={startSimulation}
        onStopSimulation={stopSimulation}
        onOpenSimulation={openSimulation}
        saving={saving}
      />

      <div className="workflow-builder-content">
        <WorkflowSidebar onCreateNode={createNode} />

        <div className="workflow-canvas">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={memoizedNodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Background />
              <Controls />
              <MiniMap />
              <Panel position="top-right">
                <div className="workflow-stats">
                  <span>Nodes: {nodes.length}</span>
                  <span>Connections: {edges.length}</span>
                </div>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {selectedNode && (
          <WorkflowProperties
            node={selectedNode}
            workflow={workflow}
            onUpdateNode={handleSaveNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      <NodeEditor
        node={editingNode}
        isOpen={showNodeEditor}
        onClose={() => {
          setShowNodeEditor(false);
          setEditingNode(null);
        }}
        onSave={handleSaveNode}
      />

      <SimulationPanel
        isOpen={showSimulation}
        onClose={() => setShowSimulation(false)}
        workflow={workflow}
        workflowId={workflowId}
        isSimulating={isSimulating}
        onStartSimulation={startSimulation}
        onStopSimulation={stopSimulation}
      />
    </div>
  );
};

export default WorkflowBuilder;
