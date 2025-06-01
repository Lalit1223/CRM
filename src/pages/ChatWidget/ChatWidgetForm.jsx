// src/pages/ChatWidget/ChatWidgetForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Save,
  Eye,
  Trash2,
  Plus,
  Minus,
  Move,
  X,
} from "lucide-react";
import "./ChatWidgetForm.css";

const ChatWidgetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [activeTab, setActiveTab] = useState("basic");
  const [previewMode, setPreviewMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Support",
    domain: "",
    destination: "WhatsApp Number",
    destinationValue: "",
    chatButton: {
      position: "right",
      color: "#25D366",
      size: "medium",
      marginBottom: 20,
      marginRight: 20,
      marginLeft: 20,
    },
    chatScreen: {
      title: "Chat with us",
      subtitle: "We typically reply within a few minutes",
      brandColor: "#25D366",
      textColor: "#ffffff",
      profileImage: "",
      defaultText: "Hello, I'd like to chat with you about...",
    },
    preChatForm: {
      enabled: true,
      questions: [
        {
          id: 1,
          type: "text",
          label: "What's your name?",
          required: true,
          customFieldId: "name",
        },
        {
          id: 2,
          type: "email",
          label: "What's your email address?",
          required: true,
          customFieldId: "email",
        },
      ],
    },
    preChatSession: {
      openByDefault: false,
      frequency: "once_per_visit",
      sessionDuration: 30, // minutes
    },
  });

  useEffect(() => {
    if (isEditMode) {
      fetchWidgetData();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const fetchWidgetData = async () => {
    try {
      // In a real application, you would fetch data from an API
      // This is just simulated data for demonstration purposes
      const mockWidgetData = {
        id: 1,
        name: "Store Support Widget",
        category: "Support",
        domain: "mystore.com",
        destination: "WhatsApp Number",
        destinationValue: "+1234567890",
        chatButton: {
          position: "right",
          color: "#25D366",
          size: "medium",
          marginBottom: 20,
          marginRight: 20,
          marginLeft: 20,
        },
        chatScreen: {
          title: "Chat with our Store Support",
          subtitle: "We typically reply within a few minutes",
          brandColor: "#25D366",
          textColor: "#ffffff",
          profileImage: "",
          defaultText: "Hello, I need help with my order...",
        },
        preChatForm: {
          enabled: true,
          questions: [
            {
              id: 1,
              type: "text",
              label: "What's your name?",
              required: true,
              customFieldId: "name",
            },
            {
              id: 2,
              type: "email",
              label: "What's your email address?",
              required: true,
              customFieldId: "email",
            },
            {
              id: 3,
              type: "text",
              label: "Order number",
              required: false,
              customFieldId: "order_number",
            },
          ],
        },
        preChatSession: {
          openByDefault: true,
          frequency: "once_per_day",
          sessionDuration: 60, // minutes
        },
      };

      setTimeout(() => {
        setFormData(mockWidgetData);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching widget data:", error);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    // Handle nested properties
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: "text",
      label: "New question",
      required: false,
      customFieldId: `field_${Date.now()}`,
    };

    setFormData({
      ...formData,
      preChatForm: {
        ...formData.preChatForm,
        questions: [...formData.preChatForm.questions, newQuestion],
      },
    });
  };

  const handleRemoveQuestion = (questionId) => {
    setFormData({
      ...formData,
      preChatForm: {
        ...formData.preChatForm,
        questions: formData.preChatForm.questions.filter(
          (q) => q.id !== questionId
        ),
      },
    });
  };

  const handleQuestionChange = (questionId, field, value) => {
    setFormData({
      ...formData,
      preChatForm: {
        ...formData.preChatForm,
        questions: formData.preChatForm.questions.map((q) =>
          q.id === questionId ? { ...q, [field]: value } : q
        ),
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In a real application, you would send the data to an API
    //console.log("Form submitted:", formData);

    // Simulating a successful save
    setTimeout(() => {
      navigate("/chat-widget");
    }, 500);
  };

  const handleSaveAndPreview = () => {
    setPreviewMode(true);
  };

  if (isLoading) {
    return (
      <div className="chat-widget-form-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading widget data...</p>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="chat-widget-form-container">
        <div className="widget-preview-container">
          <div className="preview-header">
            <button
              className="back-button"
              onClick={() => setPreviewMode(false)}
            >
              <ChevronLeft size={18} />
              <span>Back to Editor</span>
            </button>
            <h2>Widget Preview</h2>
          </div>

          <div className="preview-content">
            <div className="device-preview">
              <div className="device-frame">
                <div className="device-screen">
                  <div className="widget-preview">
                    {/* Simulated website content */}
                    <div className="mock-website">
                      <div className="mock-header"></div>
                      <div className="mock-content">
                        <div className="mock-section"></div>
                        <div className="mock-section"></div>
                        <div className="mock-section"></div>
                      </div>
                    </div>

                    {/* Chat button */}
                    <div
                      className={`chat-button-preview ${formData.chatButton.position}`}
                      style={{
                        backgroundColor: formData.chatButton.color,
                        bottom: `${formData.chatButton.marginBottom}px`,
                        right:
                          formData.chatButton.position === "right"
                            ? `${formData.chatButton.marginRight}px`
                            : "auto",
                        left:
                          formData.chatButton.position === "left"
                            ? `${formData.chatButton.marginLeft}px`
                            : "auto",
                        transform: `scale(${
                          formData.chatButton.size === "small"
                            ? 0.8
                            : formData.chatButton.size === "large"
                            ? 1.2
                            : 1
                        })`,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="white"
                      >
                        <path
                          d="M20.5 3.4A12.1 12.1 0 0012 0 12 12 0 001.7 17.8L0 24l6.3-1.7c2.8 1.5 5.7 2.2 8.5 2.2a12 12 0 0012-12c0-3.2-1.3-6.3-3.5-8.5z"
                          stroke="none"
                        />
                        <path
                          d="M17.6 14.5c-.2.1-1.4.7-1.6.8-.3 0-.4.2-2.3-.6-1.8-.7-3-2.9-3-2.9a10 10 0 01-1-1.4l.1-.2c.1-.1.2-.3.3-.4l.5-.5c.2 0 .2-.1.3-.3.1-.2 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3c-.8.8-1.1 1.8-1.1 2.8a5 5 0 001 2.7c1.2 1.8 2.6 3 4.5 3.8.8.3 1.4.5 1.9.6.8.2 1.6.1 2.2-.1.6-.2 1.2-.7 1.3-1.4.2-.5.2-.9.1-1-.1-.1-.3-.2-.5-.3z"
                          fill="white"
                          stroke="none"
                        />
                      </svg>
                    </div>

                    {/* Chat window */}
                    <div className="chat-window-preview">
                      <div
                        className="chat-header"
                        style={{
                          backgroundColor: formData.chatScreen.brandColor,
                        }}
                      >
                        <div className="profile-section">
                          <div className="profile-image">
                            {formData.chatScreen.profileImage ? (
                              <img
                                src={formData.chatScreen.profileImage}
                                alt="Agent"
                              />
                            ) : (
                              <div className="default-profile">
                                <svg
                                  viewBox="0 0 24 24"
                                  width="24"
                                  height="24"
                                  fill={formData.chatScreen.textColor}
                                >
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-2 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="profile-info">
                            <div
                              className="chat-title"
                              style={{ color: formData.chatScreen.textColor }}
                            >
                              {formData.chatScreen.title}
                            </div>
                            <div
                              className="chat-subtitle"
                              style={{
                                color: `${formData.chatScreen.textColor}99`,
                              }}
                            >
                              {formData.chatScreen.subtitle}
                            </div>
                          </div>
                        </div>
                        <button className="close-button">
                          <X size={18} color={formData.chatScreen.textColor} />
                        </button>
                      </div>

                      {formData.preChatForm.enabled ? (
                        <div className="pre-chat-form">
                          <div className="form-title">Before we chat...</div>
                          {formData.preChatForm.questions.map(
                            (question, index) => (
                              <div key={question.id} className="form-question">
                                <label>
                                  {question.label}{" "}
                                  {question.required && (
                                    <span className="required">*</span>
                                  )}
                                </label>
                                <input
                                  type={
                                    question.type === "email" ? "email" : "text"
                                  }
                                  placeholder={`Enter your ${
                                    question.type === "email"
                                      ? "email"
                                      : "answer"
                                  }`}
                                />
                              </div>
                            )
                          )}
                          <button
                            className="start-chat-button"
                            style={{
                              backgroundColor: formData.chatScreen.brandColor,
                              color: formData.chatScreen.textColor,
                            }}
                          >
                            Start Chat
                          </button>
                        </div>
                      ) : (
                        <div className="chat-messages">
                          <div className="message-bubble agent">
                            <div className="message-content">
                              Hello! How can I help you today?
                            </div>
                          </div>
                          <div className="message-input-container">
                            <input
                              type="text"
                              className="message-input"
                              placeholder={formData.chatScreen.defaultText}
                            />
                            <button
                              className="send-button"
                              style={{
                                backgroundColor: formData.chatScreen.brandColor,
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill={formData.chatScreen.textColor}
                              >
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="embed-code-section">
              <h3>Add this code to your website</h3>
              <p>
                Copy and paste this code just before the closing &lt;/body&gt;
                tag on your website.
              </p>

              <div className="code-container">
                <pre>
                  <code>
                    {`<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'widgetId': '${formData.name
    .toLowerCase()
    .replace(/\s+/g, "-")}-${Date.now()}'});
  var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://cdn.example.com/whatsapp-widget.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','waLayer','${id || "new"}');
</script>`}
                  </code>
                </pre>
                <button className="copy-code-button">
                  <span>Copy to Clipboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-widget-form-container">
      <div className="form-header">
        <div className="header-left">
          <button
            className="back-button"
            onClick={() => navigate("/chat-widget")}
          >
            <ChevronLeft size={18} />
            <span>Back to Widgets</span>
          </button>
          <h1>{isEditMode ? "Edit Chat Widget" : "Create New Chat Widget"}</h1>
        </div>
        <div className="header-actions">
          <button
            className="save-preview-button"
            onClick={handleSaveAndPreview}
          >
            <Eye size={18} />
            <span>Save & Preview</span>
          </button>
          <button className="save-button" onClick={handleSubmit}>
            <Save size={18} />
            <span>Save Widget</span>
          </button>
        </div>
      </div>

      <div className="widget-form-content">
        <div className="form-tabs">
          <button
            className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Settings
          </button>
          <button
            className={`tab-button ${
              activeTab === "appearance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("appearance")}
          >
            Appearance
          </button>
          <button
            className={`tab-button ${activeTab === "pre-chat" ? "active" : ""}`}
            onClick={() => setActiveTab("pre-chat")}
          >
            Pre-Chat Form
          </button>
          <button
            className={`tab-button ${activeTab === "behavior" ? "active" : ""}`}
            onClick={() => setActiveTab("behavior")}
          >
            Behavior
          </button>
        </div>

        <form onSubmit={handleSubmit} className="widget-form">
          {/* Basic Settings Tab */}
          {activeTab === "basic" && (
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="name">Widget Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Store Support Widget"
                  required
                />
                <span className="field-hint">
                  Internal name for your reference
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Support">Support</option>
                  <option value="Sales">Sales</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
                <span className="field-hint">
                  Choose a category for organization
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="domain">Website Domain</label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="e.g., mywebsite.com"
                  required
                />
                <span className="field-hint">
                  Domain where this widget will be used
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="destination">Chat Destination</label>
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                >
                  <option value="WhatsApp Number">WhatsApp Number</option>
                  <option value="WhatsApp Channel">WhatsApp Channel</option>
                  <option value="Chat Widget Only">Chat Widget Only</option>
                </select>
                <span className="field-hint">Where chats will be directed</span>
              </div>

              {formData.destination !== "Chat Widget Only" && (
                <div className="form-group">
                  <label htmlFor="destinationValue">
                    {formData.destination === "WhatsApp Number"
                      ? "WhatsApp Number"
                      : "Channel Name"}
                  </label>
                  <input
                    type="text"
                    id="destinationValue"
                    name="destinationValue"
                    value={formData.destinationValue}
                    onChange={handleChange}
                    placeholder={
                      formData.destination === "WhatsApp Number"
                        ? "+1234567890"
                        : "Channel Name"
                    }
                    required
                  />
                  <span className="field-hint">
                    {formData.destination === "WhatsApp Number"
                      ? "Enter with country code (e.g., +1234567890)"
                      : "Enter the name of your WhatsApp channel"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="form-section">
              <h3>Chat Button</h3>

              <div className="form-group">
                <label htmlFor="chatButton.position">Position</label>
                <select
                  id="chatButton.position"
                  name="chatButton.position"
                  value={formData.chatButton.position}
                  onChange={handleChange}
                >
                  <option value="right">Bottom Right</option>
                  <option value="left">Bottom Left</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="chatButton.color">Button Color</label>
                <div className="color-picker-container">
                  <input
                    type="color"
                    id="chatButton.color"
                    name="chatButton.color"
                    value={formData.chatButton.color}
                    onChange={handleChange}
                  />
                  <span className="color-value">
                    {formData.chatButton.color}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="chatButton.size">Button Size</label>
                <select
                  id="chatButton.size"
                  name="chatButton.size"
                  value={formData.chatButton.size}
                  onChange={handleChange}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="chatButton.marginBottom">
                    Bottom Margin (px)
                  </label>
                  <input
                    type="number"
                    id="chatButton.marginBottom"
                    name="chatButton.marginBottom"
                    value={formData.chatButton.marginBottom}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-group half-width">
                  <label
                    htmlFor={
                      formData.chatButton.position === "right"
                        ? "chatButton.marginRight"
                        : "chatButton.marginLeft"
                    }
                  >
                    {formData.chatButton.position === "right"
                      ? "Right Margin (px)"
                      : "Left Margin (px)"}
                  </label>
                  <input
                    type="number"
                    id={
                      formData.chatButton.position === "right"
                        ? "chatButton.marginRight"
                        : "chatButton.marginLeft"
                    }
                    name={
                      formData.chatButton.position === "right"
                        ? "chatButton.marginRight"
                        : "chatButton.marginLeft"
                    }
                    value={
                      formData.chatButton.position === "right"
                        ? formData.chatButton.marginRight
                        : formData.chatButton.marginLeft
                    }
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <h3>Chat Screen</h3>

              <div className="form-group">
                <label htmlFor="chatScreen.title">Title</label>
                <input
                  type="text"
                  id="chatScreen.title"
                  name="chatScreen.title"
                  value={formData.chatScreen.title}
                  onChange={handleChange}
                  placeholder="e.g., Chat with us"
                />
              </div>

              <div className="form-group">
                <label htmlFor="chatScreen.subtitle">Subtitle</label>
                <input
                  type="text"
                  id="chatScreen.subtitle"
                  name="chatScreen.subtitle"
                  value={formData.chatScreen.subtitle}
                  onChange={handleChange}
                  placeholder="e.g., We typically reply within a few minutes"
                />
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="chatScreen.brandColor">Brand Color</label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      id="chatScreen.brandColor"
                      name="chatScreen.brandColor"
                      value={formData.chatScreen.brandColor}
                      onChange={handleChange}
                    />
                    <span className="color-value">
                      {formData.chatScreen.brandColor}
                    </span>
                  </div>
                </div>

                <div className="form-group half-width">
                  <label htmlFor="chatScreen.textColor">Text Color</label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      id="chatScreen.textColor"
                      name="chatScreen.textColor"
                      value={formData.chatScreen.textColor}
                      onChange={handleChange}
                    />
                    <span className="color-value">
                      {formData.chatScreen.textColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="chatScreen.profileImage">
                  Agent Profile Image URL
                </label>
                <input
                  type="text"
                  id="chatScreen.profileImage"
                  name="chatScreen.profileImage"
                  value={formData.chatScreen.profileImage}
                  onChange={handleChange}
                  placeholder="e.g., https://example.com/profile.jpg"
                />
                <span className="field-hint">
                  Leave empty to use default icon
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="chatScreen.defaultText">
                  Default Message Text
                </label>
                <input
                  type="text"
                  id="chatScreen.defaultText"
                  name="chatScreen.defaultText"
                  value={formData.chatScreen.defaultText}
                  onChange={handleChange}
                  placeholder="e.g., Hello, I'd like to chat with you about..."
                />
              </div>
            </div>
          )}

          {/* Pre-Chat Form Tab */}
          {activeTab === "pre-chat" && (
            <div className="form-section">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="preChatForm.enabled"
                  name="preChatForm.enabled"
                  checked={formData.preChatForm.enabled}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="preChatForm.enabled">
                  Enable Pre-Chat Form
                </label>
                <span className="field-hint">
                  Collect information from users before starting the chat
                </span>
              </div>

              {formData.preChatForm.enabled && (
                <>
                  <div className="questions-container">
                    <div className="questions-header">
                      <h3>Pre-Chat Questions</h3>
                      <button
                        type="button"
                        className="add-question-button"
                        onClick={handleAddQuestion}
                      >
                        <Plus size={16} />
                        <span>Add Question</span>
                      </button>
                    </div>

                    {formData.preChatForm.questions.map((question, index) => (
                      <div key={question.id} className="question-item">
                        <div className="question-header">
                          <div className="question-drag-handle">
                            <Move size={16} />
                          </div>
                          <span className="question-number">
                            Question {index + 1}
                          </span>
                          <button
                            type="button"
                            className="remove-question-button"
                            onClick={() => handleRemoveQuestion(question.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="question-content">
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor={`question-${question.id}-label`}>
                                Question Label
                              </label>
                              <input
                                type="text"
                                id={`question-${question.id}-label`}
                                value={question.label}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    question.id,
                                    "label",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., What's your name?"
                              />
                            </div>
                          </div>

                          <div className="form-row">
                            <div className="form-group half-width">
                              <label htmlFor={`question-${question.id}-type`}>
                                Question Type
                              </label>
                              <select
                                id={`question-${question.id}-type`}
                                value={question.type}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    question.id,
                                    "type",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="text">Text Input</option>
                                <option value="email">Email Input</option>
                                <option value="date">Date Input</option>
                              </select>
                            </div>

                            <div className="form-group half-width">
                              <label htmlFor={`question-${question.id}-field`}>
                                Custom Field ID
                              </label>
                              <input
                                type="text"
                                id={`question-${question.id}-field`}
                                value={question.customFieldId}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    question.id,
                                    "customFieldId",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., name, email, etc."
                              />
                            </div>
                          </div>

                          <div className="form-group checkbox-group">
                            <input
                              type="checkbox"
                              id={`question-${question.id}-required`}
                              checked={question.required}
                              onChange={(e) =>
                                handleQuestionChange(
                                  question.id,
                                  "required",
                                  e.target.checked
                                )
                              }
                            />
                            <label htmlFor={`question-${question.id}-required`}>
                              Required Question
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Behavior Tab */}
          {activeTab === "behavior" && (
            <div className="form-section">
              <h3>Pre-Chat Session</h3>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="preChatSession.openByDefault"
                  name="preChatSession.openByDefault"
                  checked={formData.preChatSession.openByDefault}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="preChatSession.openByDefault">
                  Open Chat Widget by Default
                </label>
                <span className="field-hint">
                  Chat widget will open automatically when page loads
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="preChatSession.frequency">
                  Display Frequency
                </label>
                <select
                  id="preChatSession.frequency"
                  name="preChatSession.frequency"
                  value={formData.preChatSession.frequency}
                  onChange={handleChange}
                >
                  <option value="once_per_session">Once Per Session</option>
                  <option value="once_per_visit">Once Per Visit</option>
                  <option value="once_per_day">Once Per Day</option>
                  <option value="every_visit">Every Visit</option>
                </select>
                <span className="field-hint">
                  How often the chat widget should automatically open
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="preChatSession.sessionDuration">
                  Session Duration (minutes)
                </label>
                <input
                  type="number"
                  id="preChatSession.sessionDuration"
                  name="preChatSession.sessionDuration"
                  value={formData.preChatSession.sessionDuration}
                  onChange={handleChange}
                  min="5"
                  max="1440"
                />
                <span className="field-hint">
                  How long a chat session remains active before timeout
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatWidgetForm;
