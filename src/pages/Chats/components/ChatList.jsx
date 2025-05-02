// src/pages/Chats/components/ChatList.jsx
import React, { useState } from "react";
import { formatChatTime } from "../utils/dateFormatters";

const ChatList = ({ chats, selectedChatId, onChatSelect, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      chat.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.contact.phoneNumber.includes(searchQuery)
  );

  return (
    <div
      className="chat-list1"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "0",
      }}
    >
      <div
        className="search-container1"
        style={{
          marginBottom: "0",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div
        className="chats1"
        style={{ flex: 1, overflow: "auto", marginTop: "0", paddingTop: "0" }}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item1 ${
                selectedChatId === chat.id ? "selected" : ""
              } ${chat.unreadCount > 0 ? "unread" : ""}`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="chat-avatar1">
                {chat.contact.profile_pic ? (
                  <img src={chat.contact.profile_pic} alt={chat.contact.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {chat.contact.name.charAt(0)}
                  </div>
                )}
                {chat.status === "active" && (
                  <span className="status-dot"></span>
                )}
              </div>

              <div className="chat-details">
                <div className="chat-header">
                  <h3 className="contact-name">{chat.contact.name}</h3>
                  <span className="time">
                    {formatChatTime(chat.lastMessageTime)}
                  </span>
                </div>

                <div className="chat-preview">
                  <p className="last-message">{chat.lastMessage}</p>

                  {chat.unreadCount > 0 && (
                    <span className="unread-badge">{chat.unreadCount}</span>
                  )}
                </div>

                <div className="chat-meta">
                  {!chat.assignedTo && (
                    <span className="unassigned-tag">Unassigned</span>
                  )}
                  {chat.assignedTo === currentUser.id && (
                    <span className="assigned-tag">Assigned to you</span>
                  )}
                  {chat.assignedTo && chat.assignedTo !== currentUser.id && (
                    <span className="assigned-to-other-tag">Assigned</span>
                  )}
                  {chat.hasChatbot && (
                    <span className="chatbot-tag">Chatbot</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-chats">
            <p>No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
