// src/components/FeatureCards/FeatureCards.jsx
import React from "react";
import "./FeatureCards.css";
import { Link } from "react-router-dom";

const FeatureCards = () => {
  const features = [
    {
      id: 1,
      icon: "channels",
      title: "Social Channels",
      description: "One stop solution to manage your channels.",
      buttonText: "Go To Channels",
      buttonLink: "/channels",
    },
    {
      id: 2,
      icon: "crm",
      title: "Contact Management",
      description: "One stop solution to manage your contacts.",
      buttonText: "Go To CRM",
      buttonLink: "/crm",
    },
    {
      id: 3,
      icon: "inbox",
      title: "Chats",
      description: "Manage all your chats via unified team inbox.",
      buttonText: "Go To Unified Team Inbox",
      buttonLink: "/chats",
    },

    {
      id: 4,
      icon: "bot",
      title: "Bot Builder",
      description: "Create chat bots with our Visual Flow Builder",
      buttonText: "Go To Bot Builder",
      buttonLink: "/bot-builder",
    },
    {
      id: 5,
      icon: "automation",
      title: "Automation Builder",
      description: "Drag-n-Drop Software Automation Builder.",
      buttonText: "Go To Automations Builder",
      buttonLink: "/automation-builder",
    },
    {
      id: 6,
      icon: "whatsapp",
      title: "WhatsApp MiniApps",
      description: "Create WhatsApp Native Flows",
      buttonText: "Go To WhatsApp MiniApps",
      buttonLink: "/whatsapp-miniapps",
    },
    {
      id: 7,
      icon: "ecommerce",
      title: "Ecommerce",
      description: "One Stop Solution",
      buttonText: "Go To Ecommerce",
      buttonLink: "/ecommerce",
    },
    {
      id: 8,
      icon: "calendar",
      title: "Calendar Bookings",
      description: "Schedule And Manage Appointment Bookings Easily.",
      buttonText: "Go To Calendar",
      buttonLink: "/calendar",
    },
    {
      id: 9,
      icon: "media",
      title: "Media Manager",
      description: "Media Manager Bot",
      buttonText: "Go To Media Manager",
      buttonLink: "/media-manager",
    },
    // {
    //   id: 10,
    //   icon: "rewards",
    //   title: "Rewardz",
    //   description: "Manage Reward Points",
    //   buttonText: "Go To Rewardz",
    //   buttonLink: "/rewards",
    // },
    {
      id: 11,
      icon: "chat",
      title: "Chat Widget",
      description: "Create Chat Widget for Your Website",
      buttonText: "Go To Chat Widget",
      buttonLink: "/chat-widget",
    },
    {
      id: 12,
      icon: "experiences",
      title: "Dynamic Experiences",
      description: "Dynamic Experiences",
      buttonText: "Go To Dynamic Experiences",
      buttonLink: "/dynamic-experiences",
    },
    {
      id: 13,
      icon: "payments",
      title: "Payments",
      description: "Manage Payments and Subscriptions",
      buttonText: "Go To Payments",
      buttonLink: "/payments",
    },
  ];

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "channels":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1"
              stroke="#25D366"
              strokeWidth="2"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1"
              stroke="#25D366"
              strokeWidth="2"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1"
              stroke="#25D366"
              strokeWidth="2"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1"
              stroke="#25D366"
              strokeWidth="2"
            />
          </svg>
        );
      case "crm":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 11C9.10457 11 10 10.1046 10 9C10 7.89543 9.10457 7 8 7C6.89543 7 6 7.89543 6 9C6 10.1046 6.89543 11 8 11Z"
              stroke="#25D366"
              strokeWidth="2"
            />
            <path
              d="M16 11H13M16 7H13M16 15H8"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "inbox":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 12H16L14 15H10L8 12H2"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "bot":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="7"
              width="18"
              height="14"
              rx="2"
              stroke="#25D366"
              strokeWidth="2"
            />
            <path
              d="M8 12H8.01M12 12H12.01M16 12H16.01"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 3L12 7L8 3"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "automation":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L6 7M12 2L18 7M12 2V18M19 22H5"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "whatsapp":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 21L5 15L3 9L12 3L21 9L19 15L21 21L12 17L3 21Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V12"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="15" r="1" fill="#25D366" />
          </svg>
        );
      case "ecommerce":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "calendar":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              stroke="#25D366"
              strokeWidth="2"
            />
            <path
              d="M16 2V6"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 2V6"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 10H21"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 14H8.01"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 14H12.01"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 14H16.01"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 18H8.01"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 18H12.01"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 18H16.01"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "media":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
              stroke="#25D366"
              strokeWidth="2"
            />
            <path
              d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
              stroke="#25D366"
              strokeWidth="2"
            />
            <path
              d="M21 15L16 10L5 21"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "rewards":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.21 13.89L7 22.99L12 19.99L17 22.99L15.79 13.88"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "chat":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C10.7282 21 9.52224 20.7439 8.42883 20.2786C8.29851 20.2274 8.1563 20.216 8.01909 20.2456L3.64322 21.108C3.12475 21.2055 2.79449 20.8752 2.89197 20.3568L3.7544 15.9809C3.78403 15.8437 3.7726 15.7015 3.72143 15.5712C3.25608 14.4778 3 13.2718 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 10.5H16"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 14H13"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "experiences":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#25D366"
              strokeWidth="2"
            />
            <path
              d="M7.5 12L10.5 15L16.5 9"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "payments":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="2"
              stroke="#25D366"
              strokeWidth="2"
            />
            <path d="M2 10H22" stroke="#25D366" strokeWidth="2" />
            <path
              d="M6 15H10"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="feature-cards-container">
      {features.map((feature) => (
        <div className="feature-card" key={feature.id}>
          <div className="feature-icon">{getIconComponent(feature.icon)}</div>
          <h3 className="feature-title">{feature.title}</h3>
          <p className="feature-description">{feature.description}</p>
          <Link to={feature.buttonLink} className="feature-button">
            {feature.buttonText} <span>&rarr;</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
