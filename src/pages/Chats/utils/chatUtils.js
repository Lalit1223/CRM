// src/pages/Chats/utils/chatUtils.js

/**
 * Get filtered chats based on active tab and current user
 * @param {Array} chats - Array of chat objects
 * @param {string} activeTab - Current active tab ('mine' or 'all')
 * @param {Object} currentUser - Current user object with id
 * @returns {Array} Filtered chats
 */
export const getFilteredChats = (chats, activeTab, currentUser) => {
  if (activeTab === "mine") {
    return chats.filter((chat) => chat.assignedTo === currentUser.id);
  }
  return chats;
};

/**
 * Group chat messages by date for display
 * @param {Array} messages - Array of message objects
 * @returns {Object} Messages grouped by date
 */
export const groupMessagesByDate = (messages) => {
  if (!messages || !Array.isArray(messages)) return {};

  return messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
};

/**
 * Create a new message object
 * @param {string} content - Message content
 * @param {string} sender - Sender type ('agent' or 'customer')
 * @param {string} agentName - Name of the agent (optional)
 * @returns {Object} New message object
 */
export const createNewMessage = (
  content,
  sender = "agent",
  agentName = null
) => {
  return {
    id: `msg-${Date.now()}`,
    content,
    timestamp: new Date().toISOString(),
    sender,
    status: "sent",
    ...(agentName && { agentName }),
  };
};

/**
 * Create a new chat note
 * @param {string} content - Note content
 * @param {string} author - Author name
 * @returns {Object} New chat note object
 */
export const createChatNote = (content, author) => {
  return {
    id: `note-${Date.now()}`,
    content,
    timestamp: new Date().toISOString(),
    author,
  };
};

/**
 * Search through chats based on search query
 * @param {Array} chats - Array of chat objects
 * @param {string} query - Search query
 * @returns {Array} Filtered chats matching the search query
 */
export const searchChats = (chats, query) => {
  if (!query.trim()) return chats;

  const lowerQuery = query.toLowerCase().trim();

  return chats.filter(
    (chat) =>
      chat.contact.name.toLowerCase().includes(lowerQuery) ||
      chat.contact.phoneNumber.includes(lowerQuery) ||
      chat.messages.some((msg) =>
        msg.content.toLowerCase().includes(lowerQuery)
      )
  );
};

/**
 * Check if a chat has a template message needed
 * (when the last user message is older than 24 hours)
 * @param {Object} chat - Chat object
 * @returns {boolean} Whether a template message is needed
 */
export const needsTemplateMessage = (chat) => {
  if (!chat || !chat.messages || chat.messages.length === 0) return false;

  // Get the last customer message
  const lastCustomerMessage = [...chat.messages]
    .reverse()
    .find((msg) => msg.sender === "customer");

  if (!lastCustomerMessage) return false;

  // Calculate if it's been more than 24 hours
  const now = new Date();
  const lastMessageTime = new Date(lastCustomerMessage.timestamp);
  const hoursDifference = (now - lastMessageTime) / (1000 * 60 * 60);

  return hoursDifference > 24;
};

/**
 * Get the appropriate message input placeholder based on chat state
 * @param {Object} chat - Chat object
 * @returns {string} Placeholder text for message input
 */
export const getMessageInputPlaceholder = (chat) => {
  if (!chat) return "Select a chat to start messaging";

  if (needsTemplateMessage(chat)) {
    return "24-hour window has passed. Use a template message...";
  }

  if (chat.status === "done") {
    return "Chat is marked as done. Reopen to send messages...";
  }

  return "Type a message...";
};

/**
 * Check if user can send a message based on chat state
 * @param {Object} chat - Chat object
 * @returns {boolean} Whether user can send a message
 */
export const canSendMessage = (chat) => {
  if (!chat) return false;
  if (chat.status === "done") return false;
  if (needsTemplateMessage(chat)) return false;
  return true;
};

/**
 * Process a template message with variables
 * @param {Object} template - Template object
 * @param {Object} variables - Variables to replace in template
 * @returns {string} Processed template message
 */
export const processTemplateMessage = (template, variables) => {
  if (!template) return "";

  let content = template.content;

  // Replace variables in format {{1}}, {{2}}, etc.
  if (template.variables && variables) {
    template.variables.forEach((variable, index) => {
      const placeholder = `{{${index + 1}}}`;
      const value = variables[variable] || `[${variable}]`;
      content = content.replace(new RegExp(placeholder, "g"), value);
    });
  }

  return content;
};

/**
 * Format a template message for display
 * @param {Object} template - Template message object
 * @returns {string} Formatted template message
 */
export const formatTemplateMessage = (template) => {
  if (!template) return "";

  // If it's a simple text template
  if (template.type === "text") {
    return template.content;
  }

  // If it's a button template
  if (template.type === "buttons") {
    return [
      template.header,
      template.body,
      template.footer,
      "---",
      template.buttons.map((btn) => `• ${btn.text}`).join("\n"),
    ]
      .filter(Boolean)
      .join("\n");
  }

  return "";
};
