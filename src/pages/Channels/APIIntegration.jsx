// src/pages/Channels/APIIntegration.jsx

import React, { useState, useEffect } from "react";
import "./APIIntegration.css";

const APIIntegration = () => {
  // State for API details
  const [apiDetails, setApiDetails] = useState({
    apiKey: "",
    phoneNumberId: "",
    accountId: "",
    apiVersion: "v16.0",
    baseUrl: "https://graph.facebook.com/",
  });

  // State for webhook settings
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookVerified, setWebhookVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // State for test message
  const [testMessage, setTestMessage] = useState({
    phoneNumber: "",
    templateName: "",
    variables: {},
    isSending: false,
    status: null,
  });

  // State for available templates
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // State for code tabs
  const [activeWebhookTab, setActiveWebhookTab] = useState("php");
  const [activeApiTab, setActiveApiTab] = useState("curl");

  // State for loading
  const [isLoading, setIsLoading] = useState(true);

  // Load API details and templates
  useEffect(() => {
    // This would be an API call in a real implementation

    // Simulate loading with a timeout
    setTimeout(() => {
      // Mock API details
      setApiDetails({
        apiKey: "EAABGAIJuS4kBO...", // Truncated for security
        phoneNumberId: "123456789012345",
        accountId: "987654321098765",
        apiVersion: "v16.0",
        baseUrl: "https://graph.facebook.com/",
      });

      // Mock webhook status
      setWebhookUrl("https://webhook.example.com/whatsapp-webhooks");
      setWebhookVerified(true);

      // Mock templates
      setTemplates([
        {
          id: 1,
          name: "welcome_message",
          components: {
            body: { text: "Hello {{1}}, welcome to our service!" },
            variables: [{ key: "1", example: "John" }],
          },
        },
        {
          id: 2,
          name: "order_update",
          components: {
            body: {
              text: "Your order #{{1}} has been {{2}}. Estimated delivery: {{3}}",
            },
            variables: [
              { key: "1", example: "12345" },
              { key: "2", example: "shipped" },
              { key: "3", example: "Tomorrow" },
            ],
          },
        },
        {
          id: 3,
          name: "appointment_reminder",
          components: {
            body: {
              text: "Reminder: You have an appointment scheduled for {{1}} at {{2}}.",
            },
            variables: [
              { key: "1", example: "May 15, 2023" },
              { key: "2", example: "10:00 AM" },
            ],
          },
        },
      ]);

      setIsLoading(false);
    }, 1500);
  }, []);

  // Handle webhook URL change
  const handleWebhookUrlChange = (e) => {
    setWebhookUrl(e.target.value);
    setWebhookVerified(false);
  };

  // Verify webhook
  const verifyWebhook = () => {
    if (!webhookUrl) {
      alert("Please enter a webhook URL");
      return;
    }

    setIsVerifying(true);

    // Mock verification process
    setTimeout(() => {
      setIsVerifying(false);
      setWebhookVerified(true);

      // Show success message
      alert("Webhook verified successfully");
    }, 2000);
  };

  // Handle template selection
  const handleTemplateSelect = (e) => {
    const templateId = parseInt(e.target.value);
    const template = templates.find((t) => t.id === templateId);

    if (template) {
      setSelectedTemplate(template);

      // Initialize variables
      const variables = {};
      template.components.variables.forEach((v) => {
        variables[v.key] = "";
      });

      setTestMessage({
        ...testMessage,
        templateName: template.name,
        variables,
      });
    } else {
      setSelectedTemplate(null);
      setTestMessage({
        ...testMessage,
        templateName: "",
        variables: {},
      });
    }
  };

  // Handle phone number change
  const handlePhoneNumberChange = (e) => {
    setTestMessage({
      ...testMessage,
      phoneNumber: e.target.value,
    });
  };

  // Handle variable change
  const handleVariableChange = (key, value) => {
    setTestMessage({
      ...testMessage,
      variables: {
        ...testMessage.variables,
        [key]: value,
      },
    });
  };

  // Copy to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  // Send test message
  const sendTestMessage = () => {
    if (!testMessage.phoneNumber) {
      alert("Please enter a phone number");
      return;
    }

    if (!testMessage.templateName) {
      alert("Please select a template");
      return;
    }

    // Check if all variables are filled
    const missingVariables = [];
    if (selectedTemplate) {
      selectedTemplate.components.variables.forEach((v) => {
        if (!testMessage.variables[v.key]) {
          missingVariables.push(v.key);
        }
      });
    }

    if (missingVariables.length > 0) {
      alert(`Please fill all variables: ${missingVariables.join(", ")}`);
      return;
    }

    // Set sending state
    setTestMessage({
      ...testMessage,
      isSending: true,
      status: null,
    });

    // Mock sending process
    setTimeout(() => {
      // Simulate success
      setTestMessage({
        ...testMessage,
        isSending: false,
        status: {
          success: true,
          messageId: "wamid." + Math.random().toString(36).substring(2, 15),
          timestamp: new Date().toISOString(),
        },
      });
    }, 2000);
  };

  // Generate API code example
  const generateApiExample = () => {
    if (!selectedTemplate) return "";

    // Create variables object
    const variablesObj = {};
    if (selectedTemplate.components.variables) {
      selectedTemplate.components.variables.forEach((v) => {
        variablesObj[v.key] = testMessage.variables[v.key] || v.example;
      });
    }

    // Generate cURL example
    const curlExample = `curl -X POST \\
  '${apiDetails.baseUrl}${apiDetails.apiVersion}/${
      apiDetails.phoneNumberId
    }/messages' \\
  -H 'Authorization: Bearer ${apiDetails.apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "messaging_product": "whatsapp",
    "to": "${testMessage.phoneNumber || "recipient_phone_number"}",
    "type": "template",
    "template": {
      "name": "${selectedTemplate.name}",
      "language": {
        "code": "en_US"
      },
      "components": [
        {
          "type": "body",
          "parameters": [
${Object.entries(variablesObj)
  .map(
    ([key, value]) => `            {
              "type": "text",
              "text": "${value}"
            }`
  )
  .join(",\n")}
          ]
        }
      ]
    }
  }'`;

    // Generate Node.js example
    const nodeExample = `const axios = require('axios');

async function sendWhatsAppMessage() {
  try {
    const response = await axios.post(
      '${apiDetails.baseUrl}${apiDetails.apiVersion}/${
      apiDetails.phoneNumberId
    }/messages',
      {
        messaging_product: "whatsapp",
        to: "${testMessage.phoneNumber || "recipient_phone_number"}",
        type: "template",
        template: {
          name: "${selectedTemplate.name}",
          language: {
            code: "en_US"
          },
          components: [
            {
              type: "body",
              parameters: [
${Object.entries(variablesObj)
  .map(
    ([key, value]) => `                {
                  type: "text",
                  text: "${value}"
                }`
  )
  .join(",\n")}
              ]
            }
          ]
        }
      },
      {
        headers: {
          'Authorization': \`Bearer ${apiDetails.apiKey}\`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

sendWhatsAppMessage();`;

    // Generate PHP example
    const phpExample = `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "${apiDetails.baseUrl}${apiDetails.apiVersion}/${
      apiDetails.phoneNumberId
    }/messages",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    "messaging_product" => "whatsapp",
    "to" => "${testMessage.phoneNumber || "recipient_phone_number"}",
    "type" => "template",
    "template" => [
      "name" => "${selectedTemplate.name}",
      "language" => [
        "code" => "en_US"
      ],
      "components" => [
        [
          "type" => "body",
          "parameters" => [
${Object.entries(variablesObj)
  .map(
    ([key, value]) => `            [
              "type" => "text",
              "text" => "${value}"
            ]`
  )
  .join(",\n")}
          ]
        ]
      ]
    ]
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer ${apiDetails.apiKey}",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`;

    return {
      curl: curlExample,
      node: nodeExample,
      php: phpExample,
    };
  };

  // Get API code examples
  const codeExamples = selectedTemplate ? generateApiExample() : null;

  // Loading state
  if (isLoading) {
    return (
      <div className="api-integration-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading API details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="api-integration-container">
      <h1>WhatsApp API Integration</h1>

      <div className="api-sections">
        {/* API Keys Section */}
        <section className="api-section">
          <h2>API Details</h2>
          <p className="section-description">
            Use these details to connect your systems to the WhatsApp API. Keep
            your API key secure and never share it in client-side code.
          </p>

          <div className="api-keys-info">
            <div className="api-key-item">
              <label>API Key (Bearer Token)</label>
              <div className="masked-input">
                <input type="password" value={apiDetails.apiKey} readOnly />
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiDetails.apiKey)}
                  className="copy-btn"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="api-key-item">
              <label>Phone Number ID</label>
              <div className="input-with-copy">
                <input type="text" value={apiDetails.phoneNumberId} readOnly />
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiDetails.phoneNumberId)}
                  className="copy-btn"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="api-key-item">
              <label>Account ID</label>
              <div className="input-with-copy">
                <input type="text" value={apiDetails.accountId} readOnly />
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiDetails.accountId)}
                  className="copy-btn"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="api-key-item">
              <label>API Version</label>
              <div className="input-with-copy">
                <input type="text" value={apiDetails.apiVersion} readOnly />
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiDetails.apiVersion)}
                  className="copy-btn"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="api-key-item">
              <label>Base URL</label>
              <div className="input-with-copy">
                <input type="text" value={apiDetails.baseUrl} readOnly />
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiDetails.baseUrl)}
                  className="copy-btn"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="api-info-note">
            <p>
              <strong>Note:</strong> These credentials allow access to your
              WhatsApp API account. Never share them publicly or include them in
              client-side code.
            </p>
          </div>
        </section>

        {/* Webhook Setup Section */}
        <section className="api-section">
          <h2>Webhook Setup</h2>
          <p className="section-description">
            Configure your webhook URL to receive incoming messages and status
            updates from WhatsApp. Your server should respond with the challenge
            query parameter for verification.
          </p>

          <div className="webhook-setup">
            <div className="form-group">
              <label htmlFor="webhookUrl">Webhook URL</label>
              <div className="input-with-button">
                <input
                  type="url"
                  id="webhookUrl"
                  value={webhookUrl}
                  onChange={handleWebhookUrlChange}
                  placeholder="https://your-server.com/webhook"
                />
                <button
                  type="button"
                  onClick={verifyWebhook}
                  className="verify-btn"
                  disabled={isVerifying || !webhookUrl}
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </button>
              </div>

              {webhookVerified && (
                <div className="webhook-status verified">
                  ✓ Webhook verified and active
                </div>
              )}
            </div>

            <div className="webhook-code-examples">
              <h3>Webhook Verification Code Examples</h3>

              <div className="code-tabs">
                <div
                  className={`code-tab ${
                    activeWebhookTab === "php" ? "active" : ""
                  }`}
                  onClick={() => setActiveWebhookTab("php")}
                >
                  PHP
                </div>
                <div
                  className={`code-tab ${
                    activeWebhookTab === "node" ? "active" : ""
                  }`}
                  onClick={() => setActiveWebhookTab("node")}
                >
                  Node.js
                </div>
              </div>

              <div
                className={`code-content ${
                  activeWebhookTab === "php" ? "active" : ""
                }`}
              >
                <pre className="code-block">
                  {`<?php
//Check if method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    //Check if query contains the challange parameter
    if (isset($_GET['challange'])) {
        //Get parameter value
        $challenge = $_GET['challange'];
        echo $challenge;
    } else {
        //No Parameter Found
        echo "no challange";
    }
}
?>`}
                </pre>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(`<?php
//Check if method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    //Check if query contains the challange parameter
    if (isset($_GET['challange'])) {
        //Get parameter value
        $challenge = $_GET['challange'];
        echo $challenge;
    } else {
        //No Parameter Found
        echo "no challange";
    }
}
?>`)
                  }
                  className="copy-code-btn"
                >
                  Copy Code
                </button>
              </div>

              <div
                className={`code-content ${
                  activeWebhookTab === "node" ? "active" : ""
                }`}
              >
                <pre className="code-block">
                  {`app.get('/your_webhook_endpoint', (req, res) => {
  try {
    res.send(req.query['challange']);
  } catch (error) {
    res.send(error.message);
  }
});`}
                </pre>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(`app.get('/your_webhook_endpoint', (req, res) => {
  try {
    res.send(req.query['challange']);
  } catch (error) {
    res.send(error.message);
  }
});`)
                  }
                  className="copy-code-btn"
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Test Message Section */}
        <section className="api-section">
          <h2>Send Test Message</h2>
          <p className="section-description">
            Test your WhatsApp API integration by sending a template message.
            Use this to verify your templates and webhook setup.
          </p>

          <div className="test-message-form">
            <div className="form-group">
              <label htmlFor="receiverPhone">Receiver Phone Number</label>
              <input
                type="tel"
                id="receiverPhone"
                value={testMessage.phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Enter with country code (e.g., +1234567890)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="templateSelect">Select Template</label>
              <select
                id="templateSelect"
                onChange={handleTemplateSelect}
                value={selectedTemplate?.id || ""}
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTemplate && (
              <div className="template-variables">
                <h3>Template Variables</h3>

                {selectedTemplate.components.variables.map((variable) => (
                  <div key={variable.key} className="form-group">
                    <label htmlFor={`variable-${variable.key}`}>
                      Variable {"{{"}variable.key{"}}"}
                      <span className="variable-example">
                        (Example: {variable.example})
                      </span>
                    </label>
                    <input
                      type="text"
                      id={`variable-${variable.key}`}
                      value={testMessage.variables[variable.key] || ""}
                      onChange={(e) =>
                        handleVariableChange(variable.key, e.target.value)
                      }
                      placeholder={`Enter value for variable {{${variable.key}}}`}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={sendTestMessage}
                  className="send-test-btn"
                  disabled={testMessage.isSending}
                >
                  {testMessage.isSending ? "Sending..." : "Send Test Message"}
                </button>

                {testMessage.status && testMessage.status.success && (
                  <div className="test-result success">
                    <p>✓ Message sent successfully!</p>
                    <div className="test-details">
                      <div>Message ID: {testMessage.status.messageId}</div>
                      <div>Timestamp: {testMessage.status.timestamp}</div>
                    </div>
                  </div>
                )}

                {testMessage.status && !testMessage.status.success && (
                  <div className="test-result error">
                    <p>✗ Failed to send message</p>
                    <div className="test-details">
                      <div>Error: {testMessage.status.error}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedTemplate && (
            <div className="api-code-examples">
              <h3>API Code Examples</h3>

              <div className="code-tabs">
                <div
                  className={`code-tab ${
                    activeApiTab === "curl" ? "active" : ""
                  }`}
                  onClick={() => setActiveApiTab("curl")}
                >
                  cURL
                </div>
                <div
                  className={`code-tab ${
                    activeApiTab === "node" ? "active" : ""
                  }`}
                  onClick={() => setActiveApiTab("node")}
                >
                  Node.js
                </div>
                <div
                  className={`code-tab ${
                    activeApiTab === "php" ? "active" : ""
                  }`}
                  onClick={() => setActiveApiTab("php")}
                >
                  PHP
                </div>
              </div>

              <div
                className={`code-content ${
                  activeApiTab === "curl" ? "active" : ""
                }`}
              >
                <pre className="code-block">{codeExamples?.curl}</pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(codeExamples?.curl)}
                  className="copy-code-btn"
                >
                  Copy Code
                </button>
              </div>

              <div
                className={`code-content ${
                  activeApiTab === "node" ? "active" : ""
                }`}
              >
                <pre className="code-block">{codeExamples?.node}</pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(codeExamples?.node)}
                  className="copy-code-btn"
                >
                  Copy Code
                </button>
              </div>

              <div
                className={`code-content ${
                  activeApiTab === "php" ? "active" : ""
                }`}
              >
                <pre className="code-block">{codeExamples?.php}</pre>
                <button
                  type="button"
                  onClick={() => copyToClipboard(codeExamples?.php)}
                  className="copy-code-btn"
                >
                  Copy Code
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default APIIntegration;
