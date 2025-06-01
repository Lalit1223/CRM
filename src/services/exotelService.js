// src/services/exotelService.js

const EXOTEL_CONFIG = {
  BASE_URL: "https://pixe-backend-tkrb.onrender.com/api/exotel",
  DEFAULT_CALLER_ID: "02248906259", // Your Exotel number
  AGENT_NUMBER: "+918562800573", // Your agent number
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const exotelAPI = {
  // Make an outbound call
  makeCall: async (toNumber, options = {}) => {
    try {
      const response = await fetch(`${EXOTEL_CONFIG.BASE_URL}/calls`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          from: options.from || EXOTEL_CONFIG.AGENT_NUMBER,
          to: toNumber,
          callerId: options.callerId || EXOTEL_CONFIG.DEFAULT_CALLER_ID,
          record: options.record !== false, // Record by default
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error making call:", error);
      return {
        success: false,
        message: error.message || "Failed to make call",
      };
    }
  },

  // Get call details
  getCallDetails: async (callSid) => {
    try {
      const response = await fetch(
        `${EXOTEL_CONFIG.BASE_URL}/calls/${callSid}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting call details:", error);
      return {
        success: false,
        message: error.message || "Failed to get call details",
      };
    }
  },

  // Get all calls with filters
  getAllCalls: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 20,
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "desc",
        ...filters,
      }).toString();

      const response = await fetch(
        `${EXOTEL_CONFIG.BASE_URL}/calls?${queryParams}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting calls:", error);
      return { success: true, data: [] }; // Return empty array instead of error
    }
  },

  // Hangup a call
  hangupCall: async (callSid) => {
    try {
      const response = await fetch(
        `${EXOTEL_CONFIG.BASE_URL}/calls/${callSid}/hangup`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error hanging up call:", error);
      return {
        success: false,
        message: error.message || "Failed to hangup call",
      };
    }
  },

  // Send DTMF digits
  sendDTMF: async (callSid, digits) => {
    try {
      const response = await fetch(
        `${EXOTEL_CONFIG.BASE_URL}/calls/${callSid}/dtmf`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ digits }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending DTMF:", error);
      return {
        success: false,
        message: error.message || "Failed to send DTMF",
      };
    }
  },

  // Get call recording
  getCallRecording: async (callSid, download = false) => {
    try {
      const url = `${EXOTEL_CONFIG.BASE_URL}/calls/${callSid}/recording${
        download ? "?download=true" : ""
      }`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (download) {
        return response.blob(); // Return blob for download
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error getting recording:", error);
      return {
        success: false,
        message: error.message || "Failed to get recording",
      };
    }
  },

  // Get account info
  getAccountInfo: async () => {
    try {
      const response = await fetch(`${EXOTEL_CONFIG.BASE_URL}/account`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting account info:", error);
      return {
        success: false,
        message: error.message || "Failed to get account info",
      };
    }
  },

  // Get call analytics
  getCallAnalytics: async (options = {}) => {
    try {
      const queryParams = new URLSearchParams({
        groupBy: options.groupBy || "day",
        ...options,
      }).toString();

      const response = await fetch(
        `${EXOTEL_CONFIG.BASE_URL}/analytics?${queryParams}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting analytics:", error);
      return { success: true, data: null }; // Return null instead of error
    }
  },
};

// Utility functions
export const formatPhoneForCall = (phone) => {
  // Remove any non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Add +91 if it doesn't start with +
  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("91")) {
      cleaned = "+" + cleaned;
    } else if (cleaned.length === 10) {
      cleaned = "+91" + cleaned;
    }
  }

  return cleaned;
};

export const getCallStatusColor = (status) => {
  const statusColors = {
    ringing: "#f59e0b",
    "in-progress": "#10b981",
    completed: "#6b7280",
    failed: "#ef4444",
    busy: "#f59e0b",
    "no-answer": "#6b7280",
  };
  return statusColors[status] || "#6b7280";
};

export const formatCallDuration = (seconds) => {
  if (!seconds || seconds === 0) return "0s";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
};
