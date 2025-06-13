// src/utils/campaignAPI.js
import axios from "axios";
import { getAuthToken, handleApiError } from "./apiUtils";

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://pixe-backend-83iz.onrender.com";

/**
 * API utility functions for Campaign management
 */
export const campaignAPI = {
  /**
   * Get all campaigns with optional filtering
   * @param {string} status - Filter by campaign status (optional)
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @returns {Promise<Object>} - Campaign data with pagination info
   */
  getAllCampaigns: async (status = "", page = 1, limit = 10) => {
    try {
      const token = getAuthToken();

      let url = `${BASE_URL}/api/campaigns/requests?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch campaigns");
    }
  },

  /**
   * Get campaign details by ID
   * @param {string} campaignId - Campaign ID
   * @returns {Promise<Object>} - Campaign details
   */
  getCampaignById: async (campaignId) => {
    try {
      const token = getAuthToken();

      const response = await axios.get(
        `${BASE_URL}/api/campaigns/requests/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch campaign details");
    }
  },

  /**
   * Create a new campaign request
   * @param {Object} campaignData - Campaign data to submit
   * @returns {Promise<Object>} - Response with created campaign details
   */
  createCampaign: async (campaignData) => {
    try {
      const token = getAuthToken();

      // Handle FormData for file uploads
      let requestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // If campaignData is FormData, don't set Content-Type (browser will set it with boundary)
      if (!(campaignData instanceof FormData)) {
        requestConfig.headers["Content-Type"] = "application/json";
      }

      const response = await axios.post(
        `${BASE_URL}/api/campaigns/requests`,
        campaignData,
        requestConfig
      );

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to create campaign");
    }
  },

  /**
   * Update an existing campaign
   * @param {string} campaignId - Campaign ID to update
   * @param {Object} updateData - Updated campaign data
   * @returns {Promise<Object>} - Response with updated campaign
   */
  updateCampaign: async (campaignId, updateData) => {
    try {
      const token = getAuthToken();

      // Handle FormData for file uploads
      let requestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // If updateData is FormData, don't set Content-Type (browser will set it with boundary)
      if (!(updateData instanceof FormData)) {
        requestConfig.headers["Content-Type"] = "application/json";
      }

      const response = await axios.put(
        `${BASE_URL}/api/campaigns/requests/${campaignId}`,
        updateData,
        requestConfig
      );

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to update campaign");
    }
  },

  /**
   * Delete a campaign
   * @param {string} campaignId - Campaign ID to delete
   * @returns {Promise<Object>} - Response after deletion
   */
  deleteCampaign: async (campaignId) => {
    try {
      const token = getAuthToken();

      const response = await axios.delete(
        `${BASE_URL}/api/campaigns/requests/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to delete campaign");
    }
  },

  /**
   * Get campaign analytics data
   * @param {string} campaignId - Campaign ID
   * @param {string} startDate - Start date for analytics (YYYY-MM-DD)
   * @param {string} endDate - End date for analytics (YYYY-MM-DD)
   * @returns {Promise<Object>} - Campaign analytics data
   */
  getCampaignAnalytics: async (campaignId, startDate, endDate) => {
    try {
      const token = getAuthToken();

      const response = await axios.get(
        `${BASE_URL}/api/campaigns/${campaignId}/analytics?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return handleApiError(error, "Failed to fetch campaign analytics");
    }
  },
};

export default campaignAPI;
