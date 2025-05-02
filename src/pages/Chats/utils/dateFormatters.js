// src/pages/Chats/utils/dateFormatters.js

/**
 * Format a timestamp for display in chat list
 * Shows time for today, day name for this week, or date for older messages
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time/date
 */
export const formatChatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  // If the message is from today, show the time (HH:MM)
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // If the message is from this week, show the day name
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diff < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  // Otherwise, show the date (day/month)
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
};

/**
 * Format a timestamp as a time (HH:MM)
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time
 */
export const formatMessageTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format a timestamp as a full date with day name
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date
 */
export const formatFullDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Get a human-readable time difference
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Relative time (e.g., "2 hours ago", "5 minutes ago")
 */
export const getTimeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);

  // Less than a minute
  if (seconds < 60) {
    return "just now";
  }

  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  // Less than a week
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  // Less than a month
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }

  // Default to formatted date
  return formatChatTime(timestamp);
};

/**
 * Format a date for the last seen status
 * @param {string} dateString - ISO timestamp
 * @returns {string} Formatted last seen text
 */
export const formatLastSeen = (dateString) => {
  if (!dateString) return "Never online";

  const now = new Date();
  const date = new Date(dateString);
  const secondsDiff = Math.floor((now - date) / 1000);

  // Online now (less than 1 minute ago)
  if (secondsDiff < 60) {
    return "Online now";
  }

  // Last seen less than a day ago with time
  if (secondsDiff < 86400) {
    return `Last seen today at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Last seen yesterday with time
  if (secondsDiff < 172800) {
    return `Last seen yesterday at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Last seen more than 2 days ago
  return `Last seen ${date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} at ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};
