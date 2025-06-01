// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import { AgentsList, AgentRegistration, AgentEdit } from "./pages/Agents";

// Import all pages
import Home from "./pages/Home/Home";
import Chats from "./pages/Chats/Chats";
import BroadcastList from "./pages/BroadcastList/BroadcastList";
import Analytics from "./pages/Analytics/Analytics";
import Customers from "./pages/Customers/Customers";
import Channels from "./pages/Channels/Channels";
import CRM from "./pages/CRM/CRM";

// import BotBuilder from "./pages/BotBuilder/BotBuilder";
// import BotManagement from "./pages/BotBuilder/components/BotManagement";
// import AutomationBuilder from "./pages/AutomationBuilder/AutomationBuilder";
// import AutomationWorkflow from "./pages/AutomationBuilder/AutomationWorkflow";
import WhatsAppMiniApps from "./pages/WhatsAppMiniApps/WhatsAppMiniApps";
import FlowEditor from "./pages/WhatsAppMiniApps/FlowEditor";
import VisualFlowEditor from "./pages/WhatsAppMiniApps/VisualFlowEditor/VisualFlowEditor";

import Ecommerce from "./pages/Ecommerce/Ecommerce";
import ProductForm from "./pages/Ecommerce/ProductForm";
import ProductDetailView from "./pages/Ecommerce/ProductDetailView";

// Channel-related components
// import WhatsAppAPISetup from "./pages/Channels/WhatsAppAPISetup";
// import BusinessProfile from "./pages/Channels/BusinessProfile";
// import TemplateManager from "./pages/Channels/TemplateManager";
// import TemplateCreator from "./pages/Channels/TemplateCreator";
// import QRCodeGenerator from "./pages/Channels/QRCodeGenerator";
// import ConversationAutomation from "./pages/Channels/ConversationAutomation";
// import APIIntegration from "./pages/Channels/APIIntegration";
// import AccountQuality from "./pages/Channels/AccountQuality";
// import MessagingAnalytics from "./pages/Channels/MessagingAnalytics";

// Additional pages
// import CalendarBookings from "./pages/CalendarBookings/CalendarBookings";
// import MediaManager from "./pages/MediaManager/MediaManager";
// import ChatWidget from "./pages/ChatWidget/ChatWidget";
// import ChatWidgetForm from "./pages/ChatWidget/ChatWidgetForm";
// import ChatWidgetWebhook from "./pages/ChatWidget/ChatWidgetWebhook";
import Payments from "./pages/Payments/Payments";
// import DynamicExperiences from "./pages/DynamicExperiences/DynamicExperiences";

import CampaignsList from "./pages/Campaigns/CampaignsList";
import CampaignForm from "./pages/Campaigns/CampaignForm";
import CampaignDetail from "./pages/Campaigns/CampaignDetail";
import {
  CatalogsList,
  CatalogForm,
  CatalogDetail,
} from "./pages/ProductCatalogs";

import WorkflowManagement from "./pages/WorkflowBuilder/WorkflowManagement";
import WorkflowBuilder from "./pages/WorkflowBuilder/WorkflowBuilder";

import "./App.css";

