// src/pages/MediaManager/MediaManager.jsx
import React, { useState, useEffect } from "react";
import {
  Folder,
  Upload,
  Grid,
  List,
  Search,
  Filter,
  Trash2,
  Users,
  Settings,
  PlusCircle,
  FileIcon,
  Image,
  Video,
  FileText,
  Music,
} from "lucide-react";
import "./MediaManager.css";

const MediaManager = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentView, setCurrentView] = useState("grid"); // grid or list
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, images, videos, documents, audio
  const [isUploading, setIsUploading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("root");
  const [folderStructure, setFolderStructure] = useState({
    root: {
      id: "root",
      name: "Root",
      parent: null,
      children: ["folder-1", "folder-2"],
    },
    "folder-1": {
      id: "folder-1",
      name: "Marketing",
      parent: "root",
      children: [],
    },
    "folder-2": {
      id: "folder-2",
      name: "Customer Support",
      parent: "root",
      children: ["folder-3"],
    },
    "folder-3": {
      id: "folder-3",
      name: "Templates",
      parent: "folder-2",
      children: [],
    },
  });

  useEffect(() => {
    // Fetch media files from API
    fetchMediaFiles();
  }, [currentFolder]);

  const fetchMediaFiles = async () => {
    try {
      // Simulating API call with mock data for now
      const mockData = [
        {
          id: 1,
          name: "product-image.jpg",
          type: "image",
          folder: "root",
          url: "https://via.placeholder.com/300x200",
          size: "1.2 MB",
          uploadedAt: "2025-03-10T14:48:00",
          tags: ["product", "marketing"],
        },
        {
          id: 2,
          name: "welcome-video.mp4",
          type: "video",
          folder: "root",
          url: "https://via.placeholder.com/300x200",
          size: "8.4 MB",
          uploadedAt: "2025-03-15T09:30:00",
          tags: ["welcome", "onboarding"],
        },
        {
          id: 3,
          name: "price-list.pdf",
          type: "document",
          folder: "folder-1",
          url: "https://via.placeholder.com/300x200",
          size: "0.5 MB",
          uploadedAt: "2025-03-18T11:20:00",
          tags: ["price", "sales"],
        },
        {
          id: 4,
          name: "announcement.mp3",
          type: "audio",
          folder: "folder-1",
          url: "https://via.placeholder.com/300x200",
          size: "2.1 MB",
          uploadedAt: "2025-03-20T16:15:00",
          tags: ["announcement", "customer"],
        },
        {
          id: 5,
          name: "whatsapp-banner.png",
          type: "image",
          folder: "folder-2",
          url: "https://via.placeholder.com/300x200",
          size: "0.8 MB",
          uploadedAt: "2025-03-22T10:45:00",
          tags: ["banner", "whatsapp"],
        },
        {
          id: 6,
          name: "customer-guide.pdf",
          type: "document",
          folder: "folder-3",
          url: "https://via.placeholder.com/300x200",
          size: "1.5 MB",
          uploadedAt: "2025-03-25T13:10:00",
          tags: ["guide", "customer"],
        },
      ];

      // Filter by current folder
      const folderFiles = mockData.filter(
        (file) => file.folder === currentFolder
      );

      // Simulate loading time
      setTimeout(() => {
        setMediaFiles(folderFiles);
      }, 500);
    } catch (error) {
      console.error("Error fetching media files:", error);
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      // Create new media items from uploaded files
      const newMediaItems = Array.from(files).map((file, index) => {
        return {
          id: mediaFiles.length + index + 1,
          name: file.name,
          type: file.type.split("/")[0],
          folder: currentFolder,
          url: URL.createObjectURL(file),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          uploadedAt: new Date().toISOString(),
          tags: [],
        };
      });

      setMediaFiles([...newMediaItems, ...mediaFiles]);
      setIsUploading(false);
    }, 1500);
  };

  const handleFileSelect = (id) => {
    setSelectedFiles((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fileId) => fileId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDeleteSelected = () => {
    if (window.confirm("Are you sure you want to delete selected files?")) {
      setMediaFiles((prev) =>
        prev.filter((file) => !selectedFiles.includes(file.id))
      );
      setSelectedFiles([]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleCreateFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName && folderName.trim() !== "") {
      const newFolderId = `folder-${Date.now()}`;

      // Update folder structure
      setFolderStructure((prev) => {
        const updated = { ...prev };

        // Create new folder
        updated[newFolderId] = {
          id: newFolderId,
          name: folderName.trim(),
          parent: currentFolder,
          children: [],
        };

        // Update parent's children
        updated[currentFolder] = {
          ...updated[currentFolder],
          children: [...updated[currentFolder].children, newFolderId],
        };

        return updated;
      });
    }
  };

  const navigateToFolder = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedFiles([]);
  };

  const navigateUp = () => {
    const parentFolder = folderStructure[currentFolder].parent;
    if (parentFolder) {
      navigateToFolder(parentFolder);
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let current = currentFolder;

    while (current) {
      breadcrumbs.unshift({
        id: current,
        name: folderStructure[current].name,
      });
      current = folderStructure[current].parent;
    }

    return breadcrumbs;
  };

  const filteredMedia = mediaFiles.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.tags &&
        file.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesFilter = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Get file icon based on type
  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <Image size={24} />;
      case "video":
        return <Video size={24} />;
      case "document":
        return <FileText size={24} />;
      case "audio":
        return <Music size={24} />;
      default:
        return <FileIcon size={24} />;
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="media-manager-container">
      <div className="media-manager-header">
        <h1>Media Manager</h1>
        <div className="media-manager-actions">
          <button
            className="action-button"
            onClick={() => document.getElementById("file-upload").click()}
          >
            <Upload size={18} />
            <span>Upload Files</span>
            <input
              id="file-upload"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </button>
          <button className="action-button" onClick={handleCreateFolder}>
            <Folder size={18} />
            <span>New Folder</span>
          </button>
          <button className="action-button">
            <Users size={18} />
            <span>Team Members</span>
          </button>
          <button className="action-button">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb navigation */}
      <div className="breadcrumb-container">
        {getBreadcrumbs().map((crumb, index, array) => (
          <React.Fragment key={crumb.id}>
            <span
              className="breadcrumb-item"
              onClick={() => navigateToFolder(crumb.id)}
            >
              {crumb.name}
            </span>
            {index < array.length - 1 && (
              <span className="breadcrumb-separator">/</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="media-manager-toolbar">
        <div className="search-filter-container">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <select value={filterType} onChange={handleFilterChange}>
              <option value="all">All Files</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
              <option value="audio">Audio</option>
            </select>
          </div>
        </div>
        <div className="view-options">
          <button
            className={`view-button ${currentView === "grid" ? "active" : ""}`}
            onClick={() => setCurrentView("grid")}
          >
            <Grid size={18} />
          </button>
          <button
            className={`view-button ${currentView === "list" ? "active" : ""}`}
            onClick={() => setCurrentView("list")}
          >
            <List size={18} />
          </button>
          {selectedFiles.length > 0 && (
            <button className="delete-button" onClick={handleDeleteSelected}>
              <Trash2 size={18} />
              <span>Delete Selected ({selectedFiles.length})</span>
            </button>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span>Uploading files...</span>
        </div>
      )}

      {/* Display folders */}
      {folderStructure[currentFolder].children.length > 0 && (
        <div className="folder-section">
          <h2 className="section-title">Folders</h2>
          <div className={`folders-container ${currentView}-view`}>
            {folderStructure[currentFolder].children.map((folderId) => (
              <div
                key={folderId}
                className="folder-item"
                onClick={() => navigateToFolder(folderId)}
              >
                <div className="folder-icon">
                  <Folder size={currentView === "grid" ? 48 : 24} />
                </div>
                <div className="folder-name">
                  {folderStructure[folderId].name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display files */}
      <div className="files-section">
        <h2 className="section-title">Files</h2>
        <div className={`media-files-container ${currentView}-view`}>
          {filteredMedia.length > 0 ? (
            filteredMedia.map((file) => (
              <div
                key={file.id}
                className={`media-file-item ${
                  selectedFiles.includes(file.id) ? "selected" : ""
                }`}
                onClick={() => handleFileSelect(file.id)}
              >
                <div className="file-icon">
                  {file.type === "image" ? (
                    <img src={file.url} alt={file.name} />
                  ) : (
                    getFileIcon(file.type)
                  )}
                </div>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-meta">
                    <span className="file-size">{file.size}</span>
                    <span className="file-date">
                      {formatDate(file.uploadedAt)}
                    </span>
                  </div>
                  {file.tags && file.tags.length > 0 && (
                    <div className="file-tags">
                      {file.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-files-message">
              <Folder size={48} />
              <p>No files in this folder</p>
              <button
                className="upload-button"
                onClick={() => document.getElementById("file-upload").click()}
              >
                <PlusCircle size={18} />
                <span>Upload Files</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaManager;
