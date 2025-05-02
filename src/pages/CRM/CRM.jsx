// src/pages/CRM/CRM.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Star,
  Plus,
  Upload,
  Download,
  X,
  Phone,
  Mail,
  MessageSquare,
  Edit,
  Tag as TagIcon,
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import "./CRM.css";

const CRM = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMethod, setImportMethod] = useState("csv");
  const [importErrors, setImportErrors] = useState([]);
  const [importPreview, setImportPreview] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const fileInputRef = useRef(null);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    tags: [],
    notes: "",
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  // Mock data for demo purposes
  useEffect(() => {
    const mockContacts = [
      {
        id: 1,
        name: "John Doe",
        phone: "+91 9876543210",
        email: "johndoe@example.com",
        tags: ["Customer", "Paid"],
        lastContact: "2023-03-18T14:32:00",
        avatar: null,
        favorite: true,
        lastMessage: "Thanks for your assistance!",
        notes:
          "Prefers communication via WhatsApp. Interested in premium plan.",
        conversations: 12,
        orders: 3,
      },
      {
        id: 2,
        name: "Jane Smith",
        phone: "+91 9876543211",
        email: "janesmith@example.com",
        tags: ["Lead", "Hot Lead"],
        lastContact: "2023-03-19T10:15:00",
        avatar: null,
        favorite: false,
        lastMessage: "I'd like to know more about your services",
        notes:
          "Found us through Facebook ad. Following up on premium features.",
        conversations: 5,
        orders: 0,
      },
      {
        id: 3,
        name: "Mike Johnson",
        phone: "+91 9876543212",
        email: "mikejohnson@example.com",
        tags: ["Customer", "Enterprise"],
        lastContact: "2023-03-17T16:45:00",
        avatar: null,
        favorite: true,
        lastMessage: "When will the new update be available?",
        notes: "Enterprise client with 50+ team members.",
        conversations: 24,
        orders: 5,
      },
      {
        id: 4,
        name: "Sara Wilson",
        phone: "+91 9876543213",
        email: "sarawilson@example.com",
        tags: ["Lead"],
        lastContact: "2023-03-15T09:30:00",
        avatar: null,
        favorite: false,
        lastMessage: null,
        notes: "Interested in trial version. Call back next week.",
        conversations: 2,
        orders: 0,
      },
      {
        id: 5,
        name: "Robert Brown",
        phone: "+91 9876543214",
        email: "robertbrown@example.com",
        tags: ["Customer", "Support"],
        lastContact: "2023-03-19T08:20:00",
        avatar: null,
        favorite: false,
        lastMessage: "The issue is resolved now, thanks!",
        notes: "Had technical issues with login. Resolved on March 19.",
        conversations: 8,
        orders: 1,
      },
    ];

    setContacts(mockContacts);
    setFilteredContacts(mockContacts);

    // Extract all unique tags for the dropdown
    const tags = [...new Set(mockContacts.flatMap((contact) => contact.tags))];
    setAvailableTags(tags);
  }, []);

  // Search and filter functionality
  useEffect(() => {
    const filtered = contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        (contact.email &&
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTags =
        selectedTags.length === 0 ||
        contact.tags.some((tag) => selectedTags.includes(tag));

      return matchesSearch && matchesTags;
    });

    setFilteredContacts(filtered);
  }, [searchQuery, selectedTags, contacts]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle tag selection
  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  // Toggle favorite status
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setContacts(
      contacts.map((contact) =>
        contact.id === id
          ? { ...contact, favorite: !contact.favorite }
          : contact
      )
    );
  };

  // View contact details
  const viewContactDetails = (contact) => {
    setSelectedContact(contact);
    setShowContactDetails(true);
  };

  // Close contact details
  const closeContactDetails = () => {
    setShowContactDetails(false);
  };

  // Open add contact modal
  const openAddContact = () => {
    setNewContact({
      name: "",
      phone: "",
      email: "",
      tags: [],
      notes: "",
    });
    setShowAddContact(true);
  };

  // Close add contact modal
  const closeAddContact = () => {
    setShowAddContact(false);
  };

  // Handle input change for new contact
  const handleNewContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value,
    });
  };

  // Handle tag toggle for new contact
  const handleNewContactTagToggle = (tag) => {
    if (newContact.tags.includes(tag)) {
      setNewContact({
        ...newContact,
        tags: newContact.tags.filter((t) => t !== tag),
      });
    } else {
      setNewContact({
        ...newContact,
        tags: [...newContact.tags, tag],
      });
    }
  };

  // Add new tag to available tags
  const addNewTag = () => {
    if (
      newTagName.trim() !== "" &&
      !availableTags.includes(newTagName.trim())
    ) {
      const newTag = newTagName.trim();
      setAvailableTags([...availableTags, newTag]);
      setNewContact({
        ...newContact,
        tags: [...newContact.tags, newTag],
      });
      setNewTagName("");
      setShowNewTagInput(false);
    }
  };

  // Save new contact
  const saveNewContact = () => {
    if (newContact.name.trim() === "" || newContact.phone.trim() === "") {
      // Show validation error
      alert("Name and phone number are required");
      return;
    }

    const newId = Math.max(...contacts.map((c) => c.id), 0) + 1;
    const contactToAdd = {
      ...newContact,
      id: newId,
      avatar: null,
      favorite: false,
      lastContact: new Date().toISOString(),
      lastMessage: null,
      conversations: 0,
      orders: 0,
    };

    setContacts([...contacts, contactToAdd]);
    setShowAddContact(false);
  };

  // Open import contacts modal
  const openImportModal = () => {
    setImportMethod("csv");
    setImportErrors([]);
    setImportPreview([]);
    setImportFile(null);
    setShowImportModal(true);
  };

  // Close import contacts modal
  const closeImportModal = () => {
    setShowImportModal(false);
  };

  // Handle import method change
  const handleImportMethodChange = (e) => {
    setImportMethod(e.target.value);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle file selection for import
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportFile(file);

    // Read and parse the file based on import method
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (importMethod === "csv") {
          parseCSV(event.target.result);
        } else if (importMethod === "json") {
          parseJSON(event.target.result);
        } else if (importMethod === "vcf") {
          parseVCF(event.target.result);
        }
      } catch (error) {
        setImportErrors([`Error parsing file: ${error.message}`]);
      }
    };

    reader.onerror = () => {
      setImportErrors(["Error reading file"]);
    };

    reader.readAsText(file);
  };

  // Parse CSV file content
  const parseCSV = (content) => {
    // Reset any previous errors
    setImportErrors([]);

    // Split the content by lines and remove empty lines
    const lines = content.split(/\r\n|\n/).filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      setImportErrors([
        "CSV file must have a header row and at least one data row",
      ]);
      return;
    }

    // Parse headers (first line)
    const headers = lines[0].split(",").map((header) => header.trim());

    // Check for required columns
    const nameIndex = headers.findIndex((h) => h.toLowerCase() === "name");
    const phoneIndex = headers.findIndex((h) => h.toLowerCase() === "phone");

    if (nameIndex === -1 || phoneIndex === -1) {
      setImportErrors(["CSV file must have 'name' and 'phone' columns"]);
      return;
    }

    // Parse contact rows
    const parsedContacts = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Check if the line is inside quotes (handling commas in fields)
      let values = [];
      let inQuotes = false;
      let currentValue = "";

      for (let char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(currentValue);
          currentValue = "";
        } else {
          currentValue += char;
        }
      }

      // Add the last value
      values.push(currentValue);

      // If values don't match headers, try simple split
      if (values.length !== headers.length) {
        values = line.split(",");
      }

      // Get values for the new contact
      const name = values[nameIndex]?.trim() || "";
      const phone = values[phoneIndex]?.trim() || "";

      // Check if required fields are present
      if (!name || !phone) {
        errors.push(`Row ${i + 1}: Missing required fields (name or phone)`);
        continue;
      }

      // Find email and tags (if present in CSV)
      const emailIndex = headers.findIndex((h) => h.toLowerCase() === "email");
      const tagsIndex = headers.findIndex((h) => h.toLowerCase() === "tags");
      const notesIndex = headers.findIndex((h) => h.toLowerCase() === "notes");

      const email = emailIndex !== -1 ? values[emailIndex]?.trim() || "" : "";
      const tagsString =
        tagsIndex !== -1 ? values[tagsIndex]?.trim() || "" : "";
      const notes = notesIndex !== -1 ? values[notesIndex]?.trim() || "" : "";

      // Parse tags (usually semicolon or comma separated)
      const tags = tagsString
        .split(/[;,]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // Add new tags to available tags
      const newTags = tags.filter((tag) => !availableTags.includes(tag));
      if (newTags.length > 0) {
        setAvailableTags([...availableTags, ...newTags]);
      }

      // Create contact object
      const contact = {
        id: 0, // Placeholder, will be assigned before saving
        name,
        phone,
        email,
        tags,
        notes,
        avatar: null,
        favorite: false,
        lastContact: new Date().toISOString(),
        lastMessage: null,
        conversations: 0,
        orders: 0,
      };

      parsedContacts.push(contact);
    }

    if (errors.length > 0) {
      setImportErrors(errors);
    }

    // Set preview (up to 5 contacts)
    setImportPreview(parsedContacts.slice(0, 5));

    // Save all the contacts
    if (parsedContacts.length > 0) {
      const contactsToImport = parsedContacts.map((contact, index) => ({
        ...contact,
        id: Math.max(...contacts.map((c) => c.id), 0) + index + 1,
      }));

      // Store the full list for actual import
      window.contactsToImport = contactsToImport;
    }
  };

  // Parse JSON file content
  const parseJSON = (content) => {
    try {
      const jsonData = JSON.parse(content);

      // Check if it's an array
      if (!Array.isArray(jsonData)) {
        setImportErrors(["JSON file must contain an array of contacts"]);
        return;
      }

      const errors = [];
      const parsedContacts = [];

      jsonData.forEach((item, index) => {
        // Check for required fields
        if (!item.name || !item.phone) {
          errors.push(
            `Item ${index + 1}: Missing required fields (name or phone)`
          );
          return;
        }

        // Ensure tags is an array
        const tags = Array.isArray(item.tags)
          ? item.tags
          : typeof item.tags === "string"
          ? item.tags.split(/[;,]/)
          : [];

        // Add new tags to available tags
        const newTags = tags.filter((tag) => !availableTags.includes(tag));
        if (newTags.length > 0) {
          setAvailableTags([...availableTags, ...newTags]);
        }

        // Create contact object
        const contact = {
          id: 0, // Placeholder, will be assigned before saving
          name: item.name,
          phone: item.phone,
          email: item.email || "",
          tags,
          notes: item.notes || "",
          avatar: null,
          favorite: false,
          lastContact: new Date().toISOString(),
          lastMessage: null,
          conversations: 0,
          orders: 0,
        };

        parsedContacts.push(contact);
      });

      if (errors.length > 0) {
        setImportErrors(errors);
      }

      // Set preview (up to 5 contacts)
      setImportPreview(parsedContacts.slice(0, 5));

      // Save all the contacts
      if (parsedContacts.length > 0) {
        const contactsToImport = parsedContacts.map((contact, index) => ({
          ...contact,
          id: Math.max(...contacts.map((c) => c.id), 0) + index + 1,
        }));

        // Store the full list for actual import
        window.contactsToImport = contactsToImport;
      }
    } catch (error) {
      setImportErrors([`Invalid JSON format: ${error.message}`]);
    }
  };

  // Parse vCard file content
  const parseVCF = (content) => {
    // Split the content by VCARD entries
    const vcards = content.split("BEGIN:VCARD");

    if (vcards.length <= 1) {
      setImportErrors(["No valid vCard entries found in the file"]);
      return;
    }

    const errors = [];
    const parsedContacts = [];

    // Process each vCard (skip the first empty entry)
    for (let i = 1; i < vcards.length; i++) {
      const vcard = vcards[i];

      // Extract name
      const fnMatch = vcard.match(/FN:(.*?)(?:\r\n|\r|\n)/);
      const n = fnMatch ? fnMatch[1].trim() : "";

      // Extract phone
      const telMatch = vcard.match(/TEL;[^:]*:(.*?)(?:\r\n|\r|\n)/);
      const phone = telMatch ? telMatch[1].trim() : "";

      // Check if required fields are present
      if (!n || !phone) {
        errors.push(`vCard ${i}: Missing required fields (name or phone)`);
        continue;
      }

      // Extract email
      const emailMatch = vcard.match(/EMAIL;[^:]*:(.*?)(?:\r\n|\r|\n)/);
      const email = emailMatch ? emailMatch[1].trim() : "";

      // Extract notes
      const noteMatch = vcard.match(/NOTE:(.*?)(?:\r\n|\r|\n|END:VCARD)/s);
      const notes = noteMatch ? noteMatch[1].trim() : "";

      // Create contact object
      const contact = {
        id: 0, // Placeholder, will be assigned before saving
        name: n,
        phone,
        email,
        tags: ["Imported"],
        notes,
        avatar: null,
        favorite: false,
        lastContact: new Date().toISOString(),
        lastMessage: null,
        conversations: 0,
        orders: 0,
      };

      parsedContacts.push(contact);
    }

    if (errors.length > 0) {
      setImportErrors(errors);
    }

    // Add "Imported" tag to available tags if not already present
    if (!availableTags.includes("Imported")) {
      setAvailableTags([...availableTags, "Imported"]);
    }

    // Set preview (up to 5 contacts)
    setImportPreview(parsedContacts.slice(0, 5));

    // Save all the contacts
    if (parsedContacts.length > 0) {
      const contactsToImport = parsedContacts.map((contact, index) => ({
        ...contact,
        id: Math.max(...contacts.map((c) => c.id), 0) + index + 1,
      }));

      // Store the full list for actual import
      window.contactsToImport = contactsToImport;
    }
  };

  // Import the contacts from the parsed file
  const importContacts = () => {
    if (!window.contactsToImport || window.contactsToImport.length === 0) {
      setImportErrors(["No valid contacts to import"]);
      return;
    }

    // Add the new contacts to the existing ones
    setContacts([...contacts, ...window.contactsToImport]);

    // Close the modal
    setShowImportModal(false);

    // Clean up
    window.contactsToImport = null;
  };

  // Export contacts to CSV
  const exportContacts = () => {
    // Function to convert contacts to CSV
    const convertToCSV = (objArray) => {
      const header = Object.keys(objArray[0])
        .filter((key) => !["avatar", "id"].includes(key))
        .join(",");

      const rows = objArray.map((obj) => {
        return Object.keys(obj)
          .filter((key) => !["avatar", "id"].includes(key))
          .map((key) => {
            let value = obj[key];

            // Handle arrays (like tags)
            if (Array.isArray(value)) {
              value = `"${value.join("; ")}"`;
            }
            // Handle strings that might contain commas
            else if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              value = `"${value.replace(/"/g, '""')}"`;
            }
            // Handle null or undefined
            else if (value === null || value === undefined) {
              value = "";
            }

            return value;
          })
          .join(",");
      });

      return [header, ...rows].join("\n");
    };

    // Export all contacts or only filtered ones based on current filters
    const dataToExport =
      selectedTags.length > 0 || searchQuery !== ""
        ? filteredContacts
        : contacts;

    const csv = convertToCSV(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger download
    const link = document.createElement("a");
    const filename = `contacts_export_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get all unique tags from contacts
  const allTags = [...new Set(contacts.flatMap((contact) => contact.tags))];

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get tag class based on tag name
  const getTagClass = (tag) => {
    const tagLower = tag.toLowerCase();
    if (tagLower === "customer") return "tag-customer";
    if (tagLower === "lead") return "tag-lead";
    if (tagLower === "hot lead") return "tag-hot-lead";
    if (tagLower === "enterprise") return "tag-enterprise";
    if (tagLower === "support") return "tag-support";
    if (tagLower === "paid") return "tag-paid";
    if (tagLower === "imported") return "tag-imported";
    return "";
  };

  // Get avatar text from name
  const getAvatarText = (name) => {
    return name.charAt(0);
  };

  // Cancel add new tag
  const cancelNewTag = () => {
    setShowNewTagInput(false);
    setNewTagName("");
  };

  return (
    <div className="crm-container">
      <div className="crm-header">
        <h1>Contact Management</h1>
        <div className="crm-actions">
          <button className="action-button primary" onClick={openAddContact}>
            <Plus size={16} />
            <span>Add Contact</span>
          </button>
          <button className="action-button" onClick={openImportModal}>
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button className="action-button" onClick={exportContacts}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="crm-content">
        {/* Filter Sidebar */}
        <div className="filter-sidebar">
          <div className="filter-section">
            <h3>Filter by Tags</h3>
            <div className="tag-list">
              {allTags.map((tag) => (
                <div
                  key={tag}
                  className={`tag-chip ${
                    selectedTags.includes(tag) ? "selected" : ""
                  }`}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          <div className="reset-filters">
            <button className="reset-button" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Contacts Content */}
        <div className="contacts-content">
          <div className="search-bar">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search contacts by name, phone or email"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="contacts-count">
            {filteredContacts.length} contacts
          </div>

          {filteredContacts.length > 0 ? (
            <div className="contacts-list">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="contact-card"
                  onClick={() => viewContactDetails(contact)}
                >
                  <button
                    className={`favorite-btn ${
                      contact.favorite ? "active" : ""
                    }`}
                    onClick={(e) => toggleFavorite(contact.id, e)}
                  >
                    <Star size={20} />
                  </button>

                  <div className="contact-avatar">
                    {getAvatarText(contact.name)}
                  </div>

                  <div className="contact-info">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-phone">{contact.phone}</div>
                  </div>

                  {contact.tags.length > 0 && (
                    <div
                      className={`contact-tag ${getTagClass(contact.tags[0])}`}
                    >
                      {contact.tags[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={48} />
              <h3>No contacts found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="reset-button" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Details Modal */}
      {showContactDetails && selectedContact && (
        <div className="contact-details-modal">
          <div className="modal-overlay" onClick={closeContactDetails}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Contact Details</h2>
              <button className="close-button" onClick={closeContactDetails}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="contact-details-header">
                <div className="contact-avatar large">
                  {getAvatarText(selectedContact.name)}
                </div>
                <div className="contact-details-info">
                  <h3>{selectedContact.name}</h3>
                  <div className="contact-meta">
                    <div className="contact-meta-item">
                      <Phone size={16} />
                      <span>{selectedContact.phone}</span>
                    </div>
                    {selectedContact.email && (
                      <div className="contact-meta-item">
                        <Mail size={16} />
                        <span>{selectedContact.email}</span>
                      </div>
                    )}
                    <div className="contact-tags">
                      {selectedContact.tags.map((tag) => (
                        <span key={tag} className={`tag ${getTagClass(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="contact-actions">
                  <button className="action-button">
                    <MessageSquare size={16} />
                    <span>Message</span>
                  </button>
                  <button className="action-button">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button className="action-button">
                    <TagIcon size={16} />
                    <span>Manage Tags</span>
                  </button>
                </div>
              </div>

              <div className="contact-section">
                <h4>Notes</h4>
                <p className="contact-notes">
                  {selectedContact.notes || "No notes added for this contact."}
                </p>
              </div>

              <div className="contact-stats">
                <div className="stat-card">
                  <div className="stat-value">
                    {selectedContact.conversations}
                  </div>
                  <div className="stat-label">Conversations</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{selectedContact.orders}</div>
                  <div className="stat-label">Orders</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {selectedContact.lastContact
                      ? formatDate(selectedContact.lastContact)
                      : "Never"}
                  </div>
                  <div className="stat-label">Last Contact</div>
                </div>
              </div>

              <div className="contact-section">
                <h4>Last Conversation</h4>
                {selectedContact.lastMessage ? (
                  <div className="last-message">
                    "{selectedContact.lastMessage}"
                  </div>
                ) : (
                  <p className="no-data">No conversation history</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="contact-details-modal">
          <div className="modal-overlay" onClick={closeAddContact}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Contact</h2>
              <button className="close-button" onClick={closeAddContact}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">
                  Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newContact.name}
                  onChange={handleNewContactChange}
                  placeholder="Enter contact name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleNewContactChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newContact.email}
                  onChange={handleNewContactChange}
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tag-selection">
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      className={`tag-chip ${
                        newContact.tags.includes(tag) ? "selected" : ""
                      }`}
                      onClick={() => handleNewContactTagToggle(tag)}
                    >
                      {tag}
                    </div>
                  ))}

                  {!showNewTagInput && (
                    <button
                      className="add-tag-button"
                      onClick={() => setShowNewTagInput(true)}
                    >
                      <Plus size={16} /> Add Tag
                    </button>
                  )}
                </div>

                {showNewTagInput && (
                  <div className="new-tag-input">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter new tag"
                    />
                    <div className="new-tag-actions">
                      <button
                        className="tag-action-button save"
                        onClick={addNewTag}
                      >
                        <Save size={16} />
                      </button>
                      <button
                        className="tag-action-button cancel"
                        onClick={cancelNewTag}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={newContact.notes}
                  onChange={handleNewContactChange}
                  placeholder="Add notes about this contact"
                  rows={4}
                ></textarea>
              </div>

              <div className="form-actions">
                <button className="action-button" onClick={closeAddContact}>
                  Cancel
                </button>
                <button
                  className="action-button primary"
                  onClick={saveNewContact}
                >
                  <Save size={16} />
                  <span>Save Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Contacts Modal */}
      {showImportModal && (
        <div className="contact-details-modal">
          <div className="modal-overlay" onClick={closeImportModal}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Import Contacts</h2>
              <button className="close-button" onClick={closeImportModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="import-options">
                <div className="form-group">
                  <label>Import Format</label>
                  <div className="import-format-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="importMethod"
                        value="csv"
                        checked={importMethod === "csv"}
                        onChange={handleImportMethodChange}
                      />
                      <span>CSV</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="importMethod"
                        value="json"
                        checked={importMethod === "json"}
                        onChange={handleImportMethodChange}
                      />
                      <span>JSON</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="importMethod"
                        value="vcf"
                        checked={importMethod === "vcf"}
                        onChange={handleImportMethodChange}
                      />
                      <span>vCard</span>
                    </label>
                  </div>
                </div>

                <div className="import-file-area">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept={
                      importMethod === "csv"
                        ? ".csv"
                        : importMethod === "json"
                        ? ".json"
                        : importMethod === "vcf"
                        ? ".vcf,.vcard"
                        : ""
                    }
                    onChange={handleFileSelect}
                  />

                  <div
                    className={`file-drop-area ${importFile ? "has-file" : ""}`}
                    onClick={triggerFileInput}
                  >
                    {importFile ? (
                      <div className="selected-file">
                        <Upload size={24} />
                        <span className="filename">{importFile.name}</span>
                        <span className="filesize">
                          ({Math.round(importFile.size / 1024)} KB)
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload size={32} />
                        <p>Click to select a file or drag and drop here</p>
                        <span className="file-format">
                          {importMethod === "csv"
                            ? "CSV file with name, phone, email, tags columns"
                            : importMethod === "json"
                            ? "JSON array with contact objects"
                            : importMethod === "vcf"
                            ? "vCard (.vcf) file with contacts"
                            : ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {importErrors.length > 0 && (
                  <div className="import-errors">
                    <div className="error-header">
                      <AlertTriangle size={16} />
                      <span>Import Errors</span>
                    </div>
                    <ul className="error-list">
                      {importErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {importPreview.length > 0 && (
                  <div className="import-preview">
                    <h4>
                      Preview ({importPreview.length} of{" "}
                      {window.contactsToImport?.length || 0} contacts)
                    </h4>
                    <div className="preview-contacts">
                      {importPreview.map((contact, index) => (
                        <div key={index} className="preview-contact">
                          <div className="preview-avatar">
                            {getAvatarText(contact.name)}
                          </div>
                          <div className="preview-details">
                            <div className="preview-name">{contact.name}</div>
                            <div className="preview-phone">{contact.phone}</div>
                            {contact.email && (
                              <div className="preview-email">
                                {contact.email}
                              </div>
                            )}
                          </div>
                          {contact.tags.length > 0 && (
                            <div className="preview-tags">
                              {contact.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className={`preview-tag ${getTagClass(tag)}`}
                                >
                                  {tag}
                                </span>
                              ))}
                              {contact.tags.length > 2 && (
                                <span className="preview-tag more">
                                  +{contact.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button className="action-button" onClick={closeImportModal}>
                    Cancel
                  </button>
                  <button
                    className="action-button primary"
                    onClick={importContacts}
                    disabled={
                      !importFile ||
                      importErrors.length > 0 ||
                      !window.contactsToImport ||
                      window.contactsToImport.length === 0
                    }
                  >
                    <Upload size={16} />
                    <span>
                      Import {window.contactsToImport?.length || 0} Contacts
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
