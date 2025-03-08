// src/pages/Chats/Chats.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Send,
  Paperclip,
  Smile,
  Video,
  ArrowLeft,
  CheckCircle,
  Clock,
  MessageSquare,
  User,
  Users,
  Info,
  Phone,
  MoreVertical,
  Link,
  Edit,
} from "lucide-react";
import "./Chats.css";

const Chats = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState("all-chats");
  const [expandedFolder, setExpandedFolder] = useState("all-chats");
  const messageInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Status tabs
  const statusTabs = [
    { id: "all", label: "All" },
    { id: "not-contacted", label: "Not contacted" },
    { id: "call-back", label: "Call Back" },
    { id: "meeting-fixed", label: "Meeting fixed" },
    { id: "meeting-done", label: "Meeting Done", count: 3 },
    { id: "prospect", label: "Prospect", count: 2 },
    { id: "closed", label: "Closed" },
    { id: "junk", label: "Junk" },
    { id: "icp-not-interested", label: "Not Interested", count: 1 },
    { id: "not-contacted-2", label: "Not Contacted", count: 1 },
    { id: "junk-lead", label: "Junk Lead", count: 7 },
  ];

  // Sample chat data
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Aman Gupta",
      status: "active",
      lastMessage: "You can watch the video",
      timestamp: "04:04 pm",
      msgStatus: "sent",
      businessName: "BOAT",
      profileInitial: "R",
      hasVideo: true,
      unread: 0,
      messages: [
        {
          id: 1,
          text: "will get back to you soon.",
          sender: "contact",
          time: "04:02 pm",
          isAutoReply: true,
        },
        {
          id: 2,
          text: "Aman Gupta\nWe DESIGN your DREAM\nHave Chai? : 450960838\naman.gupta@boat.com\nhttps://www.boat.com",
          sender: "contact",
          time: "04:02 pm",
          isBusiness: true,
        },
        {
          id: 3,
          text: "Hello Aman 👋 We hope you enjoyed our WhatsApp...",
          sender: "user",
          time: "04:03 pm",
        },
        {
          id: 4,
          text: "Watch video",
          sender: "user",
          time: "04:03 pm",
          isVideo: true,
        },
      ],
      details: {
        customerName: "Aman",
        whatsappName: "Guptaji",
        phone: "+9196738",
        agent: "LG agent",
        agentPhone: "+92787383",
        leadStatus: "Select",
        category: "CORPORATE FINANCE",
      },
    },
    {
      id: 2,
      name: "Amaan Khan",
      status: "active",
      lastMessage: "Watch video",
      timestamp: "04:04 pm",
      msgStatus: "new",
      profileInitial: "A",
      hasVideo: true,
      unread: 2,
      messages: [
        { id: 1, text: "Hi there!", sender: "contact", time: "04:00 pm" },
        {
          id: 2,
          text: "Watch video",
          sender: "user",
          time: "04:04 pm",
          isVideo: true,
        },
      ],
    },
    {
      id: 3,
      name: "Sanjeev",
      status: "active",
      lastMessage: "Thank you for contacting",
      timestamp: "04:04 pm",
      msgStatus: "sent",
      profileInitial: "S",
      unread: 1,
      messages: [
        {
          id: 1,
          text: "Thank you for contacting",
          sender: "user",
          time: "04:04 pm",
        },
      ],
    },
    {
      id: 4,
      name: "Abhay",
      status: "inactive",
      lastMessage: "Did not attend",
      timestamp: "04:03 pm",
      msgStatus: "failed",
      profileInitial: "A",
      unread: 4,
      messages: [
        { id: 1, text: "Did not attend", sender: "user", time: "04:03 pm" },
      ],
    },
    {
      id: 5,
      name: "Kavya",
      status: "active",
      lastMessage: "Ya",
      timestamp: "04:03 pm",
      msgStatus: "read",
      profileInitial: "K",
      unread: 1,
      messages: [{ id: 1, text: "Ya", sender: "user", time: "04:03 pm" }],
    },
    {
      id: 6,
      name: "Ajit kumar",
      status: "active",
      lastMessage: "Watch video",
      timestamp: "04:03 pm",
      msgStatus: "delivered",
      profileInitial: "A",
      hasVideo: true,
      unread: 1,
      messages: [
        {
          id: 1,
          text: "Watch video",
          sender: "user",
          time: "04:03 pm",
          isVideo: true,
        },
      ],
    },
  ]);

  // Navigation folders
  const folderItems = [
    {
      id: "all-chats",
      label: "All chats",
      icon: <MessageSquare size={18} />,
      subfolders: [
        { id: "all", label: "All", count: 453 },
        { id: "awaiting-reply", label: "Awaiting reply", count: 11 },
        { id: "unread", label: "Unread", count: 15 },
        { id: "closed", label: "Closed", count: 375 },
        { id: "open", label: "Open", count: 78 },
      ],
    },
    // {
    //   id: "my-chats",
    //   label: "My chats",
    //   icon: <User size={18} />,
    // },
    // {
    //   id: "sla-breached",
    //   label: "SLA breached",
    //   icon: <Clock size={18} />,
    // },
    // {
    //   id: "unassigned",
    //   label: "Unassigned",
    //   icon: <Users size={18} />,
    // },
  ];

  // Filter chats based on selected folder
  const getFilteredChats = () => {
    switch (selectedTab) {
      case "all":
        return chats;
      case "unread":
        return chats.filter((c) => c.unread > 0);
      case "meeting-done":
        return chats.filter((c) => c.details?.leadStatus === "Meeting Done");
      default:
        return chats;
    }
  };

  const filteredChats = getFilteredChats();

  // Scroll to bottom of messages when chat changes
  useEffect(() => {
    if (messagesContainerRef.current && selectedChat) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [selectedChat]);

  // Clear unread count when chat is selected
  useEffect(() => {
    if (selectedChat) {
      const updatedChats = chats.map((chat) => {
        if (chat.id === selectedChat.id) {
          return { ...chat, unread: 0 };
        }
        return chat;
      });
      setChats(updatedChats);
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (message.trim() === "" || !selectedChat) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create a new message
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "user",
      time: timeString,
    };

    // Update the chats state
    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: message,
          timestamp: timeString,
          msgStatus: "sent",
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat(updatedChats.find((c) => c.id === selectedChat.id));
    setMessage("");

    // Focus back on the input
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolder(expandedFolder === folderId ? null : folderId);
    setActiveView(folderId);
  };

  return (
    <div className="whatsapp-crm">
      {/* Header with tabs */}
      <div className="crm-header">
        <div className="tabs-wrapper">
          <div className="tabs-container">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${selectedTab === tab.id ? "active" : ""}`}
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="tab-count">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="crm-container">
        {/* 1. Left Navigation Sidebar */}
        <div className="crm-sidebar">
          <div className="view-header">
            <div className="view-title">
              <span>Inbox</span>
              <button className="icon-button small">
                <Info size={16} />
              </button>
            </div>
            <div className="view-tools">
              <div className="search-container">
                <input type="text" placeholder="Search..." />
                <Search size={16} className="search-icon" />
              </div>
            </div>
          </div>

          <div className="folder-container">
            {folderItems.map((folder) => (
              <div
                key={folder.id}
                className={`folder ${activeView === folder.id ? "active" : ""}`}
              >
                <div
                  className="folder-header"
                  onClick={() => toggleFolder(folder.id)}
                >
                  <div className="folder-icon">{folder.icon}</div>
                  <div className="folder-label">{folder.label}</div>
                  <ChevronDown
                    size={16}
                    className={`folder-arrow ${
                      expandedFolder === folder.id ? "expanded" : ""
                    }`}
                  />
                </div>

                {expandedFolder === folder.id && folder.subfolders && (
                  <div className="subfolder-list">
                    {folder.subfolders.map((subfolder) => (
                      <div
                        key={subfolder.id}
                        className={`subfolder ${
                          activeView === subfolder.id ? "active" : ""
                        }`}
                        onClick={() => setActiveView(subfolder.id)}
                      >
                        <div className="subfolder-label">{subfolder.label}</div>
                        <div className="subfolder-count">{subfolder.count}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Chat List */}
        <div className="chat-list">
          <button className="filter-button ">All chats</button>

          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${
                selectedChat?.id === chat.id ? "active" : ""
              } ${chat.unread > 0 ? "unread" : ""}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className={`chat-avatar ${chat.status}`}>
                {chat.profileInitial}
                {chat.status === "active" && <div className="status-dot"></div>}
              </div>

              <div className="chat-content">
                <div className="chat-info">
                  <div className="chat-name">{chat.name}</div>
                  <div className="chat-time">{chat.timestamp}</div>
                </div>

                <div className="chat-preview">
                  <div className="preview-text">
                    {chat.hasVideo && (
                      <Video size={14} className="preview-icon" />
                    )}
                    <span>{chat.lastMessage}</span>
                  </div>

                  <div className="chat-status">
                    {chat.unread > 0 && (
                      <div className="unread-badge">{chat.unread}</div>
                    )}
                    {chat.msgStatus === "sent" && (
                      <CheckCircle size={14} className="status-icon sent" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Active Chat */}
        <div className="chat-area">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="contact-info">
                  <div className="contact-name">{selectedChat.name}</div>
                  {selectedChat.businessName && (
                    <div className="business-name">
                      {selectedChat.businessName}
                    </div>
                  )}
                </div>

                <div className="chat-actions">
                  <button className="icon-button">
                    <Link size={18} />
                  </button>
                  <button className="icon-button">
                    <Edit size={18} />
                  </button>
                  <button className="icon-button">
                    <CheckCircle size={18} />
                  </button>
                  <button className="icon-button">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Message Area */}
              <div className="messages-container" ref={messagesContainerRef}>
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${
                      msg.sender === "user" ? "sent" : "received"
                    } ${msg.isAutoReply ? "auto-reply" : ""} ${
                      msg.isBusiness ? "business-info" : ""
                    }`}
                  >
                    <div className="message-content">
                      {msg.isVideo ? (
                        <div className="video-preview">
                          <Video size={24} />
                          <span>Watch video</span>
                        </div>
                      ) : (
                        <div className="message-text">
                          {msg.sender === "user" && (
                            <span className="sender-label">You</span>
                          )}
                          {msg.sender === "user" && <br />}
                          {msg.text}
                        </div>
                      )}
                      <div className="message-meta">
                        <span className="message-time">{msg.time}</span>
                        {msg.sender === "user" && (
                          <CheckCircle size={14} className="status-icon" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="system-message agent-assignment">
                  Lalit assigned conversation to self
                </div>

                <div className="system-message response-timer">
                  <Clock size={16} />
                  <span>Response due in 59 minutes</span>
                </div>
              </div>

              {/* Message Input */}
              <div className="message-input">
                <div className="input-actions">
                  <button className="icon-button">
                    <Smile size={20} />
                  </button>
                  <button className="icon-button">
                    <Paperclip size={20} />
                  </button>
                </div>

                <div className="text-input">
                  <textarea
                    ref={messageInputRef}
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  ></textarea>
                </div>

                <button
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <MessageSquare size={48} />
              <h3>Select a conversation to start messaging</h3>
            </div>
          )}
        </div>

        {/* 4. Customer Details Panel */}
        {selectedChat && (
          <div className="details-panel">
            <div className="panel-tabs">
              <button className="panel-tab active">Details</button>
              <button className="panel-tab">Notes</button>
            </div>

            <div className="customer-details">
              <div className="detail-section">
                <div className="detail-label">Customer name</div>
                <div className="detail-value">
                  {selectedChat.details?.customerName || selectedChat.name}
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-label">Name on WhatsApp</div>
                <div className="detail-value">
                  {selectedChat.details?.whatsappName || selectedChat.name}
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-label">Phone number</div>
                <div className="detail-value phone">
                  {selectedChat.details?.phone || "+919876543210"}
                  <div className="contact-actions">
                    <a
                      href={`tel:${selectedChat.details?.phone}`}
                      className="action-link phone"
                    >
                      <Phone size={16} />
                    </a>
                    <a
                      href={`https://wa.me/${selectedChat.details?.phone?.replace(
                        "+",
                        ""
                      )}`}
                      className="action-link whatsapp"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-label">
                  {selectedChat.details?.agent || "Agent"}
                </div>
                <div className="detail-value phone">
                  {selectedChat.details?.agentPhone || "+9100000000"}
                  <div className="contact-actions">
                    <a
                      href={`tel:${selectedChat.details?.agentPhone}`}
                      className="action-link phone"
                    >
                      <Phone size={16} />
                    </a>
                    <a
                      href={`https://wa.me/${selectedChat.details?.agentPhone?.replace(
                        "+",
                        ""
                      )}`}
                      className="action-link whatsapp"
                    >
                      <MessageSquare size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-label">Lead Status</div>
                <div className="select-container">
                  <select>
                    <option value="" disabled selected>
                      Select
                    </option>
                    <option>Hot Lead</option>
                    <option>Cold Lead</option>
                    <option>Prospect</option>
                    <option>Customer</option>
                  </select>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-label">
                  {selectedChat.details?.category || "Category"}
                </div>
                <div className="select-container">
                  <select>
                    <option value="" disabled selected>
                      Select
                    </option>
                    <option>Banking</option>
                    <option>Insurance</option>
                    <option>Investment</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
