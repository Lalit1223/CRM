/**
 * Trigger types configuration for the bot builder
 * Each trigger type has specific properties, appearance, and behavior
 */
export const triggerTypes = [
  {
    id: "new_message",
    label: "New Message Received",
    icon: "MessageSquare",
    description: "Activates whenever any incoming message is received",
    color: "#4CAF50",
    priority: 5,
    platforms: ["whatsapp", "facebook", "instagram"],
    configFields: [],
  },
  {
    id: "keyword_match",
    label: "Message Match Keyword",
    icon: "MessageCircle",
    description: "Triggers when messages contain specific pre-defined keywords",
    color: "#2196F3",
    priority: 4,
    platforms: ["whatsapp", "facebook", "instagram"],
    configFields: [
      {
        id: "keywords",
        label: "Keywords",
        type: "tags",
        description: "Enter the keywords that will trigger this flow",
      },
      {
        id: "matchType",
        label: "Match Type",
        type: "select",
        options: [
          { value: "exact", label: "Exact Match" },
          { value: "contains", label: "Contains" },
          { value: "starts_with", label: "Starts With" },
          { value: "ends_with", label: "Ends With" },
        ],
        defaultValue: "contains",
      },
    ],
  },
  {
    id: "hot_keyword",
    label: "Hot Keyword",
    icon: "Zap",
    description: "Similar to keyword match, but can interrupt an existing flow",
    color: "#FF9800",
    priority: 3,
    platforms: ["whatsapp", "facebook", "instagram"],
    configFields: [
      {
        id: "keywords",
        label: "Hot Keywords",
        type: "tags",
        description:
          "Enter the hot keywords that will trigger this flow and interrupt other flows",
      },
      {
        id: "matchType",
        label: "Match Type",
        type: "select",
        options: [
          { value: "exact", label: "Exact Match" },
          { value: "contains", label: "Contains" },
          { value: "starts_with", label: "Starts With" },
          { value: "ends_with", label: "Ends With" },
        ],
        defaultValue: "contains",
      },
    ],
  },
  {
    id: "webhook",
    label: "Inbound Webhook",
    icon: "Link",
    description: "Triggered by an external webhook call",
    color: "#E91E63",
    priority: 2,
    platforms: ["whatsapp", "facebook", "instagram"],
    configFields: [
      {
        id: "webhook_id",
        label: "Webhook ID",
        type: "generated",
        description: "Unique identifier for this webhook endpoint",
      },
      {
        id: "webhook_url",
        label: "Webhook URL",
        type: "display",
        description: "URL to call to trigger this bot flow",
      },
    ],
  },
  {
    id: "ctwa_ad",
    label: "Click to WhatsApp Ad",
    icon: "ExternalLink",
    description: "Activates when a user interacts with a Facebook ad",
    color: "#3F51B5",
    priority: 1,
    platforms: ["whatsapp"],
    configFields: [
      {
        id: "ad_id",
        label: "Facebook Ad ID",
        type: "text",
        description: "Enter the Facebook Ad ID",
      },
    ],
  },
  {
    id: "fb_comment",
    label: "Facebook Comment",
    icon: "MessageSquare",
    description: "Triggers when someone comments on a Facebook post",
    color: "#1877F2",
    priority: 4,
    platforms: ["facebook"],
    configFields: [
      {
        id: "post_id",
        label: "Facebook Post ID",
        type: "text",
        description: "Enter the Facebook Post ID",
      },
      {
        id: "comment_type",
        label: "Comment Type",
        type: "select",
        options: [
          { value: "top_level", label: "Top-level Comments Only" },
          { value: "all", label: "All Comments" },
          { value: "same_user", label: "All Comments by Same User" },
        ],
        defaultValue: "top_level",
      },
      {
        id: "keywords",
        label: "Keywords (Optional)",
        type: "tags",
        description: "Only trigger for comments containing these keywords",
        required: false,
      },
    ],
  },
];

/**
 * Get trigger type information by ID
 * @param {string} typeId - The trigger type ID
 * @returns {Object} Trigger type information
 */
export const getTriggerTypeById = (typeId) => {
  return (
    triggerTypes.find((type) => type.id === typeId) || {
      label: "Unknown Trigger",
      icon: "HelpCircle",
      color: "#999",
      configFields: [],
    }
  );
};

/**
 * Get default configuration for a trigger type
 * @param {string} typeId - The trigger type ID
 * @returns {Object} Default configuration
 */
export const getDefaultTriggerConfig = (typeId) => {
  const triggerType = getTriggerTypeById(typeId);
  const config = {};

  triggerType.configFields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      config[field.id] = field.defaultValue;
    } else if (field.type === "tags") {
      config[field.id] = [];
    } else if (field.type === "generated") {
      config[field.id] = `gen_${Date.now()}`;
    } else if (field.type === "display") {
      config[field.id] = "";
    } else {
      config[field.id] = "";
    }
  });

  return config;
};
