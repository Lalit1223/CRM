// src/utils/activityLogsAPI.js - Complete Activity Logs API Module
import axios from "axios";

// Base URL from environment variable or default
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://pixe-backend-83iz.onrender.com";

// Create separate axios instance for activity logs
const activityLogsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
activityLogsAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
activityLogsAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Handle API errors for activity logs
const handleActivityLogError = (error) => {
  console.error("Activity Log API Error:", error);

  if (error.response) {
    return {
      success: false,
      message:
        error.response.data?.message || "Activity log API error occurred",
      statusCode: error.response.status,
      data: null,
      pagination: null,
    };
  } else if (error.request) {
    return {
      success: false,
      message: "No response from activity log server",
      statusCode: null,
      data: null,
      pagination: null,
    };
  } else {
    return {
      success: false,
      message: error.message || "Unknown activity log error",
      statusCode: null,
      data: null,
      pagination: null,
    };
  }
};

// ===== ADMIN ACTIVITY LOGS API =====
export const adminActivityLogsAPI = {
  // Get admin activity logs
  getAdminActivityLogs: async (
    action = null,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc"
  ) => {
    try {
      let url = `/api/activity-logs/admin`;
      const params = new URLSearchParams();

      if (action) params.append("action", action);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Admin activity logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get admin activity by ID
  getAdminActivityById: async (activityId) => {
    try {
      const response = await activityLogsAPI.get(
        `/api/activity-logs/admin/${activityId}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Admin activity details fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Log admin activity
  logAdminActivity: async (activityData) => {
    try {
      const response = await activityLogsAPI.post("/api/activity-logs/admin", {
        ...activityData,
        timestamp: new Date().toISOString(),
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent,
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Admin activity logged successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get admin login logs
  getAdminLoginLogs: async (
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/admin/login?page=${page}&limit=${limit}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Admin login logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get admin action summary
  getAdminActionSummary: async (adminId = null, timeframe = "7d") => {
    try {
      let url = `/api/activity-logs/admin/summary?timeframe=${timeframe}`;
      if (adminId) url += `&adminId=${adminId}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Admin action summary fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get admin activity analytics
  getAdminActivityAnalytics: async (startDate, endDate, groupBy = "day") => {
    try {
      const response = await activityLogsAPI.get(
        `/api/activity-logs/admin/analytics?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Admin activity analytics fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },
};

// ===== USER ACTIVITY LOGS API =====
export const userActivityLogsAPI = {
  // Get user activity logs
  getUserActivityLogs: async (
    userId = null,
    action = null,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/users`;
      const params = new URLSearchParams();

      if (userId) params.append("userId", userId);
      if (action) params.append("action", action);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "User activity logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get user activity by ID
  getUserActivityById: async (activityId) => {
    try {
      const response = await activityLogsAPI.get(
        `/api/activity-logs/users/${activityId}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "User activity details fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Log user activity
  logUserActivity: async (userId, activityData) => {
    try {
      const response = await activityLogsAPI.post("/api/activity-logs/users", {
        userId,
        ...activityData,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        ipAddress: await getClientIP(),
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: "User activity logged successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get user session logs
  getUserSessionLogs: async (
    userId,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/users/${userId}/sessions?page=${page}&limit=${limit}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "User session logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get user behavior patterns
  getUserBehaviorPatterns: async (userId, timeframe = "30d") => {
    try {
      const response = await activityLogsAPI.get(
        `/api/activity-logs/users/${userId}/patterns?timeframe=${timeframe}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "User behavior patterns fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get user engagement metrics
  getUserEngagementMetrics: async (
    userId = null,
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/activity-logs/users/engagement`;
      const params = new URLSearchParams();

      if (userId) params.append("userId", userId);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "User engagement metrics fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },
};

// ===== SYSTEM ACTIVITY LOGS API =====
export const systemActivityLogsAPI = {
  // Get system activity logs
  getSystemActivityLogs: async (
    startDate = null,
    endDate = null,
    level = null,
    component = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/system`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (level) params.append("level", level);
      if (component) params.append("component", component);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "System activity logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get system activity by ID
  getSystemActivityById: async (activityId) => {
    try {
      const response = await activityLogsAPI.get(
        `/api/activity-logs/system/${activityId}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "System activity details fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Log system activity
  logSystemActivity: async (activityData) => {
    try {
      const response = await activityLogsAPI.post("/api/activity-logs/system", {
        ...activityData,
        timestamp: new Date().toISOString(),
        serverId: getServerId(),
        environment: getEnvironment(),
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: "System activity logged successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get system error logs
  getSystemErrorLogs: async (
    startDate = null,
    endDate = null,
    severity = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/system/errors?page=${page}&limit=${limit}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (severity) url += `&severity=${severity}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "System error logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get system performance logs
  getSystemPerformanceLogs: async (
    startDate = null,
    endDate = null,
    metric = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/system/performance?page=${page}&limit=${limit}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (metric) url += `&metric=${metric}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "System performance logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get system health status
  getSystemHealthStatus: async () => {
    try {
      const response = await activityLogsAPI.get(
        "/api/activity-logs/system/health"
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "System health status fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },
};

// ===== AGENT ACTIVITY LOGS API =====
export const agentActivityLogsAPI = {
  // Get agent activity logs
  getAgentActivityLogs: async (
    agentId = null,
    action = null,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/agents`;
      const params = new URLSearchParams();

      if (agentId) params.append("agentId", agentId);
      if (action) params.append("action", action);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Agent activity logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Log agent activity
  logAgentActivity: async (agentId, activityData) => {
    try {
      const response = await activityLogsAPI.post("/api/activity-logs/agents", {
        agentId,
        ...activityData,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Agent activity logged successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get agent work sessions
  getAgentWorkSessions: async (
    agentId,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/agents/${agentId}/sessions?page=${page}&limit=${limit}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Agent work sessions fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get agent performance logs
  getAgentPerformanceLogs: async (
    agentId,
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/activity-logs/agents/${agentId}/performance`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Agent performance logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },
};

// ===== WORKFLOW ACTIVITY LOGS API =====
export const workflowActivityLogsAPI = {
  // Get workflow activity logs
  getWorkflowActivityLogs: async (
    workflowId = null,
    action = null,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/workflows`;
      const params = new URLSearchParams();

      if (workflowId) params.append("workflowId", workflowId);
      if (action) params.append("action", action);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Workflow activity logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Log workflow activity
  logWorkflowActivity: async (workflowId, activityData) => {
    try {
      const response = await activityLogsAPI.post(
        "/api/activity-logs/workflows",
        {
          workflowId,
          ...activityData,
          timestamp: new Date().toISOString(),
          executionId: generateExecutionId(),
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Workflow activity logged successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get workflow execution logs
  getWorkflowExecutionLogs: async (
    workflowId,
    executionId = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/workflows/${workflowId}/executions?page=${page}&limit=${limit}`;
      if (executionId) url += `&executionId=${executionId}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Workflow execution logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },
};

// ===== CAMPAIGN ACTIVITY LOGS API =====
export const campaignActivityLogsAPI = {
  // Get campaign activity logs
  getCampaignActivityLogs: async (
    campaignId = null,
    action = null,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/activity-logs/campaigns`;
      const params = new URLSearchParams();

      if (campaignId) params.append("campaignId", campaignId);
      if (action) params.append("action", action);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Campaign activity logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Log campaign activity
  logCampaignActivity: async (campaignId, activityData) => {
    try {
      const response = await activityLogsAPI.post(
        "/api/activity-logs/campaigns",
        {
          campaignId,
          ...activityData,
          timestamp: new Date().toISOString(),
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Campaign activity logged successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get campaign performance logs
  getCampaignPerformanceLogs: async (
    campaignId,
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/activity-logs/campaigns/${campaignId}/performance`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await activityLogsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Campaign performance logs fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },
};

// ===== ACTIVITY LOG SEARCH AND FILTER API =====
export const activityLogSearchAPI = {
  // Search activity logs across all types
  searchActivityLogs: async (
    searchQuery,
    filters = {},
    page = 1,
    limit = 20
  ) => {
    try {
      const response = await activityLogsAPI.post("/api/activity-logs/search", {
        query: searchQuery,
        filters,
        page,
        limit,
        sortBy: filters.sortBy || "timestamp",
        sortOrder: filters.sortOrder || "desc",
      });
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Activity logs search completed successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get activity log filters
  getAvailableFilters: async () => {
    try {
      const response = await activityLogsAPI.get("/api/activity-logs/filters");
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Available filters fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Get activity summary by date range
  getActivitySummary: async (startDate, endDate, groupBy = "day") => {
    try {
      const response = await activityLogsAPI.get(
        `/api/activity-logs/summary?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Activity summary fetched successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },

  // Export activity logs
  exportActivityLogs: async (filters = {}, format = "csv") => {
    try {
      const response = await activityLogsAPI.post(
        "/api/activity-logs/export",
        {
          filters,
          format,
        },
        {
          responseType: "blob",
        }
      );

      return {
        success: true,
        data: response.data,
        message: "Activity logs exported successfully",
      };
    } catch (error) {
      return handleActivityLogError(error);
    }
  },
};

// ===== HELPER FUNCTIONS =====

// Helper function to get client IP (mock implementation)
const getClientIP = async () => {
  try {
    return "127.0.0.1"; // Mock IP
  } catch (error) {
    return "unknown";
  }
};

// Helper function to get session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

// Helper function to get server ID (mock implementation)
const getServerId = () => {
  return process.env.NODE_ENV === "production"
    ? "prod-server-01"
    : "dev-server-01";
};

// Helper function to get environment
const getEnvironment = () => {
  return process.env.NODE_ENV || "development";
};

// Helper function to generate execution ID
const generateExecutionId = () => {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Export all activity log APIs
export default {
  adminActivityLogsAPI,
  userActivityLogsAPI,
  systemActivityLogsAPI,
  agentActivityLogsAPI,
  workflowActivityLogsAPI,
  campaignActivityLogsAPI,
  activityLogSearchAPI,
};
