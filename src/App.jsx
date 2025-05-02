// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Chats from "./pages/Chats/Chats";
import TemplateMessageSelector from "./pages/Chats/components/TemplateMessageSelector";

import BroadcastList from "./pages/BroadcastList/BroadcastList";
import Analytics from "./pages/Analytics/Analytics";
import Customers from "./pages/Customers/Customers";
import Login from "./pages/Login/Login";
import Channels from "./pages/Channels/Channels";
import CRM from "./pages/CRM/CRM";
import BotBuilder from "./pages/BotBuilder/BotBuilder";
import AutomationBuilder from "./pages/AutomationBuilder/AutomationBuilder";
import AutomationWorkflow from "./pages/AutomationBuilder/AutomationWorkflow";
import WhatsAppMiniApps from "./pages/WhatsAppMiniApps/WhatsAppMiniApps";
import FlowEditor from "./pages/WhatsAppMiniApps/FlowEditor";
import Ecommerce from "./pages/Ecommerce/Ecommerce";
import ProductForm from "./pages/Ecommerce/ProductForm";
import WhatsAppAPISetup from "./pages/Channels/WhatsAppAPISetup";
import BusinessProfile from "./pages/Channels/BusinessProfile";
import TemplateManager from "./pages/Channels/TemplateManager";
import TemplateCreator from "./pages/Channels/TemplateCreator";
import QRCodeGenerator from "./pages/Channels/QRCodeGenerator";
import ConversationAutomation from "./pages/Channels/ConversationAutomation";
import APIIntegration from "./pages/Channels/APIIntegration";
import AccountQuality from "./pages/Channels/AccountQuality";
import MessagingAnalytics from "./pages/Channels/MessagingAnalytics";

import CalendarBookings from "./pages/CalendarBookings/CalendarBookings";

import MediaManager from "./pages/MediaManager/MediaManager";
import ChatWidget from "./pages/ChatWidget/ChatWidget";
import ChatWidgetForm from "./pages/ChatWidget/ChatWidgetForm";
import ChatWidgetWebhook from "./pages/ChatWidget/ChatWidgetWebhook";

import "./App.css";
import Payments from "./pages/Payments/Payments";
import DynamicExperiences from "./pages/DynamicExperiences/DynamicExperiences";

