// src/pages/Agents/AgentRegistration.jsx - Updated
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Key,
  Briefcase,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { agentAPI } from "../../utils/api";
import "./AgentRegistration.css";

const AgentRegistration = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email_id: "",
    password: "",
    role: "customer_support", // Default role
    leadCapacity: 20, // Default capacity
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset status
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.first_name.trim()) {
      setError("First name is required");
      return;
    }

    if (!formData.last_name.trim()) {
      setError("Last name is required");
      return;
    }

    if (!formData.email_id.trim() || !isValidEmail(formData.email_id)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.mobile.trim() || !isValidPhone(formData.mobile)) {
      setError("Please enter a valid mobile number");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Convert leadCapacity to number
    const agentData = {
      ...formData,
      leadCapacity: parseInt(formData.leadCapacity, 10),
    };

    try {
      setIsLoading(true);

      // Call API to register agent
      const response = await agentAPI.registerAgent(agentData);

      if (response.success) {
        setSuccess(response.message || "Agent registered successfully!");

        // Reset the form
        setFormData({
          first_name: "",
          last_name: "",
          mobile: "",
          email_id: "",
          password: "",
          role: "customer_support",
          leadCapacity: 20,
        });

        // Redirect to agents list after a short delay
        setTimeout(() => {
          navigate("/agents");
        }, 2000);
      } else {
        setError(response.message || "Failed to register agent");
      }
    } catch (error) {
      console.error("Error registering agent:", error);
      setError(
        error.message ||
          "An error occurred during agent registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate email
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Helper function to validate phone
  const isValidPhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  return (
    <div className="agent-registration-container">
      <div className="agent-registration-header">
        <h1>Register New Agent</h1>
        <p>Add a new agent to your WhatsApp CRM team</p>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      <form className="agent-registration-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email_id">Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email_id"
                name="email_id"
                placeholder="Enter email address"
                value={formData.email_id}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                type="text"
                id="mobile"
                name="mobile"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Key size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <div className="input-with-icon">
              <Briefcase size={18} className="input-icon" />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer_support">Customer Support</option>
                <option value="sales">Sales</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="leadCapacity">Lead Capacity</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="number"
                id="leadCapacity"
                name="leadCapacity"
                placeholder="Maximum number of leads"
                value={formData.leadCapacity}
                onChange={handleChange}
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/agents")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`register-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Registering...</span>
              </>
            ) : (
              "Register Agent"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentRegistration;
