// src/pages/BroadcastList/BroadcastList.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Users,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare,
  Send,
  Filter,
  Info,
  UserPlus,
  AlertCircle,
  Edit,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import "./BroadcastList.css";

const BroadcastList = () => {
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [sortOption, setSortOption] = useState("date-desc");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newBroadcastName, setNewBroadcastName] = useState("");
  const [contactsFile, setContactsFile] = useState(null);

  // Fixed: Removed the extra square brackets that caused the nested array
  const [broadcastLists, setBroadcastLists] = useState([
    {
      id: 1,
      name: "AK GD 5 March",
      members: 39,
      date: "2025-03-05",
      message:
        "Hello {{Name}} 👋\nWe hope you enjoyed our WhatsApp Business API session! 🚀\n\nGot any questions? Need clarifications? 🤔?\nWe're here to help! 😊\n\nTap below to share your queries or feedback.\nWe're all ears! 👂✨\n\nLooking forward to assisting you!\n\nThank You!!!",
      stats: {
        sent: 39,
        sentPercentage: 100,
        delivered: 37,
        deliveredPercentage: 94.9,
        unread: 31,
        unreadPercentage: 79.5,
        read: 8,
        readPercentage: 20.5,
        replied: 11,
        repliedPercentage: 28.2,
        noResponse: 28,
        noResponsePercentage: 71.8,
      },
    },
    {
      id: 2,
      name: "Junk Interested",
      members: 27,
      date: "2025-03-01",
      stats: {
        sent: 27,
        sentPercentage: 100,
        delivered: 25,
        deliveredPercentage: 92.6,
        unread: 20,
        unreadPercentage: 74.1,
        read: 5,
        readPercentage: 18.5,
        replied: 3,
        repliedPercentage: 11.1,
        noResponse: 24,
        noResponsePercentage: 88.9,
      },
    },
    {
      id: 3,
      name: "Abhi dnp",
      members: 85,
      date: "2025-02-28",
      stats: {
        sent: 85,
        sentPercentage: 100,
        delivered: 82,
        deliveredPercentage: 96.5,
        unread: 65,
        unreadPercentage: 76.5,
        read: 17,
        readPercentage: 20,
        replied: 9,
        repliedPercentage: 10.6,
        noResponse: 76,
        noResponsePercentage: 89.4,
      },
    },
    {
      id: 4,
      name: "Gauri Test",
      members: 1,
      date: "2025-02-25",
      stats: {
        sent: 1,
        sentPercentage: 100,
        delivered: 1,
        deliveredPercentage: 100,
        unread: 0,
        unreadPercentage: 0,
        read: 1,
        readPercentage: 100,
        replied: 1,
        repliedPercentage: 100,
        noResponse: 0,
        noResponsePercentage: 0,
      },
    },
    {
      id: 5,
      name: "4 march 2025 gd 11:30",
      members: 30,
      date: "2025-03-04",
      stats: {
        sent: 30,
        sentPercentage: 100,
        delivered: 28,
        deliveredPercentage: 93.3,
        unread: 22,
        unreadPercentage: 73.3,
        read: 6,
        readPercentage: 20,
        replied: 4,
        repliedPercentage: 13.3,
        noResponse: 26,
        noResponsePercentage: 86.7,
      },
    },
    {
      id: 6,
      name: "Test by Sahil",
      members: 0,
      date: "2025-02-22",
      stats: {
        sent: 0,
        sentPercentage: 0,
        delivered: 0,
        deliveredPercentage: 0,
        unread: 0,
        unreadPercentage: 0,
        read: 0,
        readPercentage: 0,
        replied: 0,
        repliedPercentage: 0,
        noResponse: 0,
        noResponsePercentage: 0,
      },
    },
    {
      id: 7,
      name: "Vishu test 2",
      members: 15,
      date: "2025-02-20",
      stats: {
        sent: 15,
        sentPercentage: 100,
        delivered: 14,
        deliveredPercentage: 93.3,
        unread: 10,
        unreadPercentage: 66.7,
        read: 4,
        readPercentage: 26.7,
        replied: 2,
        repliedPercentage: 13.3,
        noResponse: 13,
        noResponsePercentage: 86.7,
      },
    },
  ]);

  const fileInputRef = useRef(null);

  // Added useEffect to set the initial selected broadcast only once
  useEffect(() => {
    if (!selectedBroadcast && broadcastLists.length > 0) {
      setSelectedBroadcast(broadcastLists[0]);
    }
  }, []);

  // Participants data for selected broadcast
  const participants = [
    { id: 1, name: "Abhay", phone: "+917567529274" },
    { id: 2, name: "Abhishek P", phone: "+917420900530" },
    { id: 3, name: "Ajit gope", phone: "+919318376247" },
    { id: 4, name: "Ajit kumar", phone: "+918651822827" },
    { id: 5, name: "Amaan Khan", phone: "+918884088894" },
    { id: 6, name: "Antonys", phone: "+918295465789" },
    { id: 7, name: "Anupam pandey", phone: "+917311181118" },
    { id: 8, name: "Arpit Yadav", phone: "+918085809797" },
    // More participants would be listed here
  ];

  // Sort broadcast lists based on current option
  const sortedBroadcasts = [...broadcastLists].sort((a, b) => {
    switch (sortOption) {
      case "date-desc":
        return new Date(b.date) - new Date(a.date);
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "members-desc":
        return b.members - a.members;
      case "members-asc":
        return a.members - b.members;
      default:
        return 0;
    }
  });

  const handleBroadcastSelect = (broadcast) => {
    setSelectedBroadcast(broadcast);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const toggleFilterExpand = () => {
    setFilterExpanded(!filterExpanded);
  };

  const handleAddBroadcast = () => {
    if (newBroadcastName.trim() === "") return;

    const newBroadcast = {
      id: Date.now(),
      name: newBroadcastName,
      members: 0,
      date: new Date().toISOString().split("T")[0],
      stats: {
        sent: 0,
        sentPercentage: 0,
        delivered: 0,
        deliveredPercentage: 0,
        unread: 0,
        unreadPercentage: 0,
        read: 0,
        readPercentage: 0,
        replied: 0,
        repliedPercentage: 0,
        noResponse: 0,
        noResponsePercentage: 0,
      },
    };

    const updatedBroadcasts = [...broadcastLists, newBroadcast];
    setBroadcastLists(updatedBroadcasts);
    setSelectedBroadcast(newBroadcast);
    setNewBroadcastName("");
    setContactsFile(null);
    setShowAddModal(false);
  };

  const handleDeleteBroadcast = () => {
    if (!selectedBroadcast) return;

    const updatedBroadcasts = broadcastLists.filter(
      (broadcast) => broadcast.id !== selectedBroadcast.id
    );

    setBroadcastLists(updatedBroadcasts);
    setSelectedBroadcast(
      updatedBroadcasts.length > 0 ? updatedBroadcasts[0] : null
    );
    setShowDeleteModal(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContactsFile(file);
    }
  };

  return (
    <div className="broadcast-page">
      {/* Main container */}
      <div className="broadcast-container">
        {/* Left panel - List of broadcast lists */}
        <div className="broadcast-lists-panel">
          <div className="panel-header">
            <h2>Broadcast lists</h2>
            <div className="header-actions">
              <button className="icon-btn">
                <Search size={18} />
              </button>
              <button className="icon-btn">
                <CheckCircle size={18} />
              </button>
              <button className="icon-btn">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="sort-filter">
            <div className="sort-dropdown" onClick={toggleFilterExpand}>
              <Filter size={16} />
              <span>Sort by Date created - descending</span>
              <ChevronDown
                size={16}
                className={filterExpanded ? "expanded" : ""}
              />
            </div>

            {filterExpanded && (
              <div className="filter-options">
                <select value={sortOption} onChange={handleSortChange}>
                  <option value="date-desc">Date created - descending</option>
                  <option value="date-asc">Date created - ascending</option>
                  <option value="name-asc">Name - ascending</option>
                  <option value="name-desc">Name - descending</option>
                  <option value="members-desc">Members - descending</option>
                  <option value="members-asc">Members - ascending</option>
                </select>
              </div>
            )}
          </div>

          <div className="broadcasts-list">
            {sortedBroadcasts.map((broadcast) => (
              <div
                key={broadcast.id}
                className={`broadcast-item ${
                  selectedBroadcast?.id === broadcast.id ? "active" : ""
                }`}
                onClick={() => handleBroadcastSelect(broadcast)}
              >
                <div className="broadcast-icon">
                  <Users size={20} />
                </div>
                <div className="broadcast-info">
                  <div className="broadcast-name">{broadcast.name}</div>
                  <div className="broadcast-members">
                    {broadcast.members}{" "}
                    {broadcast.members === 1 ? "Member" : "Members"}
                  </div>
                </div>
                <button className="more-btn">
                  <MoreVertical size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="create-broadcast">
            <button
              className="create-btn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              <span>Create Broadcast List</span>
            </button>
          </div>
        </div>

        {/* Middle panel - Broadcast details and message */}
        <div className="broadcast-details-panel">
          {selectedBroadcast ? (
            <>
              <div className="panel-header">
                <div className="broadcast-title">
                  <h2>{selectedBroadcast.name}</h2>
                  <span className="members-count">
                    {selectedBroadcast.members} members
                  </span>
                </div>
                <div className="header-actions">
                  <button className="text-btn">Manage Access</button>
                  <button className="icon-btn">
                    <Info size={18} />
                  </button>
                  <button className="icon-btn">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div className="message-preview">
                <div className="message-bubble">
                  <div className="message-content">
                    {selectedBroadcast.message ? (
                      <pre>{selectedBroadcast.message}</pre>
                    ) : (
                      <p className="no-message">No message content available</p>
                    )}
                  </div>
                  <div className="message-timestamp">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="message-stats">
                  <div className="stat-item">
                    <CheckCircle size={16} />
                    <span>
                      {selectedBroadcast.stats.sent} - Sent to{" "}
                      {selectedBroadcast.stats.sentPercentage}%
                    </span>
                    <ArrowRight size={16} />
                  </div>
                  <div className="stat-item">
                    <CheckCircle size={16} />
                    <span>
                      {selectedBroadcast.stats.delivered} - Delivered to{" "}
                      {selectedBroadcast.stats.deliveredPercentage}%
                    </span>
                    <ArrowRight size={16} />
                  </div>
                  <div className="stat-item">
                    <Clock size={16} />
                    <span>
                      {selectedBroadcast.stats.unread} - Unread by{" "}
                      {selectedBroadcast.stats.unreadPercentage}%
                    </span>
                    <ArrowRight size={16} />
                  </div>
                  <div className="stat-item">
                    <CheckCircle size={16} className="success" />
                    <span>
                      {selectedBroadcast.stats.read} - Read by{" "}
                      {selectedBroadcast.stats.readPercentage}%
                    </span>
                    <ArrowRight size={16} />
                  </div>
                  <div className="stat-item">
                    <MessageSquare size={16} />
                    <span>
                      {selectedBroadcast.stats.replied} - Replied by{" "}
                      {selectedBroadcast.stats.repliedPercentage}%
                    </span>
                    <ArrowRight size={16} />
                  </div>
                  <div className="stat-item">
                    <AlertCircle size={16} />
                    <span>
                      {selectedBroadcast.stats.noResponse} - No response by{" "}
                      {selectedBroadcast.stats.noResponsePercentage}%
                    </span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>

              <div className="panel-actions">
                <button className="action-btn">
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
                <button className="action-btn">
                  <Send size={16} />
                  <span>Broadcast Message</span>
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Users size={48} />
              <h3>Select a broadcast list to view details</h3>
            </div>
          )}
        </div>

        {/* Right panel - Participants */}
        <div className="participants-panel">
          <div className="panel-header">
            <button className="add-participant">
              <UserPlus size={18} />
              <span>Add participants</span>
            </button>
            <div className="header-actions">
              <div className="search-box">
                <Search size={16} />
                <input type="text" placeholder="Search" />
              </div>
            </div>
          </div>

          <div className="participants-list">
            {participants.map((participant) => (
              <div key={participant.id} className="participant-item">
                <div className="avatar">{participant.name.charAt(0)}</div>
                <div className="participant-info">
                  <div className="participant-name">{participant.name}</div>
                  <div className="participant-phone">{participant.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Broadcast Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Create Broadcast List</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="broadcast-name">Broadcast List Name</label>
                <input
                  id="broadcast-name"
                  type="text"
                  value={newBroadcastName}
                  onChange={(e) => setNewBroadcastName(e.target.value)}
                  placeholder="Enter broadcast list name"
                />
              </div>

              <div className="form-group">
                <label>Upload Contacts</label>
                <div className="file-upload">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,.xlsx,.xls"
                    style={{ display: "none" }}
                  />
                  <button
                    className="upload-btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Upload size={16} />
                    <span>Choose File</span>
                  </button>
                  <span className="file-name">
                    {contactsFile ? contactsFile.name : "No file chosen"}
                  </span>
                </div>
                <p className="help-text">
                  Upload a CSV or Excel file with contacts. The file should
                  include columns for name and phone number.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={handleAddBroadcast}
                disabled={!newBroadcastName.trim()}
              >
                Create Broadcast List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Broadcast Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h3>Delete Broadcast List</h3>
              <button
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-content">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{selectedBroadcast?.name}</strong>? This action cannot
                  be undone.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-btn delete"
                onClick={handleDeleteBroadcast}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastList;
