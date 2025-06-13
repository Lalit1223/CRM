import React, { useState, useEffect } from "react";
import {
  Plus,
  Phone,
  MessageSquare,
  Clock,
  User,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Play,
  Pause,
  Square,
} from "lucide-react";

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [newSession, setNewSession] = useState({
    userId: "",
    phone: "",
    workflowId: "",
    campaignId: "",
    agentId: "",
    source: "whatsapp",
  });

  // API functions
  const sessionAPI = {
    // Get all sessions
    getSessions: async (filters = {}) => {
      try {
        const token = localStorage.getItem("token");
        const queryParams = new URLSearchParams({
          page: 1,
          limit: 50,
          ...filters,
        }).toString();

        const response = await fetch(
          `https://pixe-backend-83iz.onrender.com/api/sessions/admin?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching sessions:", error);
        return { success: false, data: [] };
      }
    },

    // Create new session
    createSession: async (sessionData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://pixe-backend-83iz.onrender.com/api/sessions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sessionData),
          }
        );

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error creating session:", error);
        return { success: false, message: "Failed to create session" };
      }
    },

    // Get users for session creation
    getUsers: async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://pixe-backend-83iz.onrender.com/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, data: [] };
      }
    },
  };

  // Load initial data
  useEffect(() => {
    loadSessions();
    loadUsers();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const response = await sessionAPI.getSessions({
        status: statusFilter === "all" ? undefined : statusFilter,
      });

      if (response.success) {
        setSessions(response.data);
        setError(null);
      } else {
        setError("Failed to load sessions");
      }
    } catch (error) {
      setError("Failed to load sessions");
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const response = await sessionAPI.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Failed to load users");
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    if (!newSession.userId || !newSession.phone) {
      setError("User and phone number are required");
      return;
    }

    setLoading(true);
    try {
      const sessionData = {
        ...newSession,
        workflowId: newSession.workflowId || "683a056f8c2a1cd97bfe1d1e",
        campaignId: newSession.campaignId || "682ded90cfcfdc4c36964618",
        agentId:
          newSession.agentId ||
          localStorage.getItem("agentId") ||
          "6825b06977890b65258ad9fe",
      };

      const response = await sessionAPI.createSession(sessionData);

      if (response.success) {
        setSuccess("Session created successfully");
        setShowCreateForm(false);
        setNewSession({
          userId: "",
          phone: "",
          workflowId: "",
          campaignId: "",
          agentId: "",
          source: "whatsapp",
        });
        loadSessions();

        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || "Failed to create session");
      }
    } catch (error) {
      setError("Failed to create session");
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/^\+?91/, "");
    return `+91 ${cleaned}`;
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.user?.phone?.includes(searchQuery) ||
      session._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Session Management
            </h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Session
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by phone, session ID, or user name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <button
              onClick={loadSessions}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <Check size={16} />
            {success}
            <button onClick={() => setSuccess(null)} className="ml-auto">
              ×
            </button>
          </div>
        )}

        {/* Create Session Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create New Session</h2>
              <button onClick={() => setShowCreateForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleCreateSession}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  value={newSession.source}
                  onChange={(e) =>
                    setNewSession({ ...newSession, source: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="web">Web</option>
                  <option value="api">API</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Session"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">
              Sessions ({filteredSessions.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading sessions...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No sessions found</p>
              {searchQuery && (
                <p className="text-sm">Try adjusting your search or filters</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Node
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSessions.map((session) => (
                    <tr key={session._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User size={20} className="text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {formatPhoneNumber(session.user?.phone)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {session.user?.name || "Unknown User"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">
                          {session._id.slice(-8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            session.status
                          )}`}
                        >
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(session.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.currentNodeId || "None"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          {session.status === "active" ? (
                            <button
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Pause session"
                            >
                              <Pause size={16} />
                            </button>
                          ) : session.status === "paused" ? (
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Resume session"
                            >
                              <Play size={16} />
                            </button>
                          ) : null}

                          {session.status !== "completed" && (
                            <button
                              className="text-red-600 hover:text-red-900"
                              title="Stop session"
                            >
                              <Square size={16} />
                            </button>
                          )}

                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="View details"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Play size={16} className="text-green-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.filter((s) => s.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Pause size={16} className="text-yellow-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Paused</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.filter((s) => s.status === "paused").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.filter((s) => s.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <X size={16} className="text-red-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Failed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {sessions.filter((s) => s.status === "failed").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
