// src/contexts/ChatContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// Create Chat Context
export const ChatContext = createContext();

// Custom hook to use chat context
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [chatFilter, setChatFilter] = useState("mine"); // 'mine', 'all', 'unassigned', 'done'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch chat data
  const fetchChats = async () => {
    try {
      setLoading(true);

      // This would be replaced with an actual API call
      // Mock data for development
      const mockChats = [
        {
          id: "1",
          contact: {
            id: "101",
            name: "John Doe",
            phone: "+1234567890",
            profilePic: "https://via.placeholder.com/50",
            lastActive: "2023-04-01T12:30:00Z",
          },
          lastMessage: {
            text: "Hello, I need help with my order",
            timestamp: "2023-04-01T12:30:00Z",
            isRead: false,
            sender: "contact",
          },
          unreadCount: 3,
          assignedTo: "current-user",
          status: "active",
        },
        {
          id: "2",
          contact: {
            id: "102",
            name: "Jane Smith",
            phone: "+0987654321",
            profilePic: "https://via.placeholder.com/50",
            lastActive: "2023-03-29T15:45:00Z",
          },
          lastMessage: {
            text: "Thanks for your help!",
            timestamp: "2023-03-29T15:45:00Z",
            isRead: true,
            sender: "contact",
          },
          unreadCount: 0,
          assignedTo: "other-agent",
          status: "active",
        },
        {
          id: "3",
          contact: {
            id: "103",
            name: "Bob Johnson",
            phone: "+1122334455",
            profilePic: "https://via.placeholder.com/50",
            lastActive: "2023-04-01T09:15:00Z",
          },
          lastMessage: {
            text: "When will my order arrive?",
            timestamp: "2023-04-01T09:15:00Z",
            isRead: false,
            sender: "contact",
          },
          unreadCount: 1,
          assignedTo: null,
          status: "active",
        },
      ];

      // Filter chats based on selected filter
      let filteredChats = [];

      switch (chatFilter) {
        case "mine":
          filteredChats = mockChats.filter(
            (chat) => chat.assignedTo === "current-user"
          );
          break;
        case "all":
          filteredChats = mockChats;
          break;
        case "unassigned":
          filteredChats = mockChats.filter((chat) => chat.assignedTo === null);
          break;
        case "done":
          filteredChats = mockChats.filter((chat) => chat.status === "done");
          break;
        default:
          filteredChats = mockChats.filter(
            (chat) => chat.assignedTo === "current-user"
          );
      }

      // Calculate unread count and pending assignments
      const totalUnread = mockChats.reduce(
        (total, chat) =>
          chat.assignedTo === "current-user" ? total + chat.unreadCount : total,
        0
      );

      const unassignedCount = mockChats.filter(
        (chat) => chat.assignedTo === null
      ).length;

      setChats(filteredChats);
      setUnreadCount(totalUnread);
      setPendingAssignments(unassignedCount);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats");
      setLoading(false);
    }
  };

  // Set up initial fetch and polling
  useEffect(() => {
    fetchChats();

    // Poll for updates (can be replaced with WebSockets in production)
    const intervalId = setInterval(fetchChats, 30000);

    return () => clearInterval(intervalId);
  }, [chatFilter]);

  // Context value
  const value = {
    chats,
    unreadCount,
    pendingAssignments,
    chatFilter,
    loading,
    error,
    setChatFilter,
    refreshChats: fetchChats,
    // Function to send a message in a chat
    sendMessage: async (chatId, message) => {
      // This would be replaced with an actual API call
      console.log(`Sending message to chat ${chatId}: ${message}`);

      // Optimistically update the UI
      const updatedChats = chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: {
              text: message,
              timestamp: new Date().toISOString(),
              isRead: true,
              sender: "agent",
            },
          };
        }
        return chat;
      });

      setChats(updatedChats);
    },
    // Function to assign a chat to the current user
    assignChat: async (chatId) => {
      // This would be replaced with an actual API call
      console.log(`Assigning chat ${chatId} to current user`);

      // Optimistically update the UI
      const updatedChats = chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            assignedTo: "current-user",
          };
        }
        return chat;
      });

      setChats(updatedChats);
      fetchChats(); // Refresh the chat list and counts
    },
    // Function to mark a chat as done
    markAsDone: async (chatId) => {
      // This would be replaced with an actual API call
      console.log(`Marking chat ${chatId} as done`);

      // Optimistically update the UI
      const updatedChats = chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            status: "done",
          };
        }
        return chat;
      });

      setChats(updatedChats);
      fetchChats(); // Refresh the chat list and counts
    },
    // Function to trigger a chatbot for a contact
    triggerBot: async (chatId, botId, triggerNow = false) => {
      // This would be replaced with an actual API call
      console.log(
        `Assigning bot ${botId} to chat ${chatId}. Trigger immediately: ${triggerNow}`
      );
    },
    // Function to add a chat note
    addChatNote: async (chatId, note) => {
      // This would be replaced with an actual API call
      console.log(`Adding note to chat ${chatId}: ${note}`);
    },
    // Function to send a canned reply
    sendCannedReply: async (chatId, replyId) => {
      // This would be replaced with an actual API call
      console.log(`Sending canned reply ${replyId} to chat ${chatId}`);
    },
    // Function to send a template message (required after 24h)
    sendTemplateMessage: async (chatId, templateId, variables) => {
      // This would be replaced with an actual API call
      console.log(
        `Sending template ${templateId} to chat ${chatId} with variables:`,
        variables
      );
    },
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