const WorkflowBuilderWrapper = () => {
  const { workflowId } = useParams();
  return (
    <WorkflowBuilder
      workflowId={workflowId}
      onBackToManagement={() => (window.location.href = "/workflow-builder")}
    />
  );
};
// Placeholder page for routes under development
const PlaceholderPage = () => {
  const { pageName } = useParams();

  const formatPageName = (name) => {
    return name
      ? name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Page";
  };

  return (
    <div className="page-container">
      <h1>{formatPageName(pageName)}</h1>
      <p>This page is currently under development.</p>
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading indicator
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Main App component
const AppContent = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentBotId, setCurrentBotId] = useState(null);
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const { isAuthenticated } = useAuth();

  // Load saved workflows from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("savedWorkflows");
      if (saved) {
        setSavedWorkflows(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load saved workflows:", error);
    }
  }, []);

  // Save workflows to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("savedWorkflows", JSON.stringify(savedWorkflows));
    } catch (error) {
      console.error("Failed to save workflows:", error);
    }
  }, [savedWorkflows]);

  const handleSidebarExpand = () => {
    setSidebarExpanded(true);
  };

  const handleSidebarCollapse = () => {
    setSidebarExpanded(false);
  };

  // Bot management functions
  const handleNewBot = () => {
    // console.log("Creating new bot - setting currentBotId to null");
    setCurrentBotId(null);
  };

  const handleLoadWorkflow = (workflowId) => {
    //console.log("Loading workflow:", workflowId);
    setCurrentBotId(workflowId);
  };

  const handleWorkflowSaved = (workflow) => {
    //  console.log("Saving workflow:", workflow);
    // Update if existing, otherwise add new
    const isExisting = savedWorkflows.some((w) => w.id === workflow.id);

    if (isExisting) {
      setSavedWorkflows(
        savedWorkflows.map((w) => (w.id === workflow.id ? workflow : w))
      );
    } else {
      setSavedWorkflows([...savedWorkflows, workflow]);
    }

    setCurrentBotId(workflow.id);
  };

  const handleDeleteWorkflow = (workflowId) => {
    // console.log("Deleting workflow:", workflowId);
    setSavedWorkflows(savedWorkflows.filter((w) => w.id !== workflowId));
    if (currentBotId === workflowId) {
      setCurrentBotId(null);
    }
  };

  const handleDuplicateWorkflow = (workflowId) => {
    //console.log("Duplicating workflow:", workflowId);
    const workflowToDuplicate = savedWorkflows.find((w) => w.id === workflowId);
    if (!workflowToDuplicate) return;

    const newWorkflow = {
      ...workflowToDuplicate,
      id: Date.now().toString(),
      name: `${workflowToDuplicate.name} (Copy)`,
      timestamp: Date.now(),
    };

    setSavedWorkflows([...savedWorkflows, newWorkflow]);
  };

  return (
    <div className="app">
      {/* Only show header if authenticated */}
      {isAuthenticated && <Header />}

      <div className="main-container">
        {/* Only show sidebar if authenticated */}
        {isAuthenticated && (
          <Sidebar
            onMouseEnter={handleSidebarExpand}
            onMouseLeave={handleSidebarCollapse}
          />
        )}

        {/* Adjust main-content based on login status */}
        <div
          className={`main-content ${
            isAuthenticated
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
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
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
              path="/crm"
              element={
                <ProtectedRoute>
                  <CRM />
                </ProtectedRoute>
              }
            />
            {/* WhatsApp Mini Apps Routes */}
            <Route path="/whatsapp-mini-apps" element={<WhatsAppMiniApps />} />
            <Route
              path="/whatsapp-mini-apps/flow-editor/:workflowId"
              element={<FlowEditor />}
            />
            <Route
              path="/whatsapp-mini-apps/visual-flow-editor/new"
              element={
                <ProtectedRoute>
                  <VisualFlowEditor
                    savedWorkflows={savedWorkflows}
                    onSaveWorkflow={handleWorkflowSaved}
                    onBackToManagement={() => navigate("/whatsapp-mini-apps")}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/whatsapp-mini-apps/visual-flow-editor/:workflowId"
              element={
                <ProtectedRoute>
                  <VisualFlowEditor
                    savedWorkflows={savedWorkflows}
                    onSaveWorkflow={handleWorkflowSaved}
                    onBackToManagement={() => navigate("/whatsapp-mini-apps")}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/whatsapp-mini-apps/analytics/:workflowId"
              element={<Analytics />}
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
              path="/ecommerce/products/create"
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
              path="/ecommerce/products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailView />
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
              path="/agents"
              element={
                <ProtectedRoute>
                  <AgentsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/register"
              element={
                <ProtectedRoute>
                  <AgentRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/edit/:agentId"
              element={
                <ProtectedRoute>
                  <AgentEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <CampaignsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/create"
              element={
                <ProtectedRoute>
                  <CampaignForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/edit/:campaignId"
              element={
                <ProtectedRoute>
                  <CampaignForm isEdit={true} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns/:campaignId"
              element={
                <ProtectedRoute>
                  <CampaignDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-catalogs"
              element={
                <ProtectedRoute>
                  <CatalogsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-catalogs/create"
              element={
                <ProtectedRoute>
                  <CatalogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-catalogs/:catalogId"
              element={
                <ProtectedRoute>
                  <CatalogDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-catalogs/:catalogId/edit"
              element={
                <ProtectedRoute>
                  <CatalogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflow-builder"
              element={
                <ProtectedRoute>
                  <WorkflowManagement
                    onCreateNew={() =>
                      (window.location.href = "/workflow-builder/create")
                    }
                    onEditWorkflow={(id) =>
                      (window.location.href = `/workflow-builder/edit/${id}`)
                    }
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflow-builder/create"
              element={
                <ProtectedRoute>
                  <WorkflowBuilder
                    onBackToManagement={() =>
                      (window.location.href = "/workflow-builder")
                    }
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workflow-builder/edit/:workflowId"
              element={
                <ProtectedRoute>
                  <WorkflowBuilderWrapper />
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
            {/* Logout route */}
            <Route path="/logout" element={<LogoutHandler />} />
            {/* Redirect to login for unmatched routes */}
            <Route
              path="*"
              element={
                <Navigate to={isAuthenticated ? "/" : "/login"} replace />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Helper component to handle logout
const LogoutHandler = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <Navigate to="/login" replace />;
};

// Main App with AuthProvider
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