// Placeholder page for routes under development
const PlaceholderPage = () => {
  const { pageName } = useParams();

  const formatPageName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="page-container">
      <h1>{formatPageName(pageName)}</h1>
      <p>This page is currently under development.</p>
    </div>
  );
};

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
      document.body.classList.remove("login-mode");
    } else {
      document.body.classList.add("login-mode");
    }
  }, []);

  const handleSidebarExpand = () => {
    setSidebarExpanded(true);
  };

  const handleSidebarCollapse = () => {
    setSidebarExpanded(false);
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="app">
        {/* Only show header if logged in */}
        {isLoggedIn && <Header />}

        <div className="main-container">
          {/* Only show sidebar if logged in */}
          {isLoggedIn && (
            <Sidebar
              onMouseEnter={handleSidebarExpand}
              onMouseLeave={handleSidebarCollapse}
            />
          )}

          {/* Adjust main-content based on login status */}
          <div
            className={`main-content ${
              isLoggedIn
                ? sidebarExpanded
                  ? "sidebar-expanded"
                  : ""
                : "login-view"
            }`}
          >
            <Routes>
              {/* Login route */}
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to="/" replace />
                  ) : (
                    <Login setIsLoggedIn={setIsLoggedIn} />
                  )
                }
              />
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chats"
                element={
                  <ProtectedRoute>
                    <Chats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/broadcast-list"
                element={
                  <ProtectedRoute>
                    <BroadcastList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/channels"
                element={
                  <ProtectedRoute>
                    <Channels />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/channels/whatsapp/setup"
                element={
                  <ProtectedRoute>
                    <WhatsAppAPISetup />
                  </ProtectedRoute>
                }
              />
              {/* Business Profile Management */}
              <Route
                path="/channels/whatsapp/profile"
                element={
                  <ProtectedRoute>
                    <BusinessProfile />
                  </ProtectedRoute>
                }
              />
              {/* Templates Management */}
              <Route
                path="/channels/templates"
                element={
                  <ProtectedRoute>
                    <TemplateManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/channels/templates/create"
                element={
                  <ProtectedRoute>
                    <TemplateCreator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/channels/templates/:id/edit"
                element={
                  <ProtectedRoute>
                    <TemplateCreator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/channels/templates/:id/test"
                element={
                  <ProtectedRoute>
                    <APIIntegration />
                  </ProtectedRoute>
                }
              />
              {/* QR Code Generator */}
              <Route
                path="/channels/whatsapp/qr-code"
                element={
                  <ProtectedRoute>
                    <QRCodeGenerator />
                  </ProtectedRoute>
                }
              />
              {/* Conversation Automation */}
              <Route
                path="/channels/whatsapp/conversation-automation"
                element={
                  <ProtectedRoute>
                    <ConversationAutomation />
                  </ProtectedRoute>
                }
              />
              {/* API Integration */}
              <Route
                path="/channels/whatsapp/api"
                element={
                  <ProtectedRoute>
                    <APIIntegration />
                  </ProtectedRoute>
                }
              />
              {/* Account Quality */}
              <Route
                path="/channels/whatsapp/quality"
                element={
                  <ProtectedRoute>
                    <AccountQuality />
                  </ProtectedRoute>
                }
              />
              {/* Messaging Analytics */}
              <Route
                path="/channels/whatsapp/analytics"
                element={
                  <ProtectedRoute>
                    <MessagingAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crm"
                element={
                  <ProtectedRoute>
                    <CRM />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bot-builder"
                element={
                  <ProtectedRoute>
                    <BotBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/automation-builder"
                element={
                  <ProtectedRoute>
                    <AutomationBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/automation-builder/create"
                element={
                  <ProtectedRoute>
                    <AutomationWorkflow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/automation-builder/edit/:id"
                element={
                  <ProtectedRoute>
                    <AutomationWorkflow />
                  </ProtectedRoute>
                }
              />
              {/* WhatsApp MiniApps Routes */}
              <Route
                path="/whatsapp-miniapps"
                element={
                  <ProtectedRoute>
                    <WhatsAppMiniApps />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/whatsapp-miniapps/create"
                element={
                  <ProtectedRoute>
                    <FlowEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/whatsapp-miniapps/edit/:id"
                element={
                  <ProtectedRoute>
                    <FlowEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/whatsapp-miniapps/view/:id"
                element={
                  <ProtectedRoute>
                    <FlowEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ecommerce"
                element={
                  <ProtectedRoute>
                    <Ecommerce />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ecommerce/products/new"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ecommerce/products/edit/:id"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarBookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/media-manager"
                element={
                  <ProtectedRoute>
                    <MediaManager />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat-widget"
                element={
                  <ProtectedRoute>
                    <ChatWidget />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat-widget/create"
                element={
                  <ProtectedRoute>
                    <ChatWidgetForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat-widget/edit/:id"
                element={
                  <ProtectedRoute>
                    <ChatWidgetForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat-widget/webhook/:id"
                element={
                  <ProtectedRoute>
                    <ChatWidgetWebhook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments/send"
                element={
                  <ProtectedRoute>
                    <PlaceholderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments/campaign"
                element={
                  <ProtectedRoute>
                    <PlaceholderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments/templates"
                element={
                  <ProtectedRoute>
                    <PlaceholderPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dynamic-experiences"
                element={
                  <ProtectedRoute>
                    <DynamicExperiences />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dynamic-experiences/:methodId"
                element={
                  <ProtectedRoute>
                    <PlaceholderPage />
                  </ProtectedRoute>
                }
              />

              {/* Placeholder route for pages under development */}
              <Route
                path="/:pageName"
                element={
                  <ProtectedRoute>
                    <PlaceholderPage />
                  </ProtectedRoute>
                }
              />
              {/* Logout route handler */}
              <Route
                path="/logout"
                element={<LogoutHandler setIsLoggedIn={setIsLoggedIn} />}
              />
              {/* Redirect to login for unmatched routes */}
              <Route
                path="*"
                element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

// Helper component to handle logout route
const LogoutHandler = ({ setIsLoggedIn }) => {
  useEffect(() => {
    // Clear authentication data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isRemembered");

    // Update state
    setIsLoggedIn(false);

    // Add login-mode class
    document.body.classList.add("login-mode");
  }, [setIsLoggedIn]);

  // Redirect to login
  return <Navigate to="/login" replace />;
};

export default App;
