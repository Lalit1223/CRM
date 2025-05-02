// src/pages/Payments/Payments.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Payments.css";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [showNewGatewayForm, setShowNewGatewayForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const gateways = [
    { id: "razorpay", name: "Razorpay", icon: "razorpay", connected: true },
    { id: "phonepe", name: "PhonePe", icon: "phonepe", connected: false },
    {
      id: "whatsapp",
      name: "WhatsApp Native Pay",
      icon: "whatsapp",
      connected: true,
    },
    { id: "paypal", name: "PayPal", icon: "paypal", connected: false },
    { id: "stripe", name: "Stripe", icon: "stripe", connected: false },
  ];

  const recentPayments = [
    {
      id: "1",
      customer: "Alex Johnson",
      amount: "₹599.00",
      status: "successful",
      date: "2025-04-18",
      reference: "WAP7845291",
    },
    {
      id: "2",
      customer: "Sarah Williams",
      amount: "₹1,299.00",
      status: "successful",
      date: "2025-04-17",
      reference: "WAP7844581",
    },
    {
      id: "3",
      customer: "Rahul Sharma",
      amount: "₹849.00",
      status: "failed",
      date: "2025-04-17",
      reference: "WAP7844327",
    },
    {
      id: "4",
      customer: "Priya Patel",
      amount: "₹399.00",
      status: "successful",
      date: "2025-04-16",
      reference: "WAP7843819",
    },
    {
      id: "5",
      customer: "Michael Brown",
      amount: "₹999.00",
      status: "successful",
      date: "2025-04-16",
      reference: "WAP7843754",
    },
    {
      id: "6",
      customer: "Emma Wilson",
      amount: "₹149.00",
      status: "pending",
      date: "2025-04-15",
      reference: "WAP7843211",
    },
  ];

  const features = [
    {
      id: "payment-templates",
      title: "Payment Templates",
      icon: "template",
      description: "Create WhatsApp order detail templates for payments",
    },
    {
      id: "payment-gateways",
      title: "Payment Gateways",
      icon: "gateways",
      description: "Connect multiple payment gateways like Razorpay, PhonePe",
    },
    {
      id: "payment-campaigns",
      title: "Payment Campaigns",
      icon: "campaign",
      description: "Send payment request campaigns on WhatsApp",
    },
    {
      id: "bot-integration",
      title: "Bot Integration",
      icon: "bot",
      description: "Send payment requests via WhatsApp bots",
    },
    {
      id: "payment-hooks",
      title: "Payment Webhooks",
      icon: "webhook",
      description: "Setup automated flows after payment success/failure",
    },
    {
      id: "subscriptions",
      title: "Subscriptions",
      icon: "subscription",
      description: "Manage recurring payment models",
    },
  ];

  const templates = [
    {
      id: 1,
      name: "Standard Order Receipt",
      status: "approved",
      type: "order_details",
    },
    {
      id: 2,
      name: "Premium Product Payment",
      status: "approved",
      type: "order_details",
    },
    {
      id: 3,
      name: "Subscription Renewal",
      status: "pending",
      type: "payment_update",
    },
    {
      id: 4,
      name: "Payment Reminder",
      status: "approved",
      type: "payment_request",
    },
  ];

  // Gateway form handling
  const handleAddGateway = () => {
    setShowNewGatewayForm(true);
    setSelectedGateway(null);
  };

  const handleGatewaySubmit = (e) => {
    e.preventDefault();
    // Process gateway connection logic would go here
    setShowNewGatewayForm(false);
    alert(
      "Gateway connection initiated. Please check your email to complete the setup."
    );
  };

  // Template form handling
  const handleAddTemplate = () => {
    setShowTemplateForm(true);
  };

  const handleTemplateSubmit = (e) => {
    e.preventDefault();
    // Process template submission logic would go here
    setShowTemplateForm(false);
    alert(
      "Template submitted for approval. You will be notified once it is approved."
    );
  };

  const getGatewayIcon = (iconName) => {
    switch (iconName) {
      case "razorpay":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#072654"
              stroke="#072654"
              strokeWidth="0.5"
            />
            <path d="M8.4 14.8L11.9 7.8H14.6L11.1 14.8H8.4Z" fill="white" />
          </svg>
        );
      case "phonepe":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#5F259F"
              stroke="#5F259F"
              strokeWidth="0.5"
            />
            <path
              d="M16 8.5L12.5 12H14C14 14.5 11 16 9 14.5L8 16C11.5 18.5 17 16 17 12H18.5L16 8.5Z"
              fill="white"
            />
            <path d="M10 7H7V16H10V7Z" fill="white" />
          </svg>
        );
      case "whatsapp":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#25D366"
              stroke="#25D366"
              strokeWidth="0.5"
            />
            <path
              d="M16.5 14C16.5 15.3807 15.8807 16 14.5 16H9.5C8.11929 16 7.5 15.3807 7.5 14V10C7.5 8.61929 8.11929 8 9.5 8H14.5C15.8807 8 16.5 8.61929 16.5 10V14Z"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M10 12H14"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 10L12 14"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
      case "paypal":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#003087"
              stroke="#003087"
              strokeWidth="0.5"
            />
            <path
              d="M7 11.2L7.6 8H10C11.6 8 12.1 9.3 11.8 10.2C11.3 11.7 10.2 12 8.7 12H7.8L7 15H9L9.4 13H11.6L11 16H7L7 11.2Z"
              fill="white"
            />
            <path
              d="M11 8H13.4C15 8 15.5 9.3 15.2 10.2C14.7 11.7 13.6 12 12.1 12H11.2L10.4 15H12.4L12.8 13H15L14.4 16H10.4L11 8Z"
              fill="#009CDE"
            />
          </svg>
        );
      case "stripe":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#635BFF"
              stroke="#635BFF"
              strokeWidth="0.5"
            />
            <path
              d="M9 13.5L15 10.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M9 10.5L15 13.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getFeatureIcon = (iconName) => {
    switch (iconName) {
      case "template":
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
              stroke="#25D366"
              strokeWidth="2"
            />
            <path d="M3 9H21" stroke="#25D366" strokeWidth="2" />
            <path d="M9 21V9" stroke="#25D366" strokeWidth="2" />
          </svg>
        );
      case "gateways":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="2"
              stroke="#25D366"
              strokeWidth="2"
            />
            <path d="M2 10H22" stroke="#25D366" strokeWidth="2" />
            <path
              d="M6 15H10"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
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
              d="M12 14L8 18H16L12 14Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 3V14"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M5 21H19"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15.5 8C17.5 8 19 6.5 19 4.5C19 7.5 20.5 9 22.5 9C20.5 9 19 10.5 19 12.5C19 10.5 17.5 8 15.5 8Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinejoin="round"
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
              stroke="#25D366"
              strokeWidth="2"
            />
            <path
              d="M8 12H8.01M12 12H12.01M16 12H16.01"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 3L12 7L8 3"
              stroke="#25D366"
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
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M19 12L19 10C19 6.68629 16.3137 4 13 4L11 4"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M20 16L15 20L15 12L20 16Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M4 8L9 4L9 12L4 8Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "subscription":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6V18"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="10" stroke="#25D366" strokeWidth="2" />
            <path
              d="M12 2V4"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 20V22"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M19.0711 4.92893L17.6569 6.34315"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M6.34315 17.6569L4.92893 19.0711"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="payments-page">
      <div className="payments-header">
        <h1>Payments Ecosystem</h1>
        <p>Manage payments, gateways, subscriptions and templates</p>

        <div className="payments-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={activeTab === "gateways" ? "active" : ""}
            onClick={() => setActiveTab("gateways")}
          >
            Gateways
          </button>
          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
          <button
            className={activeTab === "templates" ? "active" : ""}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="payments-overview">
          <div className="payments-stats">
            <div className="stat-card">
              <h3>₹48,920</h3>
              <p>Total Revenue</p>
            </div>
            <div className="stat-card">
              <h3>89</h3>
              <p>Transactions</p>
            </div>
            <div className="stat-card">
              <h3>94.2%</h3>
              <p>Success Rate</p>
            </div>
            <div className="stat-card">
              <h3>3</h3>
              <p>Active Gateways</p>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon success">✓</div>
                <div className="activity-details">
                  <p>
                    Payment received from <strong>Alex Johnson</strong>
                  </p>
                  <span className="activity-meta">₹599.00 • 2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon warning">!</div>
                <div className="activity-details">
                  <p>
                    Payment failed from <strong>Rahul Sharma</strong>
                  </p>
                  <span className="activity-meta">₹849.00 • 5 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon info">i</div>
                <div className="activity-details">
                  <p>
                    New template <strong>"Subscription Renewal"</strong> pending
                    approval
                  </p>
                  <span className="activity-meta">9 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon success">✓</div>
                <div className="activity-details">
                  <p>
                    Payment received from <strong>Sarah Williams</strong>
                  </p>
                  <span className="activity-meta">₹1,299.00 • 1 day ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="payments-features">
            <h2>Payment Features</h2>
            <div className="features-grid">
              {features.map((feature) => (
                <div
                  className="feature-item"
                  key={feature.id}
                  onClick={() => alert(`Navigate to ${feature.title} feature`)}
                >
                  <div className="feature-icon">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "gateways" && (
        <div className="payments-gateways">
          {showNewGatewayForm ? (
            <div className="gateway-form-container">
              <h2>Connect New Payment Gateway</h2>
              <form onSubmit={handleGatewaySubmit}>
                <div className="form-group">
                  <label>Gateway Type</label>
                  <select required>
                    <option value="">Select a gateway</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="phonepe">PhonePe</option>
                    <option value="whatsapp">WhatsApp Pay</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    placeholder="Enter a name for this gateway"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>API Key / Merchant ID</label>
                  <input
                    type="text"
                    placeholder="Enter API key or Merchant ID"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>API Secret / Salt</label>
                  <input
                    type="password"
                    placeholder="Enter API secret or salt"
                    required
                  />
                </div>

                <div className="form-group checkbox">
                  <input type="checkbox" id="isProduction" />
                  <label htmlFor="isProduction">
                    Production Mode (uncheck for testing)
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowNewGatewayForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Connect Gateway
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="gateways-header">
                <h2>Payment Gateways</h2>
                <button className="primary-button" onClick={handleAddGateway}>
                  + Add Gateway
                </button>
              </div>

              <div className="gateway-list">
                {gateways.map((gateway) => (
                  <div className="gateway-item" key={gateway.id}>
                    <div className="gateway-info">
                      <div className="gateway-icon">
                        {getGatewayIcon(gateway.icon)}
                      </div>
                      <div>
                        <h3>{gateway.name}</h3>
                        <span
                          className={`gateway-status ${
                            gateway.connected ? "connected" : "disconnected"
                          }`}
                        >
                          {gateway.connected ? "Connected" : "Not Connected"}
                        </span>
                      </div>
                    </div>
                    <div className="gateway-actions">
                      {gateway.connected && (
                        <button
                          className="icon-button"
                          title="View Transactions"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 20V10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 20V4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6 20V14"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        className="button"
                        onClick={() =>
                          gateway.connected
                            ? setSelectedGateway(gateway.id)
                            : handleAddGateway()
                        }
                      >
                        {gateway.connected ? "Configure" : "Connect"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {selectedGateway && (
                <div className="gateway-details">
                  <h2>Gateway Configuration</h2>
                  <div className="form-group">
                    <label>Webhook URL</label>
                    <div className="copy-input">
                      <input
                        type="text"
                        value="https://your-app.com/api/webhooks/payments"
                        readOnly
                      />
                      <button
                        className="icon-button"
                        onClick={() => alert("Webhook URL copied to clipboard")}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status Callback URL</label>
                    <div className="copy-input">
                      <input
                        type="text"
                        value="https://your-app.com/api/webhooks/payment-status"
                        readOnly
                      />
                      <button
                        className="icon-button"
                        onClick={() => alert("Status URL copied to clipboard")}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    className="secondary-button"
                    onClick={() => setSelectedGateway(null)}
                  >
                    Close
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="payments-transactions">
          <div className="transactions-header">
            <h2>Transaction History</h2>
            <div className="transactions-filters">
              <div className="search-box">
                <input type="text" placeholder="Search transactions..." />
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <select>
                <option value="all">All Statuses</option>
                <option value="successful">Successful</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
              <select>
                <option value="all">All Gateways</option>
                <option value="razorpay">Razorpay</option>
                <option value="phonepe">PhonePe</option>
                <option value="whatsapp">WhatsApp Pay</option>
              </select>
            </div>
          </div>

          <div className="transaction-list">
            <div className="transaction-header">
              <span>Customer</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
              <span>Reference</span>
              <span>Actions</span>
            </div>

            {recentPayments.map((payment) => (
              <div className="transaction-item" key={payment.id}>
                <span className="customer-name">{payment.customer}</span>
                <span className="payment-amount">{payment.amount}</span>
                <span className={`payment-status ${payment.status}`}>
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </span>
                <span className="payment-date">{payment.date}</span>
                <span className="payment-reference">{payment.reference}</span>
                <div className="transaction-actions">
                  <button className="icon-button" title="View Details">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="icon-button" title="Download Receipt">
                    <svg
                      width="18"
                      height="18"
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
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {payment.status === "failed" && (
                    <button className="icon-button" title="Retry Payment">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4V10H7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.51 15C4.15839 16.8404 5.38734 18.4202 7.01166 19.5014C8.63598 20.5826 10.5677 21.1066 12.5157 20.9945C14.4637 20.8824 16.3226 20.1402 17.8121 18.8798C19.3017 17.6194 20.3413 15.909 20.7742 14.0068C21.2072 12.1045 21.0101 10.1124 20.2126 8.33154C19.4152 6.55068 18.0605 5.06926 16.3528 4.13757C14.6451 3.20589 12.6769 2.87088 10.7447 3.18039C8.81245 3.48991 7.02091 4.43127 5.64 5.86"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="payments-templates">
          {showTemplateForm ? (
            <div className="template-form-container">
              <h2>Create Payment Template</h2>
              <form onSubmit={handleTemplateSubmit}>
                <div className="form-group">
                  <label>Template Name</label>
                  <input
                    type="text"
                    placeholder="Enter template name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select required>
                    <option value="">Select category</option>
                    <option value="marketing">Marketing</option>
                    <option value="utility">Utility</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Template Type</label>
                  <select required>
                    <option value="">Select type</option>
                    <option value="order_details">Order Details</option>
                    <option value="payment_request">Payment Request</option>
                    <option value="payment_update">Payment Update</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Header Type</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="headerText"
                        name="headerType"
                        value="text"
                      />
                      <label htmlFor="headerText">Text</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="headerMedia"
                        name="headerType"
                        value="media"
                        defaultChecked
                      />
                      <label htmlFor="headerMedia">Media</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="headerNone"
                        name="headerType"
                        value="none"
                      />
                      <label htmlFor="headerNone">None</label>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Header Media</label>
                  <div className="file-upload">
                    <input type="file" id="headerMedia" accept="image/*" />
                    <label htmlFor="headerMedia" className="file-label">
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
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Body Text</label>
                  <textarea
                    placeholder="Enter template body text. Use {{1}} for product name, {{2}} for price, etc."
                    rows="5"
                    required
                  ></textarea>
                  // Replace the template variables section with this fixed
                  version
                  <div className="template-variables">
                    <p>Available variables:</p>
                    <span className="variable-tag">
                      {"{{1}}"} - Product Name
                    </span>
                    <span className="variable-tag">{"{{2}}"} - Price</span>
                    <span className="variable-tag">{"{{3}}"} - Quantity</span>
                    <span className="variable-tag">{"{{4}}"} - Currency</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Footer Text (Optional)</label>
                  <input type="text" placeholder="Enter footer text" />
                </div>

                <div className="form-group checkbox">
                  <input type="checkbox" id="hasButtons" />
                  <label htmlFor="hasButtons">Add Call-to-Action Buttons</label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowTemplateForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Submit Template
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="templates-header">
                <h2>Payment Templates</h2>
                <button className="primary-button" onClick={handleAddTemplate}>
                  + Create Template
                </button>
              </div>

              <div className="template-list">
                <div className="template-header">
                  <span>Template Name</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>

                {templates.map((template) => (
                  <div className="template-item" key={template.id}>
                    <span className="template-name">{template.name}</span>
                    <span className="template-type">
                      {template.type === "order_details"
                        ? "Order Details"
                        : template.type === "payment_request"
                        ? "Payment Request"
                        : "Payment Update"}
                    </span>
                    <span className={`template-status ${template.status}`}>
                      {template.status.charAt(0).toUpperCase() +
                        template.status.slice(1)}
                    </span>
                    <div className="template-actions">
                      <button className="icon-button" title="View Template">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {template.status === "approved" && (
                        <button className="icon-button" title="Use Template">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 12H19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 5L19 12L12 19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                      <button className="icon-button" title="Edit Template">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="payments-actions">
        <Link to="/payments/send" className="action-button">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Send Payment Request
        </Link>
        <Link to="/payments/campaign" className="action-button primary">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22L12 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 13H7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 18H5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Create Payment Campaign
        </Link>
      </div>
    </div>
  );
};

export default Payments;
