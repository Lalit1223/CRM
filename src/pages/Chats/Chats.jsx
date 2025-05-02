// src/pages/Chats/Chats.jsx
import React, { useState, useEffect } from "react";
import "./Chats.css";
import ChatList from "./components/ChatList";
import ChatView from "./components/ChatView";
import ContactInfo from "./components/ContactInfo";
import img from "../../assets/favicon.jpg";
import {
  getFilteredChats,
  canSendMessage,
  createNewMessage,
  createChatNote,
} from "./utils/chatUtils";

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mine"); // "mine" or "all"
  const [chatNotes, setChatNotes] = useState({});
  const [showCannedReplies, setShowCannedReplies] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "user123",
    name: "Lalit Gandhi",
    role: "Manager",
  });

  // Sample data - replace with API calls
  const sampleChats = [
    {
      id: "chat1",
      contact: {
        id: "contact1",
        name: "John Doe",
        phoneNumber: "+919876543210",
        profile_pic: `${img}`,
        lastSeen: "2025-04-01T10:30:00Z",
      },
      messages: [
        {
          id: "msg1",
          content: "Hello, I need help with my order",
          timestamp: "2025-04-01T09:30:00Z",
          sender: "customer",
          status: "read",
        },
        {
          id: "msg2",
          content:
            "Sure, I'd be happy to help. Can you provide your order number?",
          timestamp: "2025-04-01T09:3:00Z",
          sender: "agent",
          status: "delivered",
          agentName: "Lalit Gandhi",
        },
      ],
      unreadCount: 0,
      lastMessage:
        "Sure, I'd be happy to help. Can you provide your order number?",
      lastMessageTime: "2023-04-01T09:32:00Z",
      status: "active",
      assignedTo: "user123",
    },
    {
      id: "chat2",
      contact: {
        id: "contact2",
        name: "Jane Smith",
        phoneNumber: "+919876543211",
        profile_pic: "https://images.app.goo.gl/MFAVypaD57DM3idC7",
        lastSeen: "2023-04-01T08:45:00Z",
      },
      messages: [
        {
          id: "msg3",
          content: "I want to know about your pricing",
          timestamp: "2023-04-01T08:30:00Z",
          sender: "customer",
          status: "read",
        },
      ],
      unreadCount: 1,
      lastMessage: "I want to know about your pricing",
      lastMessageTime: "2023-04-01T08:30:00Z",
      status: "active",
      assignedTo: null,
    },
  ];

  const sampleCannedReplies = [
    {
      id: "canned1",
      title: "Welcome Message",
      messageType: "text",
      content: "Thank you for contacting us. How can I assist you today?",
    },
    {
      id: "canned2",
      title: "Support",
      messageType: "buttons",
      header: "Support Options",
      body: "Please select one of the following options:",
      footer: "Thank you for choosing our service",
      buttons: [
        { label: "CRM Automations", id: "btn1" },
        { label: "Inbox", id: "btn2" },
      ],
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch chats
    const fetchChats = async () => {
      try {
        // Replace with actual API call
        setTimeout(() => {
          setChats(sampleChats);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatSelect = (chatId) => {
    const selected = chats.find((chat) => chat.id === chatId);

    // If chat is unassigned, assign it to current user
    if (selected && !selected.assignedTo) {
      const updatedChat = { ...selected, assignedTo: currentUser.id };
      setChats((prevChats) =>
        prevChats.map((chat) => (chat.id === chatId ? updatedChat : chat))
      );
      setSelectedChat(updatedChat);
    } else {
      setSelectedChat(selected);
    }

    // If a chat with unread messages is selected, mark it as read
    if (selected && selected.unreadCount > 0) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    }
  };

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  const handleSendMessage = (message) => {
    if (!selectedChat || !canSendMessage(selectedChat)) return;

    // Create a new message object
    const newMessage = createNewMessage(message, "agent", currentUser.name);

    // Update the selected chat with the new message
    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
      lastMessage: message,
      lastMessageTime: new Date().toISOString(),
    };

    setSelectedChat(updatedChat);

    // Update chats list
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id ? updatedChat : chat
      )
    );
  };

  const handleAddChatNote = (chatId, note) => {
    // Add note to chat notes
    setChatNotes((prev) => ({
      ...prev,
      [chatId]: [
        ...(prev[chatId] || []),
        createChatNote(note, currentUser.name),
      ],
    }));
  };

  const handleMarkAsDone = (chatId) => {
    // Mark chat as done
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, status: "done" } : chat
      )
    );

    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat((prev) => ({ ...prev, status: "done" }));
    }
  };

  const handleSendCannedReply = (cannedReplyId) => {
    const reply = sampleCannedReplies.find(
      (reply) => reply.id === cannedReplyId
    );
    if (!reply || !selectedChat) return;

    // Send canned reply based on type
    if (reply.messageType === "text") {
      handleSendMessage(reply.content);
    } else if (reply.messageType === "buttons") {
      // In a real implementation, you would send a button message via the WhatsApp API
      handleSendMessage(`${reply.header}\n${reply.body}\n${reply.footer}`);
    }

    setShowCannedReplies(false);
  };

  const handleTriggerChatbot = (chatId, triggerNow = false) => {
    // In a real implementation, you would call an API to assign a chatbot
    console.log(
      `Assigned chatbot to chat ${chatId}, trigger now: ${triggerNow}`
    );

    // Update UI to show the chatbot is assigned
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, hasChatbot: true } : chat
      )
    );

    if (selectedChat && selectedChat.id === chatId) {
      setSelectedChat((prev) => ({ ...prev, hasChatbot: true }));
    }
  };

  return (
    <div className="chats-container">
      <div className="chats-header1">
        <h1>Team Inbox</h1>
        <div className="tabs1">
          <button
            className={`tab1 ${activeTab === "mine" ? "active" : ""}`}
            onClick={() => setActiveTab("mine")}
          >
            Mine
          </button>
          <button
            className={`tab1 ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
        </div>
      </div>

      <div className="chats-content1">
        <div className="chat-list-container1">
          {loading ? (
            <div className="loading1">Loading chats...</div>
          ) : (
            <ChatList
              chats={getFilteredChats(chats, activeTab, currentUser)}
              selectedChatId={selectedChat?.id}
              onChatSelect={handleChatSelect}
              currentUser={currentUser}
            />
          )}
        </div>

        <div className="chat-view-container1">
          {selectedChat ? (
            <ChatView
              chat={selectedChat}
              onSendMessage={handleSendMessage}
              onToggleContactInfo={toggleContactInfo}
              onAddChatNote={(note) => handleAddChatNote(selectedChat.id, note)}
              onMarkAsDone={() => handleMarkAsDone(selectedChat.id)}
              onShowCannedReplies={() => setShowCannedReplies(true)}
              currentUser={currentUser}
              chatNotes={chatNotes[selectedChat.id] || []}
            />
          ) : (
            <div className="no-chat-selected">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>

        {showContactInfo && selectedChat && (
          <div className="contact-info-container1">
            <ContactInfo
              contact={selectedChat.contact}
              onClose={toggleContactInfo}
              onTriggerChatbot={(triggerNow) =>
                handleTriggerChatbot(selectedChat.id, triggerNow)
              }
              chatNotes={chatNotes[selectedChat.id] || []}
            />
          </div>
        )}
      </div>

      {showCannedReplies && (
        <div className="canned-replies-modal1">
          <div className="canned-replies-content1">
            <h3>Canned Replies</h3>
            <div className="canned-replies-list1">
              {sampleCannedReplies.map((reply) => (
                <div
                  key={reply.id}
                  className="canned-reply-item1"
                  onClick={() => handleSendCannedReply(reply.id)}
                >
                  <h4>{reply.title}</h4>
                  <p>
                    {reply.messageType === "text" ? reply.content : reply.body}
                  </p>
                </div>
              ))}
            </div>
            <button
              className="close-button"
              onClick={() => setShowCannedReplies(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;
