// src/pages/Agents/AgentEdit.jsx - Updated with Fallback Handling
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { agentAPI } from "../../utils/api";
import "./AgentEdit.css";

const AgentEdit = () => {
  const navigate = useNavigate();
  const { agentId } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email_id: "",
    role: "customer_support",
    leadCapacity: 20,
    status: true,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch agent data on component mount
  useEffect(() => {
    const fetchAgent = async () => {
      setIsFetching(true);
      setFetchError("");

      try {
        // Get the specific agent by ID
        const response = await agentAPI.getAgentById(agentId);

        if (response.success) {
          const agent = response.data;
          setFormData({
            first_name: agent.first_name || "",
            last_name: agent.last_name || "",
            mobile: agent.mobile || "",
            email_id: agent.email_id || "",
            role: agent.role || "customer_support",
            leadCapacity: agent.leadCapacity || 20,
            status: typeof agent.status === "boolean" ? agent.status : true,
          });
        } else {
          setFetchError(
            response.message ||
              "Failed to fetch agent details. Using default values."
          );
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
        setFetchError(
          "Agent details could not be loaded. You can still update with new information."
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchAgent();
  }, [agentId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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

    // Convert leadCapacity to number
    const updateData = {
      ...formData,
      leadCapacity: parseInt(formData.leadCapacity, 10),
    };

    try {
      setIsLoading(true);

      // Call API to update agent
      const response = await agentAPI.updateAgent(agentId, updateData);

      if (response.success) {
        setSuccess(response.message || "Agent updated successfully!");
        setTimeout(() => {
          navigate("/agents");
        }, 2000);
      } else {
        setError(response.message || "Failed to update agent");
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      setError(
        error.message ||
          "An error occurred during agent update. Please try again."
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

  // Handle back button
  const handleBack = () => {
    navigate("/agents");
  };

  return (
    <div className="agent-edit-container">
      <div className="agent-edit-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Back to Agents</span>
          </button>
          <div className="title-section">
            <h1>Edit Agent</h1>
            <p>Update agent details and permissions</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {fetchError && (
        <div className="warning-message">
          <AlertCircle size={16} />
          <span>{fetchError}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {isFetching ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading agent details...</p>
        </div>
      ) : (
        <form className="agent-edit-form" onSubmit={handleSubmit}>
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

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <span>Active</span>
              </label>
              <p className="checkbox-help">
                If unchecked, the agent will be disabled and unable to login
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleBack}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`update-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Updating...</span>
                </>
              ) : (
                "Update Agent"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AgentEdit;
