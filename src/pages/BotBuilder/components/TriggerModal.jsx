import React from "react";
import * as Icons from "lucide-react";
import TriggerSetup from "./TriggerSetup";

/**
 * Modal component for setting up bot triggers
 */
const TriggerModal = ({
  isOpen,
  onClose,
  triggerId,
  triggerConfig,
  onSaveTrigger,
  availablePlatforms = ["whatsapp", "facebook", "instagram"],
}) => {
  if (!isOpen) return null;

  // Helper to render icons
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={size} strokeWidth={2} /> : null;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container trigger-modal">
        <div className="modal-header">
          <h3>Bot Trigger Setup</h3>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            {renderIcon("X", 20)}
          </button>
        </div>
        <div className="modal-content">
          <TriggerSetup
            triggerId={triggerId}
            triggerConfig={triggerConfig}
            onSave={onSaveTrigger}
            onCancel={onClose}
            availablePlatforms={availablePlatforms}
          />
        </div>
      </div>
    </div>
  );
};

export default TriggerModal;
