// src/pages/Analytics/Analytics.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Activity,
  Eye,
  Bell,
  Clock,
} from "lucide-react";
import {
  statisticsAPI,
  activityLogsAPI,
  notificationsAPI,
} from "../../utils/api";
import "./Analytics.css";

const Analytics = () => {
  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    keyMetrics: [],
    trendData: [],
    entityBreakdown: [],
    realTimeCounts: {},
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // State for UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });
  const [activityFilter, setActivityFilter] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("unread");

  // Pagination state
  const [activityPage, setActivityPage] = useState(1);
  const [notificationPage, setNotificationPage] = useState(1);
  const [activityPagination, setActivityPagination] = useState({});
  const [notificationPagination, setNotificationPagination] = useState({});

  // Fetch all data on component mount and when filters change
  useEffect(() => {
    fetchAllData();
  }, [
    selectedPeriod,
    dateRange,
    activityFilter,
    activityPage,
    notificationStatus,
    notificationPage,
  ]);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch dashboard statistics
      const statsResponse = await statisticsAPI.getDashboardStats(
        selectedPeriod,
        dateRange.startDate,
        dateRange.endDate
      );

      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
      }

      // Fetch activity logs with individual parameters
      const activityResponse = await activityLogsAPI.getAdminActivityLogs(
        activityFilter,
        dateRange.startDate,
        dateRange.endDate,
        activityPage,
        20
      );

      if (activityResponse.success) {
        setActivityLogs(activityResponse.data);
        setActivityPagination(activityResponse.pagination);
      }

      // Fetch notifications with individual parameters
      const notificationResponse = await notificationsAPI.getAdminNotifications(
        notificationStatus,
        notificationPage,
        20
      );

      if (notificationResponse.success) {
        setNotifications(notificationResponse.data);
        setNotificationPagination(notificationResponse.pagination);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const handleExportData = async (
    format = "csv",
    entityType = "campaign",
    metricType = "campaign_impressions"
  ) => {
    try {
      const blob = await statisticsAPI.exportStatistics(
        format,
        entityType,
        metricType
      );

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics_export_${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      setError("Failed to export data. Please try again.");
    }
  };

  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      const response = await notificationsAPI.markNotificationAsRead(
        notificationId
      );
      if (response.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, status: "read" } : notif
          )
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRole = (role) => {
    return role
      ? role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "N/A";
  };

  const getMetricIcon = (metricType) => {
    switch (metricType) {
      case "users":
        return <Users size={20} />;
      case "campaigns":
        return <MessageSquare size={20} />;
      case "agents":
        return <Users size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? (
      <TrendingUp size={16} className="trend-up" />
    ) : (
      <TrendingDown size={16} className="trend-down" />
    );
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div className="header-left">
          <h1>Analytics Dashboard</h1>
          <p>Monitor your platform performance and user activity</p>
        </div>
        <div className="header-right">
          <button className="export-button" onClick={() => handleExportData()}>
            <Download size={16} />
            <span>Export Data</span>
          </button>
          <button className="refresh-button" onClick={handleRefresh}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="analytics-filters">
        <div className="filter-group">
          <label>Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="filter-select"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From:</label>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="date-input"
          />
        </div>

        <div className="filter-group">
          <label>To:</label>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="date-input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <div className="analytics-content">
          {/* Real-time Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Agents</span>
                <Users size={20} className="metric-icon" />
              </div>
              <div className="metric-value">
                {dashboardStats.realTimeCounts?.totalAgents || 0}
              </div>
              <div className="metric-subtitle">
                Active: {dashboardStats.realTimeCounts?.activeAgents || 0}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Users</span>
                <Users size={20} className="metric-icon" />
              </div>
              <div className="metric-value">
                {dashboardStats.realTimeCounts?.totalUsers || 0}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Campaigns</span>
                <MessageSquare size={20} className="metric-icon" />
              </div>
              <div className="metric-value">
                {dashboardStats.realTimeCounts?.totalCampaigns || 0}
              </div>
              <div className="metric-subtitle">
                Active: {dashboardStats.realTimeCounts?.activeCampaigns || 0}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Notifications</span>
                <Bell size={20} className="metric-icon" />
              </div>
              <div className="metric-value">{notifications.length || 0}</div>
              <div className="metric-subtitle">
                {notificationStatus === "unread" ? "Unread" : "Total"}{" "}
                notifications
              </div>
            </div>
          </div>

          <div className="analytics-grid">
            {/* Activity Logs Section */}
            <div className="analytics-section">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <div className="section-filters">
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className="filter-select small"
                  >
                    <option value="">All Actions</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="message_sent">Message Sent</option>
                  </select>
                </div>
              </div>

              <div className="activity-logs">
                {activityLogs.length === 0 ? (
                  <div className="no-data">
                    <Activity size={48} />
                    <p>No activity logs found for the selected period</p>
                  </div>
                ) : (
                  <div className="activity-list">
                    {activityLogs.map((log, index) => (
                      <div key={log._id || index} className="activity-item">
                        <div className="activity-icon">
                          <Activity size={16} />
                        </div>
                        <div className="activity-content">
                          <div className="activity-description">
                            {log.action} -{" "}
                            {log.description || "No description available"}
                          </div>
                          <div className="activity-meta">
                            <span className="activity-user">
                              {log.actorName || "System"}
                            </span>
                            <span className="activity-time">
                              <Clock size={12} />
                              {formatDate(log.createdAt)}
                            </span>
                            <span className={`activity-status ${log.status}`}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activityPagination?.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={activityPage === 1}
                      onClick={() => setActivityPage((prev) => prev - 1)}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {activityPage} of {activityPagination.totalPages}
                    </span>
                    <button
                      disabled={activityPage === activityPagination.totalPages}
                      onClick={() => setActivityPage((prev) => prev + 1)}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications Section */}
            <div className="analytics-section">
              <div className="section-header">
                <h2>Notifications</h2>
                <div className="section-filters">
                  <select
                    value={notificationStatus}
                    onChange={(e) => setNotificationStatus(e.target.value)}
                    className="filter-select small"
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="">All</option>
                  </select>
                </div>
              </div>

              <div className="notifications">
                {notifications.length === 0 ? (
                  <div className="no-data">
                    <Bell size={48} />
                    <p>No notifications found</p>
                  </div>
                ) : (
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-item ${
                          notification.status === "unread" ? "unread" : ""
                        }`}
                        onClick={() =>
                          handleMarkNotificationAsRead(notification._id)
                        }
                      >
                        <div className="notification-icon">
                          <Bell size={16} />
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">
                            {notification.title}
                          </div>
                          <div className="notification-description">
                            {notification.description}
                          </div>
                          <div className="notification-meta">
                            <span
                              className={`notification-priority ${notification.priority}`}
                            >
                              {notification.priority}
                            </span>
                            <span className="notification-time">
                              <Clock size={12} />
                              {formatDate(notification.createdAt)}
                            </span>
                            <span className="notification-type">
                              {notification.type}
                            </span>
                          </div>
                        </div>
                        {notification.status === "unread" && (
                          <div className="unread-indicator"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {notificationPagination?.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      disabled={notificationPage === 1}
                      onClick={() => setNotificationPage((prev) => prev - 1)}
                      className="pagination-button"
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {notificationPage} of{" "}
                      {notificationPagination.totalPages}
                    </span>
                    <button
                      disabled={
                        notificationPage === notificationPagination.totalPages
                      }
                      onClick={() => setNotificationPage((prev) => prev + 1)}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Metrics Section (if available) */}
          {dashboardStats.keyMetrics &&
            dashboardStats.keyMetrics.length > 0 && (
              <div className="analytics-section full-width">
                <div className="section-header">
                  <h2>Key Performance Metrics</h2>
                </div>
                <div className="metrics-detailed">
                  {dashboardStats.keyMetrics.map((metric, index) => (
                    <div key={index} className="detailed-metric-card">
                      <div className="metric-header">
                        {getMetricIcon(metric.type)}
                        <span className="metric-name">{metric.name}</span>
                      </div>
                      <div className="metric-value">{metric.value}</div>
                      <div className="metric-change">
                        {getTrendIcon(metric.trend)}
                        <span className={`change-text ${metric.trend}`}>
                          {metric.changePercent}% vs last period
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
