// src/types/workflow.js

export const NODE_TYPES = {
  message: {
    icon: "MessageSquare",
    color: "bg-blue-500",
    label: "Message",
    description: "Send a text message to user",
    defaultContent: "Welcome! How can I help you today?",
  },
  input: {
    icon: "Edit3",
    color: "bg-green-500",
    label: "Input",
    description: "Collect user input",
    defaultContent: "Please provide your information:",
  },
  condition: {
    icon: "GitBranch",
    color: "bg-yellow-500",
    label: "Condition",
    description: "Branch based on conditions",
    defaultContent: "Condition check",
  },
  api: {
    icon: "Globe",
    color: "bg-purple-500",
    label: "API Call",
    description: "Make external API calls",
    defaultContent: "API verification",
  },
  interactive: {
    icon: "User",
    color: "bg-orange-500",
    label: "Interactive",
    description: "Show options/buttons to user",
    defaultContent: "Please select an option:",
  },
  delay: {
    icon: "Clock",
    color: "bg-gray-500",
    label: "Delay",
    description: "Add time delay",
    defaultContent: "Wait for specified time",
  },
  end: {
    icon: "CheckCircle",
    color: "bg-red-500",
    label: "End",
    description: "End the workflow",
    defaultContent: "Workflow completed",
  },
};

export const SUREPASS_ENDPOINTS = {
  AADHAAR_GENERATE_OTP: "/api/verification/aadhaar-v2/generate-otp",
  AADHAAR_SUBMIT_OTP: "/api/verification/aadhaar-v2/submit-otp",
  PAN: "/api/verification/pan",
  AADHAAR_PAN_LINK: "/api/verification/aadhaar-pan-link",
  BANK_VERIFICATION: "/api/verification/bank-verification", // Note: different from bank-account
  CHASSIS_TO_RC: "/api/verification/chassis-to-rc-details",
  COMPANY_DETAILS: "/api/verification/company-details",
  DIN_VERIFICATION: "/api/verification/din-verification",
  FSSAI: "/api/verification/fssai",
  GSTIN: "/api/verification/gstin",
  ICAI: "/api/verification/icai",
};
export const WORKFLOW_CATEGORIES = {
  GENERAL: "general",
  KYC: "kyc",
  SALES: "sales",
  FINANCE: "finance",
  CUSTOMER_SERVICE: "customer-service",
  ONBOARDING: "onboarding",
};

export const WORKFLOW_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
  TESTING: "testing",
};

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

// Default workflow structure
export const DEFAULT_WORKFLOW = {
  name: "New Workflow",
  description: "A new workflow",
  category: "general",
  isActive: false,
  isTemplate: false,
  nodes: [],
  startNodeId: null,
  version: 1,
  tags: [],
};

// FIXED createDefaultNode function for src/types/workflow.js

