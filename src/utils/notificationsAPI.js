// src/utils/notificationsAPI.js - Separate Notifications API Module
import axios from "axios";

// Base URL from environment variable or default
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://pixe-backend-83iz.onrender.com";

// Create separate axios instance for notifications
const notificationsAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
notificationsAPI.interceptors.request.use(
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
notificationsAPI.interceptors.response.use(
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

// Handle API errors for notifications
const handleNotificationError = (error) => {
  console.error("Notification API Error:", error);

  if (error.response) {
    return {
      success: false,
      message:
        error.response.data?.message || "Notification API error occurred",
      statusCode: error.response.status,
      data: null,
    };
  } else if (error.request) {
    return {
      success: false,
      message: "No response from notification server",
      statusCode: null,
      data: null,
    };
  } else {
    return {
      success: false,
      message: error.message || "Unknown notification error",
      statusCode: null,
      data: null,
    };
  }
};

// ===== ADMIN NOTIFICATIONS API =====
export const adminNotificationsAPI = {
  // Get admin notifications list
  getAdminNotifications: async (
    status = "unread",
    page = 1,
    limit = 20,
    priority = null,
    type = null
  ) => {
    try {
      let url = `/api/notifications/admin/list?status=${status}&page=${page}&limit=${limit}`;
      if (priority) url += `&priority=${priority}`;
      if (type) url += `&type=${type}`;

      const response = await notificationsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        unreadCount: response.data.unreadCount || 0,
        pagination: response.data.pagination || {},
        message: "Admin notifications fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get all admin notifications (read and unread)
  getAllAdminNotifications: async (
    page = 1,
    limit = 50,
    sortBy = "createdAt",
    sortOrder = "desc"
  ) => {
    try {
      const url = `/api/notifications/admin/all?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      const response = await notificationsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "All admin notifications fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    try {
      const response = await notificationsAPI.get(
        `/api/notifications/admin/${notificationId}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification details fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await notificationsAPI.patch(
        `/api/notifications/${notificationId}/read`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification marked as read successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Mark multiple notifications as read
  markMultipleAsRead: async (notificationIds) => {
    try {
      const response = await notificationsAPI.patch(
        "/api/notifications/admin/mark-multiple-read",
        {
          notificationIds,
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Multiple notifications marked as read successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    try {
      const response = await notificationsAPI.patch(
        "/api/notifications/admin/mark-all-read"
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "All notifications marked as read successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get notification counts
  getNotificationCounts: async () => {
    try {
      const response = await notificationsAPI.get(
        "/api/notifications/admin/counts"
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification counts fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await notificationsAPI.delete(
        `/api/notifications/${notificationId}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification deleted successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Delete multiple notifications
  deleteMultipleNotifications: async (notificationIds) => {
    try {
      const response = await notificationsAPI.delete(
        "/api/notifications/admin/delete-multiple",
        {
          data: { notificationIds },
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Multiple notifications deleted successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Archive notification
  archiveNotification: async (notificationId) => {
    try {
      const response = await notificationsAPI.patch(
        `/api/notifications/${notificationId}/archive`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification archived successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get archived notifications
  getArchivedNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await notificationsAPI.get(
        `/api/notifications/admin/archived?page=${page}&limit=${limit}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Archived notifications fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },
};

// ===== NOTIFICATION CREATION API =====
export const notificationCreationAPI = {
  // Create notification for admin
  createNotification: async (notificationData) => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/admin/create",
        notificationData
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification created successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Create bulk notifications
  createBulkNotifications: async (notificationsData) => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/admin/create-bulk",
        {
          notifications: notificationsData,
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Bulk notifications created successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Create system notification
  createSystemNotification: async (notificationData) => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/system/create",
        notificationData
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "System notification created successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Create scheduled notification
  createScheduledNotification: async (notificationData, scheduledTime) => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/admin/schedule",
        {
          ...notificationData,
          scheduledTime,
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Scheduled notification created successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Update notification
  updateNotification: async (notificationId, updateData) => {
    try {
      const response = await notificationsAPI.patch(
        `/api/notifications/${notificationId}`,
        updateData
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification updated successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },
};

// ===== NOTIFICATION PREFERENCES API =====
export const notificationPreferencesAPI = {
  // Get admin notification preferences
  getAdminPreferences: async () => {
    try {
      const response = await notificationsAPI.get(
        "/api/notifications/admin/preferences"
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Admin notification preferences fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Update admin notification preferences
  updateAdminPreferences: async (preferences) => {
    try {
      const response = await notificationsAPI.patch(
        "/api/notifications/admin/preferences",
        preferences
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Admin notification preferences updated successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get notification channels
  getNotificationChannels: async () => {
    try {
      const response = await notificationsAPI.get(
        "/api/notifications/channels"
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification channels fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Update notification channel settings
  updateChannelSettings: async (channelId, settings) => {
    try {
      const response = await notificationsAPI.patch(
        `/api/notifications/channels/${channelId}`,
        settings
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification channel settings updated successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Test notification channel
  testNotificationChannel: async (channelType, testData) => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/channels/test",
        {
          channelType,
          testData,
        }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification channel test completed successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },
};

// ===== NOTIFICATION TEMPLATES API =====
export const notificationTemplatesAPI = {
  // Get notification templates
  getNotificationTemplates: async (
    type = null,
    category = null,
    page = 1,
    limit = 20
  ) => {
    try {
      let url = `/api/notifications/templates?page=${page}&limit=${limit}`;
      if (type) url += `&type=${type}`;
      if (category) url += `&category=${category}`;

      const response = await notificationsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Notification templates fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get template by ID
  getTemplateById: async (templateId) => {
    try {
      const response = await notificationsAPI.get(
        `/api/notifications/templates/${templateId}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification template fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Create notification template
  createTemplate: async (templateData) => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/templates",
        templateData
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification template created successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Update notification template
  updateTemplate: async (templateId, templateData) => {
    try {
      const response = await notificationsAPI.patch(
        `/api/notifications/templates/${templateId}`,
        templateData
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification template updated successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Delete notification template
  deleteTemplate: async (templateId) => {
    try {
      const response = await notificationsAPI.delete(
        `/api/notifications/templates/${templateId}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification template deleted successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Preview notification template
  previewTemplate: async (templateId, previewData = {}) => {
    try {
      const response = await notificationsAPI.post(
        `/api/notifications/templates/${templateId}/preview`,
        previewData
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification template preview generated successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },
};

// ===== NOTIFICATION DELIVERY API =====
export const notificationDeliveryAPI = {
  // Get delivery status
  getDeliveryStatus: async (notificationId) => {
    try {
      const response = await notificationsAPI.get(
        `/api/notifications/${notificationId}/delivery-status`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Delivery status fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get delivery analytics
  getDeliveryAnalytics: async (
    startDate = null,
    endDate = null,
    channelType = null
  ) => {
    try {
      let url = `/api/notifications/delivery/analytics`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (channelType) params.append("channelType", channelType);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await notificationsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Delivery analytics fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Retry failed notification
  retryNotification: async (notificationId) => {
    try {
      const response = await notificationsAPI.post(
        `/api/notifications/${notificationId}/retry`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification retry initiated successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get failed notifications
  getFailedNotifications: async (page = 1, limit = 20, channelType = null) => {
    try {
      let url = `/api/notifications/delivery/failed?page=${page}&limit=${limit}`;
      if (channelType) url += `&channelType=${channelType}`;

      const response = await notificationsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Failed notifications fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get delivery logs
  getDeliveryLogs: async (notificationId, page = 1, limit = 10) => {
    try {
      const response = await notificationsAPI.get(
        `/api/notifications/${notificationId}/delivery-logs?page=${page}&limit=${limit}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Delivery logs fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },
};

// ===== NOTIFICATION QUEUE API =====
export const notificationQueueAPI = {
  // Get notification queue status
  getQueueStatus: async () => {
    try {
      const response = await notificationsAPI.get(
        "/api/notifications/queue/status"
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Queue status fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get pending notifications
  getPendingNotifications: async (page = 1, limit = 20, priority = null) => {
    try {
      let url = `/api/notifications/queue/pending?page=${page}&limit=${limit}`;
      if (priority) url += `&priority=${priority}`;

      const response = await notificationsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Pending notifications fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get scheduled notifications
  getScheduledNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await notificationsAPI.get(
        `/api/notifications/queue/scheduled?page=${page}&limit=${limit}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: "Scheduled notifications fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Cancel scheduled notification
  cancelScheduledNotification: async (notificationId) => {
    try {
      const response = await notificationsAPI.delete(
        `/api/notifications/queue/scheduled/${notificationId}`
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Scheduled notification cancelled successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Update notification priority
  updateNotificationPriority: async (notificationId, priority) => {
    try {
      const response = await notificationsAPI.patch(
        `/api/notifications/${notificationId}/priority`,
        { priority }
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification priority updated successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Pause notification queue
  pauseQueue: async () => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/queue/pause"
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification queue paused successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Resume notification queue
  resumeQueue: async () => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/queue/resume"
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification queue resumed successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },
};

// ===== NOTIFICATION REPORTING API =====
export const notificationReportingAPI = {
  // Get notification reports
  getNotificationReports: async (
    reportType = "summary",
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/notifications/reports/${reportType}`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await notificationsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Notification reports fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Generate custom report
  generateCustomReport: async (reportConfig) => {
    try {
      const response = await notificationsAPI.post(
        "/api/notifications/reports/custom",
        reportConfig
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Custom notification report generated successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Export notification report
  exportNotificationReport: async (
    reportType,
    format = "csv",
    startDate = null,
    endDate = null
  ) => {
    try {
      let url = `/api/notifications/reports/${reportType}/export?format=${format}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await notificationsAPI.get(url, {
        responseType: "blob",
      });

      return {
        success: true,
        data: response.data,
        message: "Notification report exported successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },

  // Get engagement metrics
  getEngagementMetrics: async (
    startDate = null,
    endDate = null,
    groupBy = "day"
  ) => {
    try {
      let url = `/api/notifications/reports/engagement?groupBy=${groupBy}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await notificationsAPI.get(url);
      return {
        success: true,
        data: response.data.data || response.data,
        message: "Engagement metrics fetched successfully",
      };
    } catch (error) {
      return handleNotificationError(error);
    }
  },
};

// Export all notification APIs
export default {
  adminNotificationsAPI,
  notificationCreationAPI,
  notificationPreferencesAPI,
  notificationTemplatesAPI,
  notificationDeliveryAPI,
  notificationQueueAPI,
  notificationReportingAPI,
};
