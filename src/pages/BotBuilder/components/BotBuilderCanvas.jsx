// src/pages/BotBuilder/components/BotBuilderCanvas.jsx
import React, { useState, useRef, useEffect, forwardRef } from "react";
import * as Icons from "lucide-react";
import { getNodeTypeById } from "../constants/nodeTypes";

// Import generic node component
import GenericNode from "./nodes/GenericNode";

// Import canvas-related hooks
import useNodeDrag from "../hooks/useNodeDrag";
import useConnectionCreation from "../hooks/useConnectionCreation";

const BotBuilderCanvas = forwardRef(
  (
    {
      showSidebar,
      setShowSidebar,
      nodes,
      setNodes,
      connections,
      selectedNode,
      setSelectedNode,
      zoomLevel,
      canvasOffset,
      onAddNode,
      onAddConnection,
      onRemoveConnection,
      onRemoveNode,
      saveToHistory,
    },
    ref
  ) => {
    // State for connections being created
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Initialize custom hooks
    const {
      isDragging,
      dragNodeRef,
      handleNodeMouseDown,
      handleMouseMove: handleDragMouseMove,
      handleMouseUp: handleDragMouseUp,
    } = useNodeDrag({ nodes, setNodes, saveToHistory });

    const {
      isConnecting,
      startConnectionNode,
      handleStartConnection,
      handleCompleteConnection,
      handleMouseMove: handleConnectionMouseMove,
      handleMouseUp: handleConnectionMouseUp,
      calculateConnectionPath,
      calculateTempConnectionPath,
    } = useConnectionCreation({
      nodes,
      connections,
      mousePosition,
      onAddConnection,
    });

    // Render icon helper
    const renderIcon = (iconName, size = 20, strokeWidth = 2) => {
      const IconComponent = Icons[iconName];
      return IconComponent ? (
        <IconComponent size={size} strokeWidth={strokeWidth} />
      ) : null;
    };

    // Handle mouse move on canvas
    const handleMouseMove = (e) => {
      // Update mouse position for connection drawing
      if (ref.current) {
        const canvasRect = ref.current.getBoundingClientRect();
        const newMousePosition = {
          x: (e.clientX - canvasRect.left) / zoomLevel - canvasOffset.x,
          y: (e.clientY - canvasRect.top) / zoomLevel - canvasOffset.y,
        };
        setMousePosition(newMousePosition);

        // Handle node dragging
        handleDragMouseMove(e, newMousePosition);

        // Handle connection creation
        handleConnectionMouseMove(newMousePosition);
      }
    };

    // Handle mouse up on canvas
    const handleMouseUp = () => {
      handleDragMouseUp();
      handleConnectionMouseUp();
    };

    // Handle canvas click (clear selection)
    const handleCanvasClick = (e) => {
      // Only clear selection if clicking directly on the canvas, not on a node
      if (
        e.target === ref.current ||
        e.target.classList.contains("canvas-nodes")
      ) {
        setSelectedNode(null);
      }
    };

    return (
      <div
        className="builder-canvas"
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {!showSidebar && (
          <button
            className="show-sidebar-button"
            onClick={() => setShowSidebar(true)}
          >
            {renderIcon("Sidebar", 18)}
          </button>
        )}

        <div
          className="canvas-nodes"
          style={{
            transform: `scale(${zoomLevel}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
          }}
        >
          {/* Render connections */}
          <svg className="connections-layer">
            {/* Existing connections */}
            {connections.map((connection) => {
              const sourceNode = nodes.find(
                (node) => node.id === connection.source
              );
              const targetNode = nodes.find(
                (node) => node.id === connection.target
              );

              if (!sourceNode || !targetNode) return null;

              const sourceNodeType = getNodeTypeById(sourceNode.type);

              return (
                <g key={connection.id} className="connection-group">
                  <path
                    className="connection-path"
                    d={calculateConnectionPath(
                      sourceNode,
                      targetNode,
                      connection.sourceOutput
                    )}
                    stroke={sourceNodeType.color}
                  />
                  <path
                    className="connection-path-hitbox"
                    d={calculateConnectionPath(
                      sourceNode,
                      targetNode,
                      connection.sourceOutput
                    )}
                    stroke="transparent"
                    strokeWidth="10"
                    onClick={() => onRemoveConnection(connection.id)}
                  />
                </g>
              );
            })}

            {/* Temporary connection while dragging */}
            {isConnecting && startConnectionNode && (
              <path
                className="connection-path temp"
                d={calculateTempConnectionPath()}
                stroke={getNodeTypeById(startConnectionNode.node.type).color}
                strokeDasharray="5,5"
              />
            )}
          </svg>

          {/* Render nodes */}
          {nodes.map((node) => (
            <GenericNode
              key={node.id}
              node={node}
              isSelected={selectedNode?.id === node.id}
              onSelect={() => setSelectedNode(node)}
              onRemove={onRemoveNode}
              onStartConnection={handleStartConnection}
              onCompleteConnection={handleCompleteConnection}
            />
          ))}

          {/* Empty canvas message */}
          {nodes.length === 0 && (
            <div className="canvas-placeholder">
              {renderIcon("Grid", 48, 1)}
              <p>Drag elements from the sidebar to create your bot flow</p>
              <button
                className="action-button"
                onClick={() => onAddNode("start")}
              >
                {renderIcon("Plus", 16)}
                <span>Add Starting Node</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

BotBuilderCanvas.displayName = "BotBuilderCanvas";

export default BotBuilderCanvas;