export const createDefaultNode = (type, position) => {
  const nodeConfig = NODE_TYPES[type];
  const nodeId = `node_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const baseNode = {
    nodeId,
    name: `${nodeConfig.label} Node`,
    type,
    content: nodeConfig.defaultContent || "",
    position: position || { x: 0, y: 0 },
    nextNodeId: null,
    trueNodeId: null,
    falseNodeId: null,
    errorNodeId: null,
    options:
      type === "interactive" ? [{ text: "Option 1", value: "option1" }] : [],
    buttons: [],
    variableName: type === "input" ? "user_input" : null,
    condition: type === "condition" ? 'variable === "value"' : null,
    // FIXED: Use correct default endpoint
    apiEndpoint:
      type === "api" ? SUREPASS_ENDPOINTS.AADHAAR_GENERATE_OTP : null,
    apiMethod: type === "api" ? "POST" : null,
    apiParams: type === "api" ? {} : null,
    delay: type === "delay" ? 1 : null,
    timeout: type === "api" ? 30 : null,
    errorHandling: "continue",
    notes: "",
    // FIXED: Added proper SurePass configuration for all nodes
    surePassConfig: {
      isKycVerification: type === "api",
      requiredParams: type === "api" ? [] : [],
      endpointName: type === "api" ? "API Verification" : "",
      description: type === "api" ? "API call for verification" : "",
      verificationStep: type === "api" ? "general" : "",
      responseMapping:
        type === "api"
          ? {
              success: "data.verified",
              status: "data.status",
            }
          : {},
    },
  };

  return baseNode;
};

// CORRECTED KYC_WORKFLOW_TEMPLATE for src/types/workflow.js

export const KYC_WORKFLOW_TEMPLATE = {
  name: "Complete KYC Verification",
  description:
    "Full KYC workflow with Aadhaar, PAN, and bank verification using SurePass",
  category: "kyc",
  tags: ["kyc", "verification", "surepass"],
  isActive: true,
  isTemplate: false,
  startNodeId: "welcome",
  nodes: [
    {
      nodeId: "welcome",
      name: "Welcome Message",
      type: "message",
      content:
        "Welcome to KYC verification process. We'll help you complete your identity verification.",
      nextNodeId: "get_aadhaar",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "get_aadhaar",
      name: "Get Aadhaar Number",
      type: "input",
      content: "Please enter your Aadhaar number (12 digits):",
      variableName: "aadhaar_number",
      nextNodeId: "generate_aadhaar_otp",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "generate_aadhaar_otp",
      name: "Generate Aadhaar OTP",
      type: "api",
      apiEndpoint: "/api/verification/aadhaar-v2/generate-otp", // CORRECTED
      apiMethod: "POST",
      apiParams: {
        aadhaar_number: "{{aadhaar_number}}",
      },
      nextNodeId: "get_otp",
      errorNodeId: "aadhaar_error",
      surePassConfig: {
        endpointName: "Aadhaar Verification",
        description: "Generate OTP for Aadhaar verification using SurePass API",
        isKycVerification: true,
        verificationStep: "aadhaar_generate_otp",
        requiredParams: ["aadhaar_number"],
        responseMapping: {
          success: "data.success",
          client_id: "data.client_id",
          status: "data.status",
        },
      },
    },
    {
      nodeId: "get_otp",
      name: "Get OTP",
      type: "input",
      content:
        "Please enter the OTP sent to your Aadhaar-linked mobile number:",
      variableName: "otp",
      nextNodeId: "verify_aadhaar_otp",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "verify_aadhaar_otp",
      name: "Verify Aadhaar OTP",
      type: "api",
      apiEndpoint: "/api/verification/aadhaar-v2/submit-otp", // CORRECTED
      apiMethod: "POST",
      apiParams: {
        client_id: "{{api_response.data.client_id}}", // From previous OTP generation
        otp: "{{otp}}",
      },
      nextNodeId: "check_aadhaar_result",
      errorNodeId: "aadhaar_error",
      surePassConfig: {
        endpointName: "Aadhaar OTP Verification",
        description: "Verify Aadhaar OTP using SurePass API",
        isKycVerification: true,
        verificationStep: "aadhaar_submit_otp",
        requiredParams: ["client_id", "otp"],
        responseMapping: {
          success: "data.verified",
          name: "data.name",
          status: "data.status",
        },
      },
    },
    {
      nodeId: "check_aadhaar_result",
      name: "Check Aadhaar Verification Result",
      type: "condition",
      condition: "api_response.data.verified === true",
      trueNodeId: "aadhaar_success",
      falseNodeId: "aadhaar_failed",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "aadhaar_success",
      name: "Aadhaar Verification Success",
      type: "message",
      content:
        "✅ Aadhaar verified successfully! Name: {{api_response.data.name}}",
      nextNodeId: "get_pan",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "aadhaar_failed",
      name: "Aadhaar Verification Failed",
      type: "message",
      content:
        "❌ Aadhaar verification failed. Please check your OTP and try again.",
      nextNodeId: "get_otp", // Go back to OTP input
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "aadhaar_error",
      name: "Aadhaar API Error",
      type: "message",
      content:
        "⚠️ There was an error verifying your Aadhaar. Please try again later.",
      nextNodeId: "end_node",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "get_pan",
      name: "Get PAN Number",
      type: "input",
      content: "Please enter your PAN number:",
      variableName: "pan_number",
      nextNodeId: "verify_pan",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "verify_pan",
      name: "Verify PAN",
      type: "api",
      apiEndpoint: "/api/verification/pan", // CORRECTED - removed /v1/
      apiMethod: "POST",
      apiParams: {
        pan_number: "{{pan_number}}",
      },
      nextNodeId: "check_pan_result",
      errorNodeId: "pan_error",
      surePassConfig: {
        endpointName: "PAN Verification",
        description: "Verify PAN number using SurePass API",
        isKycVerification: true,
        verificationStep: "pan",
        requiredParams: ["pan_number"],
        responseMapping: {
          success: "data.verified",
          name: "data.name",
          status: "data.status",
        },
      },
    },
    {
      nodeId: "check_pan_result",
      name: "Check PAN Verification Result",
      type: "condition",
      condition: "api_response.data.verified === true",
      trueNodeId: "pan_success",
      falseNodeId: "pan_failed",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "pan_success",
      name: "PAN Verification Success",
      type: "message",
      content: "✅ PAN verified successfully! Name: {{api_response.data.name}}",
      nextNodeId: "get_bank_details",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "pan_failed",
      name: "PAN Verification Failed",
      type: "message",
      content: "❌ PAN verification failed. Please check your PAN number.",
      nextNodeId: "get_pan",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "pan_error",
      name: "PAN API Error",
      type: "message",
      content: "⚠️ Error verifying PAN. Please try again later.",
      nextNodeId: "end_node",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "get_bank_details",
      name: "Get Bank Account Details",
      type: "interactive",
      content: "Would you like to verify your bank account as well?",
      variableName: "verify_bank",
      options: [
        {
          text: "Yes, verify my bank account",
          value: "yes",
        },
        {
          text: "Skip bank verification",
          value: "no",
        },
      ],
      nextNodeId: "check_bank_choice",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "check_bank_choice",
      name: "Check Bank Verification Choice",
      type: "condition",
      condition: "verify_bank === 'yes'",
      trueNodeId: "get_account_number",
      falseNodeId: "kyc_complete",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "get_account_number",
      name: "Get Account Number",
      type: "input",
      content: "Please enter your bank account number:",
      variableName: "account_number",
      nextNodeId: "get_ifsc",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "get_ifsc",
      name: "Get IFSC Code",
      type: "input",
      content: "Please enter your bank's IFSC code:",
      variableName: "ifsc",
      nextNodeId: "verify_bank_account",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "verify_bank_account",
      name: "Verify Bank Account",
      type: "api",
      apiEndpoint: "/api/verification/bank-verification", // CORRECTED
      apiMethod: "POST",
      apiParams: {
        account_number: "{{account_number}}",
        ifsc: "{{ifsc}}",
      },
      nextNodeId: "check_bank_result",
      errorNodeId: "bank_error",
      surePassConfig: {
        endpointName: "Bank Account Verification",
        description: "Verify bank account using SurePass API",
        isKycVerification: true,
        verificationStep: "bank_verification",
        requiredParams: ["account_number", "ifsc"],
        responseMapping: {
          success: "data.verified",
          name: "data.account_holder_name",
          status: "data.status",
        },
      },
    },
    {
      nodeId: "check_bank_result",
      name: "Check Bank Verification Result",
      type: "condition",
      condition: "api_response.data.verified === true",
      trueNodeId: "bank_success",
      falseNodeId: "bank_failed",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "bank_success",
      name: "Bank Verification Success",
      type: "message",
      content:
        "✅ Bank account verified! Account holder: {{api_response.data.account_holder_name}}",
      nextNodeId: "kyc_complete",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "bank_failed",
      name: "Bank Verification Failed",
      type: "message",
      content:
        "❌ Bank account verification failed. Please check your details.",
      nextNodeId: "get_account_number",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "bank_error",
      name: "Bank API Error",
      type: "message",
      content: "⚠️ Error verifying bank account. Please try again later.",
      nextNodeId: "kyc_complete",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "kyc_complete",
      name: "KYC Process Complete",
      type: "message",
      content:
        "🎉 Your KYC verification is complete! Thank you for providing your information.",
      nextNodeId: "end_node",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
    {
      nodeId: "end_node",
      name: "End",
      type: "end",
      surePassConfig: {
        isKycVerification: false,
        requiredParams: [],
      },
    },
  ],
};
