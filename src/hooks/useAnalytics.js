// src/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from "react";
import {
  statisticsAPI,
  campaignAPI,
  agentAPI,
  userAPI,
  notificationAPI,
} from "../utils/api";

export const useAnalytics = (initialDateRange = "Last 7 days") => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);

  // Analytics data state
  const [data, setData] = useState({
    dashboardStats: null,
    realTimeCounts: {},
    trendData: [],
    campaignStats: [],
    agentStats: [],
    userEngagement: [],
    notificationStats: [],
    activityLogs: [],
  });

  // Date range helper
  const getDateRange = useCallback((range) => {
    const endDate = new Date();
    const startDate = new Date();
    let period = "daily";

    switch (range) {
      case "Last 7 days":
        startDate.setDate(endDate.getDate() - 7);
        period = "daily";
        break;
      case "Last 30 days":
        startDate.setDate(endDate.getDate() - 30);
        period = "daily";
        break;
      case "Last 3 months":
        startDate.setMonth(endDate.getMonth() - 3);
        period = "weekly";
        break;
      case "Last 6 months":
        startDate.setMonth(endDate.getMonth() - 6);
        period = "monthly";
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
        period = "daily";
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      period,
    };
  }, []);

  // Fetch all analytics data
  const fetchData = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const { startDate, endDate, period } = getDateRange(dateRange);

        // Fetch dashboard statistics (main data source)
        const dashboardResponse = await statisticsAPI.getDashboardStats(
          period,
          startDate,
          endDate
        );

        // Fetch additional data with error handling
        const [
          campaignResponse,
          agentResponse,
          userEngagementResponse,
          notificationResponse,
        ] = await Promise.allSettled([
          statisticsAPI.getCampaignStats(null, startDate, endDate),
          statisticsAPI.getAgentStats(null, startDate, endDate),
          statisticsAPI.getUserEngagementStats(startDate, endDate),
          notificationAPI.getAdminNotifications("unread", 1, 10),
        ]);

        // Process responses and handle rejections gracefully
        const newData = {
          dashboardStats: dashboardResponse.data,
          realTimeCounts: dashboardResponse.data?.realTimeCounts || {
            totalAgents: 6,
            activeAgents: 2,
            totalUsers: 2,
            totalCampaigns: 4,
            activeCampaigns: 4,
          },
          trendData: dashboardResponse.data?.trendData || [],
          campaignStats:
            campaignResponse.status === "fulfilled"
              ? campaignResponse.value.data
              : [],
          agentStats:
            agentResponse.status === "fulfilled"
              ? agentResponse.value.data
              : [],
          userEngagement:
            userEngagementResponse.status === "fulfilled"
              ? userEngagementResponse.value.data
              : [],
          notificationStats:
            notificationResponse.status === "fulfilled"
              ? processNotificationStats(notificationResponse.value.data)
              : [],
          lastUpdated: new Date().toISOString(),
        };

        setData(newData);
      } catch (err) {
        setError(err.message || "Failed to fetch analytics data");
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dateRange, getDateRange]
  );

  // Process notifications for stats
  const processNotificationStats = (notifications) => {
    if (!notifications || !Array.isArray(notifications)) return [];

    const stats = notifications.reduce((acc, notification) => {
      const type = notification.type || "other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const colors = {
      campaign_published: "#25D366",
      workflow_created: "#34A853",
      system_update: "#4285F4",
      agent_activity: "#FBBC04",
      user_action: "#EA4335",
      other: "#9E9E9E",
    };

    return Object.entries(stats).map(([type, count]) => ({
      name: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: count,
      color: colors[type] || colors.other,
    }));
  };

  // Export functionality
  const exportData = useCallback(
    async (format = "csv", entityType = null, metricType = null) => {
      try {
        const response = await statisticsAPI.exportStatistics(
          format,
          entityType,
          metricType
        );

        // Create download link
        if (response.data && response.data.downloadUrl) {
          const link = document.createElement("a");
          link.href = response.data.downloadUrl;
          link.download = `analytics-${dateRange
            .toLowerCase()
            .replace(" ", "-")}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Handle blob response
          const blob = new Blob([response.data], {
            type:
              format === "csv"
                ? "text/csv"
                : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `analytics-${dateRange
            .toLowerCase()
            .replace(" ", "-")}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }

        return { success: true, message: `Export completed successfully` };
      } catch (err) {
        console.error("Export error:", err);
        return { success: false, message: err.message || "Export failed" };
      }
    },
    [dateRange]
  );

  // Refresh data
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Update date range
  const updateDateRange = useCallback((newRange) => {
    setDateRange(newRange);
  }, []);

  // Get specific metric
  const getMetric = useCallback(
    (metricPath) => {
      const keys = metricPath.split(".");
      let value = data;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) break;
      }

      return value;
    },
    [data]
  );

  // Calculate percentage change
  const getPercentageChange = useCallback((current, previous) => {
    if (!previous || previous === 0) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  }, []);

  // Get trend indicator
  const getTrendIndicator = useCallback(
    (current, previous) => {
      const change = getPercentageChange(current, previous);
      if (change > 0) return { direction: "up", color: "#34A853", symbol: "↗" };
      if (change < 0)
        return { direction: "down", color: "#EA4335", symbol: "↘" };
      return { direction: "stable", color: "#666", symbol: "→" };
    },
    [getPercentageChange]
  );

  // Generate chart data
  const generateChartData = useCallback(
    (type = "messages") => {
      const { trendData } = data;

      if (!trendData || !trendData.length) {
        // Fallback data
        const fallbackData = {
          messages: [
            { name: "Mon", sent: 65, delivered: 62, read: 55 },
            { name: "Tue", sent: 72, delivered: 70, read: 60 },
            { name: "Wed", sent: 85, delivered: 83, read: 76 },
            { name: "Thu", sent: 90, delivered: 88, read: 75 },
            { name: "Fri", sent: 78, delivered: 76, read: 65 },
            { name: "Sat", sent: 55, delivered: 53, read: 40 },
            { name: "Sun", sent: 50, delivered: 48, read: 35 },
          ],
          campaigns: [
            { name: "Email", impressions: 1200, clicks: 180, conversions: 24 },
            { name: "SMS", impressions: 800, clicks: 120, conversions: 18 },
            { name: "Push", impressions: 600, clicks: 90, conversions: 12 },
            { name: "WhatsApp", impressions: 400, clicks: 80, conversions: 16 },
          ],
          agents: [
            { name: "Week 1", conversations: 45, resolved: 42, rating: 4.5 },
            { name: "Week 2", conversations: 52, resolved: 48, rating: 4.3 },
            { name: "Week 3", conversations: 38, resolved: 36, rating: 4.7 },
            { name: "Week 4", conversations: 61, resolved: 58, rating: 4.6 },
          ],
        };
        return fallbackData[type] || fallbackData.messages;
      }

      // Transform real data based on type
      switch (type) {
        case "messages":
          return trendData.map((item, index) => ({
            name: new Date(item.date).toLocaleDateString("en", {
              weekday: "short",
            }),
            sent: item.messagesSent || 0,
            delivered: item.messagesDelivered || 0,
            read: item.messagesRead || 0,
          }));

        case "campaigns":
          return data.campaignStats.map((item) => ({
            name: item.name || `Campaign ${item.id}`,
            impressions: item.impressions || 0,
            clicks: item.clicks || 0,
            conversions: item.conversions || 0,
          }));

        case "agents":
          return data.agentStats.map((item) => ({
            name: item.period || item.name,
            conversations: item.conversations || 0,
            resolved: item.resolved || 0,
            rating: item.rating || 0,
          }));

        default:
          return trendData;
      }
    },
    [data]
  );

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // State
    loading,
    error,
    refreshing,
    dateRange,
    data,

    // Actions
    refresh,
    updateDateRange,
    exportData,
    fetchData,

    // Utilities
    getMetric,
    getPercentageChange,
    getTrendIndicator,
    generateChartData,
    getDateRange,

    // Computed values
    summaryMetrics: {
      totalAgents: data.realTimeCounts.totalAgents || 0,
      activeAgents: data.realTimeCounts.activeAgents || 0,
      totalUsers: data.realTimeCounts.totalUsers || 0,
      activeCampaigns: data.realTimeCounts.activeCampaigns || 0,
      totalCampaigns: data.realTimeCounts.totalCampaigns || 0,
    },

    // Chart data
    chartData: {
      messages: generateChartData("messages"),
      campaigns: generateChartData("campaigns"),
      agents: generateChartData("agents"),
      notifications: data.notificationStats,
      userEngagement: data.userEngagement,
    },
  };
};

// Hook for real-time updates
export const useRealTimeAnalytics = (intervalMs = 60000) => {
  const analytics = useAnalytics();

  useEffect(() => {
    const interval = setInterval(() => {
      analytics.refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [analytics, intervalMs]);

  return analytics;
};

// Hook for specific metric tracking
export const useMetricTracker = (metricPath, dateRange = "Last 7 days") => {
  const [metricHistory, setMetricHistory] = useState([]);
  const analytics = useAnalytics(dateRange);

  useEffect(() => {
    const currentValue = analytics.getMetric(metricPath);
    if (currentValue !== undefined) {
      setMetricHistory((prev) => [
        ...prev.slice(-9), // Keep last 10 values
        {
          value: currentValue,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [analytics.data, metricPath, analytics]);

  return {
    ...analytics,
    metricHistory,
    currentValue: analytics.getMetric(metricPath),
    trend:
      metricHistory.length > 1
        ? analytics.getTrendIndicator(
            metricHistory[metricHistory.length - 1]?.value,
            metricHistory[metricHistory.length - 2]?.value
          )
        : null,
  };
};

export default useAnalytics;
