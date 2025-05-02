// src/pages/Channels/WhatsAppAPISetup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WhatsAppAPISetup.css";

const WhatsAppAPISetup = () => {
  const navigate = useNavigate();
  const [setupMode, setSetupMode] = useState("new"); // "new", "migrate", "stuck"
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currency: "",
    accountName: "",
    category: "",
    phoneNumber: "",
    verificationCode: "",
    channelName: "",
    channelColor: "#25D366",
    pin: "",
  });

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle next step
  const handleNextStep = () => {
    setStep(step + 1);
  };

  // Handle previous step
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data, make API calls to register the number
    // Show success message and redirect to channel management
    navigate("/channels");
  };

  return (
    <div className="whatsapp-api-setup-container">
      <h1>Set Up WhatsApp API</h1>

      {/* Setup Mode Selection */}
      <div className="setup-mode-selector">
        <button
          className={setupMode === "new" ? "active" : ""}
          onClick={() => setSetupMode("new")}
        >
          Register New Number
        </button>
        <button
          className={setupMode === "migrate" ? "active" : ""}
          onClick={() => setSetupMode("migrate")}
        >
          Migrate Existing Number
        </button>
        <button
          className={setupMode === "stuck" ? "active" : ""}
          onClick={() => setSetupMode("stuck")}
        >
          Migration Stuck
        </button>
      </div>

      {/* Multi-step Form */}
      <div className="setup-form">
        {setupMode === "new" && (
          <>
            {step === 1 && (
              <div className="form-step">
                <h2>Step 1: Account Setup</h2>
                <div className="form-group">
                  <label>WABA Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="">Select Currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                    {/* Add more currencies */}
                  </select>
                </div>
                <button onClick={handleNextStep} className="next-btn">
                  Connect with Facebook
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h2>Step 2: Business Information</h2>
                <div className="form-group">
                  <label>WhatsApp Account Name</label>
                  <input
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="Enter your brand or business name"
                  />
                </div>
                <div className="form-group">
                  <label>Business Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option value="retail">Retail</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="finance">Finance</option>
                    {/* Add more categories */}
                  </select>
                </div>
                <div className="form-actions">
                  <button onClick={handlePrevStep} className="back-btn">
                    Back
                  </button>
                  <button onClick={handleNextStep} className="next-btn">
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h2>Step 3: Phone Verification</h2>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number with country code"
                  />
                </div>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    placeholder="Enter verification code"
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handlePrevStep} className="back-btn">
                    Back
                  </button>
                  <button onClick={handleNextStep} className="next-btn">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="form-step">
                <h2>Step 4: Channel Setup</h2>
                <div className="form-group">
                  <label>Channel Name</label>
                  <input
                    type="text"
                    name="channelName"
                    value={formData.channelName}
                    onChange={handleChange}
                    placeholder="Enter channel name"
                  />
                </div>
                <div className="form-group">
                  <label>Channel Color</label>
                  <input
                    type="color"
                    name="channelColor"
                    value={formData.channelColor}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handlePrevStep} className="back-btn">
                    Back
                  </button>
                  <button onClick={handleNextStep} className="next-btn">
                    Create Channel
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="form-step">
                <h2>Step 5: Two-Factor Authentication</h2>
                <div className="form-group">
                  <label>Six-Digit PIN</label>
                  <input
                    type="password"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    placeholder="Enter 6-digit PIN"
                    maxLength={6}
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handlePrevStep} className="back-btn">
                    Back
                  </button>
                  <button onClick={handleSubmit} className="submit-btn">
                    Register PIN
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Migration mode */}
        {setupMode === "migrate" && (
          <div className="migration-instructions">
            <h2>Migrate an Existing Number</h2>
            <p>
              Follow these steps to migrate your number from another provider:
            </p>
            <ol>
              <li>
                Ensure you have access to the same Meta Business Account linked
                to your WhatsApp API number.
              </li>
              <li>
                Disable two-step verification for your number in the WhatsApp
                Manager.
              </li>
              <li>
                You will receive an OTP via SMS or voice call to your WhatsApp
                API number as part of the verification process.
              </li>
              <li>
                Your templates and green tick (if any) will be migrated, but
                you'll need to reconfigure some settings after migration.
              </li>
            </ol>
            <div className="note">
              <strong>Important:</strong> Your templates will be transferred
              with a 99% success rate and any green tick will remain intact
              post-migration.
            </div>
            <button onClick={handleNextStep} className="next-btn">
              Start Migration Process
            </button>
          </div>
        )}

        {/* Migration stuck mode */}
        {setupMode === "stuck" && (
          <div className="stuck-migration-instructions">
            <h2>Migration Stuck?</h2>
            <p>
              If your migration is stuck or you're experiencing errors, follow
              these steps:
            </p>
            <ol>
              <li>
                Delete the number from WhatsApp API (note: all existing
                templates will be lost)
              </li>
              <li>Permanently disable the existing channel</li>
              <li>Register the WhatsApp API number as new</li>
            </ol>
            <div className="note">
              <strong>Warning:</strong> This process will remove any verified
              status, such as the green tick, and all templates will be lost.
            </div>
            <button onClick={handleNextStep} className="next-btn">
              Continue with Troubleshooting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppAPISetup;
