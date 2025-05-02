// src/pages/Chats/components/TemplateMessageSelector.jsx
import React, { useState, useEffect } from "react";

const TemplateMessageSelector = ({ onSelectTemplate, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch templates - replace with your API call
    setTimeout(() => {
      setTemplates([
        {
          id: "template1",
          name: "Order Status",
          content: "Hello {{1}}, your order #{{2}} is {{3}}.",
          variables: ["customer_name", "order_number", "status"],
          type: "text",
        },
        {
          id: "template2",
          name: "Product Information",
          content:
            "Our {{1}} is available for {{2}}. Would you like to place an order?",
          variables: ["product_name", "price"],
          type: "text",
        },
        {
          id: "template3",
          name: "Support Options",
          header: "Need help?",
          body: "Choose from the following support options:",
          footer: "Thank you for contacting us",
          buttons: [
            { id: "btn1", text: "Talk to Agent" },
            { id: "btn2", text: "View FAQs" },
          ],
          type: "buttons",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);

    // Initialize variables
    const initialVariables = {};
    if (template.variables) {
      template.variables.forEach((variable) => {
        initialVariables[variable] = "";
      });
    }
    setTemplateVariables(initialVariables);
  };

  const handleVariableChange = (variable, value) => {
    setTemplateVariables({
      ...templateVariables,
      [variable]: value,
    });
  };

  const handleSendTemplate = () => {
    if (!selectedTemplate) return;

    let content = selectedTemplate.content;
    if (selectedTemplate.variables) {
      selectedTemplate.variables.forEach((variable, index) => {
        content = content.replace(
          `{{${index + 1}}}`,
          templateVariables[variable] || `[${variable}]`
        );
      });
    }

    onSelectTemplate({
      id: selectedTemplate.id,
      name: selectedTemplate.name,
      content,
      type: selectedTemplate.type,
      header: selectedTemplate.header,
      body: selectedTemplate.body,
      footer: selectedTemplate.footer,
      buttons: selectedTemplate.buttons,
    });
  };

  return (
    <div className="template-selector">
      <div className="template-selector-header">
        <h3>Select Template Message</h3>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      {loading ? (
        <div className="loading-templates">Loading templates...</div>
      ) : (
        <div className="template-selector-content">
          {!selectedTemplate ? (
            <div className="template-list">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="template-item"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <h4>{template.name}</h4>
                  <p className="template-preview">
                    {template.type === "text"
                      ? template.content
                      : `${template.header ? template.header + " - " : ""}${
                          template.body
                        }`}
                  </p>
                  <div className="template-type">
                    {template.type === "buttons"
                      ? "Button Template"
                      : "Text Template"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="template-editor">
              <h4>{selectedTemplate.name}</h4>

              {selectedTemplate.type === "text" ? (
                <div className="template-text-preview">
                  <p className="template-content">{selectedTemplate.content}</p>
                </div>
              ) : (
                <div className="template-button-preview">
                  {selectedTemplate.header && (
                    <div className="template-header">
                      {selectedTemplate.header}
                    </div>
                  )}
                  <div className="template-body">{selectedTemplate.body}</div>
                  {selectedTemplate.footer && (
                    <div className="template-footer">
                      {selectedTemplate.footer}
                    </div>
                  )}
                  <div className="template-buttons">
                    {selectedTemplate.buttons.map((button) => (
                      <div key={button.id} className="template-button">
                        {button.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate.variables && (
                <div className="template-variables">
                  <h5>Fill in the variables:</h5>
                  {selectedTemplate.variables.map((variable, index) => (
                    <div key={index} className="variable-input">
                      <label>{variable.replace(/_/g, " ")}:</label>
                      <input
                        type="text"
                        value={templateVariables[variable] || ""}
                        onChange={(e) =>
                          handleVariableChange(variable, e.target.value)
                        }
                        placeholder={`Enter ${variable.replace(/_/g, " ")}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="template-actions">
                <button
                  className="back-button"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Back
                </button>
                <button
                  className="send-template-button"
                  onClick={handleSendTemplate}
                >
                  Send Template
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateMessageSelector;
