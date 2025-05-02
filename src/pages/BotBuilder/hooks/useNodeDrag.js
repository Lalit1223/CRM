// src/pages/BotBuilder/hooks/useNodeDrag.js
import { useState, useRef } from "react";

/**
 * Custom hook for dragging nodes on the canvas
 * @param {Object} options - Configuration options
 * @param {Array} options.nodes - Current nodes array
 * @param {Function} options.setNodes - Function to update nodes
 * @param {Function} options.saveToHistory - Function to save state to history
 * @returns {Object} - Node dragging methods and state
 */
const useNodeDrag = ({ nodes, setNodes, saveToHistory }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragNodeRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  /**
   * Handle mouse down on a node to start dragging
   * @param {Event} e - Mouse event
   * @param {Object} node - The node to drag
   */
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();

    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true);
      dragNodeRef.current = node;

      // Calculate the offset from the node's top-left corner
      const rect = e.currentTarget.getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  /**
   * Handle mouse move while dragging
   * @param {Event} e - Mouse event
   * @param {Object} mousePosition - Current mouse position
   */
  const handleMouseMove = (e, mousePosition) => {
    if (isDragging && dragNodeRef.current) {
      const updatedNodes = nodes.map((node) => {
        if (node.id === dragNodeRef.current.id) {
          return {
            ...node,
            position: {
              x: mousePosition.x - dragOffsetRef.current.x,
              y: mousePosition.y - dragOffsetRef.current.y,
            },
          };
        }
        return node;
      });

      setNodes(updatedNodes);
    }
  };

  /**
   * Handle mouse up to end dragging
   */
  const handleMouseUp = () => {
    if (isDragging) {
      saveToHistory();
      setIsDragging(false);
      dragNodeRef.current = null;
    }
  };

  return {
    isDragging,
    dragNodeRef,
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

export default useNodeDrag;
