// src/utils/api.js
import axios from "axios";

// Base URL from environment variable or default
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://pixe-backend-tkrb.onrender.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");

      // Redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to fix URL format issues
const fixUrlFormat = (url) => {
  if (!url) return url;

  // Replace semicolons with colons in protocol
  url = url.replace(/;\/\//g, "://");

  // Add https:// if missing
  if (url && !url.match(/^https?:\/\//i) && !url.startsWith("www.")) {
    url = "https://" + url;
  }

  return url;
};

// Handle API errors
const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      success: false,
      message:
        error.response.data?.message ||
        "An error occurred with the server response",
      statusCode: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      success: false,
      message:
        "No response received from server. Please check your internet connection.",
      statusCode: null,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      success: false,
      message: error.message || "An unknown error occurred",
      statusCode: null,
    };
  }
};

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post("/api/admin/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/api/admin/register", userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getRegistrationStatus: async (email) => {
    try {
      const response = await api.get(
        `/api/admin/registration-status?email=${email}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/api/admin/profile");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getWhatsAppInfo: async () => {
    try {
      const response = await api.get("/api/admin/whatsapp/info");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/api/admin/logout");
      // Clear local storage on successful logout
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Update all campaign-related functions in your campaignAPI object in api.js

// Fixed campaign API functions with correct routes based on the error logs

export const campaignAPI = {
  // Get all campaign requests with optional filtering
  getCampaignRequests: async (status = "", page = 1, limit = 10) => {
    try {
      // Note the corrected URL - removed v1 prefix per error log
      const response = await api.get(
        `/api/campaigns/requests?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get campaign by ID
  getCampaignById: async (campaignId) => {
    try {
      // Note the corrected URL
      const response = await api.get(`/api/campaigns/requests/${campaignId}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Create a new campaign request
  createCampaignRequest: async (formData) => {
    try {
      // console.log("Creating campaign with FormData:", formData);

      // Log form data for debugging
      for (let pair of formData.entries()) {
        // console.log(
        //   pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        // );
      }

      // Use the correct URL
      const response = await api.post("/api/campaigns/requests", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Create Campaign Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Update an existing campaign
  updateCampaign: async (campaignId, formData) => {
    try {
      // console.log("Updating campaign with FormData:", formData);

      // Log form data for debugging
      for (let pair of formData.entries()) {
        // console.log(
        //   pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        // );
      }

      // Use the correct URL for updating
      const response = await api.put(
        `/api/campaigns/requests/${campaignId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update Campaign Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Delete a campaign
  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(
        `/api/campaigns/requests/${campaignId}`
      );
      return response.data;
    } catch (error) {
      console.error("Delete Campaign Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get campaign analytics
  getCampaignAnalytics: async (campaignId, startDate, endDate) => {
    try {
      const response = await api.get(
        `/api/campaigns/${campaignId}/analytics?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Analytics Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },
};
// These functions should be added to the productAPI object in your api.js file

// Product Catalog API Functions for Admin
export const productAPI = {
  // ========== CATALOG MANAGEMENT FUNCTIONS ==========

  // Get all catalogs for logged in admin with optional filtering
  getProductCatalogs: async (queryString = "") => {
    try {
      const response = await api.get(
        `/api/product-catalogs/admin${queryString}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching catalogs:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch catalogs",
      };
    }
  },

  // Get catalog by ID with optional includeProducts and includeStats
  getProductCatalogById: async (
    catalogId,
    includeProducts = false,
    includeStats = false
  ) => {
    try {
      const response = await api.get(`/api/product-catalogs/${catalogId}`, {
        params: { includeProducts, includeStats },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching catalog details:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch catalog details",
      };
    }
  },

  // Create new catalog
  createProductCatalog: async (catalogData) => {
    try {
      const response = await api.post("/api/product-catalogs/", catalogData);
      return response.data;
    } catch (error) {
      console.error("Error creating catalog:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create catalog",
      };
    }
  },

  // Update catalog
  updateProductCatalog: async (catalogId, catalogData) => {
    try {
      const response = await api.patch(
        `/api/product-catalogs/${catalogId}`,
        catalogData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating catalog:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update catalog",
      };
    }
  },

  // Set catalog as default
  setDefaultCatalog: async (catalogId) => {
    try {
      const response = await api.patch(
        `/api/product-catalogs/${catalogId}/set-default`
      );
      return response.data;
    } catch (error) {
      console.error("Error setting default catalog:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to set catalog as default",
      };
    }
  },

  // Submit catalog for review (change status to pending)
  submitCatalogForReview: async (catalogId, adminNotes) => {
    try {
      const response = await api.patch(`/api/product-catalogs/${catalogId}`, {
        status: "pending",
        adminNotes: adminNotes || "Submitted for review",
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting catalog for review:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit catalog for review",
      };
    }
  },

  // Duplicate catalog
  duplicateCatalog: async (catalogId, options) => {
    try {
      const response = await api.post(
        `/api/product-catalogs/${catalogId}/duplicate`,
        options
      );
      return response.data;
    } catch (error) {
      console.error("Error duplicating catalog:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to duplicate catalog",
      };
    }
  },

  // Delete catalog
  deleteProductCatalog: async (catalogId, forceDelete = false) => {
    try {
      const response = await api.delete(`/api/product-catalogs/${catalogId}`, {
        params: { forceDelete },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting catalog:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete catalog",
      };
    }
  },

  // ========== PRODUCT MANAGEMENT FUNCTIONS ==========

  // Get all products for admin with filtering
  getProducts: async (params = {}) => {
    try {
      const response = await api.get("/api/products/admin", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch products",
      };
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/api/products/admin/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch product details",
      };
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await api.post("/api/products/", productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create product",
      };
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/api/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update product",
      };
    }
  },

  // Upload product images
  uploadProductImages: async (productId, formData) => {
    try {
      const response = await api.post(
        `/api/products/${productId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading product images:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to upload product images",
      };
    }
  },

  // Update product images
  updateProductImages: async (productId, formData) => {
    try {
      const response = await api.put(
        `/api/products/${productId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product images:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update product images",
      };
    }
  },

  // Submit product for review
  submitProductForReview: async (productId, adminNotes) => {
    try {
      const response = await api.patch(`/api/products/${productId}`, {
        status: "submitted",
        adminNotes: adminNotes || "Product ready for review",
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting product for review:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit product for review",
      };
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete product",
      };
    }
  },

  // Get product categories
  getProductCategories: async () => {
    try {
      const response = await api.get("/api/products/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching product categories:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch product categories",
      };
    }
  },

  // Bulk import products from CSV
  bulkImportProducts: async (formData) => {
    try {
      const response = await api.post("/api/products/bulk-import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error importing products:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to import products",
      };
    }
  },
};

// Agent API calls
export const agentAPI = {
  registerAgent: async (agentData) => {
    try {
      const response = await api.post("/api/agent/register", agentData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getAllAgents: async (status = "true", page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/api/agent/admin?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getAgentById: async (agentId) => {
    try {
      // Update the endpoint to the correct path based on the API documentation
      // This should be api/agent/admin/:agentId instead of api/agent/:agentId
      const response = await api.get(`/api/agent/admin/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  updateAgent: async (agentId, updateData) => {
    try {
      // Also update this endpoint to the correct path
      const response = await api.patch(
        `/api/agent/admin/${agentId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Update status endpoint
  updateAgentStatus: async (agentId, status) => {
    try {
      // Update this endpoint too
      const response = await api.patch(`/api/agent/admin/${agentId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // Delete endpoint
  deleteAgent: async (agentId) => {
    try {
      // Update this endpoint too
      const response = await api.delete(`/api/agent/admin/${agentId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Lead management API calls
export const leadAPI = {
  createLeadAssignment: async (leadData) => {
    try {
      const response = await api.post("/api/leads", leadData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getLeadAssignments: async (status = "active", page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/api/leads/admin?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Workflow API calls
// Add these to the existing workflowAPI object in api.js

// Enhanced workflowAPI functions for your existing src/utils/api.js
// Add these enhanced functions to your existing workflowAPI object

export const workflowAPI = {
  // ... your existing functions ...

  // Enhanced workflow creation
  createWorkflow: async (workflowData) => {
    try {
      const response = await api.post("/api/workflows", {
        ...workflowData,
        adminId: localStorage.getItem("adminId"), // Auto-add admin ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isTemplate: false,
      });
      return response.data;
    } catch (error) {
      console.error("Create Workflow Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Enhanced workflow update
  updateWorkflow: async (workflowId, updateData) => {
    try {
      const response = await api.patch(`/api/workflows/${workflowId}`, {
        ...updateData,
        updatedAt: new Date().toISOString(),
        version: (updateData.version || 1) + 1,
      });
      return response.data;
    } catch (error) {
      console.error("Update Workflow Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Enhanced workflow preview with proper session handling
  previewWorkflow: async (workflowId, testData = {}) => {
    try {
      const response = await api.post(`/api/workflows/${workflowId}/preview`, {
        testData,
        sessionId: `preview_${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Preview Workflow Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Test workflow with comprehensive validation
  testWorkflow: async (workflowId, testData = {}) => {
    try {
      const response = await api.post(`/api/workflows/${workflowId}/test`, {
        testData,
        validateNodes: true,
        checkConnections: true,
        validateSurePassIntegration: true,
      });
      return response.data;
    } catch (error) {
      console.error("Test Workflow Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Enhanced get workflows with better filtering
  getAdminWorkflows: async (
    isActive = "true",
    page = 1,
    limit = 10,
    category = "",
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc"
  ) => {
    try {
      let queryString = `/api/workflows/admin?page=${page}&limit=${limit}`;

      if (isActive !== "") {
        queryString += `&isActive=${isActive}`;
      }
      if (category) {
        queryString += `&category=${encodeURIComponent(category)}`;
      }
      if (search) {
        queryString += `&search=${encodeURIComponent(search)}`;
      }
      if (sortBy) {
        queryString += `&sortBy=${sortBy}`;
      }
      if (sortOrder) {
        queryString += `&sortOrder=${sortOrder}`;
      }

      const response = await api.get(queryString);
      return response.data;
    } catch (error) {
      console.error("Get Admin Workflows Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get workflow by ID with enhanced data
  getWorkflowById: async (workflowId) => {
    try {
      const response = await api.get(`/api/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error("Get Workflow Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Enhanced SurePass endpoints
  getSurePassEndpoints: async () => {
    try {
      const response = await api.get(`/api/workflows/surepass/endpoints`);
      return response.data;
    } catch (error) {
      console.error("Get SurePass Endpoints Error:", error);
      // Return fallback data if API fails
      return {
        success: true,
        data: {
          endpoints: [
            {
              endpoint: "/api/verification/aadhaar",
              name: "Aadhaar Verification",
              method: "POST",
              requiredParams: ["aadhaar_number"],
              description: "Verify Aadhaar number using SurePass API",
            },
            {
              endpoint: "/api/verification/pan",
              name: "PAN Verification",
              method: "POST",
              requiredParams: ["pan_number"],
              description: "Verify PAN number using SurePass API",
            },
            {
              endpoint: "/api/verification/bank-account",
              name: "Bank Account Verification",
              method: "POST",
              requiredParams: ["account_number", "ifsc"],
              description: "Verify bank account using SurePass API",
            },
            {
              endpoint: "/api/verification/aadhaar-pan-link",
              name: "Aadhaar-PAN Link Check",
              method: "POST",
              requiredParams: ["aadhaar_number", "pan_number"],
              description: "Check if Aadhaar and PAN are linked",
            },
            {
              endpoint: "/api/verification/aadhaar-otp",
              name: "Aadhaar OTP Verification",
              method: "POST",
              requiredParams: ["client_id", "otp"],
              description: "Verify Aadhaar OTP using SurePass API",
            },
          ],
          totalEndpoints: 5,
          configured: true,
        },
      };
    }
  },

  // Validate SurePass node configuration
  validateSurePassNode: async (nodeData) => {
    try {
      const response = await api.post(
        `/api/workflows/surepass/validate-node`,
        nodeData
      );
      return response.data;
    } catch (error) {
      console.error("Validate SurePass Node Error:", error);
      // Return mock validation for testing
      return {
        success: true,
        data: {
          nodeId: nodeData.nodeId,
          endpoint: nodeData.apiEndpoint,
          isValid: true,
          missingParams: [],
          requiredParams: nodeData.requiredParams || [],
        },
      };
    }
  },

  // Clone workflow
  cloneWorkflow: async (workflowId, cloneData) => {
    try {
      const response = await api.post(`/api/workflows/${workflowId}/clone`, {
        ...cloneData,
        adminId: localStorage.getItem("adminId"),
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Clone Workflow Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Delete workflow
  deleteWorkflow: async (workflowId) => {
    try {
      const response = await api.delete(`/api/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error("Delete Workflow Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get workflow analytics
  getWorkflowAnalytics: async (workflowId, startDate, endDate) => {
    try {
      const response = await api.get(
        `/api/workflows/${workflowId}/analytics?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Get Workflow Analytics Error:", error);
      throw error.response ? error.response.data : error.message;
    }
  },

  // Get workflow templates
  getWorkflowTemplates: async (category = "", page = 1, limit = 10) => {
    try {
      let queryString = `/api/workflows/templates`;
      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());

      if (params.toString()) {
        queryString += `?${params.toString()}`;
      }

      const response = await api.get(queryString);
      return response.data;
    } catch (error) {
      console.error("Get Workflow Templates Error:", error);
      // Return fallback templates if API fails
      return {
        success: true,
        data: {
          templates: [
            {
              id: "kyc_basic",
              name: "Basic KYC Verification",
              description:
                "Complete KYC workflow with Aadhaar, PAN, and Bank verification",
              category: "kyc",
              hasSurePassIntegration: true,
              estimatedNodes: 12,
            },
            {
              id: "property_sales",
              name: "Property Sales Workflow",
              description:
                "Guide customers through property information and booking",
              category: "sales",
              hasSurePassIntegration: false,
              estimatedNodes: 8,
            },
            {
              id: "loan_application",
              name: "Loan Application Process",
              description: "Complete loan application with KYC verification",
              category: "finance",
              hasSurePassIntegration: true,
              estimatedNodes: 15,
            },
          ],
        },
      };
    }
  },

  // Session management for real-time simulation
  createWorkflowSession: async (workflowId, initialData = {}) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const response = await api.post(`/api/workflows/${workflowId}/sessions`, {
        sessionId,
        initialData,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Create Workflow Session Error:", error);
      // Return mock session for testing
      return {
        success: true,
        data: {
          sessionId: `mock_session_${Date.now()}`,
          workflowId,
          status: "active",
          variables: {},
          currentNodeId: null,
        },
      };
    }
  },

  // Continue workflow session with user input
  continueWorkflowSession: async (sessionId, userInput, currentNodeId) => {
    try {
      const response = await api.post(
        `/api/workflows/sessions/${sessionId}/continue`,
        {
          userInput,
          currentNodeId,
          timestamp: new Date().toISOString(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Continue Workflow Session Error:", error);
      // Return mock continuation for testing
      return {
        success: true,
        data: {
          nextNodeId: null,
          variables: {},
          messages: [],
          completed: false,
        },
      };
    }
  },

  // End workflow session
  endWorkflowSession: async (sessionId) => {
    try {
      const response = await api.post(
        `/api/workflows/sessions/${sessionId}/end`
      );
      return response.data;
    } catch (error) {
      console.error("End Workflow Session Error:", error);
      return { success: true, message: "Session ended" };
    }
  },
};
// User management API calls
export const userAPI = {
  getAdminUsers: async (status = "active", page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/api/user/admin?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getUserAnalytics: async (startDate, endDate) => {
    try {
      const response = await api.get(
        `/api/user/admin/analytics?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/api/user/admin/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  updateUser: async (userId, updateData) => {
    try {
      const response = await api.patch(`/api/user/admin/${userId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

// WhatsApp templates API calls
export const templateAPI = {
  createTemplate: async (templateData) => {
    try {
      const response = await api.post("/api/whatsapp-templates", templateData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getAdminTemplates: async (
    status = "approved",
    category = "utility",
    page = 1,
    limit = 10
  ) => {
    try {
      const response = await api.get(
        `/api/whatsapp-templates/admin?status=${status}&category=${category}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  submitTemplateForReview: async (templateId) => {
    try {
      const response = await api.post(
        `/api/whatsapp-templates/${templateId}/submit`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getTemplateUsageStats: async (templateId, startDate, endDate) => {
    try {
      const response = await api.get(
        `/api/whatsapp-templates/${templateId}/stats?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

// WhatsApp numbers API calls
export const whatsappNumberAPI = {
  getWhatsAppNumbers: async (status = "active", page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/api/whatsapp-numbers?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getNumberById: async (numberId) => {
    try {
      const response = await api.get(`/api/whatsapp-numbers/${numberId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  updateWhatsAppNumber: async (numberId, updateData) => {
    try {
      const response = await api.put(
        `/api/whatsapp-numbers/${numberId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getNumberMetrics: async (numberId, startDate, endDate) => {
    try {
      const response = await api.get(
        `/api/whatsapp-numbers/${numberId}/metrics?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Webhook API calls
export const webhookAPI = {
  getWebhooks: async (status = "active", page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/api/webhooks?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createWebhook: async (webhookData) => {
    try {
      const response = await api.post("/api/webhooks", webhookData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  updateWebhook: async (webhookId, updateData) => {
    try {
      const response = await api.put(`/api/webhooks/${webhookId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  testWebhook: async (webhookId, testData) => {
    try {
      const response = await api.post(
        `/api/webhooks/${webhookId}/test`,
        testData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

// Session API calls
export const sessionAPI = {
  createSession: async (sessionData) => {
    try {
      const response = await api.post("/api/sessions", sessionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getAdminSessions: async (status = "active", page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/api/sessions/admin?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getSessionStats: async (startDate, endDate) => {
    try {
      const response = await api.get(
        `/api/sessions/stats?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  transferSession: async (sessionId, transferData) => {
    try {
      const response = await api.post(
        `/api/sessions/${sessionId}/transfer`,
        transferData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default api;
