// src/utils/analyticsAPI.js - Separate Analytics API Module
import axios from "axios";

// Base URL from environment variable or default
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://pixe-backend-83iz.onrender.com";

// Create separate axios instance for analytics
const analyticsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
analyticsAPI.interceptors.request.use(
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
analyticsAPI.interceptors.response.use(
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

// Handle API errors for analytics
const handleAnalyticsError = (error) => {
  console.error("Analytics API Error:", error);

  if (error.response) {
    return {
      success: false,
      message: error.response.data?.message || "Analytics API error occurred",
      statusCode: error.response.status,
      data: null,
    };
  } else if (error.request) {
    return {
      success: false,
      message: "No response from analytics server",
      statusCode: null,
      data: null,
    };
  } else {
    return {
      success: false,
      message: error.message || "Unknown analytics error",
      statusCode: null,
      data: null,
    };
  }
};

// ===== DASHBOARD ANALYTICS API =====
export const dashboardAnalyticsAPI = {
  // Get complete dashboard statistics
  getDashboardStats: async (
    period = "daily",
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/analytics/dashboard?period=${period}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Dashboard stats fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get real-time dashboard metrics
  getRealTimeMetrics: async () => {
    try {
      const response = await analyticsAPI.get("/api/analytics/realtime");
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Real-time metrics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get dashboard overview with key KPIs
  getDashboardOverview: async (timeframe = "7d") => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/overview?timeframe=${timeframe}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Dashboard overview fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== CAMPAIGN ANALYTICS API =====
export const campaignAnalyticsAPI = {
  // Get campaign performance statistics
  getCampaignStats: async (
    campaignId = null,
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/analytics/campaigns`;
      const params = new URLSearchParams();

      if (campaignId) params.append("campaignId", campaignId);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Campaign stats fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get campaign performance metrics
  getCampaignMetrics: async (campaignId) => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/campaigns/${campaignId}/metrics`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Campaign metrics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get campaign conversion funnel
  getCampaignFunnel: async (campaignId, startDate = null, endDate = null) => {
    try {
      let url = `/api/analytics/campaigns/${campaignId}/funnel`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Campaign funnel data fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get campaign comparison data
  compareCampaigns: async (
    campaignIds,
    metrics = ["impressions", "clicks", "conversions"]
  ) => {
    try {
      const response = await analyticsAPI.post(
        "/api/analytics/campaigns/compare",
        {
          campaignIds,
          metrics,
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Campaign comparison data fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== AGENT ANALYTICS API =====
export const agentAnalyticsAPI = {
  // Get agent performance statistics
  getAgentStats: async (agentId = null, startDate = null, endDate = null) => {
    try {
      let url = `/api/analytics/agents`;
      const params = new URLSearchParams();

      if (agentId) params.append("agentId", agentId);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Agent stats fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get agent performance metrics
  getAgentPerformance: async (agentId) => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/agents/${agentId}/performance`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Agent performance fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get agent workload analytics
  getAgentWorkload: async (agentId = null, period = "daily") => {
    try {
      let url = `/api/analytics/agents/workload?period=${period}`;
      if (agentId) url += `&agentId=${agentId}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Agent workload data fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get agent productivity trends
  getAgentProductivity: async (startDate, endDate, groupBy = "day") => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/agents/productivity?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Agent productivity trends fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== USER ENGAGEMENT ANALYTICS API =====
export const userEngagementAPI = {
  // Get user engagement statistics
  getUserEngagementStats: async (startDate = null, endDate = null) => {
    try {
      let url = `/api/analytics/users/engagement`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "User engagement stats fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get user behavior analytics
  getUserBehavior: async (timeframe = "30d") => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/users/behavior?timeframe=${timeframe}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "User behavior analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get user journey analytics
  getUserJourney: async (userId = null, startDate = null, endDate = null) => {
    try {
      let url = `/api/analytics/users/journey`;
      const params = new URLSearchParams();

      if (userId) params.append("userId", userId);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "User journey analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get user retention analytics
  getUserRetention: async (cohortType = "weekly", periods = 12) => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/users/retention?cohortType=${cohortType}&periods=${periods}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "User retention analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== WORKFLOW ANALYTICS API =====
export const workflowAnalyticsAPI = {
  // Get workflow performance statistics
  getWorkflowStats: async (
    workflowId = null,
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/analytics/workflows`;
      const params = new URLSearchParams();

      if (workflowId) params.append("workflowId", workflowId);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Workflow stats fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get workflow execution analytics
  getWorkflowExecution: async (workflowId, period = "daily") => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/workflows/${workflowId}/execution?period=${period}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Workflow execution analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get workflow completion rates
  getWorkflowCompletion: async (startDate, endDate) => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/workflows/completion?startDate=${startDate}&endDate=${endDate}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Workflow completion rates fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get workflow bottleneck analysis
  getWorkflowBottlenecks: async (workflowId) => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/workflows/${workflowId}/bottlenecks`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Workflow bottleneck analysis fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== NOTIFICATION ANALYTICS API =====
export const notificationAnalyticsAPI = {
  // Get notification statistics
  getNotificationStats: async (startDate = null, endDate = null) => {
    try {
      let url = `/api/analytics/notifications`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification stats fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get notification delivery analytics
  getNotificationDelivery: async (period = "daily") => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/notifications/delivery?period=${period}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification delivery analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get notification engagement rates
  getNotificationEngagement: async (notificationType = null) => {
    try {
      let url = `/api/analytics/notifications/engagement`;
      if (notificationType) url += `?type=${notificationType}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification engagement rates fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== SYSTEM ANALYTICS API =====
export const systemAnalyticsAPI = {
  // Get system performance metrics
  getSystemMetrics: async (period = "hourly") => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/system/metrics?period=${period}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "System metrics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get API usage analytics
  getAPIUsage: async (startDate, endDate, endpoint = null) => {
    try {
      let url = `/api/analytics/system/api-usage?startDate=${startDate}&endDate=${endDate}`;
      if (endpoint) url += `&endpoint=${endpoint}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "API usage analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get error analytics
  getErrorAnalytics: async (period = "daily", errorType = null) => {
    try {
      let url = `/api/analytics/system/errors?period=${period}`;
      if (errorType) url += `&type=${errorType}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Error analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get system health status
  getSystemHealth: async () => {
    try {
      const response = await analyticsAPI.get("/api/analytics/system/health");
      return {
        success: true,
        data: response.data.data || response.data,
        message: "System health status fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== EXPORT ANALYTICS API =====
export const exportAnalyticsAPI = {
  // Export dashboard statistics
  exportDashboardStats: async (
    format = "csv",
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/analytics/export/dashboard?format=${format}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await analyticsAPI.get(url, {
        responseType: "blob",
      });

      return {
        success: true,
        data: response.data,
        message: "Dashboard stats exported successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Export campaign analytics
  exportCampaignAnalytics: async (
    format = "csv",
    campaignId = null,
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/analytics/export/campaigns?format=${format}`;
      if (campaignId) url += `&campaignId=${campaignId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await analyticsAPI.get(url, {
        responseType: "blob",
      });

      return {
        success: true,
        data: response.data,
        message: "Campaign analytics exported successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Export agent analytics
  exportAgentAnalytics: async (
    format = "csv",
    agentId = null,
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/analytics/export/agents?format=${format}`;
      if (agentId) url += `&agentId=${agentId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await analyticsAPI.get(url, {
        responseType: "blob",
      });

      return {
        success: true,
        data: response.data,
        message: "Agent analytics exported successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Export user engagement analytics
  exportUserEngagement: async (
    format = "csv",
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/analytics/export/users?format=${format}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await analyticsAPI.get(url, {
        responseType: "blob",
      });

      return {
        success: true,
        data: response.data,
        message: "User engagement analytics exported successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Export custom analytics report
  exportCustomReport: async (reportConfig) => {
    try {
      const response = await analyticsAPI.post(
        "/api/analytics/export/custom",
        reportConfig,
        {
          responseType: "blob",
        }
      );

      return {
        success: true,
        data: response.data,
        message: "Custom analytics report exported successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== ACTIVITY LOG ANALYTICS API =====
export const activityLogAnalyticsAPI = {
  // Get admin activity logs
  getAdminActivityLogs: async (
    action = null,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/analytics/activity-logs/admin`;
      const params = new URLSearchParams();

      if (action) params.append("action", action);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
        message: "Admin activity logs fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

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
      let url = `/api/analytics/activity-logs/users`;
      const params = new URLSearchParams();

      if (userId) params.append("userId", userId);
      if (action) params.append("action", action);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
        message: "User activity logs fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get system activity logs
  getSystemActivityLogs: async (
    startDate = null,
    endDate = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/analytics/activity-logs/system`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      url += `?${params.toString()}`;

      const response = await analyticsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination,
        message: "System activity logs fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get activity summary
  getActivitySummary: async (timeframe = "24h") => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/activity-logs/summary?timeframe=${timeframe}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Activity summary fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// ===== COMPREHENSIVE ANALYTICS API =====
export const comprehensiveAnalyticsAPI = {
  // Get all analytics data in one call
  getAllAnalytics: async (
    startDate = null,
    endDate = null,
    modules = ["dashboard", "campaigns", "agents", "users"]
  ) => {
    try {
      const response = await analyticsAPI.post("/api/analytics/comprehensive", {
        startDate,
        endDate,
        modules,
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: "Comprehensive analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get analytics summary for quick overview
  getAnalyticsSummary: async (timeframe = "7d") => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/summary?timeframe=${timeframe}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Analytics summary fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get trending metrics
  getTrendingMetrics: async (period = "daily", count = 10) => {
    try {
      const response = await analyticsAPI.get(
        `/api/analytics/trending?period=${period}&count=${count}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Trending metrics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },

  // Get comparative analytics
  getComparativeAnalytics: async (metric, entities, startDate, endDate) => {
    try {
      const response = await analyticsAPI.post("/api/analytics/compare", {
        metric,
        entities,
        startDate,
        endDate,
      });

      return {
        success: true,
        data: response.data.data || response.data,
        message: "Comparative analytics fetched successfully",
      };
    } catch (error) {
      return handleAnalyticsError(error);
    }
  },
};

// Export all analytics APIs
export default {
  dashboardAnalyticsAPI,
  campaignAnalyticsAPI,
  agentAnalyticsAPI,
  userEngagementAPI,
  workflowAnalyticsAPI,
  notificationAnalyticsAPI,
  systemAnalyticsAPI,
  exportAnalyticsAPI,
  activityLogAnalyticsAPI,
  comprehensiveAnalyticsAPI,
};
