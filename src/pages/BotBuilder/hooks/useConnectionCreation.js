// src/pages/BotBuilder/hooks/useConnectionCreation.js
import { useState } from "react";
import { getNodeTypeById } from "../constants/nodeTypes";

/**
 * Custom hook for creating connections between nodes
 * @param {Object} options - Configuration options
 * @param {Array} options.nodes - Current nodes array
 * @param {Array} options.connections - Current connections array
 * @param {Object} options.mousePosition - Current mouse position
 * @param {Function} options.onAddConnection - Function to add a new connection
 * @returns {Object} - Connection creation methods and state
 */
const useConnectionCreation = ({
  nodes,
  connections,
  mousePosition,
  onAddConnection,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [startConnectionNode, setStartConnectionNode] = useState(null);

  /**
   * Start creating a connection from a node output
   * @param {Event} e - Event object
   * @param {Object} sourceNode - Source node
   * @param {number} outputIndex - Output index
   */
  const handleStartConnection = (e, sourceNode, outputIndex = 0) => {
    e.stopPropagation();
    setIsConnecting(true);
    setStartConnectionNode({ node: sourceNode, outputIndex });
  };

  /**
   * Complete a connection to a node input
   * @param {Event} e - Event object
   * @param {Object} targetNode - Target node
   */
  const handleCompleteConnection = (e, targetNode) => {
    e.stopPropagation();

    if (!isConnecting || !startConnectionNode) return;

    // Skip self-connections
    if (targetNode.id === startConnectionNode.node.id) {
      setIsConnecting(false);
      setStartConnectionNode(null);
      return;
    }

    // Add the connection
    if (
      onAddConnection(
        startConnectionNode.node.id,
        targetNode.id,
        startConnectionNode.outputIndex
      )
    ) {
      // Connection was added successfully
    }

    // Reset connection state
    setIsConnecting(false);
    setStartConnectionNode(null);
  };

  /**
   * Handle mouse move while creating a connection
   * @param {Object} newMousePosition - New mouse position
   */
  const handleMouseMove = (newMousePosition) => {
    // Nothing to do here, we just use the mouse position directly
  };

  /**
   * Handle mouse up while creating a connection
   */
  const handleMouseUp = () => {
    if (isConnecting) {
      setIsConnecting(false);
      setStartConnectionNode(null);
    }
  };

  /**
   * Calculate the path for a connection between nodes
   * @param {Object} sourceNode - Source node
   * @param {Object} targetNode - Target node
   * @param {number} sourceOutput - Source output index
   * @returns {string} SVG path definition
   */
  const calculateConnectionPath = (
    sourceNode,
    targetNode,
    sourceOutput = 0
  ) => {
    if (!sourceNode || !targetNode) return "";

    const sourceNodeType = getNodeTypeById(sourceNode.type);
    const nodeWidth = 240;
    const nodeHeight = 120; // Approximate height

    // Calculate source and target positions
    const sourceOutputCount = sourceNodeType.outputs || 1;
    const outputSpacing = nodeWidth / (sourceOutputCount + 1);

    const sourceX = sourceNode.position.x + outputSpacing * (sourceOutput + 1);
    const sourceY = sourceNode.position.y + nodeHeight;

    const targetX = targetNode.position.x + nodeWidth / 2;
    const targetY = targetNode.position.y;

    // Create a curved path
    const midY = sourceY + (targetY - sourceY) / 2;

    return `M${sourceX},${sourceY} C${sourceX},${midY} ${targetX},${midY} ${targetX},${targetY}`;
  };

  /**
   * Calculate temporary connection path while dragging
   * @returns {string} SVG path definition
   */
  const calculateTempConnectionPath = () => {
    if (!isConnecting || !startConnectionNode) return "";

    const sourceNode = startConnectionNode.node;
    const sourceOutput = startConnectionNode.outputIndex;
    const sourceNodeType = getNodeTypeById(sourceNode.type);
    const nodeWidth = 240;
    const nodeHeight = 120; // Approximate height

    // Calculate source position
    const sourceOutputCount = sourceNodeType.outputs || 1;
    const outputSpacing = nodeWidth / (sourceOutputCount + 1);

    const sourceX = sourceNode.position.x + outputSpacing * (sourceOutput + 1);
    const sourceY = sourceNode.position.y + nodeHeight;

    // Use mouse position for target
    const targetX = mousePosition.x;
    const targetY = mousePosition.y;

    // Create a curved path
    const midY = sourceY + (targetY - sourceY) / 2;

    return `M${sourceX},${sourceY} C${sourceX},${midY} ${targetX},${midY} ${targetX},${targetY}`;
  };

  return {
    isConnecting,
    startConnectionNode,
    handleStartConnection,
    handleCompleteConnection,
    handleMouseMove,
    handleMouseUp,
    calculateConnectionPath,
    calculateTempConnectionPath,
  };
};

export default useConnectionCreation;
