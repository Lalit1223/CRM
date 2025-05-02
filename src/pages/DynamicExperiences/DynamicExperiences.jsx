// src/pages/DynamicExperiences/DynamicExperiences.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DynamicExperiences.css";

const DynamicExperiences = () => {
  const [activeTab, setActiveTab] = useState("experiences");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeComponent, setActiveComponent] = useState("image");

  // Mock data for experiences
  const experiences = [
    {
      id: 1,
      name: "Event Ticket",
      type: "ticket",
      createdAt: "2025-04-15",
      variables: ["name", "event_name", "date", "seat", "qr_code"],
      thumbnail: "/placeholder/ticket.jpg",
      usageCount: 342,
    },
    {
      id: 2,
      name: "Product Promo",
      type: "image",
      createdAt: "2025-04-12",
      variables: ["customer_name", "product", "discount"],
      thumbnail: "/placeholder/promo.jpg",
      usageCount: 156,
    },
    {
      id: 3,
      name: "Welcome Card",
      type: "image",
      createdAt: "2025-04-10",
      variables: ["name", "company"],
      thumbnail: "/placeholder/welcome.jpg",
      usageCount: 427,
    },
    {
      id: 4,
      name: "Appointment Reminder",
      type: "image",
      createdAt: "2025-04-08",
      variables: ["name", "date", "time", "doctor_name"],
      thumbnail: "/placeholder/appointment.jpg",
      usageCount: 89,
    },
  ];

  // Mock data for integration methods
  const integrationMethods = [
    {
      id: "campaign",
      title: "Campaign Integration",
      description: "Send dynamic images in bulk via campaigns",
      steps: [
        "Create a new campaign in the CRM",
        "Select channel, template, and audience",
        "Choose the dynamic option from image header",
        "Select your dynamic image experience",
        "Map variables to fields in your contacts",
        "Schedule or send immediately",
      ],
      icon: "campaign",
    },
    {
      id: "bot",
      title: "Bot Flow Integration",
      description: "Send dynamic images through bot interactions",
      steps: [
        "Edit your bot flow",
        'Add "send message" block and select "image message"',
        'Choose the "dynamic" option',
        "Select your dynamic image experience",
        "Map variables to bot context or user inputs",
        "Save and enable your flow",
      ],
      icon: "bot",
    },
    {
      id: "webhook",
      title: "Webhook Integration",
      description: "Generate and send images triggered by webhooks",
      steps: [
        "Create a custom webhook trigger in Automation Builder",
        "Add Dynamic Image Generator block",
        "Select your dynamic image experience",
        "Map webhook payload to image variables",
        "Add WhatsApp send block",
        "Save and enable your automation",
      ],
      icon: "webhook",
    },
    {
      id: "ticket",
      title: "Dynamic Tickets",
      description: "Create and send personalized tickets to users",
      steps: [
        "Create a ticket template in Dynamic Experiences",
        "Include QR codes, text blocks, and personalization",
        "Configure Tickets app integration",
        "Set up authentication and event mappings",
        "Add to your bot flow or campaign",
        "Map user data to ticket variables",
      ],
      icon: "ticket",
    },
  ];

  // Components that can be added to a dynamic image
  const componentsOptions = [
    { id: "image", name: "Image", icon: "image" },
    { id: "text", name: "Text Block", icon: "text" },
    { id: "qr", name: "QR Code", icon: "qr" },
    { id: "barcode", name: "Barcode", icon: "barcode" },
    { id: "logo", name: "Logo", icon: "logo" },
    { id: "shape", name: "Shape", icon: "shape" },
  ];

  // Handle creating a new experience
  const handleCreateExperience = () => {
    setIsCreating(true);
    setSelectedExperience(null);
  };

  // Handle edit experience
  const handleEditExperience = (experience) => {
    setSelectedExperience(experience);
    setIsCreating(true);
  };

  // Handle back to list
  const handleBackToList = () => {
    setIsCreating(false);
    setSelectedExperience(null);
  };

  // Get icon for different component options
  const getComponentIcon = (iconName) => {
    switch (iconName) {
      case "image":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <path
              d="M21 15L16 10L5 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "text":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 7H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 12H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 17H12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "qr":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 14H21V21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 14V21H14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "barcode":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5V19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 5V19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M11 5V19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 5V19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M19 5V19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M21 5V19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "logo":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 20C5 17 8 15 12 15C16 15 19 17 21 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "shape":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "campaign":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 8C17.5 8 19 6.5 19 4.5C19 7.5 20.5 9 22.5 9C20.5 9 19 10.5 19 12.5C19 10.5 17.5 8 16 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12 14L8 18H16L12 14Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 2V14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M5 22H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "bot":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="7"
              width="18"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 12H8.01M12 12H12.01M16 12H16.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 3L12 7L8 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "webhook":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12L5 14C5 17.3137 7.68629 20 11 20L13 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M19 12L19 10C19 6.68629 16.3137 4 13 4L11 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M20 16L15 20L15 12L20 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M4 8L9 4L9 12L4 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "ticket":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V9C20.4696 9 19.9609 9.21071 19.5858 9.58579C19.2107 9.96086 19 10.4696 19 11C19 11.5304 19.2107 12.0391 19.5858 12.4142C19.9609 12.7893 20.4696 13 21 13V15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H5C4.46957 17 3.96086 16.7893 3.58579 16.4142C3.21071 16.0391 3 15.5304 3 15V13C3.53043 13 4.03914 12.7893 4.41421 12.4142C4.78929 12.0391 5 11.5304 5 11C5 10.4696 4.78929 9.96086 4.41421 9.58579C4.03914 9.21071 3.53043 9 3 9V7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 9H12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M8 13H16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dynamic-experiences-page">
      <div className="dynamic-experiences-header">
        <div>
          <h1>Dynamic Experiences</h1>
          <p>Create personalized dynamic images and tickets for WhatsApp</p>
        </div>
        {!isCreating && (
          <button className="primary-button" onClick={handleCreateExperience}>
            + Create New Experience
          </button>
        )}
      </div>

      {!isCreating && (
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={activeTab === "experiences" ? "active" : ""}
              onClick={() => setActiveTab("experiences")}
            >
              My Experiences
            </button>
            <button
              className={activeTab === "integration" ? "active" : ""}
              onClick={() => setActiveTab("integration")}
            >
              Integration Methods
            </button>
          </div>
        </div>
      )}

      {isCreating ? (
        <div className="experience-editor">
          <div className="editor-header">
            <button className="back-button" onClick={handleBackToList}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
            <h2>
              {selectedExperience
                ? `Edit: ${selectedExperience.name}`
                : "Create New Experience"}
            </h2>
            <button className="primary-button">Save Experience</button>
          </div>

          <div className="editor-container">
            <div className="editor-sidebar">
              <div className="sidebar-section">
                <h3>Experience Details</h3>
                <div className="form-group">
                  <label>Experience Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    defaultValue={selectedExperience?.name || ""}
                  />
                </div>
                <div className="form-group">
                  <label>Experience Type</label>
                  <select defaultValue={selectedExperience?.type || "image"}>
                    <option value="image">Dynamic Image</option>
                    <option value="ticket">Ticket</option>
                  </select>
                </div>
              </div>

              <div className="sidebar-section">
                <h3>Add Components</h3>
                <div className="components-list">
                  {componentsOptions.map((component) => (
                    <div
                      key={component.id}
                      className={`component-item ${
                        activeComponent === component.id ? "active" : ""
                      }`}
                      onClick={() => setActiveComponent(component.id)}
                    >
                      <div className="component-icon">
                        {getComponentIcon(component.icon)}
                      </div>
                      <span>{component.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h3>Variables</h3>
                <div className="variables-list">
                  {selectedExperience?.variables ? (
                    selectedExperience.variables.map((variable, index) => (
                      <div key={index} className="variable-tag">
                        {`{{${variable}}}`}
                        <button className="remove-variable">×</button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-variables">
                      <p>No variables added yet</p>
                      <button className="secondary-button">
                        + Add Variable
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="editor-canvas">
              <div className="canvas-container">
                <div className="canvas-placeholder">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8.5" cy="14.5" r="1.5" fill="currentColor" />
                    <path
                      d="M21 15L16 10L7 19H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p>
                    Drag components from the left panel to create your
                    experience
                  </p>
                  <p className="hint-text">
                    Or upload a background image to get started
                  </p>
                  <button className="secondary-button">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17 8L12 3L7 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 3V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Upload Background
                  </button>
                </div>
              </div>
            </div>

            <div className="editor-properties">
              <h3>Component Properties</h3>
              {activeComponent === "image" && (
                <div className="properties-panel">
                  <div className="form-group">
                    <label>Image Source</label>
                    <button className="secondary-button">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 8L12 3L7 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 3V15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Upload Image
                    </button>
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <div className="input-row">
                      <div className="input-group">
                        <label>X</label>
                        <input type="number" defaultValue="0" />
                      </div>
                      <div className="input-group">
                        <label>Y</label>
                        <input type="number" defaultValue="0" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Size</label>
                    <div className="input-row">
                      <div className="input-group">
                        <label>W</label>
                        <input type="number" defaultValue="200" />
                      </div>
                      <div className="input-group">
                        <label>H</label>
                        <input type="number" defaultValue="200" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Opacity</label>
                    <input type="range" min="0" max="100" defaultValue="100" />
                  </div>
                </div>
              )}

              {activeComponent === "text" && (
                <div className="properties-panel">
                  <div className="form-group">
                    <label>Text Content</label>
                    <input
                      type="text"
                      placeholder="Enter text or use variables"
                    />
                  </div>
                  <div className="form-group">
                    <label>Font</label>
                    <select>
                      <option value="Arial">Arial</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Size</label>
                    <input type="number" defaultValue="16" />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input type="color" defaultValue="#000000" />
                  </div>
                  <div className="form-group">
                    <label>Style</label>
                    <div className="button-group">
                      <button className="icon-button active">B</button>
                      <button className="icon-button">I</button>
                      <button className="icon-button">U</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Alignment</label>
                    <div className="button-group">
                      <button className="icon-button active">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M4 12H10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M4 18H16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <button className="icon-button">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M8 12H16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M4 18H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <button className="icon-button">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M14 12H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M4 18H20"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeComponent === "qr" && (
                <div className="properties-panel">
                  <div className="form-group">
                    <label>QR Code Value</label>
                    <select>
                      <option value="">Select a variable</option>
                      <option value="ticket_id">Ticket ID</option>
                      <option value="event_url">Event URL</option>
                      <option value="custom">Custom Value</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Custom Value</label>
                    <input
                      type="text"
                      placeholder="Enter value or use variables"
                    />
                  </div>
                  <div className="form-group">
                    <label>Size</label>
                    <input type="number" defaultValue="150" />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input type="color" defaultValue="#000000" />
                  </div>
                  <div className="form-group">
                    <label>Background</label>
                    <input type="color" defaultValue="#FFFFFF" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === "experiences" ? (
        <div className="experiences-grid">
          {experiences.map((experience) => (
            <div className="experience-card" key={experience.id}>
              <div className="experience-thumbnail">
                <img src="/api/placeholder/250/150" alt={experience.name} />
                <div className="experience-type">{experience.type}</div>
              </div>
              <div className="experience-details">
                <h3>{experience.name}</h3>
                <div className="experience-meta">
                  <span>Created: {experience.createdAt}</span>
                  <span>• {experience.usageCount} uses</span>
                </div>
                <div className="experience-variables">
                  {experience.variables.map((variable, index) => (
                    <span
                      key={index}
                      className="variable-chip"
                    >{`{{${variable}}}`}</span>
                  ))}
                </div>
                <div className="experience-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEditExperience(experience)}
                  >
                    Edit
                  </button>
                  <button className="icon-button">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 10V16M10 14H14M18 6H20M6 6H4M6 6H18M6 6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4H16C16.5304 4 17.0391 4.21071 17.4142 4.58579C17.7893 4.96086 18 5.46957 18 6M18 6V18C18 18.5304 17.7893 19.0391 17.4142 19.4142C17.0391 19.7893 16.5304 20 16 20H8C7.46957 20 6.96086 19.7893 6.58579 19.4142C6.21071 19.0391 6 18.5304 6 18V6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="add-experience-card" onClick={handleCreateExperience}>
            <div className="add-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p>Create New Experience</p>
          </div>
        </div>
      ) : (
        <div className="integration-methods">
          {integrationMethods.map((method) => (
            <div className="integration-card" key={method.id}>
              <div className="integration-header">
                <div className="integration-icon">
                  {getComponentIcon(method.icon)}
                </div>
                <h3>{method.title}</h3>
              </div>
              <p className="integration-description">{method.description}</p>
              <div className="integration-steps">
                <h4>Integration Steps:</h4>
                <ol>
                  {method.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="integration-actions">
                <Link
                  to={`/dynamic-experiences/${method.id}`}
                  className="primary-button"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicExperiences;
