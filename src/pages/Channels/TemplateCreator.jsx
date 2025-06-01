// src/pages/Channels/TemplateCreator.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TemplateCreator.css";

const TemplateCreator = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [templateType, setTemplateType] = useState("standard");
  const [templateData, setTemplateData] = useState({
    name: "",
    language: "en_US",
    category: "MARKETING",
    header: {
      type: "NONE", // NONE, TEXT, IMAGE, VIDEO, DOCUMENT
      text: "",
      mediaUrl: "",
    },
    body: {
      text: "",
      variables: [],
    },
    footer: {
      text: "",
    },
    buttons: [],
  });

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  // Variables detected from body text
  const [detectedVariables, setDetectedVariables] = useState([]);
  const [variableExamples, setVariableExamples] = useState({});

  // Load template data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // This would be an API call in production
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Mock data for editing
        const templateToEdit = {
          id: parseInt(id),
          name: "welcome_message",
          language: "en_US",
          category: "MARKETING",
          type: "standard",
          header: {
            type: "TEXT",
            text: "Welcome!",
          },
          body: {
            text: "Hello {{1}}, welcome to our service! Your account was created on {{2}}.",
          },
          footer: {
            text: "Reply for more info",
          },
          buttons: [
            { type: "QUICK_REPLY", text: "Get Started" },
            { type: "QUICK_REPLY", text: "Learn More" },
          ],
        };

        setTemplateType(templateToEdit.type);
        setTemplateData({
          name: templateToEdit.name,
          language: templateToEdit.language,
          category: templateToEdit.category,
          header: templateToEdit.header,
          body: templateToEdit.body,
          footer: templateToEdit.footer,
          buttons: templateToEdit.buttons,
        });

        // Extract variables from the body text
        const bodyText = templateToEdit.body.text;
        detectVariablesFromText(bodyText);

        // Set example values (these would come from the API in production)
        setVariableExamples({
          1: "John",
          2: "May 15, 2023",
        });

        setIsLoading(false);
      }, 1000);
    }
  }, [id, isEditMode]);

  // Handle template name and basic info changes
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle header type change
  const handleHeaderTypeChange = (type) => {
    setTemplateData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        type,
      },
    }));
  };

  // Handle header content change
  const handleHeaderContentChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [name]: value,
      },
    }));
  };

  // Detect variables from text
  const detectVariablesFromText = (text) => {
    // Detect variables {{1}}, {{2}}, etc.
    const variableRegex = /{{(\d+)}}/g;
    const matches = [...text.matchAll(variableRegex)];
    const variables = matches.map((match) => match[1]);

    // Get unique variables
    const uniqueVariables = [...new Set(variables)];
    setDetectedVariables(uniqueVariables);

    // Initialize example values for new variables
    const newExamples = { ...variableExamples };
    uniqueVariables.forEach((variable) => {
      if (!newExamples[variable]) {
        newExamples[variable] = "";
      }
    });
    setVariableExamples(newExamples);
  };

  // Handle body text change and variable detection
  const handleBodyTextChange = (e) => {
    const text = e.target.value;

    // Update template data
    setTemplateData((prev) => ({
      ...prev,
      body: {
        ...prev.body,
        text,
      },
    }));

    detectVariablesFromText(text);
  };

  // Handle variable example change
  const handleVariableExampleChange = (variable, value) => {
    setVariableExamples((prev) => ({
      ...prev,
      [variable]: value,
    }));
  };

  // Handle footer text change
  const handleFooterChange = (e) => {
    setTemplateData((prev) => ({
      ...prev,
      footer: {
        text: e.target.value,
      },
    }));
  };

  // Handle button actions
  const [buttonType, setButtonType] = useState("QUICK_REPLY");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [buttonPhone, setButtonPhone] = useState("");

  // Add button
  const addButton = () => {
    const newButton = {
      type: buttonType,
      text: buttonText,
    };

    // Add URL or phone if needed
    if (buttonType === "URL") {
      newButton.url = buttonUrl;
    } else if (buttonType === "PHONE_NUMBER") {
      newButton.phone_number = buttonPhone;
    }

    // Add to template data
    setTemplateData((prev) => ({
      ...prev,
      buttons: [...prev.buttons, newButton],
    }));

    // Reset button form
    setButtonText("");
    setButtonUrl("");
    setButtonPhone("");
  };

  // Remove button
  const removeButton = (index) => {
    setTemplateData((prev) => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!templateData.name) {
      alert("Template name is required");
      return;
    }

    if (!templateData.body.text) {
      alert("Body text is required");
      return;
    }

    // Check if all detected variables have examples
    const missingExamples = detectedVariables.filter(
      (variable) => !variableExamples[variable]
    );

    if (missingExamples.length > 0) {
      alert(
        `Please provide examples for all variables: ${missingExamples.join(
          ", "
        )}`
      );
      return;
    }

    // Prepare template data for submission
    const finalTemplateData = {
      ...templateData,
      type: templateType,
      body: {
        ...templateData.body,
        variables: detectedVariables.map((variable) => ({
          key: variable,
          example: variableExamples[variable],
        })),
      },
    };

    setIsSaving(true);

    //console.log("Submitting template:", finalTemplateData);
    // API call to create/submit template would go here

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Redirect to template manager on success
      navigate("/channels/templates");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="template-creator-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading template data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="template-creator-container">
      <h1>
        {isEditMode ? "Edit WhatsApp Template" : "Create WhatsApp Template"}
      </h1>

      <div className="template-type-selector">
        <button
          className={templateType === "standard" ? "active" : ""}
          onClick={() => setTemplateType("standard")}
        >
          Standard Template
        </button>
        <button
          className={templateType === "carousel" ? "active" : ""}
          onClick={() => setTemplateType("carousel")}
        >
          Carousel Template
        </button>
        <button
          className={templateType === "mpm" ? "active" : ""}
          onClick={() => setTemplateType("mpm")}
        >
          Multi-Product (MPM)
        </button>
        <button
          className={templateType === "lto" ? "active" : ""}
          onClick={() => setTemplateType("lto")}
        >
          Limited Time Offer
        </button>
        <button
          className={templateType === "catalog" ? "active" : ""}
          onClick={() => setTemplateType("catalog")}
        >
          Product Catalog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="template-form">
        {/* Basic Template Information */}
        <section className="form-section">
          <h3>Template Information</h3>

          <div className="form-group">
            <label htmlFor="name">Template Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={templateData.name}
              onChange={handleBasicInfoChange}
              required
              placeholder="e.g., welcome_message (no spaces, use underscore)"
              disabled={isEditMode}
            />
            {isEditMode && (
              <p className="field-hint">
                Template name cannot be changed after creation
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={templateData.language}
              onChange={handleBasicInfoChange}
              required
              disabled={isEditMode}
            >
              <option value="en_US">English (US)</option>
              <option value="es_ES">Spanish (Spain)</option>
              <option value="pt_BR">Portuguese (Brazil)</option>
              <option value="fr_FR">French</option>
              <option value="de_DE">German</option>
              <option value="it_IT">Italian</option>
              <option value="hi_IN">Hindi</option>
              {/* Add more languages */}
            </select>
            {isEditMode && (
              <p className="field-hint">
                Language cannot be changed after creation
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={templateData.category}
              onChange={handleBasicInfoChange}
              required
            >
              <option value="MARKETING">Marketing</option>
              <option value="UTILITY">Utility</option>
              <option value="AUTHENTICATION">Authentication</option>
              {/* Add more categories */}
            </select>
          </div>
        </section>

        {/* Header Section */}
        <section className="form-section">
          <h3>Header (Optional)</h3>

          <div className="header-type-selector">
            <button
              type="button"
              className={templateData.header.type === "NONE" ? "active" : ""}
              onClick={() => handleHeaderTypeChange("NONE")}
            >
              No Header
            </button>
            <button
              type="button"
              className={templateData.header.type === "TEXT" ? "active" : ""}
              onClick={() => handleHeaderTypeChange("TEXT")}
            >
              Text
            </button>
            <button
              type="button"
              className={templateData.header.type === "IMAGE" ? "active" : ""}
              onClick={() => handleHeaderTypeChange("IMAGE")}
            >
              Image
            </button>
            <button
              type="button"
              className={templateData.header.type === "VIDEO" ? "active" : ""}
              onClick={() => handleHeaderTypeChange("VIDEO")}
            >
              Video
            </button>
            <button
              type="button"
              className={
                templateData.header.type === "DOCUMENT" ? "active" : ""
              }
              onClick={() => handleHeaderTypeChange("DOCUMENT")}
            >
              Document
            </button>
          </div>

          {templateData.header.type === "TEXT" && (
            <div className="form-group">
              <label htmlFor="headerText">Header Text</label>
              <input
                type="text"
                id="headerText"
                name="text"
                value={templateData.header.text}
                onChange={handleHeaderContentChange}
                maxLength={60}
                placeholder="Enter header text (max 60 characters)"
              />
              <div className="character-count">
                {templateData.header.text.length}/60
              </div>
            </div>
          )}

          {["IMAGE", "VIDEO", "DOCUMENT"].includes(
            templateData.header.type
          ) && (
            <div className="form-group">
              <label htmlFor="mediaUrl">Media URL</label>
              <input
                type="url"
                id="mediaUrl"
                name="mediaUrl"
                value={templateData.header.mediaUrl}
                onChange={handleHeaderContentChange}
                placeholder="Enter media URL"
              />
              <p className="media-instructions">
                {templateData.header.type === "IMAGE" &&
                  "Image must be less than 5MB"}
                {templateData.header.type === "VIDEO" &&
                  "Video must be less than 10MB"}
                {templateData.header.type === "DOCUMENT" &&
                  "Document must be less than 100MB"}
              </p>
            </div>
          )}
        </section>

        {/* Body Section */}
        <section className="form-section">
          <h3>Body</h3>

          <div className="form-group">
            <label htmlFor="bodyText">Body Text</label>
            <textarea
              id="bodyText"
              value={templateData.body.text}
              onChange={handleBodyTextChange}
              rows="6"
              maxLength={1024}
              placeholder="Enter message body. Use {{1}}, {{2}}, etc. for variables."
              required
            ></textarea>
            <div className="character-count">
              {templateData.body.text.length}/1024
            </div>
            <p className="field-hint">
              Use {"{"}
              {"{"}"1"{"}"}
              {"}"}," {"{"}
              {"{"}"2"{"}"}
              {"}"},", etc. to add variables that can be personalized for each
              recipient.
            </p>
          </div>

          {detectedVariables.length > 0 && (
            <div className="variables-section">
              <h4>Variable Examples</h4>
              <p className="variables-instruction">
                Provide an example for each variable in your template
              </p>

              {detectedVariables.map((variable) => (
                <div key={variable} className="form-group variable-example">
                  <label htmlFor={`variable-${variable}`}>
                    Example for {"{"}
                    {"{"}
                    {variable}
                    {"}"}
                    {"}"}
                  </label>
                  <input
                    type="text"
                    id={`variable-${variable}`}
                    value={variableExamples[variable] || ""}
                    onChange={(e) =>
                      handleVariableExampleChange(variable, e.target.value)
                    }
                    placeholder={`Example for variable {{${variable}}}`}
                    required
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer Section */}
        <section className="form-section">
          <h3>Footer (Optional)</h3>

          <div className="form-group">
            <label htmlFor="footerText">Footer Text</label>
            <input
              type="text"
              id="footerText"
              value={templateData.footer.text}
              onChange={handleFooterChange}
              maxLength={60}
              placeholder="Enter footer text (max 60 characters)"
            />
            <div className="character-count">
              {templateData.footer.text.length}/60
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="form-section">
          <h3>Buttons (Optional)</h3>
          <p className="buttons-instruction">
            Add up to 10 buttons. At least one button is recommended.
          </p>

          <div className="current-buttons">
            {templateData.buttons.map((button, index) => (
              <div key={index} className="button-item">
                <span className="button-type">{button.type}</span>
                <span className="button-text">{button.text}</span>
                {button.url && <span className="button-url">{button.url}</span>}
                {button.phone_number && (
                  <span className="button-phone">{button.phone_number}</span>
                )}
                <button
                  type="button"
                  onClick={() => removeButton(index)}
                  className="remove-button-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {templateData.buttons.length < 10 && (
            <div className="add-button-section">
              <h4>Add Button</h4>

              <div className="button-type-selector">
                <button
                  type="button"
                  className={buttonType === "QUICK_REPLY" ? "active" : ""}
                  onClick={() => setButtonType("QUICK_REPLY")}
                >
                  Quick Reply
                </button>
                <button
                  type="button"
                  className={buttonType === "URL" ? "active" : ""}
                  onClick={() => setButtonType("URL")}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={buttonType === "PHONE_NUMBER" ? "active" : ""}
                  onClick={() => setButtonType("PHONE_NUMBER")}
                >
                  Call Now
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="buttonText">Button Text</label>
                <input
                  type="text"
                  id="buttonText"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  maxLength={20}
                  placeholder="Enter button text (max 20 characters)"
                />
              </div>

              {buttonType === "URL" && (
                <div className="form-group">
                  <label htmlFor="buttonUrl">URL</label>
                  <input
                    type="url"
                    id="buttonUrl"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="Enter URL (e.g., https://example.com)"
                  />
                </div>
              )}

              {buttonType === "PHONE_NUMBER" && (
                <div className="form-group">
                  <label htmlFor="buttonPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="buttonPhone"
                    value={buttonPhone}
                    onChange={(e) => setButtonPhone(e.target.value)}
                    placeholder="Enter phone with country code (e.g., +1234567890)"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={addButton}
                className="add-button-btn"
                disabled={
                  !buttonText ||
                  (buttonType === "URL" && !buttonUrl) ||
                  (buttonType === "PHONE_NUMBER" && !buttonPhone)
                }
              >
                Add Button
              </button>
            </div>
          )}
        </section>

        {/* Template Preview */}
        <section className="form-section template-preview-section">
          <h3>Template Preview</h3>

          <div className="template-preview">
            <div className="preview-phone">
              <div className="preview-screen">
                <div className="preview-chat">
                  {templateData.header.type !== "NONE" && (
                    <div className="preview-header">
                      {templateData.header.type === "TEXT" && (
                        <div className="preview-header-text">
                          {templateData.header.text || "Header Text"}
                        </div>
                      )}
                      {templateData.header.type === "IMAGE" && (
                        <div className="preview-header-media preview-image">
                          {templateData.header.mediaUrl ? (
                            <img
                              src={templateData.header.mediaUrl}
                              alt="Header"
                            />
                          ) : (
                            <div className="placeholder-media">Image</div>
                          )}
                        </div>
                      )}
                      {templateData.header.type === "VIDEO" && (
                        <div className="preview-header-media preview-video">
                          <div className="placeholder-media">Video</div>
                        </div>
                      )}
                      {templateData.header.type === "DOCUMENT" && (
                        <div className="preview-header-media preview-document">
                          <div className="placeholder-media">Document</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="preview-body">
                    {templateData.body.text
                      ? templateData.body.text.replace(
                          /{{(\d+)}}/g,
                          (match, variable) =>
                            `<${
                              variableExamples[variable] ||
                              `Variable ${variable}`
                            }>`
                        )
                      : "Your message body will appear here"}
                  </div>

                  {templateData.footer.text && (
                    <div className="preview-footer">
                      {templateData.footer.text}
                    </div>
                  )}

                  {templateData.buttons.length > 0 && (
                    <div className="preview-buttons">
                      {templateData.buttons.map((button, index) => (
                        <div
                          key={index}
                          className={`preview-button preview-${button.type.toLowerCase()}`}
                        >
                          {button.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Section */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/channels/templates")}
            className="cancel-btn"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSaving}>
            {isSaving
              ? "Submitting..."
              : isEditMode
              ? "Update Template"
              : "Submit Template"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateCreator;
