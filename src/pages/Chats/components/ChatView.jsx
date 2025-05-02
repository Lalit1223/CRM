// src/pages/Chats/components/ChatView.jsx
import React, { useState, useRef, useEffect } from "react";
import { formatMessageTime, formatFullDate } from "../utils/dateFormatters";
import {
  groupMessagesByDate,
  canSendMessage,
  getMessageInputPlaceholder,
  needsTemplateMessage,
} from "../utils/chatUtils";
import TemplateMessageSelector from "./TemplateMessageSelector";

const ChatView = ({
  chat,
  onSendMessage,
  onToggleContactInfo,
  onAddChatNote,
  onMarkAsDone,
  onShowCannedReplies,
  currentUser,
  chatNotes,
}) => {
  const [message, setMessage] = useState("");
  const [showChatNoteInput, setShowChatNoteInput] = useState(false);
  const [chatNote, setChatNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [chat.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && canSendMessage(chat)) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleAddChatNote = (e) => {
    e.preventDefault();
    if (chatNote.trim()) {
      onAddChatNote(chatNote);
      setChatNote("");
      setShowChatNoteInput(false);
    }
  };

  const handleSendTemplateMessage = (template) => {
    if (!template) return;

    // For text templates
    if (template.type === "text") {
      onSendMessage(template.content);
    }
    // For button templates
    else if (template.type === "buttons") {
      const messageContent = [
        template.header,
        template.body,
        template.footer,
        "---",
        template.buttons.map((btn) => `• ${btn.text}`).join("\n"),
      ]
        .filter(Boolean)
        .join("\n");

      onSendMessage(messageContent);
    }

    setShowTemplateSelector(false);
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(chat.messages);

  return (
    <div className="chat-view">
      <div className="chat-header">
        <div className="contact-info">
          <div className="contact-avatar">
            {chat.contact.profile_pic ? (
              <img src={chat.contact.profile_pic} alt={chat.contact.name} />
            ) : (
              <div className="avatar-placeholder">
                {chat.contact.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="contact-details">
            <h3>{chat.contact.name}</h3>
            <p className="phone-number">{chat.contact.phoneNumber}</p>
          </div>
        </div>

        <div className="chat-actions">
          <button
            className="notes-button"
            onClick={() => setShowNotes(!showNotes)}
            title="Chat Notes"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9 12H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M9 16H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            className="info-button"
            onClick={onToggleContactInfo}
            title="Contact Info"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 16V11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
          </button>

          <button
            className="more-button"
            onClick={onMarkAsDone}
            title="Mark as Done"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 6H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 18H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {showNotes && (
        <div className="chat-notes-panel">
          <h3>Chat Notes</h3>
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
              <p className="no-notes">No notes yet</p>
            )}
          </div>
        </div>
      )}

      <div className="messages-container">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="message-group">
            <div className="date-divider">
              <span>{formatFullDate(groupedMessages[date][0].timestamp)}</span>
            </div>

            {groupedMessages[date].map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender === "agent" ? "sent" : "received"
                }`}
              >
                <div className="message-content">
                  {msg.sender === "agent" && msg.agentName && (
                    <div className="agent-name">{msg.agentName}</div>
                  )}
                  <p>{msg.content}</p>
                  <span className="message-time">
                    {formatMessageTime(msg.timestamp)}
                  </span>

                  {msg.sender === "agent" && (
                    <span className={`status-indicator ${msg.status}`}>
                      {msg.status === "sent" && "✓"}
                      {msg.status === "delivered" && "✓✓"}
                      {msg.status === "read" && "✓✓"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showChatNoteInput ? (
        <form className="chat-note-form" onSubmit={handleAddChatNote}>
          <textarea
            value={chatNote}
            onChange={(e) => setChatNote(e.target.value)}
            placeholder="Add a note (only visible to team members)..."
            className="chat-note-input"
          />
          <div className="note-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setShowChatNoteInput(false);
                setChatNote("");
              }}
            >
              Cancel
            </button>
            <button type="submit" className="send-button">
              Add Note
            </button>
          </div>
        </form>
      ) : needsTemplateMessage(chat) ? (
        // When template message is needed, show a more prominent template button
        <div className="template-message-form">
          <div className="template-message-notice">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            <span>24-hour window has passed. Use a template message.</span>
          </div>
          <button
            className="template-message-button"
            onClick={() => setShowTemplateSelector(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M4 9h16" stroke="currentColor" strokeWidth="2" />
              <path
                d="M8 14h.01M12 14h.01M16 14h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Send Template Message
          </button>
        </div>
      ) : (
        // Regular message form
        <form className="message-form" onSubmit={handleSendMessage}>
          <div className="message-input-actions">
            <button
              type="button"
              className="canned-replies-button"
              onClick={onShowCannedReplies}
              title="Canned Replies"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 10H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M8 14H12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3 19L5 5H19L21 19L12 22L3 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="note-button"
              onClick={() => setShowChatNoteInput(true)}
              title="Add Note"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={getMessageInputPlaceholder(chat)}
            className="message-input"
            disabled={!canSendMessage(chat)}
          />

          <button
            type="submit"
            className="send-button"
            disabled={!message.trim() || !canSendMessage(chat)}
          >
            <svg
              width="20"
              height="20"
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
          </button>
        </form>
      )}

      {/* Template Message Selector Modal */}
      {showTemplateSelector && (
        <div className="template-selector-modal">
          <TemplateMessageSelector
            onSelectTemplate={handleSendTemplateMessage}
            onClose={() => setShowTemplateSelector(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatView;
