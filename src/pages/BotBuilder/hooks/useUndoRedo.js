// src/pages/BotBuilder/hooks/useUndoRedo.js
import { useState } from "react";

/**
 * Custom hook for managing undo/redo functionality
 * @param {Object} options - Configuration options
 * @param {Array} options.nodes - Current nodes array
 * @param {Array} options.connections - Current connections array
 * @param {Function} options.setNodes - Function to update nodes
 * @param {Function} options.setConnections - Function to update connections
 * @returns {Object} - Undo/redo methods and state
 */
const useUndoRedo = ({ nodes, connections, setNodes, setConnections }) => {
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  /**
   * Save current state to undo stack
   */
  const saveToHistory = () => {
    setUndoStack((prev) => [
      ...prev,
      {
        nodes: JSON.parse(JSON.stringify(nodes)),
        connections: JSON.parse(JSON.stringify(connections)),
      },
    ]);

    // Clear redo stack when a new action is performed
    setRedoStack([]);
  };

  /**
   * Undo last action
   */
  const handleUndo = () => {
    if (undoStack.length === 0) return;

    // Get the last state from undo stack
    const lastState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    // Save current state to redo stack
    setRedoStack((prev) => [
      ...prev,
      {
        nodes: JSON.parse(JSON.stringify(nodes)),
        connections: JSON.parse(JSON.stringify(connections)),
      },
    ]);

    // Restore previous state
    setNodes(lastState.nodes);
    setConnections(lastState.connections);
    setUndoStack(newUndoStack);
  };

  /**
   * Redo last undone action
   */
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    // Get the next state from redo stack
    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    // Save current state to undo stack
    setUndoStack((prev) => [
      ...prev,
      {
        nodes: JSON.parse(JSON.stringify(nodes)),
        connections: JSON.parse(JSON.stringify(connections)),
      },
    ]);

    // Restore next state
    setNodes(nextState.nodes);
    setConnections(nextState.connections);
    setRedoStack(newRedoStack);
  };

  return {
    undoStack,
    redoStack,
    saveToHistory,
    handleUndo,
    handleRedo,
  };
};

export default useUndoRedo;
