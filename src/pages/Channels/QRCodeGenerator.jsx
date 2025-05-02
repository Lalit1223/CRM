// src/pages/Channels/QRCodeGenerator.jsx

import React, { useState } from "react";
import "./QRCodeGenerator.css";

const QRCodeGenerator = () => {
  const [message, setMessage] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Generate QR code
  const generateQRCode = () => {
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsGenerating(true);
    setError("");

    // In a real implementation, this would be an API call that returns the QR code URL
    // For this example, we're using a public QR code generator API
    setTimeout(() => {
      setQrCodeUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          `https://wa.me/918380852111?text=${encodeURIComponent(message)}`
        )}`
      );
      setIsGenerating(false);
    }, 1500);
  };

  // Reset form
  const resetForm = () => {
    setMessage("");
    setQrCodeUrl("");
    setError("");
  };

  // Download QR code
  const downloadQRCode = () => {
    fetch(qrCodeUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "whatsapp-qr-code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Error downloading QR code:", err);
        setError("Failed to download QR code. Please try again.");
      });
  };

  return (
    <div className="qr-code-generator-container">
      <h1>WhatsApp QR Code Generator</h1>

      <div className="qr-code-description">
        <p>
          Create a dynamic QR code that, when scanned, will send a message to
          your WhatsApp number. This QR code can be shared on social media,
          printed materials, or your website.
        </p>
        <p>
          <strong>Note:</strong> You can edit the message later without needing
          to regenerate the QR code.
        </p>
      </div>

      <div className="qr-code-form">
        <div className="form-group">
          <label htmlFor="message">
            Message to send when QR code is scanned
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message (e.g., 'Hi, I'm interested in your services')"
            rows="4"
            maxLength="1000"
          ></textarea>
          <div className="character-count">{message.length}/1000</div>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="reset-btn"
            onClick={resetForm}
            disabled={isGenerating || (!message && !qrCodeUrl)}
          >
            Reset
          </button>
          <button
            type="button"
            className="generate-btn"
            onClick={generateQRCode}
            disabled={isGenerating || !message.trim()}
          >
            {isGenerating ? "Generating..." : "Generate QR Code"}
          </button>
        </div>
      </div>

      {qrCodeUrl && (
        <div className="qr-code-result">
          <h2>Your WhatsApp QR Code</h2>

          <div className="qr-code-image-container">
            <img
              src={qrCodeUrl}
              alt="WhatsApp QR Code"
              className="qr-code-image"
            />
          </div>

          <div className="qr-code-actions">
            <button
              type="button"
              className="download-btn"
              onClick={downloadQRCode}
            >
              Download QR Code
            </button>
            <button
              type="button"
              className="test-btn"
              onClick={() =>
                window.open(
                  `https://wa.me/918380852111?text=${encodeURIComponent(
                    message
                  )}`,
                  "_blank"
                )
              }
            >
              Test QR Code
            </button>
          </div>

          <div className="qr-code-usage">
            <h3>How to Use This QR Code</h3>
            <ol>
              <li>Download the QR code image</li>
              <li>
                Share it on your marketing materials, website, or social media
              </li>
              <li>
                When customers scan it, they'll be directed to your WhatsApp
                with the pre-filled message
              </li>
              <li>
                You can edit the message anytime without needing to regenerate
                the QR code
              </li>
            </ol>
          </div>
        </div>
      )}

      <div className="qr-code-examples">
        <h3>QR Code Use Cases</h3>
        <div className="example-cards">
          <div className="example-card">
            <div className="example-icon product-catalog"></div>
            <h4>Product Catalog</h4>
            <p>
              Create QR codes for specific products that open WhatsApp with
              pre-filled product inquiries
            </p>
          </div>
          <div className="example-card">
            <div className="example-icon store-front"></div>
            <h4>Store Front</h4>
            <p>
              Place QR codes at your physical location for quick customer
              support or information
            </p>
          </div>
          <div className="example-card">
            <div className="example-icon marketing"></div>
            <h4>Marketing Materials</h4>
            <p>
              Add QR codes to brochures, business cards, and promotional
              materials
            </p>
          </div>
          <div className="example-card">
            <div className="example-icon support"></div>
            <h4>Customer Support</h4>
            <p>
              Generate a QR code that pre-fills specific support requests to
              streamline assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
