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
      icon: "whatsapp",
      title: "WhatsApp MiniApps",
      description: "Create WhatsApp Native Flows",
      buttonText: "Go To WhatsApp MiniApps",
      buttonLink: "/workflow-builder",
    },
    {
      id: 5,
      icon: "ecommerce",
      title: "Ecommerce",
      description: "One Stop Solution",
      buttonText: "Go To Ecommerce",
      buttonLink: "/ecommerce",
    },
    {
      id: 6,
      icon: "analytics",
      title: "Analytics",
      description: "Comprehensive analytics and reporting",
      buttonText: "Go To Analytics",
      buttonLink: "/analytics",
    },
    {
      id: 7,
      icon: "users",
      title: "Agents",
      description: "Manage and register agents",
      buttonText: "Go To Agents",
      buttonLink: "/agents",
    },
    {
      id: 8,
      icon: "campaign",
      title: "Campaigns",
      description: "Create and manage marketing campaigns",
      buttonText: "Go To Campaigns",
      buttonLink: "/campaigns",
    },
    {
      id: 9,
      icon: "catalog",
      title: "Product Catalogs",
      description: "Manage your product catalogs",
      buttonText: "Go To Product Catalogs",
      buttonLink: "/product-catalogs",
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
      case "analytics":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 20V10"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20V4"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 20V14"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "users":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 21V19C22.9993 18.1136 22.7044 17.2527 22.1614 16.5522C21.6184 15.8517 20.8581 15.3515 20 15.1299"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 3.12988C16.8604 3.35018 17.623 3.85058 18.1676 4.55219C18.7122 5.2538 19.0078 6.11671 19.0078 7.00488C19.0078 7.89305 18.7122 8.75596 18.1676 9.45757C17.623 10.1592 16.8604 10.6596 16 10.8799"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "campaign":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3V21H21"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 14L11 10L15 14L21 8"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12V8H17"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "catalog":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00229 12 2.00229C11.6489 2.00229 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.9978 12 21.9978C12.3511 21.9978 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.27002 6.96002L12 12L20.73 6.96002"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22.08V12"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
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
