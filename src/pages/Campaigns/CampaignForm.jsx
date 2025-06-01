// CampaignForm.jsx - Updated with correct CTA values and field names
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle,
  Calendar,
  Target,
  DollarSign,
  Image as ImageIcon,
  Type,
  Mouse,
} from "lucide-react";
import { campaignAPI } from "../../utils/api";
// CSS will be imported via scoped CSS file

const CampaignForm = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const isEditMode = Boolean(campaignId);

  // Call to Action options with correct values
  const callToActionOptions = [
    { value: "Learn More", label: "Learn More" },
    { value: "Shop Now", label: "Shop Now" },
    { value: "Sign Up", label: "Sign Up" },
    { value: "Download", label: "Download" },
    { value: "Get Quote", label: "Get Quote" },
    { value: "Contact Us", label: "Contact Us" },
    { value: "Apply Now", label: "Apply Now" },
    { value: "Book Now", label: "Book Now" },
    { value: "See Menu", label: "See Menu" },
    { value: "Watch More", label: "Watch More" },
    { value: "Play Game", label: "Play Game" },
    { value: "Install Now", label: "Install Now" },
    { value: "Use App", label: "Use App" },
    { value: "Call Now", label: "Call Now" },
    { value: "Message", label: "Message" },
    { value: "Subscribe", label: "Subscribe" },
    { value: "Get Directions", label: "Get Directions" },
    { value: "Send Message", label: "Send Message" },
    { value: "Get Offer", label: "Get Offer" },
  ];

  // Platform options
  const platformOptions = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "google", label: "Google Ads" },
  ];

  // Objective options
  const objectiveOptions = [
    { value: "awareness", label: "Brand Awareness" },
    { value: "traffic", label: "Traffic" },
    { value: "engagement", label: "Engagement" },
    { value: "leads", label: "Lead Generation" },
    { value: "conversions", label: "Conversions" },
    { value: "sales", label: "Sales" },
  ];

  // Ad type options
  const adTypeOptions = [
    { value: "single_image", label: "Single Image" },
    { value: "carousel", label: "Carousel" },
    { value: "video", label: "Video" },
    { value: "collection", label: "Collection" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    objective: "awareness",
    adType: "single_image",
    platform: "facebook",
    adminNotes: "",
    targeting: {
      locations: [],
      interests: [],
      languages: [],
      excludedAudiences: [],
      customAudiences: [],
      age_min: 18,
      age_max: 65,
      genders: [1, 2], // 1 = male, 2 = female
    },
    budgetSchedule: {
      dailyBudget: 1000,
      totalBudget: 30000,
      startDate: "",
      endDate: "",
    },
  });

  // Creatives state with correct field names
  const [creatives, setCreatives] = useState([
    {
      headline: "",
      description: "",
      callToAction: "Learn More", // Changed from 'cta' to 'callToAction'
      primaryText: "",
      imageUrls: [],
    },
  ]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Input states for targeting
  const [locationInput, setLocationInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    setFormData((prev) => ({
      ...prev,
      budgetSchedule: {
        ...prev.budgetSchedule,
        startDate: today.toISOString().split("T")[0],
        endDate: nextMonth.toISOString().split("T")[0],
      },
    }));
  }, []);

  // Load campaign data if editing
  useEffect(() => {
    if (isEditMode && campaignId) {
      fetchCampaignData();
    }
  }, [campaignId, isEditMode]);

  const fetchCampaignData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await campaignAPI.getCampaignById(campaignId);

      if (response.success) {
        const campaign = response.data;
        setFormData({
          name: campaign.name || "",
          description: campaign.description || "",
          objective: campaign.objective || "awareness",
          adType: campaign.adType || "single_image",
          platform: campaign.platform || "facebook",
          adminNotes: campaign.adminNotes || "",
          targeting: campaign.targeting || formData.targeting,
          budgetSchedule: campaign.budgetSchedule || formData.budgetSchedule,
        });

        if (campaign.creatives && campaign.creatives.length > 0) {
          setCreatives(
            campaign.creatives.map((creative) => ({
              headline: creative.headline || "",
              description: creative.description || "",
              callToAction: creative.callToAction || "Learn More",
              primaryText: creative.primaryText || "",
              imageUrls: creative.imageUrls || [],
            }))
          );
        }
      } else {
        setError(response.message || "Failed to fetch campaign data");
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setError("Failed to fetch campaign data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const newData = { ...prev };
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle creative changes
  const handleCreativeChange = (index, field, value) => {
    setCreatives((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  // Add new creative
  const addCreative = () => {
    setCreatives((prev) => [
      ...prev,
      {
        headline: "",
        description: "",
        callToAction: "Learn More",
        primaryText: "",
        imageUrls: [],
      },
    ]);
  };

  // Remove creative
  const removeCreative = (index) => {
    if (creatives.length > 1) {
      setCreatives((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  // Add location to targeting
  const addLocation = () => {
    if (
      locationInput.trim() &&
      !formData.targeting.locations.includes(locationInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        targeting: {
          ...prev.targeting,
          locations: [...prev.targeting.locations, locationInput.trim()],
        },
      }));
      setLocationInput("");
    }
  };

  // Remove location from targeting
  const removeLocation = (location) => {
    setFormData((prev) => ({
      ...prev,
      targeting: {
        ...prev.targeting,
        locations: prev.targeting.locations.filter((loc) => loc !== location),
      },
    }));
  };

  // Add interest to targeting
  const addInterest = () => {
    if (
      interestInput.trim() &&
      !formData.targeting.interests.includes(interestInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        targeting: {
          ...prev.targeting,
          interests: [...prev.targeting.interests, interestInput.trim()],
        },
      }));
      setInterestInput("");
    }
  };

  // Remove interest from targeting
  const removeInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      targeting: {
        ...prev.targeting,
        interests: prev.targeting.interests.filter((int) => int !== interest),
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim()) {
      setError("Campaign name is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Campaign description is required");
      return;
    }

    if (creatives.some((creative) => !creative.headline.trim())) {
      setError("All creatives must have a headline");
      return;
    }

    if (creatives.some((creative) => !creative.callToAction)) {
      setError("All creatives must have a call to action");
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData
      const formDataToSend = new FormData();

      // Add basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("objective", formData.objective);
      formDataToSend.append("adType", formData.adType);
      formDataToSend.append("platform", formData.platform);
      formDataToSend.append("adminNotes", formData.adminNotes);

      // Add complex objects as JSON strings
      formDataToSend.append("targeting", JSON.stringify(formData.targeting));
      formDataToSend.append(
        "budgetSchedule",
        JSON.stringify(formData.budgetSchedule)
      );
      formDataToSend.append("creatives", JSON.stringify(creatives));

      // Add files
      uploadedFiles.forEach((file) => {
        formDataToSend.append("files", file);
      });

      let response;
      if (isEditMode) {
        response = await campaignAPI.updateCampaign(campaignId, formDataToSend);
      } else {
        response = await campaignAPI.createCampaignRequest(formDataToSend);
      }

      if (response.success) {
        setSuccess(
          response.message ||
            `Campaign ${isEditMode ? "updated" : "created"} successfully!`
        );
        setTimeout(() => {
          navigate("/campaigns");
        }, 2000);
      } else {
        setError(
          response.message ||
            `Failed to ${isEditMode ? "update" : "create"} campaign`
        );
      }
    } catch (error) {
      console.error("Error submitting campaign:", error);
      setError(
        error.message ||
          `An error occurred while ${
            isEditMode ? "updating" : "creating"
          } the campaign`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="campaign-form-container">
      {/* Header */}
      <div className="campaign-form-header">
        <div className="header-left">
          <button
            className="back-button"
            onClick={() => navigate("/campaigns")}
          >
            <ArrowLeft size={16} />
            <span>Back to Campaigns</span>
          </button>
          <div className="title-section">
            <h1>{isEditMode ? "Edit Campaign" : "Create Campaign"}</h1>
            <p>
              {isEditMode
                ? "Update your campaign settings"
                : "Create a new advertising campaign"}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Form */}
      <form className="campaign-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h2 className="section-title">
            <Type size={20} />
            Basic Information
          </h2>

          <div className="form-group">
            <label htmlFor="name">Campaign Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter campaign name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="platform">Platform *</label>
              <select
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="objective">Objective *</label>
              <select
                id="objective"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                required
              >
                {objectiveOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="adType">Ad Type *</label>
              <select
                id="adType"
                name="adType"
                value={formData.adType}
                onChange={handleChange}
                required
              >
                {adTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your campaign objectives and target audience"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminNotes">Admin Notes</label>
            <textarea
              id="adminNotes"
              name="adminNotes"
              placeholder="Internal notes for campaign management"
              value={formData.adminNotes}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        {/* Budget & Schedule */}
        <div className="form-section">
          <h2 className="section-title">
            <DollarSign size={20} />
            Budget & Schedule
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budgetSchedule.dailyBudget">
                Daily Budget (₹) *
              </label>
              <input
                type="number"
                id="budgetSchedule.dailyBudget"
                name="budgetSchedule.dailyBudget"
                placeholder="1000"
                value={formData.budgetSchedule.dailyBudget}
                onChange={handleChange}
                min="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="budgetSchedule.totalBudget">
                Total Budget (₹) *
              </label>
              <input
                type="number"
                id="budgetSchedule.totalBudget"
                name="budgetSchedule.totalBudget"
                placeholder="30000"
                value={formData.budgetSchedule.totalBudget}
                onChange={handleChange}
                min="1000"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budgetSchedule.startDate">Start Date *</label>
              <input
                type="date"
                id="budgetSchedule.startDate"
                name="budgetSchedule.startDate"
                value={formData.budgetSchedule.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="budgetSchedule.endDate">End Date *</label>
              <input
                type="date"
                id="budgetSchedule.endDate"
                name="budgetSchedule.endDate"
                value={formData.budgetSchedule.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Targeting */}
        <div className="form-section">
          <h2 className="section-title">
            <Target size={20} />
            Targeting
          </h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targeting.age_min">Minimum Age</label>
              <input
                type="number"
                id="targeting.age_min"
                name="targeting.age_min"
                value={formData.targeting.age_min}
                onChange={handleChange}
                min="13"
                max="65"
              />
            </div>

            <div className="form-group">
              <label htmlFor="targeting.age_max">Maximum Age</label>
              <input
                type="number"
                id="targeting.age_max"
                name="targeting.age_max"
                value={formData.targeting.age_max}
                onChange={handleChange}
                min="18"
                max="65"
              />
            </div>
          </div>

          {/* Locations */}
          <div className="form-group">
            <label>Target Locations</label>
            <div className="tag-input-container">
              <div className="tag-input-field">
                <input
                  type="text"
                  placeholder="Add location and press Enter"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLocation();
                    }
                  }}
                />
                <button
                  type="button"
                  className="tag-add-button"
                  onClick={addLocation}
                >
                  Add
                </button>
              </div>
              <div className="tags-container">
                {formData.targeting.locations.map((location, index) => (
                  <div key={index} className="tag">
                    <span>{location}</span>
                    <button
                      type="button"
                      className="tag-remove-button"
                      onClick={() => removeLocation(location)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="form-group">
            <label>Target Interests</label>
            <div className="tag-input-container">
              <div className="tag-input-field">
                <input
                  type="text"
                  placeholder="Add interest and press Enter"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                />
                <button
                  type="button"
                  className="tag-add-button"
                  onClick={addInterest}
                >
                  Add
                </button>
              </div>
              <div className="tags-container">
                {formData.targeting.interests.map((interest, index) => (
                  <div key={index} className="tag">
                    <span>{interest}</span>
                    <button
                      type="button"
                      className="tag-remove-button"
                      onClick={() => removeInterest(interest)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Creatives */}
        <div className="form-section">
          <h2 className="section-title">
            <ImageIcon size={20} />
            Creatives
          </h2>

          {creatives.map((creative, index) => (
            <div key={index} className="creative-item">
              <div className="creative-header">
                <h3>Creative {index + 1}</h3>
                {creatives.length > 1 && (
                  <button
                    type="button"
                    className="remove-creative-button"
                    onClick={() => removeCreative(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Headline *</label>
                <input
                  type="text"
                  placeholder="Enter headline"
                  value={creative.headline}
                  onChange={(e) =>
                    handleCreativeChange(index, "headline", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Primary Text</label>
                <textarea
                  placeholder="Enter primary text"
                  value={creative.primaryText}
                  onChange={(e) =>
                    handleCreativeChange(index, "primaryText", e.target.value)
                  }
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter description"
                  value={creative.description}
                  onChange={(e) =>
                    handleCreativeChange(index, "description", e.target.value)
                  }
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Call to Action *</label>
                <select
                  value={creative.callToAction}
                  onChange={(e) =>
                    handleCreativeChange(index, "callToAction", e.target.value)
                  }
                  required
                >
                  {callToActionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-creative-button"
            onClick={addCreative}
          >
            <Plus size={16} />
            Add Creative
          </button>
        </div>

        {/* File Upload */}
        <div className="form-section">
          <h2 className="section-title">
            <Upload size={20} />
            Media Files
          </h2>

          <div className="file-upload-area">
            <input
              type="file"
              id="files"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="file-input"
            />
            <label htmlFor="files" className="file-upload-label">
              <Upload size={24} />
              <span>Click to upload files or drag and drop</span>
              <span className="file-types">PNG, JPG, MP4 up to 10MB each</span>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h4>Uploaded Files:</h4>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/campaigns")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>{isEditMode ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <span>{isEditMode ? "Update Campaign" : "Create Campaign"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
