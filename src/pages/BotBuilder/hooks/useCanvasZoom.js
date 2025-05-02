// src/pages/BotBuilder/hooks/useCanvasZoom.js
import { useState, useEffect } from "react";

/**
 * Custom hook for zooming and panning the canvas
 * @returns {Object} - Zoom and pan methods and state
 */
const useCanvasZoom = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPos, setStartPanPos] = useState({ x: 0, y: 0 });

  // Set up wheel event listener for zooming
  useEffect(() => {
    const handleWheel = (e) => {
      // Only zoom if Ctrl key is pressed to avoid interfering with page scrolling
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoomLevel((prevZoom) => {
          const newZoom = Math.max(0.5, Math.min(2, prevZoom + delta));
          return newZoom;
        });
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  /**
   * Manually change zoom level
   * @param {boolean} zoomIn - Whether to zoom in or out
   */
  const handleZoom = (zoomIn) => {
    setZoomLevel((prevZoom) => {
      const newZoom = zoomIn
        ? Math.min(prevZoom + 0.1, 2)
        : Math.max(prevZoom - 0.1, 0.5);
      return newZoom;
    });
  };

  /**
   * Start canvas panning
   * @param {Object} position - Start position for panning
   */
  const startPanning = (position) => {
    setIsPanning(true);
    setStartPanPos(position);
  };

  /**
   * Update canvas position during panning
   * @param {Object} currentPos - Current mouse position
   */
  const updatePanning = (currentPos) => {
    if (isPanning) {
      const dx = (currentPos.x - startPanPos.x) / zoomLevel;
      const dy = (currentPos.y - startPanPos.y) / zoomLevel;

      setCanvasOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      setStartPanPos(currentPos);
    }
  };

  /**
   * End canvas panning
   */
  const endPanning = () => {
    setIsPanning(false);
  };

  /**
   * Reset canvas view to default
   */
  const handleResetView = () => {
    setZoomLevel(1);
    setCanvasOffset({ x: 0, y: 0 });
  };

  /**
   * Handle canvas pan by specified amount
   * @param {number} dx - Delta x
   * @param {number} dy - Delta y
   */
  const handleCanvasPan = (dx, dy) => {
    setCanvasOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
  };

  return {
    zoomLevel,
    canvasOffset,
    isPanning,
    handleZoom,
    startPanning,
    updatePanning,
    endPanning,
    handleResetView,
    handleCanvasPan,
  };
};

export default useCanvasZoom;
