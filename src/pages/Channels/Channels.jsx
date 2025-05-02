// src/pages/Channels/Channels.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Channels.css";

const Channels = () => {
  const [activeChannels, setActiveChannels] = useState([
    {
      id: 1,
      name: "Business WhatsApp",
      type: "whatsapp",
      phoneNumber: "+918380852111",
      status: "Connected",
      qualityRating: "high",
    },
  ]);

  return (
    <div className="channels-container">
      <h1>Messaging Channels</h1>

      <div className="channels-actions">
        <button className="add-channel-btn">Add New Channel</button>
      </div>

      <div className="channels-list">
        {activeChannels.map((channel) => (
          <div key={channel.id} className="channel-card">
            <div className="channel-icon whatsapp">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 13.7 2.43 15.3 3.21 16.74L2 22L7.26 20.79C8.7 21.57 10.3 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.2 16.10C16.62 16.68 15.88 17 15.1 17C14.65 17 14.19 16.91 13.75 16.72L13.03 16.43L12.29 16.71C11.53 17 10.71 17.15 9.87 17.15C8.92 17.15 8.01 16.92 7.19 16.46L6.92 16.31L6.65 16.46C6.19 16.72 5.67 16.85 5.14 16.85C4.45 16.85 3.79 16.59 3.32 16.13L2.85 15.66V12C2.85 7.41 6.41 3.85 12 3.85C16.89 3.85 20.15 7.11 20.15 12C20.15 13.58 19.63 15.09 18.64 16.28L17.2 16.10Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="channel-info">
              <h2>{channel.name}</h2>
              <div className="channel-meta">
                <span className="channel-number">{channel.phoneNumber}</span>
                <span
                  className={`channel-status ${channel.status.toLowerCase()}`}
                >
                  {channel.status}
                </span>
                <span className={`quality-indicator ${channel.qualityRating}`}>
                  {channel.qualityRating === "high"
                    ? "High Quality"
                    : channel.qualityRating === "medium"
                    ? "Medium Quality"
                    : "Low Quality"}
                </span>
              </div>
            </div>

            <div className="channel-actions">
              <div className="dropdown">
                <button className="dropdown-toggle">Manage</button>
                <div className="dropdown-menu">
                  <Link to="/channels/whatsapp/profile">Business Profile</Link>
                  <Link to="/channels/templates">Templates</Link>
                  <Link to="/channels/whatsapp/qr-code">QR Code</Link>
                  <Link to="/channels/whatsapp/conversation-automation">
                    Conversation Automation
                  </Link>
                  <Link to="/channels/whatsapp/api">API Integration</Link>
                  <Link to="/channels/whatsapp/quality">Account Quality</Link>
                  <Link to="/channels/whatsapp/analytics">Analytics</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="available-channels">
        <h2>Available Channels</h2>

        <div className="available-channels-grid">
          <div className="available-channel-card">
            <div className="channel-icon whatsapp">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 13.7 2.43 15.3 3.21 16.74L2 22L7.26 20.79C8.7 21.57 10.3 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.2 16.10C16.62 16.68 15.88 17 15.1 17C14.65 17 14.19 16.91 13.75 16.72L13.03 16.43L12.29 16.71C11.53 17 10.71 17.15 9.87 17.15C8.92 17.15 8.01 16.92 7.19 16.46L6.92 16.31L6.65 16.46C6.19 16.72 5.67 16.85 5.14 16.85C4.45 16.85 3.79 16.59 3.32 16.13L2.85 15.66V12C2.85 7.41 6.41 3.85 12 3.85C16.89 3.85 20.15 7.11 20.15 12C20.15 13.58 19.63 15.09 18.64 16.28L17.2 16.10Z"
                  fill="white"
                />
              </svg>
            </div>
            <h3>WhatsApp API</h3>
            <p>Connect your business through the WhatsApp Business API.</p>
            <Link to="/channels/whatsapp/setup" className="connect-btn">
              Connect
            </Link>
          </div>

          <div className="available-channel-card">
            <div className="channel-icon facebook">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z"
                  fill="white"
                />
              </svg>
            </div>
            <h3>Facebook Messenger</h3>
            <p>Connect your Facebook Page to enable Messenger integration.</p>
            <button className="connect-btn">Connect</button>
          </div>

          <div className="available-channel-card">
            <div className="channel-icon instagram">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"
                  fill="white"
                />
              </svg>
            </div>
            <h3>Instagram DM</h3>
            <p>Connect your Instagram business account for DM integration.</p>
            <button className="connect-btn">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channels;
