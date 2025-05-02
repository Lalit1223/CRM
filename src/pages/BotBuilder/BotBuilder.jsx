// src/pages/BotBuilder/BotBuilder.jsx
import React, { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import "./BotBuilder.css";

// Import components
import BotBuilderHeader from "./components/BotBuilderHeader";
import BotBuilderSidebar from "./components/BotBuilderSidebar";
import BotBuilderCanvas from "./components/BotBuilderCanvas";
import BotBuilderProperties from "./components/BotBuilderProperties";

// Import hooks
import useUndoRedo from "./hooks/useUndoRedo";
import useCanvasZoom from "./hooks/useCanvasZoom";

// Import constants
import { nodeTypes } from "./constants/nodeTypes";

const BotBuilder = () => {
  // State
  const [showSidebar, setShowSidebar] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [botName, setBotName] = useState("New Bot");
  const [isEditingBotName, setIsEditingBotName] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Refs
  const canvasRef = useRef(null);

  // Custom hooks
  const { zoomLevel, canvasOffset, handleZoom, handleResetView } =
    useCanvasZoom();
  const { undoStack, redoStack, saveToHistory, handleUndo, handleRedo } =
    useUndoRedo({ nodes, connections, setNodes, setConnections });

  // Handler to add a new node
  const handleAddNode = (nodeType, x = null, y = null) => {
    // Calculate position if not provided
    const position = {
      x: x !== null ? x : window.innerWidth / 2 - 120,
      y: y !== null ? y : window.innerHeight / 2 - 100,
    };

    // Find node type info
    const nodeTypeInfo = nodeTypes.find((n) => n.id === nodeType) || {
      label: "Unknown Node",
      icon: "HelpCircle",
      color: "#999",
      outputs: 1,
      inputs: 1,
    };

    // Create a new node with defaults based on type
    const newNode = {
      id: `node_${Date.now()}`,
      type: nodeType,
      position,
      data: {
        label: nodeTypeInfo.label,
        ...getDefaultNodeData(nodeType),
      },
    };

    saveToHistory();
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
  };

  // Get default data for a new node based on type
  const getDefaultNodeData = (nodeType) => {
    switch (nodeType) {
      case "message":
        return { content: "Enter your message here" };
      case "input":
        return {
          content: "Ask a question...",
          options: [
            { id: "opt_1", text: "Option 1" },
            { id: "opt_2", text: "Option 2" },
          ],
        };
      case "condition":
        return {
          condition: {
            variable: "{{user_input}}",
            operator: "==",
            value: "yes",
          },
        };
      case "api":
        return {
          apiDetails: {
            url: "https://api.example.com/endpoint",
            method: "GET",
            headers: {},
            body: "{}",
          },
        };
      case "template":
        return {
          templateDetails: {
            name: "sample_template",
            language: "en",
            parameters: [],
          },
        };
      case "delay":
        return {
          delayTime: {
            value: 5,
            unit: "minutes",
          },
        };
      case "webhook":
        return {
          webhookDetails: {
            url: "https://webhooks.example.com/trigger",
            method: "POST",
            headers: {},
            payload: "{}",
          },
        };
      default:
        return {};
    }
  };

  // Handle updating node properties
  const handleUpdateNodeProperties = (updatedData) => {
    if (!selectedNode) return;

    saveToHistory();
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updatedData,
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);

    // Update selected node reference
    setSelectedNode({
      ...selectedNode,
      data: {
        ...selectedNode.data,
        ...updatedData,
      },
    });
  };

  // Handle removing a node
  const handleRemoveNode = (nodeId) => {
    saveToHistory();
    setNodes(nodes.filter((node) => node.id !== nodeId));

    // Remove all connections associated with this node
    setConnections(
      connections.filter(
        (conn) => conn.source !== nodeId && conn.target !== nodeId
      )
    );

    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  };

  // Handle adding a new connection
  const handleAddConnection = (sourceId, targetId, sourceOutput = 0) => {
    // Check if connection already exists
    const connectionExists = connections.some(
      (conn) =>
        conn.source === sourceId &&
        conn.target === targetId &&
        conn.sourceOutput === sourceOutput
    );

    if (!connectionExists) {
      saveToHistory();
      const newConnection = {
        id: `conn_${Date.now()}`,
        source: sourceId,
        target: targetId,
        sourceOutput,
        targetInput: 0,
      };

      setConnections([...connections, newConnection]);
      return true;
    }

    return false;
  };

  // Handle removing a connection
  const handleRemoveConnection = (connectionId) => {
    saveToHistory();
    setConnections(connections.filter((conn) => conn.id !== connectionId));
  };

  // Handle saving the bot
  const handleSaveBot = () => {
    setIsSaving(true);

    // Simulating API call with setTimeout
    setTimeout(() => {
      // Save logic here - in a real app, you would call your API
      const botData = {
        name: botName,
        nodes,
        connections,
        updatedAt: new Date().toISOString(),
      };

      console.log("Saving bot data:", botData);

      // Typically you would do something like:
      // await api.saveBotFlow(botData);

      setIsSaving(false);
      setLastSaved(new Date().toISOString());

      // Show success message
      alert("Bot flow saved successfully!");
    }, 1000);
  };

  // Handle export
  const handleExportBot = () => {
    const botData = {
      name: botName,
      nodes,
      connections,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(botData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${botName
      .replace(/\s+/g, "-")
      .toLowerCase()}-flow.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Handle import
  const handleImportBot = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const botData = JSON.parse(event.target.result);

        if (botData.nodes && botData.connections) {
          setNodes(botData.nodes);
          setConnections(botData.connections);
          if (botData.name) setBotName(botData.name);
          setSelectedNode(null);
          alert("Bot flow imported successfully!");
        } else {
          alert("Invalid bot flow file format");
        }
      } catch (error) {
        console.error("Error importing bot:", error);
        alert("Error importing bot flow: " + error.message);
      }
    };

    reader.readAsText(file);
  };

  // Create a new bot flow
  const handleNewBot = () => {
    if (nodes.length > 0) {
      if (
        window.confirm(
          "Are you sure you want to create a new bot? Your current changes will be lost."
        )
      ) {
        setNodes([]);
        setConnections([]);
        setBotName("New Bot");
        setSelectedNode(null);
        setLastSaved(null);
      }
    } else {
      setBotName("New Bot");
    }
  };

  return (
    <div className="bot-builder-container">
      <BotBuilderHeader
        botName={botName}
        setBotName={setBotName}
        isEditingBotName={isEditingBotName}
        setIsEditingBotName={setIsEditingBotName}
        lastSaved={lastSaved}
        isSaving={isSaving}
        zoomLevel={zoomLevel}
        handleZoom={handleZoom}
        handleResetView={handleResetView}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleSaveBot={handleSaveBot}
        handleNewBot={handleNewBot}
        handleExportBot={handleExportBot}
        handleImportBot={handleImportBot}
        undoStack={undoStack}
        redoStack={redoStack}
      />

      <div className="bot-builder-content">
        {showSidebar && (
          <BotBuilderSidebar
            setShowSidebar={setShowSidebar}
            nodeTypes={nodeTypes}
            onAddNode={handleAddNode}
          />
        )}

        <BotBuilderCanvas
          ref={canvasRef}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          nodes={nodes}
          setNodes={setNodes}
          connections={connections}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          zoomLevel={zoomLevel}
          canvasOffset={canvasOffset}
          onAddNode={handleAddNode}
          onAddConnection={handleAddConnection}
          onRemoveConnection={handleRemoveConnection}
          onRemoveNode={handleRemoveNode}
          saveToHistory={saveToHistory}
        />

        <BotBuilderProperties
          selectedNode={selectedNode}
          onUpdateNodeProperties={handleUpdateNodeProperties}
          onRemoveNode={handleRemoveNode}
        />
      </div>
    </div>
  );
};

export default BotBuilder;
