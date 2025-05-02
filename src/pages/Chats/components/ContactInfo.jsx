// src/pages/Chats/components/ContactInfo.jsx
import React, { useState } from "react";
import { formatMessageTime, formatLastSeen } from "../utils/dateFormatters";

const ContactInfo = ({ contact, onClose, onTriggerChatbot, chatNotes }) => {
  const [activeTab, setActiveTab] = useState("info"); // "info", "chatbot", "notes"
  const [selectedBot, setSelectedBot] = useState(null);

  // Sample chatbots - in a real app, these would come from an API
  const availableChatbots = [
    {
      id: "bot1",
      name: "Customer Support Bot",
      description: "Handles general customer inquiries",
    },
    {
      id: "bot2",
      name: "Order Status Bot",
      description: "Helps customers check order status",
    },
    {
      id: "bot3",
      name: "Product Catalog Bot",
      description: "Helps browse and find products",
    },
  ];

  return (
    <div className="contact-info-sidebar">
      <div className="contact-info-header">
        <h3>Contact Information</h3>
        <button className="close-button" onClick={onClose}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Info
        </button>
        <button
          className={`tab ${activeTab === "chatbot" ? "active" : ""}`}
          onClick={() => setActiveTab("chatbot")}
        >
          Chatbot
        </button>
        <button
          className={`tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "info" && (
          <div className="info-tab">
            <div className="contact-avatar-large">
              {contact.profile_pic ? (
                <img src={contact.profile_pic} alt={contact.name} />
              ) : (
                <div className="avatar-placeholder-large">
                  {contact.name.charAt(0)}
                </div>
              )}
            </div>

            <h2 className="contact-name">{contact.name}</h2>

            <div className="contact-data">
              <div className="data-row">
                <span className="label">Phone Number</span>
                <span className="value">{contact.phoneNumber}</span>
              </div>

              <div className="data-row">
                <span className="label">Last Seen</span>
                <span className="value">
                  {formatLastSeen(contact.lastSeen)}
                </span>
              </div>

              <div className="data-row">
                <span className="label">WhatsApp Name</span>
                <span className="value">{contact.name}</span>
              </div>
            </div>

            <div className="custom-fields">
              <h4>Custom Fields</h4>
              <button className="add-field-button">Add New Field</button>

              {/* Sample custom fields - in a real app, these would come from the contact data */}
              <div className="custom-field">
                <span className="field-name">Birthday</span>
                <span className="field-value">Not set</span>
              </div>

              <div className="custom-field">
                <span className="field-name">Address</span>
                <span className="field-value">Not set</span>
              </div>

              <div className="custom-field">
                <span className="field-name">Email</span>
                <span className="field-value">Not set</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="chatbot-tab">
            <h3>Assign Chatbot</h3>
            <p className="chatbot-info">
              Select a chatbot to handle this conversation. The chatbot will
              respond to incoming messages based on its configured flows.
            </p>

            <div className="chatbot-list">
              {availableChatbots.map((bot) => (
                <div
                  key={bot.id}
                  className={`chatbot-item ${
                    selectedBot === bot.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedBot(bot.id)}
                >
                  <div className="chatbot-icon">
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
                  </div>
                  <div className="chatbot-details">
                    <h4>{bot.name}</h4>
                    <p>{bot.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="chatbot-actions">
              <button
                className="assign-button"
                disabled={!selectedBot}
                onClick={() => onTriggerChatbot(false)}
              >
                Assign
              </button>
              <button
                className="assign-trigger-button"
                disabled={!selectedBot}
                onClick={() => onTriggerChatbot(true)}
              >
                Assign & Trigger
              </button>
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="notes-tab">
            <h3>Chat Notes</h3>
            <p className="notes-info">
              Chat notes are only visible to team members and help track
              important information about this contact.
            </p>

            <div className="notes-list">
              {chatNotes.length > 0 ? (
                chatNotes.map((note) => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <span className="note-author">{note.author}</span>
                      <span className="note-time">
                        {formatMessageTime(note.timestamp)}
                      </span>
                    </div>
                    <p className="note-content">{note.content}</p>
                  </div>
                ))
              ) : (
                <p className="no-notes">No notes for this contact yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
