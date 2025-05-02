// src/pages/Channels/MessagingAnalytics.jsx

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./MessagingAnalytics.css";

const MessagingAnalytics = () => {
  // Date range state
  const [dateRange, setDateRange] = useState("last7days");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState({
    summary: {
      totalMessages: 0,
      messagesSent: 0,
      messagesReceived: 0,
      conversationsStarted: 0,
      templatesSent: 0,
      deliveryRate: 0,
      readRate: 0,
      responseRate: 0,
    },
    messagesByDay: [],
    messagesByType: [],
    messagesByStatus: [],
    topTemplates: [],
    conversationsByHour: [],
  });

  // Load analytics data based on date range
  useEffect(() => {
    // Generate mock data for development
    generateMockData();
  }, [dateRange, customDateRange]);

  // Generate mock data for development
  const generateMockData = () => {
    // Determine date range
    let days = 7;
    if (dateRange === "last30days") days = 30;
    if (dateRange === "last90days") days = 90;

    // Mock message by day data
    const messagesByDay = [];
    let runningTotal = 0;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));

      const sent = Math.floor(Math.random() * 100) + 50;
      const received = Math.floor(Math.random() * 80) + 30;

      runningTotal += sent + received;

      messagesByDay.push({
        date: date.toISOString().split("T")[0],
        sent,
        received,
        total: sent + received,
      });
    }

    // Mock message by type data
    const messagesByType = [
      { name: "Text", value: Math.floor(Math.random() * 1000) + 500 },
      { name: "Image", value: Math.floor(Math.random() * 300) + 200 },
      { name: "Video", value: Math.floor(Math.random() * 150) + 50 },
      { name: "Document", value: Math.floor(Math.random() * 100) + 30 },
      { name: "Template", value: Math.floor(Math.random() * 800) + 400 },
    ];

    // Mock message by status data
    const messagesByStatus = [
      { name: "Delivered", value: Math.floor(Math.random() * 800) + 1500 },
      { name: "Read", value: Math.floor(Math.random() * 700) + 1200 },
      { name: "Failed", value: Math.floor(Math.random() * 50) + 10 },
      { name: "Pending", value: Math.floor(Math.random() * 30) + 5 },
    ];

    // Mock top templates data
    const topTemplates = [
      {
        name: "order_confirmation",
        sent: Math.floor(Math.random() * 300) + 200,
        delivered: Math.floor(Math.random() * 280) + 190,
        read: Math.floor(Math.random() * 250) + 150,
      },
      {
        name: "shipping_update",
        sent: Math.floor(Math.random() * 250) + 150,
        delivered: Math.floor(Math.random() * 240) + 140,
        read: Math.floor(Math.random() * 200) + 120,
      },
      {
        name: "payment_reminder",
        sent: Math.floor(Math.random() * 200) + 100,
        delivered: Math.floor(Math.random() * 190) + 95,
        read: Math.floor(Math.random() * 150) + 80,
      },
      {
        name: "welcome_message",
        sent: Math.floor(Math.random() * 180) + 90,
        delivered: Math.floor(Math.random() * 170) + 85,
        read: Math.floor(Math.random() * 130) + 70,
      },
      {
        name: "appointment_reminder",
        sent: Math.floor(Math.random() * 150) + 80,
        delivered: Math.floor(Math.random() * 140) + 75,
        read: Math.floor(Math.random() * 110) + 60,
      },
    ];

    // Mock conversations by hour data
    const conversationsByHour = [];
    for (let hour = 0; hour < 24; hour++) {
      conversationsByHour.push({
        hour: hour,
        count:
          Math.floor(Math.random() * 50) + (hour >= 8 && hour <= 20 ? 30 : 5),
      });
    }

    // Calculate summary metrics
    const messagesSent = messagesByDay.reduce((sum, day) => sum + day.sent, 0);
    const messagesReceived = messagesByDay.reduce(
      (sum, day) => sum + day.received,
      0
    );
    const totalMessages = messagesSent + messagesReceived;

    const totalSent = messagesByStatus.reduce(
      (sum, status) => sum + status.value,
      0
    );
    const delivered =
      messagesByStatus.find((s) => s.name === "Delivered")?.value || 0;
    const read = messagesByStatus.find((s) => s.name === "Read")?.value || 0;

    const deliveryRate = Math.round((delivered / totalSent) * 100);
    const readRate = Math.round((read / delivered) * 100);
    const responseRate = Math.round((messagesReceived / messagesSent) * 65); // Assuming not all sent messages get responses

    // Set analytics data
    setAnalyticsData({
      summary: {
        totalMessages,
        messagesSent,
        messagesReceived,
        conversationsStarted: Math.floor(totalMessages * 0.3), // Approximate
        templatesSent:
          messagesByType.find((t) => t.name === "Template")?.value || 0,
        deliveryRate,
        readRate,
        responseRate,
      },
      messagesByDay,
      messagesByType,
      messagesByStatus,
      topTemplates,
      conversationsByHour,
    });
  };

  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  // Handle custom date range change
  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Colors for charts
  const COLORS = ["#25D366", "#128C7E", "#075E54", "#34B7F1", "#ECE5DD"];

  return (
    <div className="messaging-analytics-container">
      <h1>WhatsApp Messaging Analytics</h1>

      <div className="analytics-controls">
        <div className="date-range-selector">
          <label htmlFor="dateRange">Date Range:</label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={handleDateRangeChange}
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === "custom" && (
            <div className="custom-date-inputs">
              <input
                type="date"
                name="startDate"
                value={customDateRange.startDate}
                onChange={handleCustomDateChange}
                placeholder="Start Date"
              />
              <span>to</span>
              <input
                type="date"
                name="endDate"
                value={customDateRange.endDate}
                onChange={handleCustomDateChange}
                placeholder="End Date"
              />
            </div>
          )}
        </div>

        <button className="export-btn">Export Data</button>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-value">
            {analyticsData.summary.totalMessages.toLocaleString()}
          </div>
          <div className="summary-label">Total Messages</div>
        </div>

        <div className="summary-card">
          <div className="summary-value">
            {analyticsData.summary.messagesSent.toLocaleString()}
          </div>
          <div className="summary-label">Messages Sent</div>
        </div>

        <div className="summary-card">
          <div className="summary-value">
            {analyticsData.summary.messagesReceived.toLocaleString()}
          </div>
          <div className="summary-label">Messages Received</div>
        </div>

        <div className="summary-card">
          <div className="summary-value">
            {analyticsData.summary.conversationsStarted.toLocaleString()}
          </div>
          <div className="summary-label">Conversations Started</div>
        </div>

        <div className="summary-card">
          <div className="summary-value">
            {analyticsData.summary.templatesSent.toLocaleString()}
          </div>
          <div className="summary-label">Templates Sent</div>
        </div>

        <div className="summary-card">
          <div className="summary-value">
            {analyticsData.summary.deliveryRate}%
          </div>
          <div className="summary-label">Delivery Rate</div>
        </div>

        <div className="summary-card">
          <div className="summary-value">{analyticsData.summary.readRate}%</div>
          <div className="summary-label">Read Rate</div>
        </div>

        <div className="summary-card">
          <div className="summary-value">
            {analyticsData.summary.responseRate}%
          </div>
          <div className="summary-label">Response Rate</div>
        </div>
      </div>

      <div className="analytics-charts">
        {/* Messages Over Time Chart */}
        <div className="analytics-chart-container">
          <h2>Messages Over Time</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.messagesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [value, ""]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString()
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sent"
                  name="Messages Sent"
                  stroke="#128C7E"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="received"
                  name="Messages Received"
                  stroke="#25D366"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Message Types Chart */}
        <div className="analytics-chart-container">
          <h2>Message Types</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.messagesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.messagesByType.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} messages`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Message Status Chart */}
        <div className="analytics-chart-container">
          <h2>Message Status</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.messagesByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value} messages`, ""]} />
                <Bar dataKey="value" fill="#128C7E">
                  {analyticsData.messagesByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversations by Hour Chart */}
        <div className="analytics-chart-container">
          <h2>Conversations by Hour</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.conversationsByHour}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(hour) => `${hour}:00`}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value} conversations`, ""]}
                  labelFormatter={(hour) => `${hour}:00 - ${hour}:59`}
                />
                <Bar dataKey="count" fill="#25D366" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="top-templates-section">
        <h2>Top Templates Performance</h2>

        <div className="templates-table">
          <table>
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Sent</th>
                <th>Delivered</th>
                <th>Read</th>
                <th>Delivery Rate</th>
                <th>Read Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topTemplates.map((template) => (
                <tr key={template.name}>
                  <td>{template.name}</td>
                  <td>{template.sent}</td>
                  <td>{template.delivered}</td>
                  <td>{template.read}</td>
                  <td>
                    {Math.round((template.delivered / template.sent) * 100)}%
                  </td>
                  <td>
                    {Math.round((template.read / template.delivered) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MessagingAnalytics;
