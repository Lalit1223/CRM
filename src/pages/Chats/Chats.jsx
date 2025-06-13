// src/pages/Chats/Chats.jsx - Enhanced with Manual Session Creation (NO AUTO SESSION)
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Phone,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  User,
  Clock,
  CheckCheck,
  Check,
  AlertCircle,
  Filter,
  MessageSquare,
  Users,
  Plus,
  RefreshCw,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Download,
  X,
  Settings,
  UserPlus,
  PlayCircle,
  ChevronDown,
} from "lucide-react";
import api, { sessionAPI } from "../../utils/api";
import "./Chats.css";

// Configuration
const CHAT_CONFIG = {
  MESSAGE_POLL_INTERVAL: 1000, // 1 second
  DEFAULT_WORKFLOW_ID: "68397fcd465994036c73321e",
  DEFAULT_CAMPAIGN_ID: "682ded90cfcfdc4c36964618",
  EXOTEL_BASE_URL: "https://pixe-backend-83iz.onrender.com/api/exotel",
};

// Enhanced API functions for chat using existing API structure
const chatAPI = {
  getRecentChats: async () => {
    try {
      const response = await api.get("/api/message/recent-chats");
      return response.data;
    } catch (error) {
      console.error("Error fetching recent chats:", error);
      return { success: false, data: [] };
    }
  },

  getChatMessages: async (userId) => {
    try {
      const response = await api.get(`/api/message/chats/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      return { success: false, data: [] };
    }
  },

  getSessionMessages: async (sessionId, page = 1, limit = 50) => {
    try {
      const response = await api.get(
        `/api/message/session/${sessionId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching session messages:", error);
      return { success: false, data: [] };
    }
  },

  sendMessage: async (messageData) => {
    try {
      const response = await api.post("/api/message/send", messageData);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, message: "Failed to send message" };
    }
  },

  createSession: async (sessionData) => {
    try {
      // Use the existing sessionAPI from utils/api.js
      return await sessionAPI.createSession(sessionData);
    } catch (error) {
      console.error("Error creating session:", error);
      return { success: false, message: "Failed to create session" };
    }
  },

  getSessions: async (filters = {}) => {
    try {
      // Use the existing sessionAPI from utils/api.js
      return await sessionAPI.getAdminSessions(
        filters.status || "active",
        filters.page || 1,
        filters.limit || 10
      );
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return { success: false, data: [] };
    }
  },

  getSessionStats: async (startDate, endDate) => {
    try {
      // Use the existing sessionAPI from utils/api.js
      return await sessionAPI.getSessionStats(startDate, endDate);
    } catch (error) {
      console.error("Error fetching session stats:", error);
      return { success: false, data: null };
    }
  },

  // New APIs for session creation dropdowns
  getWorkflows: async (page = 1, limit = 100) => {
    try {
      const response = await api.get(
        `/api/workflows/admin?page=${page}&limit=${limit}&isActive=true&sortBy=createdAt&sortOrder=desc`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching workflows:", error);
      return { success: false, data: { workflows: [] } };
    }
  },

  getCampaigns: async (page = 1, limit = 100) => {
    try {
      const response = await api.get(
        `/api/campaigns/requests?status=&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return { success: false, data: { campaignRequests: [] } };
    }
  },

  getAgents: async (page = 1, limit = 100) => {
    try {
      const response = await api.get(
        `/api/agent/admin?status=true&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching agents:", error);
      return { success: false, data: [] };
    }
  },
};

// Exotel API functions (updated with correct endpoints and response handling)
const exotelAPI = {
  makeCall: async (to, options = {}) => {
    try {
      const response = await fetch(`${CHAT_CONFIG.EXOTEL_BASE_URL}/calls`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          from: "+918562800573", // Your Exotel number
          to: to,
          callerId: "02248906259", // Your caller ID
          record: options.record || true,
          ...options,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error making call:", error);
      return { success: false, message: "Call service unavailable" };
    }
  },

  getCallDetails: async (callSid) => {
    try {
      const response = await fetch(
        `${CHAT_CONFIG.EXOTEL_BASE_URL}/calls/${callSid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching call details:", error);
      return { success: false };
    }
  },

  getAllCalls: async (filters = {}) => {
    try {
      const defaultFilters = {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
        ...filters,
      };
      const queryParams = new URLSearchParams(defaultFilters).toString();
      const response = await fetch(
        `${CHAT_CONFIG.EXOTEL_BASE_URL}/calls?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      // Return calls array based on actual API response structure
      if (data.success && data.data && data.data.calls) {
        return { success: true, data: data.data.calls };
      }
      return { success: false, data: [] };
    } catch (error) {
      console.error("Error fetching calls:", error);
      return { success: false, data: [] };
    }
  },

  hangupCall: async (callSid) => {
    try {
      const response = await fetch(
        `${CHAT_CONFIG.EXOTEL_BASE_URL}/calls/${callSid}/hangup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error hanging up call:", error);
      return { success: false };
    }
  },

  getCallRecording: async (callSid, download = false) => {
    try {
      const url = `${CHAT_CONFIG.EXOTEL_BASE_URL}/calls/${callSid}/recording${
        download ? "?download=true" : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (download) {
        // For download, return blob if recording exists
        const jsonResponse = await response.json();
        if (
          jsonResponse.success &&
          jsonResponse.data.callRecord.exotelData.Call.RecordingUrl
        ) {
          // Download from the actual recording URL
          const recordingResponse = await fetch(
            jsonResponse.data.callRecord.exotelData.Call.RecordingUrl
          );
          return await recordingResponse.blob();
        } else {
          throw new Error("No recording available");
        }
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error("Error fetching recording:", error);
      throw error;
    }
  },
};

// Utility functions
const getAgentId = () => {
  return (
    localStorage.getItem("agentId") ||
    localStorage.getItem("userId") ||
    "6825b06977890b65258ad9fe"
  );
};

const getAdminId = () => {
  return localStorage.getItem("adminId") || "6824c3e06ab972602262a2a7";
};

const getSenderName = () => {
  return (
    localStorage.getItem("agentName") ||
    localStorage.getItem("adminName") ||
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    "Agent User"
  );
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays <= 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};

const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/^\+?91/, "");
  return `+91 ${cleaned}`;
};

const formatPhoneForCall = (phone) => {
  if (!phone) return "";
  return phone.startsWith("+") ? phone : `+91${phone.replace(/^\+?91/, "")}`;
};

const getCallStatusColor = (status) => {
  const colors = {
    ringing: "#f59e0b",
    "in-progress": "#10b981",
    completed: "#6b7280",
    failed: "#ef4444",
    busy: "#f59e0b",
    "no-answer": "#6b7280",
  };
  return colors[status] || "#6b7280";
};

const formatCallDuration = (seconds) => {
  if (!seconds) return "0s";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

// WhatsApp-style message status icons
const getMessageStatusIcon = (status) => {
  switch (status) {
    case "sent":
      return (
        <Check
          size={16}
          className="whatsapp-crm-status-sent"
          style={{ color: "#9ca3af" }}
        />
      );
    case "delivered":
      return (
        <CheckCheck
          size={16}
          className="whatsapp-crm-status-delivered"
          style={{ color: "#9ca3af" }}
        />
      );
    case "read":
      return (
        <CheckCheck
          size={16}
          className="whatsapp-crm-status-read"
          style={{ color: "#3b82f6" }}
        />
      );
    case "failed":
      return (
        <AlertCircle
          size={16}
          className="whatsapp-crm-status-failed"
          style={{ color: "#ef4444" }}
        />
      );
    default:
      return (
        <Check
          size={16}
          className="whatsapp-crm-status-pending"
          style={{ color: "#d1d5db" }}
        />
      );
  }
};

const Chats = () => {
  // State management
  const [chatsList, setChatsList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChatsList, setShowChatsList] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [sessionStats, setSessionStats] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  // Manual Session Creation States
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loadingDropdownData, setLoadingDropdownData] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    workflowId: CHAT_CONFIG.DEFAULT_WORKFLOW_ID,
    campaignId: CHAT_CONFIG.DEFAULT_CAMPAIGN_ID,
    agentId: getAgentId(),
    source: "whatsapp",
  });

  const messagesEndRef = useRef(null);
  const messagePollingRef = useRef(null);

  // Load data on component mount
  useEffect(() => {
    loadRecentChats();
    loadSessions();
    loadSessionStats();
    loadCallHistory();

    // Check if user has proper identification set
    const senderName = getSenderName();
    if (senderName === "Agent User") {
      setError(
        "Please set your name in localStorage. Example: localStorage.setItem('agentName', 'Your Name')"
      );
    }
  }, []);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto scroll to bottom of messages

  // Update the useEffect for messages
  useEffect(() => {
    // Only scroll to bottom when new messages are added, not on every render
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const isNewMessage = lastMessage && lastMessage.sender !== "user";

      if (isNewMessage) {
        scrollToBottom();
      }
    }
  }, [messages.length]); // Only depend on message count, not the entire messages array
  // Poll for new messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      startMessagePolling();
    } else {
      stopMessagePolling();
    }
    return () => stopMessagePolling();
  }, [selectedChat, messages.length]);

  // Data loading functions
  const loadRecentChats = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getRecentChats();
      if (response.success) {
        setChatsList(response.data);
        setError(null);
      } else {
        setError("Failed to load chats");
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
      setError("Failed to load chats");
    }
    setLoading(false);
  };

  const loadChatMessages = async (userId) => {
    setMessagesLoading(true);
    try {
      const response = await chatAPI.getChatMessages(userId);
      if (response.success) {
        setMessages(response.data);
        setError(null);
      } else {
        setError("Failed to load messages");
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Failed to load messages");
    }
    setMessagesLoading(false);
  };

  const loadSessions = async (
    filters = { status: "active", page: 1, limit: 10 }
  ) => {
    try {
      const response = await chatAPI.getSessions(filters);
      if (response.success) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const loadSessionStats = async () => {
    try {
      const startDate = new Date(new Date().getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];
      const response = await chatAPI.getSessionStats(startDate, endDate);
      if (response.success) {
        setSessionStats(response.data);
      }
    } catch (error) {
      console.error("Failed to load session stats:", error);
    }
  };

  const loadCallHistory = async () => {
    try {
      const response = await exotelAPI.getAllCalls({ limit: 10 });
      if (response.success && Array.isArray(response.data)) {
        setCallHistory(response.data);
      } else {
        setCallHistory([]);
      }
    } catch (error) {
      console.error("Failed to load call history:", error);
      setCallHistory([]);
    }
  };

  // Load dropdown data for session creation
  const loadDropdownData = async () => {
    setLoadingDropdownData(true);
    try {
      const [workflowsRes, campaignsRes, agentsRes] = await Promise.all([
        chatAPI.getWorkflows(),
        chatAPI.getCampaigns(),
        chatAPI.getAgents(),
      ]);

      if (workflowsRes.success) {
        setWorkflows(workflowsRes.data.workflows || []);
      }

      if (campaignsRes.success) {
        setCampaigns(campaignsRes.data.campaignRequests || []);
      }

      if (agentsRes.success) {
        setAgents(agentsRes.data || []);
      }
    } catch (error) {
      console.error("Error loading dropdown data:", error);
      setError("Failed to load workflow/campaign/agent data");
    } finally {
      setLoadingDropdownData(false);
    }
  };

  // Call management functions
  const handleMakeCall = async (phoneNumber) => {
    try {
      setError(null);
      const formattedNumber = formatPhoneForCall(phoneNumber);

      const response = await exotelAPI.makeCall(formattedNumber, {
        record: true,
      });

      if (response.success) {
        setActiveCall({
          callSid: response.data.callSid,
          to: formattedNumber,
          status: "ringing",
          startTime: new Date(),
        });
        setSuccessMessage("Call initiated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
        pollCallStatus(response.data.callSid);
      } else {
        setError(response.message || "Failed to make call");
      }
    } catch (error) {
      console.error("Error making call:", error);
      setError(
        "Call functionality is not available. Please check if the Exotel service is running."
      );
    }
  };

  const pollCallStatus = async (callSid) => {
    let pollCount = 0;
    const maxPolls = 30;

    const pollInterval = setInterval(async () => {
      pollCount++;

      try {
        const response = await exotelAPI.getCallDetails(callSid);
        if (response.success && response.data) {
          const callData = response.data.callRecord || response.data;
          const status = callData.status || callData.exotelData?.Call?.Status;
          const duration =
            callData.duration || callData.exotelData?.Call?.Duration;

          setActiveCall((prev) => ({
            ...prev,
            status: status,
            duration: duration,
          }));

          if (
            ["completed", "failed", "busy", "no-answer"].includes(status) ||
            pollCount >= maxPolls
          ) {
            clearInterval(pollInterval);
            setTimeout(() => setActiveCall(null), 3000);
            loadCallHistory();
          }
        }
      } catch (error) {
        console.error("Error polling call status:", error);
        clearInterval(pollInterval);
        setActiveCall(null);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(pollInterval);
      if (activeCall?.callSid === callSid) {
        setActiveCall(null);
      }
    }, maxPolls * 2000);
  };

  const handleHangupCall = async () => {
    if (!activeCall) return;

    try {
      const response = await exotelAPI.hangupCall(activeCall.callSid);
      if (response.success) {
        setActiveCall(null);
        setSuccessMessage("Call ended");
        setTimeout(() => setSuccessMessage(null), 3000);
        loadCallHistory();
      } else {
        setError("Failed to hangup call");
      }
    } catch (error) {
      console.error("Error hanging up call:", error);
      setError("Failed to hangup call");
    }
  };

  const handleDownloadRecording = async (callSid) => {
    try {
      const blob = await exotelAPI.getCallRecording(callSid, true);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `call_recording_${callSid}.wav`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading recording:", error);
      setError("Failed to download recording");
    }
  };

  // Message polling functions
  const startMessagePolling = () => {
    if (!isPollingEnabled || messagePollingRef.current) return;

    messagePollingRef.current = setInterval(async () => {
      if (
        selectedChat &&
        !messagesLoading &&
        !sendingMessage &&
        isPollingEnabled
      ) {
        try {
          const response = await chatAPI.getChatMessages(selectedChat.userId);
          if (response.success) {
            const newMessageCount = response.data.length;
            const currentMessageCount = messages.length;

            if (newMessageCount !== currentMessageCount) {
              setMessages(response.data);
              // console.log(
              //   `Messages updated: ${currentMessageCount} → ${newMessageCount}`
              // );
            }
          }
        } catch (error) {
          console.error("Error polling messages:", error);
          stopMessagePolling();
        }
      }
    }, CHAT_CONFIG.MESSAGE_POLL_INTERVAL);

    //console.log("Started message polling for user:", selectedChat?.userId);
  };

  const stopMessagePolling = () => {
    if (messagePollingRef.current) {
      clearInterval(messagePollingRef.current);
      messagePollingRef.current = null;
      //console.log("Stopped message polling");
    }
  };

  // Chat interaction functions
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    loadChatMessages(chat.userId);
    if (isMobile) {
      setShowChatsList(false);
    }
  };

  const handleBackToChats = () => {
    setShowChatsList(true);
    setSelectedChat(null);
    stopMessagePolling();
  };
  // In your Chats.jsx, update the scrollToBottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Add smooth scroll with proper timing
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  };

  // UPDATED Send message function - NO AUTOMATIC SESSION CREATION
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat || sendingMessage) return;

    setSendingMessage(true);
    setError(null);

    try {
      const senderName = getSenderName();

      if (!senderName || senderName === "Agent User") {
        throw new Error(
          "Please set your name: localStorage.setItem('agentName', 'Your Name')"
        );
      }

      // CRITICAL: NO AUTOMATIC SESSION CREATION
      // Only use existing session ID, never create automatically
      let sessionId = selectedChat.sessionId || selectedChat.session?._id;

      if (!sessionId) {
        // SHOW WARNING BUT ALLOW SENDING WITHOUT SESSION
        console.warn(
          "No active session found. Message will be sent without session tracking."
        );
        setError(
          "⚠️ No active session. Message sent without workflow tracking. Create a session to enable automation."
        );

        // Continue sending message WITHOUT session (sessionId will be null/undefined)
        // This allows basic messaging without workflow automation
      }

      const messageData = {
        userId: selectedChat.userId,
        sessionId: sessionId, // Will be null/undefined if no session exists
        content: messageInput.trim(),
        messageType: "text",
        senderName: senderName,
      };

      const response = await chatAPI.sendMessage(messageData);

      if (response.success) {
        const newMessage = {
          _id: response.data._id,
          content: messageInput.trim(),
          sender: "agent",
          createdAt: new Date().toISOString(),
          status: "sent", // Start with "sent" status
          messageType: "text",
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessageInput("");

        // Only show success if we're not showing session warning
        if (sessionId) {
          setSuccessMessage("Message sent successfully");
          setTimeout(() => setSuccessMessage(null), 3000);
        } else {
          // Clear error after a longer delay to show session warning
          setTimeout(() => setError(null), 5000);
        }

        loadRecentChats();
      } else {
        throw new Error(response.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Manual Session Creation functions
  const handleCreateSessionClick = async () => {
    if (!selectedChat) return;

    // Load dropdown data if not already loaded
    if (
      workflows.length === 0 ||
      campaigns.length === 0 ||
      agents.length === 0
    ) {
      await loadDropdownData();
    }

    setShowCreateSession(true);
  };

  const handleSessionFormChange = (field, value) => {
    setSessionForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateSession = async () => {
    if (!selectedChat) return;

    setCreatingSession(true);
    try {
      const sessionData = {
        userId: selectedChat.userId,
        phone: selectedChat.user?.phone,
        workflowId: sessionForm.workflowId,
        campaignId: sessionForm.campaignId,
        agentId: sessionForm.agentId,
        source: sessionForm.source,
      };

      const response = await chatAPI.createSession(sessionData);
      if (response.success) {
        setSuccessMessage(
          "Session created successfully and workflow triggered!"
        );
        setShowCreateSession(false);

        // Update selected chat with new session
        setSelectedChat((prev) => ({
          ...prev,
          sessionId: response.data._id,
          session: response.data,
        }));

        loadSessions();
        loadRecentChats();

        // Reset form to defaults
        setSessionForm({
          workflowId: CHAT_CONFIG.DEFAULT_WORKFLOW_ID,
          campaignId: CHAT_CONFIG.DEFAULT_CAMPAIGN_ID,
          agentId: getAgentId(),
          source: "whatsapp",
        });
      } else {
        setError(
          "Failed to create session: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error creating session:", error);
      setError("Failed to create session: " + error.message);
    } finally {
      setCreatingSession(false);
    }
  };

  // Filter chats based on search query
  const filteredChats = chatsList.filter(
    (chat) =>
      chat.user?.phone?.includes(searchQuery) ||
      chat.lastMessage?.content
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="whatsapp-crm-chats-main-container">
      {/* Error/Success Messages */}
      {error && (
        <div className="whatsapp-crm-error-message">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {successMessage && (
        <div className="whatsapp-crm-success-message">
          <Check size={16} />
          {successMessage}
          <button onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}

      {/* Chat List Panel */}
      <div
        className={`whatsapp-crm-chats-list-panel ${
          !showChatsList && isMobile ? "whatsapp-crm-hidden-mobile" : ""
        }`}
      >
        {/* Chat List Panel */}
        <div
          className={`whatsapp-crm-chats-list-panel ${
            !showChatsList && isMobile ? "whatsapp-crm-hidden-mobile" : ""
          }`}
        >
          {/* Header */}
          <div className="whatsapp-crm-chats-header">
            <div className="whatsapp-crm-chats-header-content">
              <h1>Chats</h1>
              <div className="whatsapp-crm-chats-header-actions">
                <button
                  className="whatsapp-crm-chats-refresh-btn"
                  onClick={loadRecentChats}
                  disabled={loading}
                  title="Refresh chats"
                >
                  <RefreshCw size={20} className={loading ? "spinning" : ""} />
                </button>
              </div>
            </div>
            {/* Search Bar */}
            <div className="whatsapp-crm-chats-search-container">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="whatsapp-crm-chats-search-input"
              />
            </div>
            Stats
            <div className="whatsapp-crm-chats-stats">
              <div className="whatsapp-crm-chats-stat-item">
                <MessageSquare size={16} />
                <span>{chatsList.length} Total</span>
              </div>
              <div className="whatsapp-crm-chats-stat-item">
                <Users size={16} />
                <span>
                  {chatsList.filter((chat) => chat.unreadCount > 0).length}{" "}
                  Unread
                </span>
              </div>
              {sessionStats && (
                <div className="whatsapp-crm-chats-stat-item">
                  <Clock size={16} />
                  <span>{sessionStats.active || 0} Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Chat List */}
          <div className="whatsapp-crm-chats-list">
            {loading ? (
              <div className="whatsapp-crm-chats-loading">
                <div className="whatsapp-crm-loading-spinner"></div>
                <p>Loading chats...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="whatsapp-crm-chats-empty">
                <MessageSquare size={48} />
                <p>No chats available</p>
                <p>Start a conversation to see chats here</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                // DEBUG: Add console log to check data structure
                //console.log("Chat data:", {
                //   userId: chat.userId,
                //   userPhone: chat.user?.phone,
                //   phone: chat.phone,
                //   userMobile: chat.user?.mobile,
                //   mobile: chat.mobile,
                //   fullUser: chat.user,
                //   fullChat: chat,
                // });

                return (
                  <div
                    key={chat.userId}
                    className={`whatsapp-crm-chat-item ${
                      selectedChat?.userId === chat.userId
                        ? "whatsapp-crm-selected"
                        : ""
                    }`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="whatsapp-crm-chat-avatar">
                      <User size={24} />
                    </div>

                    <div className="whatsapp-crm-chat-content">
                      <div className="whatsapp-crm-chat-header-row">
                        <span className="whatsapp-crm-chat-phone">
                          {/* Multiple fallback options to ensure phone number shows */}
                          {formatPhoneNumber(
                            chat.user?.phone ||
                              chat.phone ||
                              chat.user?.mobile ||
                              chat.mobile ||
                              chat.user?.phoneNumber ||
                              chat.phoneNumber ||
                              chat.contactNumber ||
                              chat.user?.contact ||
                              chat.userId ||
                              "Unknown Contact"
                          )}
                        </span>
                        <span className="whatsapp-crm-chat-time">
                          {formatTime(chat.lastMessage?.createdAt)}
                        </span>
                      </div>

                      <div className="whatsapp-crm-chat-preview-row">
                        <div className="whatsapp-crm-chat-preview">
                          {chat.lastMessage?.sender === "workflow" && (
                            <span className="whatsapp-crm-message-sender-indicator">
                              Bot:{" "}
                            </span>
                          )}
                          {chat.lastMessage?.sender === "agent" && (
                            <span className="whatsapp-crm-message-sender-indicator">
                              You:{" "}
                            </span>
                          )}
                          <span className="whatsapp-crm-message-preview">
                            {chat.lastMessage?.content || "No message"}
                          </span>
                        </div>

                        <div className="whatsapp-crm-chat-indicators">
                          {(chat.lastMessage?.sender === "workflow" ||
                            chat.lastMessage?.sender === "agent") &&
                            getMessageStatusIcon(chat.lastMessage?.status)}
                          {chat.unreadCount > 0 && (
                            <span className="whatsapp-crm-unread-badge">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Session Status */}
                      {chat.session && (
                        <div className="whatsapp-crm-session-info">
                          <div
                            className={`whatsapp-crm-session-status whatsapp-crm-status-${chat.session.status}`}
                          >
                            {chat.session.status}
                          </div>
                          {chat.session.currentNodeId && (
                            <span className="whatsapp-crm-current-node">
                              {chat.session.currentNodeId}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`whatsapp-crm-chat-window ${
          showChatsList && isMobile ? "whatsapp-crm-hidden-mobile" : ""
        }`}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="whatsapp-crm-chat-window-header">
              {isMobile && (
                <button
                  className="whatsapp-crm-back-button"
                  onClick={handleBackToChats}
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              <div className="whatsapp-crm-chat-contact-info">
                <div className="whatsapp-crm-chat-avatar">
                  <User size={32} />
                </div>
                <div className="whatsapp-crm-contact-details">
                  <h3>{formatPhoneNumber(selectedChat.user?.phone)}</h3>
                  <div className="whatsapp-crm-contact-status">
                    {/* Session Status */}
                    {selectedChat.sessionId || selectedChat.session?._id ? (
                      <div className="whatsapp-crm-session-indicator whatsapp-crm-session-active">
                        <Check size={12} />
                        Active Session
                      </div>
                    ) : (
                      <div className="whatsapp-crm-session-indicator whatsapp-crm-session-inactive">
                        <AlertCircle size={12} />
                        No Session
                      </div>
                    )}

                    <div className="whatsapp-crm-user-verifications">
                      {selectedChat.user?.isOtpVerified && (
                        <span className="whatsapp-crm-verification-badge whatsapp-crm-verified">
                          OTP ✓
                        </span>
                      )}
                      {selectedChat.user?.isPanVerified && (
                        <span className="whatsapp-crm-verification-badge whatsapp-crm-verified">
                          PAN ✓
                        </span>
                      )}
                      {selectedChat.user?.isAadhaarVerified && (
                        <span className="whatsapp-crm-verification-badge whatsapp-crm-verified">
                          Aadhaar ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="whatsapp-crm-chat-actions">
                <button
                  className="whatsapp-crm-chat-action-btn"
                  onClick={() => handleMakeCall(selectedChat.user?.phone)}
                  disabled={!!activeCall}
                  title={activeCall ? "Call in progress" : "Make call"}
                >
                  {activeCall ? <PhoneOff size={20} /> : <Phone size={20} />}
                </button>
                <button
                  className="whatsapp-crm-chat-action-btn"
                  onClick={() => setShowCallHistory(!showCallHistory)}
                  title="Call history"
                >
                  <Clock size={20} />
                </button>
                <button
                  className="whatsapp-crm-chat-action-btn whatsapp-crm-trigger-session-btn"
                  onClick={handleCreateSessionClick}
                  title="Create & Trigger Session"
                  disabled={loadingDropdownData}
                >
                  {loadingDropdownData ? (
                    <RefreshCw size={20} className="spinning" />
                  ) : (
                    <PlayCircle size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Active Call Status */}
            {activeCall && (
              <div className="whatsapp-crm-active-call-banner">
                <div className="whatsapp-crm-call-info">
                  <PhoneCall size={16} />
                  <span>Call to {formatPhoneNumber(activeCall.to)}</span>
                  <span
                    className="whatsapp-crm-call-status"
                    style={{ color: getCallStatusColor(activeCall.status) }}
                  >
                    {activeCall.status}
                  </span>
                  {activeCall.duration && (
                    <span className="whatsapp-crm-call-duration">
                      {formatCallDuration(activeCall.duration)}
                    </span>
                  )}
                </div>
                <button
                  className="whatsapp-crm-hangup-btn"
                  onClick={handleHangupCall}
                >
                  <PhoneOff size={16} />
                  Hangup
                </button>
              </div>
            )}

            {/* Call History Panel */}
            {showCallHistory && (
              <div className="whatsapp-crm-call-history-panel">
                <div className="whatsapp-crm-call-history-header">
                  <h4>Recent Calls</h4>
                  <button onClick={() => setShowCallHistory(false)}>×</button>
                </div>
                <div className="whatsapp-crm-call-history-list">
                  {!Array.isArray(callHistory) || callHistory.length === 0 ? (
                    <p>No call history available</p>
                  ) : (
                    callHistory.map((call) => (
                      <div
                        key={call.callSid}
                        className="whatsapp-crm-call-history-item"
                      >
                        <div className="whatsapp-crm-call-details">
                          <span className="whatsapp-crm-call-number">
                            {formatPhoneNumber(call.toNumber)}
                          </span>
                          <span
                            className="whatsapp-crm-call-status"
                            style={{ color: getCallStatusColor(call.status) }}
                          >
                            {call.status}
                          </span>
                          <span className="whatsapp-crm-call-duration">
                            {formatCallDuration(parseInt(call.duration) || 0)}
                          </span>
                          <span className="whatsapp-crm-call-time">
                            {formatTime(call.createdAt)}
                          </span>
                        </div>
                        {call.exotelData?.Call?.RecordingUrl && (
                          <button
                            className="whatsapp-crm-download-recording"
                            onClick={() =>
                              handleDownloadRecording(call.callSid)
                            }
                            title="Download recording"
                          >
                            <Download size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Create Session Modal */}
            {showCreateSession && (
              <div className="whatsapp-crm-create-session-modal">
                <div className="whatsapp-crm-modal-content whatsapp-crm-large-modal">
                  <div className="whatsapp-crm-modal-header">
                    <h3>Create & Trigger Session</h3>
                    <button
                      onClick={() => setShowCreateSession(false)}
                      disabled={creatingSession}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="whatsapp-crm-modal-body">
                    <div className="whatsapp-crm-session-form">
                      <div className="whatsapp-crm-form-section">
                        <h4>Contact Information</h4>
                        <div className="whatsapp-crm-contact-summary">
                          <div className="whatsapp-crm-contact-item">
                            <strong>Phone:</strong>{" "}
                            {formatPhoneNumber(selectedChat.user?.phone)}
                          </div>
                          <div className="whatsapp-crm-contact-item">
                            <strong>User ID:</strong> {selectedChat.userId}
                          </div>
                        </div>
                      </div>

                      <div className="whatsapp-crm-form-section">
                        <h4>Session Configuration</h4>

                        {/* Workflow Selection */}
                        <div className="whatsapp-crm-form-group">
                          <label htmlFor="workflow-select">
                            <PlayCircle size={16} />
                            Select Workflow *
                          </label>
                          {loadingDropdownData ? (
                            <div className="whatsapp-crm-loading-select">
                              <RefreshCw size={16} className="spinning" />
                              Loading workflows...
                            </div>
                          ) : (
                            <div className="whatsapp-crm-select-wrapper">
                              <select
                                id="workflow-select"
                                value={sessionForm.workflowId}
                                onChange={(e) =>
                                  handleSessionFormChange(
                                    "workflowId",
                                    e.target.value
                                  )
                                }
                                className="whatsapp-crm-form-select"
                                disabled={creatingSession}
                              >
                                <option value="">Select a workflow...</option>
                                {workflows.map((workflow) => (
                                  <option
                                    key={workflow._id}
                                    value={workflow._id}
                                  >
                                    {workflow.name}
                                    {workflow.category &&
                                      workflow.category !== "general" &&
                                      ` (${workflow.category})`}
                                    {workflow.surePassSummary?.hasIntegration &&
                                      " - SurePass"}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={16}
                                className="whatsapp-crm-select-icon"
                              />
                            </div>
                          )}
                          {sessionForm.workflowId && (
                            <div className="whatsapp-crm-selection-info">
                              {(() => {
                                const selected = workflows.find(
                                  (w) => w._id === sessionForm.workflowId
                                );
                                return selected ? (
                                  <div className="whatsapp-crm-workflow-details">
                                    <span className="whatsapp-crm-detail-item">
                                      <strong>Description:</strong>{" "}
                                      {selected.description}
                                    </span>
                                    <span className="whatsapp-crm-detail-item">
                                      <strong>Nodes:</strong>{" "}
                                      {selected.metadata?.totalNodes || 0}
                                    </span>
                                    {selected.surePassSummary
                                      ?.hasIntegration && (
                                      <span className="whatsapp-crm-detail-item whatsapp-crm-surepass">
                                        <strong>SurePass:</strong>{" "}
                                        {selected.surePassSummary.endpointCount}{" "}
                                        endpoints
                                      </span>
                                    )}
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Campaign Selection */}
                        <div className="whatsapp-crm-form-group">
                          <label htmlFor="campaign-select">
                            <MessageSquare size={16} />
                            Select Campaign *
                          </label>
                          {loadingDropdownData ? (
                            <div className="whatsapp-crm-loading-select">
                              <RefreshCw size={16} className="spinning" />
                              Loading campaigns...
                            </div>
                          ) : (
                            <div className="whatsapp-crm-select-wrapper">
                              <select
                                id="campaign-select"
                                value={sessionForm.campaignId}
                                onChange={(e) =>
                                  handleSessionFormChange(
                                    "campaignId",
                                    e.target.value
                                  )
                                }
                                className="whatsapp-crm-form-select"
                                disabled={creatingSession}
                              >
                                <option value="">Select a campaign...</option>
                                {campaigns.map((campaign) => (
                                  <option
                                    key={campaign._id}
                                    value={campaign._id}
                                  >
                                    {campaign.name}({campaign.objective}) -{" "}
                                    {campaign.platform}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={16}
                                className="whatsapp-crm-select-icon"
                              />
                            </div>
                          )}
                          {sessionForm.campaignId && (
                            <div className="whatsapp-crm-selection-info">
                              {(() => {
                                const selected = campaigns.find(
                                  (c) => c._id === sessionForm.campaignId
                                );
                                return selected ? (
                                  <div className="whatsapp-crm-campaign-details">
                                    <span className="whatsapp-crm-detail-item">
                                      <strong>Description:</strong>{" "}
                                      {selected.description}
                                    </span>
                                    <span className="whatsapp-crm-detail-item">
                                      <strong>Budget:</strong>{" "}
                                      {selected.budgetSchedule?.dailyBudget
                                        ? `₹${selected.budgetSchedule.dailyBudget}/day`
                                        : "Not set"}
                                    </span>
                                    <span className="whatsapp-crm-detail-item">
                                      <strong>Status:</strong> {selected.status}
                                    </span>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Agent Selection */}
                        <div className="whatsapp-crm-form-group">
                          <label htmlFor="agent-select">
                            <User size={16} />
                            Assign Agent *
                          </label>
                          {loadingDropdownData ? (
                            <div className="whatsapp-crm-loading-select">
                              <RefreshCw size={16} className="spinning" />
                              Loading agents...
                            </div>
                          ) : (
                            <div className="whatsapp-crm-select-wrapper">
                              <select
                                id="agent-select"
                                value={sessionForm.agentId}
                                onChange={(e) =>
                                  handleSessionFormChange(
                                    "agentId",
                                    e.target.value
                                  )
                                }
                                className="whatsapp-crm-form-select"
                                disabled={creatingSession}
                              >
                                <option value="">Select an agent...</option>
                                {agents.map((agent) => (
                                  <option key={agent._id} value={agent._id}>
                                    {agent.first_name} {agent.last_name}(
                                    {agent.role}) - Capacity:{" "}
                                    {agent.stats?.availableCapacity ||
                                      agent.leadCapacity}
                                    /20
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={16}
                                className="whatsapp-crm-select-icon"
                              />
                            </div>
                          )}
                          {sessionForm.agentId && (
                            <div className="whatsapp-crm-selection-info">
                              {(() => {
                                const selected = agents.find(
                                  (a) => a._id === sessionForm.agentId
                                );
                                return selected ? (
                                  <div className="whatsapp-crm-agent-details">
                                    <span className="whatsapp-crm-detail-item">
                                      <strong>Email:</strong>{" "}
                                      {selected.email_id}
                                    </span>
                                    <span className="whatsapp-crm-detail-item">
                                      <strong>Mobile:</strong> {selected.mobile}
                                    </span>
                                    <span className="whatsapp-crm-detail-item">
                                      <strong>Available Capacity:</strong>{" "}
                                      {selected.stats?.availableCapacity ||
                                        selected.leadCapacity}
                                      /20
                                    </span>
                                    <span
                                      className={`whatsapp-crm-detail-item ${
                                        selected.isOnline
                                          ? "whatsapp-crm-online"
                                          : "whatsapp-crm-offline"
                                      }`}
                                    >
                                      <strong>Status:</strong>{" "}
                                      {selected.isOnline ? "Online" : "Offline"}
                                    </span>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Source Selection */}
                        <div className="whatsapp-crm-form-group">
                          <label htmlFor="source-select">
                            <Settings size={16} />
                            Source Platform
                          </label>
                          <div className="whatsapp-crm-select-wrapper">
                            <select
                              id="source-select"
                              value={sessionForm.source}
                              onChange={(e) =>
                                handleSessionFormChange(
                                  "source",
                                  e.target.value
                                )
                              }
                              className="whatsapp-crm-form-select"
                              disabled={creatingSession}
                            >
                              <option value="whatsapp">WhatsApp</option>
                              <option value="facebook">Facebook</option>
                              <option value="instagram">Instagram</option>
                              <option value="web">Website</option>
                              <option value="manual">Manual</option>
                            </select>
                            <ChevronDown
                              size={16}
                              className="whatsapp-crm-select-icon"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="whatsapp-crm-form-section">
                        <h4>Session Summary</h4>
                        <div className="whatsapp-crm-session-summary">
                          <div className="whatsapp-crm-summary-item">
                            <strong>Contact:</strong>{" "}
                            {formatPhoneNumber(selectedChat.user?.phone)}
                          </div>
                          <div className="whatsapp-crm-summary-item">
                            <strong>Workflow:</strong>{" "}
                            {workflows.find(
                              (w) => w._id === sessionForm.workflowId
                            )?.name || "Not selected"}
                          </div>
                          <div className="whatsapp-crm-summary-item">
                            <strong>Campaign:</strong>{" "}
                            {campaigns.find(
                              (c) => c._id === sessionForm.campaignId
                            )?.name || "Not selected"}
                          </div>
                          <div className="whatsapp-crm-summary-item">
                            <strong>Agent:</strong>{" "}
                            {(() => {
                              const agent = agents.find(
                                (a) => a._id === sessionForm.agentId
                              );
                              return agent
                                ? `${agent.first_name} ${agent.last_name}`
                                : "Not selected";
                            })()}
                          </div>
                          <div className="whatsapp-crm-summary-item">
                            <strong>Source:</strong> {sessionForm.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="whatsapp-crm-modal-actions">
                    <button
                      onClick={() => setShowCreateSession(false)}
                      className="whatsapp-crm-btn-secondary"
                      disabled={creatingSession}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateSession}
                      className="whatsapp-crm-btn-primary"
                      disabled={
                        creatingSession ||
                        !sessionForm.workflowId ||
                        !sessionForm.campaignId ||
                        !sessionForm.agentId
                      }
                    >
                      {creatingSession ? (
                        <>
                          <div className="whatsapp-crm-loading-spinner-small"></div>
                          Creating & Triggering...
                        </>
                      ) : (
                        <>
                          <PlayCircle size={16} />
                          Create Session & Trigger Workflow
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="whatsapp-crm-messages-container">
              {messagesLoading ? (
                <div className="whatsapp-crm-messages-loading">
                  <div className="whatsapp-crm-loading-spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="whatsapp-crm-no-messages">
                  <MessageSquare size={48} />
                  <p>No messages yet</p>
                  <p>Start the conversation!</p>
                  {!selectedChat.sessionId && !selectedChat.session?._id && (
                    <button
                      className="whatsapp-crm-create-session-cta"
                      onClick={handleCreateSessionClick}
                    >
                      <Plus size={16} />
                      Create Session to Start
                    </button>
                  )}
                </div>
              ) : (
                <div className="whatsapp-crm-messages-list">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`whatsapp-crm-message-item ${
                        message.sender === "user"
                          ? "whatsapp-crm-message-incoming"
                          : "whatsapp-crm-message-outgoing"
                      }`}
                    >
                      <div className="whatsapp-crm-message-bubble">
                        <div className="whatsapp-crm-message-content">
                          {message.content}
                        </div>
                        <div className="whatsapp-crm-message-meta">
                          <span className="whatsapp-crm-message-time">
                            {formatTime(message.createdAt)}
                          </span>
                          {(message.sender === "workflow" ||
                            message.sender === "agent") && (
                            <span className="whatsapp-crm-message-status">
                              {getMessageStatusIcon(message.status)}
                            </span>
                          )}
                        </div>
                        {message.nodeId && (
                          <div className="whatsapp-crm-message-node">
                            Node: {message.nodeId}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="whatsapp-crm-message-input-container">
              {/* Session status info banner */}
              {!selectedChat.sessionId && !selectedChat.session?._id && (
                <div className="whatsapp-crm-session-info-banner">
                  <AlertCircle size={16} />
                  <span>No active session.</span>
                  <button
                    onClick={handleCreateSessionClick}
                    className="whatsapp-crm-create-session-link"
                  >
                    Create & Trigger Session
                  </button>
                  <span>to start workflow automation.</span>
                </div>
              )}

              <form
                onSubmit={handleSendMessage}
                className="whatsapp-crm-message-input-form"
              >
                <div className="whatsapp-crm-message-input-wrapper">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="whatsapp-crm-message-input"
                    disabled={sendingMessage}
                  />
                </div>

                <button
                  type="submit"
                  className="whatsapp-crm-send-btn"
                  disabled={!messageInput.trim() || sendingMessage}
                  title="Send message"
                >
                  {sendingMessage ? (
                    <div className="whatsapp-crm-loading-spinner-small"></div>
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="whatsapp-crm-no-chat-selected">
            <MessageSquare size={64} />
            <h3>Select a chat to start messaging</h3>
            <p>Choose from your existing conversations on the left</p>
            <div className="whatsapp-crm-getting-started">
              <h4>Getting Started:</h4>
              <ul>
                <li>Select any conversation from the chat list</li>
                <li>Messages can be sent without a session (basic chat)</li>
                <li>
                  Create & trigger a session to enable workflow automation
                </li>
                <li>Choose specific workflows, campaigns, and agents</li>
                <li>Make calls directly from the chat interface</li>
                <li>View WhatsApp-style message delivery status</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
