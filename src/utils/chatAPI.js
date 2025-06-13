// src/utils/chatAPI.js
import api from "./api.js";

const BASE_URL = "https://pixe-backend-83iz.onrender.com";

// Chat API functions
export const chatAPI = {
  // Get recent chats list
  getRecentChats: async (page = 1, limit = 20, status = "", search = "") => {
    try {
      let queryParams = `?page=${page}&limit=${limit}`;

      if (status) queryParams += `&status=${status}`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;

      const response = await api.get(`/api/message/recent-chats${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recent chats:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get messages for a specific chat/user
  getChatMessages: async (userId, page = 1, limit = 50) => {
    try {
      const response = await api.get(
        `/api/message/chats/${userId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Send a message
  sendMessage: async (messageData) => {
    try {
      const response = await api.post("/api/message/send", messageData);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Send template message
  sendTemplateMessage: async (templateData) => {
    try {
      const response = await api.post(
        "/api/message/send-template",
        templateData
      );
      return response.data;
    } catch (error) {
      console.error("Error sending template message:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Mark messages as read
  markAsRead: async (userId, messageIds = []) => {
    try {
      const response = await api.post("/api/message/mark-read", {
        userId,
        messageIds,
      });
      return response.data;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get message status
  getMessageStatus: async (messageId) => {
    try {
      const response = await api.get(`/api/message/status/${messageId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting message status:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Search messages
  searchMessages: async (
    query,
    userId = null,
    startDate = null,
    endDate = null
  ) => {
    try {
      let queryParams = `?query=${encodeURIComponent(query)}`;

      if (userId) queryParams += `&userId=${userId}`;
      if (startDate) queryParams += `&startDate=${startDate}`;
      if (endDate) queryParams += `&endDate=${endDate}`;

      const response = await api.get(`/api/message/search${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error searching messages:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Upload media for messages
  uploadMedia: async (file, messageType = "image") => {
    try {
      const formData = new FormData();
      formData.append("media", file);
      formData.append("messageType", messageType);

      const response = await api.post("/api/message/upload-media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get chat analytics
  getChatAnalytics: async (startDate, endDate, userId = null) => {
    try {
      let queryParams = `?startDate=${startDate}&endDate=${endDate}`;

      if (userId) queryParams += `&userId=${userId}`;

      const response = await api.get(`/api/message/analytics${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error getting chat analytics:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Transfer chat to agent
  transferChat: async (userId, agentId, notes = "") => {
    try {
      const response = await api.post("/api/message/transfer-chat", {
        userId,
        agentId,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error("Error transferring chat:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Close/End chat session
  closeChat: async (userId, reason = "") => {
    try {
      const response = await api.post("/api/message/close-chat", {
        userId,
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error closing chat:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get user profile information
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/api/user/admin/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Update user information
  updateUserInfo: async (userId, updateData) => {
    try {
      const response = await api.patch(`/api/user/admin/${userId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating user info:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Add notes to user
  addUserNotes: async (userId, notes) => {
    try {
      const response = await api.post(`/api/user/admin/${userId}/notes`, {
        notes,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding user notes:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Tag user
  tagUser: async (userId, tags) => {
    try {
      const response = await api.post(`/api/user/admin/${userId}/tags`, {
        tags,
      });
      return response.data;
    } catch (error) {
      console.error("Error tagging user:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
};

// WebSocket connection for real-time messages
export class ChatWebSocket {
  constructor(onMessage, onStatusUpdate, onError) {
    this.ws = null;
    this.onMessage = onMessage;
    this.onStatusUpdate = onStatusUpdate;
    this.onError = onError;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
  }

  connect() {
    try {
      const token = localStorage.getItem("token");
      const wsUrl = `wss://pixe-backend-tkrb.onrender.com/ws?token=${token}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        ////console.log("WebSocket connected");
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "new_message":
              this.onMessage(data.message);
              break;
            case "message_status_update":
              this.onStatusUpdate(data.messageId, data.status);
              break;
            case "user_typing":
              // Handle typing indicator
              break;
            default:
            ////console.log("Unknown WebSocket message type:", data.type);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        ////console.log("WebSocket disconnected");
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (this.onError) {
          this.onError(error);
        }
      };
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      //console.log(
      //     `Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      //   );

      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error("Max WebSocket reconnection attempts reached");
    }
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Utility functions
export const chatUtils = {
  // Format phone number for display
  formatPhoneNumber: (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/^\+?91/, "");
    return `+91 ${cleaned}`;
  },

  // Format timestamp
  formatTime: (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  },

  // Check if message is from today
  isToday: (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  // Check if message is from yesterday
  isYesterday: (dateString) => {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  },

  // Get message status color
  getStatusColor: (status) => {
    switch (status) {
      case "delivered":
        return "#666";
      case "read":
        return "#25D366";
      case "failed":
        return "#f44336";
      default:
        return "#999";
    }
  },

  // Extract contact name from phone number or session data
  getContactName: (user, session) => {
    // Try to get name from session data first
    if (session?.data?.name) {
      return session.data.name;
    }

    // Fallback to formatted phone number
    return chatUtils.formatPhoneNumber(user?.phone);
  },

  // Check if user has unread messages
  hasUnreadMessages: (chat) => {
    return chat.unreadCount && chat.unreadCount > 0;
  },

  // Generate unique message ID
  generateMessageId: () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};

export default chatAPI;
