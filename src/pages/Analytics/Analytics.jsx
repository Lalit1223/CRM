// src/pages/Analytics/Analytics.jsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Filter, Download } from "lucide-react";
import "./Analytics.css";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("Last 7 days");

  // Sample data for the charts
  const messageData = [
    { name: "Mon", sent: 65, delivered: 62, read: 55 },
    { name: "Tue", sent: 72, delivered: 70, read: 60 },
    { name: "Wed", sent: 85, delivered: 83, read: 76 },
    { name: "Thu", sent: 90, delivered: 88, read: 75 },
    { name: "Fri", sent: 78, delivered: 76, read: 65 },
    { name: "Sat", sent: 55, delivered: 53, read: 40 },
    { name: "Sun", sent: 50, delivered: 48, read: 35 },
  ];

  const responseData = [
    { name: "Response", value: 75 },
    { name: "No Response", value: 25 },
  ];

  const COLORS = ["#25D366", "#E0E0E0"];

  // Summary data
  const summaryData = [
    { label: "Total Messages Sent", value: 495, change: "+12%" },
    { label: "Delivered Rate", value: "97%", change: "+1%" },
    { label: "Read Rate", value: "85%", change: "+3%" },
    { label: "Response Rate", value: "75%", change: "+5%" },
  ];

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h2>
          Analytics <span className="beta-tag">BETA</span>
        </h2>
        <div className="analytics-controls">
          <div className="date-selector">
            <Calendar size={16} />
            <span>{dateRange}</span>
          </div>
          <button className="filter-btn">
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <button className="export-btn">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="summary-cards">
        {summaryData.map((item, index) => (
          <div key={index} className="summary-card">
            <div className="summary-value">{item.value}</div>
            <div className="summary-label">{item.label}</div>
            <div
              className={`summary-change ${
                item.change.startsWith("+") ? "positive" : "negative"
              }`}
            >
              {item.change}
            </div>
          </div>
        ))}
      </div>

      <div className="chart-containers">
        <div className="chart-container">
          <h3>Message Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={messageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sent" fill="#8884d8" name="Sent" />
              <Bar dataKey="delivered" fill="#4CAF50" name="Delivered" />
              <Bar dataKey="read" fill="#25D366" name="Read" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Response Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={responseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {responseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="more-info">
        <p>
          Note: Analytics is in beta. More detailed insights will be available
          in future updates.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
