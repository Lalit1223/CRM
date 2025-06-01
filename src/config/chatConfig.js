// src/config/chatConfig.js

export const CHAT_CONFIG = {
  // API Base URL
  API_BASE_URL: "https://pixe-backend-tkrb.onrender.com/api",

  // Default IDs (you should make these configurable per environment)
  DEFAULT_WORKFLOW_ID: "683a056f8c2a1cd97bfe1d1e",
  DEFAULT_CAMPAIGN_ID: "682ded90cfcfdc4c36964618",
  DEFAULT_AGENT_ID: "6825b06977890b65258ad9fe",

  // Polling intervals
  MESSAGE_POLL_INTERVAL: 3000, // 3 seconds
  CHAT_LIST_REFRESH_INTERVAL: 30000, // 30 seconds

  // Pagination
  DEFAULT_MESSAGE_LIMIT: 50,
  DEFAULT_SESSION_LIMIT: 10,

  // Message types
  MESSAGE_TYPES: {
    TEXT: "text",
    IMAGE: "image",
    DOCUMENT: "document",
    AUDIO: "audio",
    VIDEO: "video",
  },

  // Message senders
  MESSAGE_SENDERS: {
    USER: "user",
    AGENT: "agent",
    WORKFLOW: "workflow",
  },

  // Message statuses
  MESSAGE_STATUSES: {
    SENT: "sent",
    DELIVERED: "delivered",
    READ: "read",
    FAILED: "failed",
  },

  // Session statuses
  SESSION_STATUSES: {
    ACTIVE: "active",
    PAUSED: "paused",
    COMPLETED: "completed",
    FAILED: "failed",
  },

  // UI Configuration
  UI: {
    MOBILE_BREAKPOINT: 768,
    AUTO_SCROLL_BEHAVIOR: "smooth",
    MESSAGE_TIME_FORMAT: {
      HOUR: "2-digit",
      MINUTE: "2-digit",
    },
  },
};

// Helper functions
export const getAuthHeaders = (preferAgentToken = false) => {
  let token;

  if (preferAgentToken && localStorage.getItem("agentToken")) {
    token = localStorage.getItem("agentToken");
  } else if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  } else if (localStorage.getItem("agentToken")) {
    token = localStorage.getItem("agentToken");
  } else if (localStorage.getItem("adminToken")) {
    token = localStorage.getItem("adminToken");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const getAgentAuthHeaders = () => {
  return getAuthHeaders(true);
};

export const getAgentId = () => {
  return localStorage.getItem("agentId") || CHAT_CONFIG.DEFAULT_AGENT_ID;
};

export const getSenderName = () => {
  // Try different possible keys for the sender name
  return (
    localStorage.getItem("agentName") ||
    localStorage.getItem("adminName") ||
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    localStorage.getItem("fullName") ||
    "Unknown User"
  );
};

export const getSenderType = () => {
  // Determine if user is admin or agent based on available tokens/data
  if (localStorage.getItem("agentId") || localStorage.getItem("agentToken")) {
    return "agent";
  } else if (
    localStorage.getItem("adminId") ||
    localStorage.getItem("adminToken")
  ) {
    return "admin";
  }
  return "agent"; // default fallback
};

export const getUserId = () => {
  return localStorage.getItem("agentId") || localStorage.getItem("adminId");
};

export const buildApiUrl = (endpoint) => {
  return `${CHAT_CONFIG.API_BASE_URL}${endpoint}`;
};
