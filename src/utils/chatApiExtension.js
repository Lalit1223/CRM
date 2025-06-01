// src/utils/chatApiExtension.js
// This file extends your existing api.js with chat and messaging functionality

import api from "./api.js";

// Chat and messaging API functions to extend your existing API
export const chatAPI = {
  // Get recent chats for the current user
  getRecentChats: async (options = {}) => {
    try {
      const { page = 1, limit = 20, status, search } = options;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(search && { search }),
      });

      const response = await api.get(
        `/api/message/recent-chats?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent chats:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get chat messages for a specific user
  getChatMessages: async (userId, options = {}) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { page = 1, limit = 50 } = options;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await api.get(
        `/api/message/chats/${userId}?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get messages for a specific session
  getSessionMessages: async (sessionId, options = {}) => {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const { page = 1, limit = 50 } = options;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await api.get(
        `/api/message/session/${sessionId}?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching session messages:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Send a message
  sendMessage: async (messageData) => {
    try {
      // Validate required fields
      if (!messageData.userId || !messageData.content?.trim()) {
        throw new Error("User ID and message content are required");
      }

      // Ensure senderName is set
      if (!messageData.senderName) {
        const senderName =
          localStorage.getItem("agentName") ||
          localStorage.getItem("adminName") ||
          localStorage.getItem("userName") ||
          "Unknown User";
        messageData.senderName = senderName;
      }

      const response = await api.post("/api/message/send", messageData);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (userId, messageIds = []) => {
    try {
      const response = await api.patch(`/api/message/mark-read`, {
        userId,
        messageIds,
      });
      return response.data;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get message delivery status
  getMessageStatus: async (messageId) => {
    try {
      const response = await api.get(`/api/message/status/${messageId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching message status:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Search messages
  searchMessages: async (query, options = {}) => {
    try {
      const {
        userId,
        sessionId,
        page = 1,
        limit = 20,
        dateFrom,
        dateTo,
      } = options;

      const queryParams = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        ...(userId && { userId }),
        ...(sessionId && { sessionId }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });

      const response = await api.get(`/api/message/search?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error searching messages:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get chat statistics
  getChatStats: async (startDate, endDate) => {
    try {
      const queryParams = new URLSearchParams({
        startDate,
        endDate,
      });

      const response = await api.get(`/api/message/stats?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat stats:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Enhanced session API that extends your existing sessionAPI
export const enhancedSessionAPI = {
  // All existing sessionAPI functions are available via import
  ...sessionAPI,

  // Create session with validation
  createSession: async (sessionData) => {
    try {
      // Validate required fields
      if (!sessionData.userId || !sessionData.phone) {
        throw new Error("User ID and phone number are required");
      }

      // Set default values
      const defaultSessionData = {
        workflowId: "68397fcd465994036c73321e",
        campaignId: "682ded90cfcfdc4c36964618",
        agentId: localStorage.getItem("agentId") || "6825b06977890b65258ad9fe",
        adminId: localStorage.getItem("adminId") || "6824c3e06ab972602262a2a7",
        source: "whatsapp",
        ...sessionData,
      };

      const response = await api.post("/api/sessions", defaultSessionData);
      return response.data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Update session with additional data
  updateSession: async (sessionId, updateData) => {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await api.patch(
        `/api/sessions/${sessionId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating session:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get session by ID
  getSessionById: async (sessionId) => {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await api.get(`/api/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching session:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // End session
  endSession: async (sessionId, reason = "completed") => {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await api.patch(`/api/sessions/${sessionId}`, {
        status: "completed",
        completedAt: new Date().toISOString(),
        completionReason: reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error ending session:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get active sessions for agent
  getAgentActiveSessions: async (agentId, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;

      const queryParams = new URLSearchParams({
        agentId,
        status: "active",
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await api.get(`/api/sessions/agent?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching agent sessions:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Transfer session to another agent (enhanced)
  transferSession: async (sessionId, transferData) => {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      if (!transferData.newAgentId) {
        throw new Error("New agent ID is required");
      }

      const transferPayload = {
        newAgentId: transferData.newAgentId,
        reason: transferData.reason || "Manual transfer",
        notes: transferData.notes || "",
        transferredBy:
          localStorage.getItem("agentId") || localStorage.getItem("adminId"),
        transferredAt: new Date().toISOString(),
      };

      const response = await api.post(
        `/api/sessions/${sessionId}/transfer`,
        transferPayload
      );
      return response.data;
    } catch (error) {
      console.error("Error transferring session:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
};

// File upload API for chat media
export const chatFileAPI = {
  // Upload file for chat
  uploadChatFile: async (file, options = {}) => {
    try {
      if (!file) {
        throw new Error("File is required");
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum 10MB allowed.");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error("File type not allowed");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("entityType", options.entityType || "message");
      formData.append("entityId", options.entityId || "");
      formData.append("isPublic", options.isPublic || "true");

      const response = await api.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get file download URL
  getFileDownloadUrl: async (fileId) => {
    try {
      const response = await api.get(`/api/files/${fileId}/download-url`);
      return response.data;
    } catch (error) {
      console.error("Error getting file download URL:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Delete uploaded file
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/api/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Notification API for chat
export const chatNotificationAPI = {
  // Get unread notifications
  getUnreadNotifications: async () => {
    try {
      const response = await api.get(
        "/api/notifications/admin/list?status=unread"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.patch(
        `/api/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get notification settings
  getNotificationSettings: async () => {
    try {
      const response = await api.get("/api/settings/notifications");
      return response.data;
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put("/api/settings/notifications", settings);
      return response.data;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Activity logging API for chat
export const chatActivityAPI = {
  // Log activity
  logActivity: async (activityData) => {
    try {
      const activityPayload = {
        action: activityData.action,
        entityType: activityData.entityType || "message",
        entityId: activityData.entityId,
        details: activityData.details || {},
        userId: activityData.userId,
        agentId: localStorage.getItem("agentId"),
        adminId: localStorage.getItem("adminId"),
        timestamp: new Date().toISOString(),
        metadata: activityData.metadata || {},
      };

      const response = await api.post("/api/activity-logs", activityPayload);
      return response.data;
    } catch (error) {
      console.error("Error logging activity:", error);
      // Don't throw error for activity logging to avoid disrupting main flow
      return { success: false, message: "Activity logging failed" };
    }
  },

  // Get activity logs
  getActivityLogs: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const response = await api.get(`/api/activity-logs/admin?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Utility functions for chat
export const chatUtils = {
  // Format phone number for display
  formatPhoneNumber: (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/^\+?91/, "");
    return `+91 ${cleaned}`;
  },

  // Format phone number for API calls (E.164 format)
  formatPhoneForCall: (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("91") && cleaned.length === 12) {
      return `+${cleaned}`;
    } else if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }

    return phone.startsWith("+") ? phone : `+${cleaned}`;
  },

  // Validate phone number
  isValidPhoneNumber: (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, "");
    return (
      (cleaned.length === 10 && /^[6-9]/.test(cleaned)) ||
      (cleaned.length === 12 &&
        cleaned.startsWith("91") &&
        /^91[6-9]/.test(cleaned))
    );
  },

  // Format timestamp for display
  formatTime: (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Same day - show time
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays <= 7) {
      // Within a week - show day
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      // Older - show date
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: diffDays > 365 ? "numeric" : undefined,
      });
    }
  },

  // Get sender name from localStorage
  getSenderName: () => {
    return (
      localStorage.getItem("agentName") ||
      localStorage.getItem("adminName") ||
      localStorage.getItem("userName") ||
      localStorage.getItem("name") ||
      "Unknown User"
    );
  },

  // Get user role
  getUserRole: () => {
    if (localStorage.getItem("adminToken") || localStorage.getItem("adminId")) {
      return "admin";
    } else if (
      localStorage.getItem("agentToken") ||
      localStorage.getItem("agentId")
    ) {
      return "agent";
    } else {
      return "user";
    }
  },

  // Generate unique temporary ID
  generateTempId: () => {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validate message data
  validateMessageData: (messageData) => {
    const errors = [];

    if (!messageData.userId) {
      errors.push("User ID is required");
    }

    if (!messageData.content || !messageData.content.trim()) {
      errors.push("Message content is required");
    } else if (messageData.content.length > 4096) {
      errors.push("Message too long (max 4096 characters)");
    }

    if (!messageData.messageType) {
      messageData.messageType = "text"; // Default to text
    }

    if (!messageData.senderName) {
      messageData.senderName = chatUtils.getSenderName();
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: messageData,
    };
  },

  // Validate session data
  validateSessionData: (sessionData) => {
    const errors = [];

    if (!sessionData.userId) {
      errors.push("User ID is required");
    }

    if (!sessionData.phone) {
      errors.push("Phone number is required");
    } else if (!chatUtils.isValidPhoneNumber(sessionData.phone)) {
      errors.push("Invalid phone number format");
    }

    // Set defaults
    if (!sessionData.workflowId) {
      sessionData.workflowId = "68397fcd465994036c73321e";
    }

    if (!sessionData.campaignId) {
      sessionData.campaignId = "682ded90cfcfdc4c36964618";
    }

    if (!sessionData.agentId) {
      sessionData.agentId =
        localStorage.getItem("agentId") || "6825b06977890b65258ad9fe";
    }

    if (!sessionData.source) {
      sessionData.source = "whatsapp";
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: sessionData,
    };
  },

  // Debounce function for API calls
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  // Get file type icon
  getFileTypeIcon: (fileType) => {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.startsWith("video/")) return "🎥";
    if (fileType.startsWith("audio/")) return "🎵";
    if (fileType === "application/pdf") return "📄";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("excel")) return "📊";
    return "📎";
  },

  // Check if message is from today
  isToday: (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    return today.toDateString() === messageDate.toDateString();
  },

  // Group messages by date
  groupMessagesByDate: (messages) => {
    const groups = {};

    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  },

  // Calculate read time for message
  calculateReadTime: (content) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes === 1 ? "1 min read" : `${minutes} min read`;
  },
};

// Constants for chat functionality
export const CHAT_CONSTANTS = {
  MESSAGE_TYPES: {
    TEXT: "text",
    IMAGE: "image",
    DOCUMENT: "document",
    AUDIO: "audio",
    VIDEO: "video",
    INTERACTIVE: "interactive",
    LOCATION: "location",
    CONTACT: "contact",
    STICKER: "sticker",
  },

  MESSAGE_SENDERS: {
    USER: "user",
    AGENT: "agent",
    WORKFLOW: "workflow",
    SYSTEM: "system",
  },

  MESSAGE_STATUS: {
    SENT: "sent",
    DELIVERED: "delivered",
    READ: "read",
    FAILED: "failed",
    PENDING: "pending",
  },

  SESSION_STATUS: {
    ACTIVE: "active",
    COMPLETED: "completed",
    EXPIRED: "expired",
    PAUSED: "paused",
  },

  CALL_STATUS: {
    RINGING: "ringing",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
    FAILED: "failed",
    BUSY: "busy",
    NO_ANSWER: "no-answer",
    CANCELLED: "cancelled",
  },

  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_MESSAGE_LENGTH: 4096,
  POLL_INTERVAL: 5000, // 5 seconds

  ALLOWED_FILE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// Performance monitoring for chat APIs
export const chatPerformance = {
  // Measure API call performance
  measureApiCall: async (apiName, apiCall) => {
    const startTime = Date.now();

    try {
      const result = await apiCall();
      const duration = Date.now() - startTime;

      ////console.log(`Chat API "${apiName}" completed in ${duration}ms`);

      // Log slow API calls
      if (duration > 3000) {
        console.warn(
          `Slow Chat API call detected: "${apiName}" took ${duration}ms`
        );
      }

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Chat API "${apiName}" failed after ${duration}ms:`, error);
      throw error;
    }
  },

  // Monitor real-time features
  monitorRealTimeFeatures: () => {
    const metrics = {
      messagePollingActive: false,
      lastPollTime: null,
      pollCount: 0,
      errors: [],
    };

    return {
      startPolling: () => {
        metrics.messagePollingActive = true;
        metrics.lastPollTime = Date.now();
        //console.log("Chat polling started");
      },

      stopPolling: () => {
        metrics.messagePollingActive = false;
        //console.log("Chat polling stopped");
      },

      recordPoll: () => {
        metrics.pollCount++;
        metrics.lastPollTime = Date.now();
      },

      recordError: (error) => {
        metrics.errors.push({
          error: error.message,
          timestamp: Date.now(),
        });
      },

      getMetrics: () => ({ ...metrics }),
    };
  },
};

// Local storage utilities for chat
export const chatStorage = {
  // Save chat preferences
  saveChatPreferences: (preferences) => {
    try {
      localStorage.setItem("chatPreferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Error saving chat preferences:", error);
    }
  },

  // Get chat preferences
  getChatPreferences: () => {
    try {
      const preferences = localStorage.getItem("chatPreferences");
      return preferences
        ? JSON.parse(preferences)
        : {
            soundEnabled: true,
            notificationsEnabled: true,
            autoScroll: true,
            showTimestamps: true,
            compactMode: false,
          };
    } catch (error) {
      console.error("Error getting chat preferences:", error);
      return {};
    }
  },

  // Save draft message
  saveDraftMessage: (userId, message) => {
    try {
      const drafts = JSON.parse(localStorage.getItem("chatDrafts") || "{}");
      drafts[userId] = message;
      localStorage.setItem("chatDrafts", JSON.stringify(drafts));
    } catch (error) {
      console.error("Error saving draft message:", error);
    }
  },

  // Get draft message
  getDraftMessage: (userId) => {
    try {
      const drafts = JSON.parse(localStorage.getItem("chatDrafts") || "{}");
      return drafts[userId] || "";
    } catch (error) {
      console.error("Error getting draft message:", error);
      return "";
    }
  },

  // Clear draft message
  clearDraftMessage: (userId) => {
    try {
      const drafts = JSON.parse(localStorage.getItem("chatDrafts") || "{}");
      delete drafts[userId];
      localStorage.setItem("chatDrafts", JSON.stringify(drafts));
    } catch (error) {
      console.error("Error clearing draft message:", error);
    }
  },

  // Save chat filter state
  saveChatFilters: (filters) => {
    try {
      localStorage.setItem("chatFilters", JSON.stringify(filters));
    } catch (error) {
      console.error("Error saving chat filters:", error);
    }
  },

  // Get chat filter state
  getChatFilters: () => {
    try {
      const filters = localStorage.getItem("chatFilters");
      return filters
        ? JSON.parse(filters)
        : {
            status: "all",
            dateRange: "all",
            agent: "all",
            unreadOnly: false,
          };
    } catch (error) {
      console.error("Error getting chat filters:", error);
      return {};
    }
  },
};

// Export everything as a combined object for easy importing
export default {
  chatAPI,
  enhancedSessionAPI,
  chatFileAPI,
  chatNotificationAPI,
  chatActivityAPI,
  chatUtils,
  CHAT_CONSTANTS,
  chatPerformance,
  chatStorage,
};
