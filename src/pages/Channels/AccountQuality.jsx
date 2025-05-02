// src/pages/Channels/AccountQuality.jsx

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./AccountQuality.css";

const AccountQuality = () => {
  // Quality metrics state
  const [qualityData, setQualityData] = useState({
    currentRating: "High", // High, Medium, Low
    ratingColor: "#00c853", // Green, Yellow, Red
    ratingScore: 95,
    messagingLimit: 10000,
    accountStatus: "Connected", // Connected, Flagged, Restricted
    blockReasons: {
      noLongerNeeded: 15,
      didntSignUp: 5,
      spam: 3,
      offensive: 0,
      noReason: 8,
    },
    historicalData: [],
  });

  // Load quality data
  useEffect(() => {
    // Mock data for development
    const mockHistoricalData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));

      // Generate some random data with a general upward trend
      let score = 70 + Math.floor(Math.random() * 10);

      // Add an upward trend
      score += Math.floor(i / 3);

      // Cap at 100
      score = Math.min(score, 100);

      return {
        date: date.toISOString().split("T")[0],
        score,
        status: score > 90 ? "High" : score > 75 ? "Medium" : "Low",
      };
    });

    setQualityData((prev) => ({
      ...prev,
      historicalData: mockHistoricalData,
    }));
  }, []);

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 90) return "#00c853"; // Green
    if (score >= 75) return "#ffab00"; // Yellow
    return "#ff5252"; // Red
  };

  // Get label based on score
  const getScoreLabel = (score) => {
    if (score >= 90) return "High";
    if (score >= 75) return "Medium";
    return "Low";
  };

  // Format date for chart
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Calculate total blocks
  const totalBlocks = Object.values(qualityData.blockReasons).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="account-quality-container">
      <h1>WhatsApp Account Quality</h1>

      <div className="quality-overview">
        <div className="quality-card current-quality">
          <h2>Current Quality Rating</h2>
          <div
            className="quality-indicator"
            style={{ backgroundColor: qualityData.ratingColor }}
          >
            <span className="quality-label">{qualityData.currentRating}</span>
            <span className="quality-score">{qualityData.ratingScore}/100</span>
          </div>
          <p className="quality-description">
            Based on customer feedback and blocking behavior over the past 7
            days.
          </p>
        </div>

        <div className="quality-card messaging-limits">
          <h2>Messaging Limits</h2>
          <div className="limit-value">
            <span className="limit-number">
              {qualityData.messagingLimit.toLocaleString()}
            </span>
            <span className="limit-label">conversations per 24 hours</span>
          </div>
          <p className="limit-description">
            This limit applies to business-initiated conversations.
            User-initiated conversations are unlimited.
          </p>
          <div className="account-status">
            <span className="status-label">Account Status:</span>
            <span
              className={`status-value ${qualityData.accountStatus.toLowerCase()}`}
            >
              {qualityData.accountStatus}
            </span>
          </div>
        </div>

        <div className="quality-card block-reasons">
          <h2>Block Reasons (Last 7 Days)</h2>
          {totalBlocks > 0 ? (
            <div className="block-reasons-chart">
              <div className="block-reason-item">
                <div className="reason-label">No longer needed</div>
                <div className="reason-bar-container">
                  <div
                    className="reason-bar"
                    style={{
                      width: `${
                        (qualityData.blockReasons.noLongerNeeded /
                          totalBlocks) *
                        100
                      }%`,
                      backgroundColor: "#42a5f5",
                    }}
                  ></div>
                </div>
                <div className="reason-count">
                  {qualityData.blockReasons.noLongerNeeded}
                </div>
              </div>

              <div className="block-reason-item">
                <div className="reason-label">Didn't sign up</div>
                <div className="reason-bar-container">
                  <div
                    className="reason-bar"
                    style={{
                      width: `${
                        (qualityData.blockReasons.didntSignUp / totalBlocks) *
                        100
                      }%`,
                      backgroundColor: "#7e57c2",
                    }}
                  ></div>
                </div>
                <div className="reason-count">
                  {qualityData.blockReasons.didntSignUp}
                </div>
              </div>

              <div className="block-reason-item">
                <div className="reason-label">Spam</div>
                <div className="reason-bar-container">
                  <div
                    className="reason-bar"
                    style={{
                      width: `${
                        (qualityData.blockReasons.spam / totalBlocks) * 100
                      }%`,
                      backgroundColor: "#ff7043",
                    }}
                  ></div>
                </div>
                <div className="reason-count">
                  {qualityData.blockReasons.spam}
                </div>
              </div>

              <div className="block-reason-item">
                <div className="reason-label">Offensive messages</div>
                <div className="reason-bar-container">
                  <div
                    className="reason-bar"
                    style={{
                      width: `${
                        (qualityData.blockReasons.offensive / totalBlocks) * 100
                      }%`,
                      backgroundColor: "#ff5252",
                    }}
                  ></div>
                </div>
                <div className="reason-count">
                  {qualityData.blockReasons.offensive}
                </div>
              </div>

              <div className="block-reason-item">
                <div className="reason-label">No reason provided</div>
                <div className="reason-bar-container">
                  <div
                    className="reason-bar"
                    style={{
                      width: `${
                        (qualityData.blockReasons.noReason / totalBlocks) * 100
                      }%`,
                      backgroundColor: "#78909c",
                    }}
                  ></div>
                </div>
                <div className="reason-count">
                  {qualityData.blockReasons.noReason}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-blocks-message">
              No blocks reported in the last 7 days.
            </div>
          )}
        </div>
      </div>

      <div className="quality-history-section">
        <h2>Quality History (Last 30 Days)</h2>

        <div className="quality-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityData.historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`Quality: ${value}`, "Score"]}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                name="Quality Score"
                stroke="#25D366"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="quality-timeline">
          {qualityData.historicalData.map((day, index) => {
            // Only show every 5th day to avoid cluttering
            if (
              index % 5 !== 0 &&
              index !== qualityData.historicalData.length - 1
            ) {
              return null;
            }

            return (
              <div key={day.date} className="timeline-item">
                <div className="timeline-date">{formatDate(day.date)}</div>
                <div
                  className="timeline-point"
                  style={{ backgroundColor: getScoreColor(day.score) }}
                  title={`${day.score}/100 - ${day.status} Quality`}
                ></div>
                <div className="timeline-score">{day.score}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="quality-recommendations">
        <h2>Recommendations to Improve Quality</h2>

        <div className="recommendations-list">
          <div className="recommendation-item">
            <div className="recommendation-icon pause"></div>
            <div className="recommendation-content">
              <h3>Pause Outbound Messages</h3>
              <p>
                When your quality rating drops to yellow or red, consider
                pausing all outbound marketing messages for 7 days to allow your
                quality score to recover.
              </p>
            </div>
          </div>

          <div className="recommendation-item">
            <div className="recommendation-icon target"></div>
            <div className="recommendation-content">
              <h3>Improve Message Targeting</h3>
              <p>
                Ensure you're only messaging customers who have explicitly opted
                in to receive communications. Better targeting leads to higher
                engagement and fewer blocks.
              </p>
            </div>
          </div>

          <div className="recommendation-item">
            <div className="recommendation-icon content"></div>
            <div className="recommendation-content">
              <h3>Optimize Message Content</h3>
              <p>
                Create clear, concise messages that provide immediate value to
                customers. Avoid excessive marketing language, and focus on
                useful information.
              </p>
            </div>
          </div>

          <div className="recommendation-item">
            <div className="recommendation-icon frequency"></div>
            <div className="recommendation-content">
              <h3>Manage Message Frequency</h3>
              <p>
                Avoid sending too many messages in a short period. Space out
                your communications to respect customer preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="quality-faq">
        <h2>Account Quality FAQ</h2>

        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-question">
              What factors affect my quality rating?
            </div>
            <div className="faq-answer">
              Your quality rating is primarily based on how recipients interact
              with your messages. Key factors include: block rate, report rate,
              and opt-out rate over the past 7 days.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              What happens if my quality rating drops to "Low"?
            </div>
            <div className="faq-answer">
              If your quality rating is "Low" (red) for 7 consecutive days, your
              messaging limit may be decreased. In severe cases, your account
              might be restricted temporarily.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              How can I increase my messaging limits?
            </div>
            <div className="faq-answer">
              Messaging limits increase automatically as you maintain a "Medium"
              or "High" quality rating and approach your current limit. Verify
              your business to unlock higher initial limits.
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              What's the difference between "Flagged" and "Restricted" status?
            </div>
            <div className="faq-answer">
              "Flagged" means your quality is low, but you can still send
              messages within your limit. "Restricted" means you've reached your
              messaging limit and cannot send outbound messages for 24 hours,
              but can still respond to customer-initiated conversations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountQuality;
