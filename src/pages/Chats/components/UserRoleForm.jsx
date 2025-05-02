// src/pages/TeamMembers/components/UserRoleForm.jsx
import React, { useState } from "react";

const UserRoleForm = ({ onSave, initialData = {} }) => {
  const [roleName, setRoleName] = useState(initialData.name || "");
  const [permissions, setPermissions] = useState({
    waba: initialData.permissions?.waba || false,
    whatsappApi: initialData.permissions?.whatsappApi || false,
    crm: initialData.permissions?.crm || false,
    liveChat: initialData.permissions?.liveChat || false,
    showIdentifiers: initialData.permissions?.showIdentifiers || false,
    sendOperatorName: initialData.permissions?.sendOperatorName || false,
    allContacts: initialData.permissions?.allContacts || false,
    unassignedChats: initialData.permissions?.unassignedChats || false,
    newChats: initialData.permissions?.newChats || false,
    allChats: initialData.permissions?.allChats || false,
    automationsBuilder: initialData.permissions?.automationsBuilder || false,
    botBuilder: initialData.permissions?.botBuilder || false,
    ecommerce: initialData.permissions?.ecommerce || false,
  });

  const handlePermissionChange = (field) => {
    setPermissions({
      ...permissions,
      [field]: !permissions[field],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: roleName,
      permissions,
    });
  };

  return (
    <form className="user-role-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Role Name</label>
        <input
          type="text"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="e.g., Manager"
          required
        />
      </div>

      <div className="permissions-section">
        <h3>Permissions</h3>

        <div className="permission-group">
          <h4>Access</h4>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.waba}
              onChange={() => handlePermissionChange("waba")}
            />
            WABA
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.whatsappApi}
              onChange={() => handlePermissionChange("whatsappApi")}
            />
            WhatsApp API
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.crm}
              onChange={() => handlePermissionChange("crm")}
            />
            CRM
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.liveChat}
              onChange={() => handlePermissionChange("liveChat")}
            />
            Live Chat
          </label>
        </div>

        <div className="permission-group">
          <h4>Chat Options</h4>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.showIdentifiers}
              onChange={() => handlePermissionChange("showIdentifiers")}
            />
            Show customer identifiers
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.sendOperatorName}
              onChange={() => handlePermissionChange("sendOperatorName")}
            />
            Send chat operator name with messages
          </label>
        </div>

        <div className="permission-group">
          <h4>Chat Access</h4>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.allContacts}
              onChange={() => handlePermissionChange("allContacts")}
            />
            All contacts
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.unassignedChats}
              onChange={() => handlePermissionChange("unassignedChats")}
            />
            Unassigned chats
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.newChats}
              onChange={() => handlePermissionChange("newChats")}
            />
            New chats
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.allChats}
              onChange={() => handlePermissionChange("allChats")}
            />
            All chats (assigned and unassigned)
          </label>
        </div>

        <div className="permission-group">
          <h4>Additional Access</h4>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.automationsBuilder}
              onChange={() => handlePermissionChange("automationsBuilder")}
            />
            Automations Builder
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.botBuilder}
              onChange={() => handlePermissionChange("botBuilder")}
            />
            Bot Builder
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={permissions.ecommerce}
              onChange={() => handlePermissionChange("ecommerce")}
            />
            E-commerce
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-button">
          Save
        </button>
      </div>
    </form>
  );
};

export default UserRoleForm;
