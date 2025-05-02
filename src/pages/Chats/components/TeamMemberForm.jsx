// src/pages/TeamMembers/components/TeamMemberForm.jsx
import React, { useState, useEffect } from "react";

const TeamMemberForm = ({ onSave, roles = [], initialData = {} }) => {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(initialData.roleId || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      email,
      password,
      roleId: selectedRole,
    });
  };

  return (
    <form className="team-member-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
        />
      </div>

      <div className="form-group">
        <label>Email ID</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={
            initialData.id ? "Leave blank to keep current" : "Enter password"
          }
          required={!initialData.id}
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          required
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-button">
          Save
        </button>
      </div>
    </form>
  );
};

export default TeamMemberForm;
