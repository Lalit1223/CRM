// src/pages/Campaigns/CampaignDetail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart2,
  Calendar,
  DollarSign,
  Target,
  Layers,
  User,
  MapPin,
  AlertCircle,
  Clock,
  Check,
  X,
  Image,
  Globe,
  Maximize2,
} from "lucide-react";
import { campaignAPI } from "../../utils/api";

const CampaignDetail = () => {
  const navigate = useNavigate();
  const { campaignId } = useParams();

  // State
  const [campaign, setCampaign] = useState(null);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Fetch campaign data
  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await campaignAPI.getCampaignById(campaignId);

      if (response.success) {
        // Extract campaign data and files from API response
        const campaignData = response.data.campaignRequest;
        const campaignFiles = response.data.files || [];

        if (campaignData) {
          setCampaign(campaignData);
          setFiles(campaignFiles);
        } else {
          setError("Campaign data not found in the response");
        }
      } else {
        setError(response.message || "Failed to fetch campaign details");
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setError(
        "An error occurred while fetching campaign details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/campaigns");
  };

  // Handle opening fullscreen image
  const openFullscreenImage = (imageUrl) => {
    setFullscreenImage(imageUrl);
    document.body.style.overflow = "hidden";
  };

  // Handle closing fullscreen image
  const closeFullscreenImage = () => {
    setFullscreenImage(null);
    document.body.style.overflow = "auto";
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get gender display text
  const getGenderText = (gender) => {
    if (gender === "all") return "All Genders";
    if (gender === "male") return "Male";
    if (gender === "female") return "Female";
    return "Not specified";
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusMap = {
      submitted: {
        icon: <Clock size={14} />,
        class: "submitted",
        text: "Submitted",
      },
      approved: {
        icon: <Check size={14} />,
        class: "approved",
        text: "Approved",
      },
      rejected: { icon: <X size={14} />, class: "rejected", text: "Rejected" },
      running: {
        icon: <BarChart2 size={14} />,
        class: "running",
        text: "Running",
      },
      paused: { icon: <Clock size={14} />, class: "paused", text: "Paused" },
      completed: {
        icon: <Check size={14} />,
        class: "completed",
        text: "Completed",
      },
    };

    const statusInfo = statusMap[status] || {
      icon: null,
      class: "unknown",
      text: status || "Unknown",
    };

    return (
      <span className={`campaign-detail-status-badge ${statusInfo.class}`}>
        {statusInfo.icon && (
          <span className="campaign-detail-status-icon">{statusInfo.icon}</span>
        )}
        <span>{statusInfo.text}</span>
      </span>
    );
  };

  return (
    <div className="campaign-detail-container">
      <div className="campaign-detail-header">
        <div className="campaign-detail-header-left">
          <button className="campaign-detail-back-button" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Back to Campaigns</span>
          </button>
          <div className="campaign-detail-title-section">
            <h1>Campaign Details</h1>
            <p>View and monitor your campaign</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="campaign-detail-error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="campaign-detail-loading">
          <div className="campaign-detail-spinner"></div>
          <p>Loading campaign details...</p>
        </div>
      ) : campaign ? (
        <div className="campaign-detail-content">
          <div className="campaign-detail-section">
            <div className="campaign-detail-section-header">
              <h2 className="campaign-detail-section-title">
                Campaign Information
              </h2>
              {renderStatusBadge(campaign.status)}
            </div>

            <div className="campaign-detail-overview">
              <h3>{campaign.name || "Unnamed Campaign"}</h3>
              {campaign.description && <p>{campaign.description}</p>}
            </div>

            <div className="campaign-detail-grid">
              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <BarChart2 size={16} />
                  <span>Objective</span>
                </div>
                <div className="campaign-detail-value">
                  <span
                    className={`campaign-detail-objective-badge ${
                      campaign.objective || ""
                    }`}
                  >
                    {campaign.objective
                      ? campaign.objective.charAt(0).toUpperCase() +
                        campaign.objective.slice(1)
                      : "Not specified"}
                  </span>
                </div>
              </div>

              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <Layers size={16} />
                  <span>Ad Type</span>
                </div>
                <div className="campaign-detail-value">
                  {campaign.adType
                    ? campaign.adType
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "Not specified"}
                </div>
              </div>

              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <Globe size={16} />
                  <span>Platform</span>
                </div>
                <div className="campaign-detail-value">
                  {campaign.platform
                    ? campaign.platform.charAt(0).toUpperCase() +
                      campaign.platform.slice(1)
                    : "Not specified"}
                </div>
              </div>
            </div>
          </div>

          <div className="campaign-detail-section">
            <h2 className="campaign-detail-section-title">Budget & Schedule</h2>
            <div className="campaign-detail-grid">
              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <DollarSign size={16} />
                  <span>Daily Budget</span>
                </div>
                <div className="campaign-detail-value">
                  {formatCurrency(campaign.budgetSchedule?.dailyBudget)}
                </div>
              </div>

              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <DollarSign size={16} />
                  <span>Total Budget</span>
                </div>
                <div className="campaign-detail-value">
                  {formatCurrency(campaign.budgetSchedule?.totalBudget)}
                </div>
              </div>

              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <Calendar size={16} />
                  <span>Start Date</span>
                </div>
                <div className="campaign-detail-value">
                  {formatDate(campaign.budgetSchedule?.startDate)}
                </div>
              </div>

              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <Calendar size={16} />
                  <span>End Date</span>
                </div>
                <div className="campaign-detail-value">
                  {formatDate(campaign.budgetSchedule?.endDate)}
                </div>
              </div>
            </div>
          </div>

          <div className="campaign-detail-section">
            <h2 className="campaign-detail-section-title">
              Audience Targeting
            </h2>
            <div className="campaign-detail-grid">
              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <User size={16} />
                  <span>Age Range</span>
                </div>
                <div className="campaign-detail-value">
                  {campaign.targeting?.ageRange?.min || 0} to{" "}
                  {campaign.targeting?.ageRange?.max || 0} years
                </div>
              </div>

              <div className="campaign-detail-item">
                <div className="campaign-detail-label">
                  <User size={16} />
                  <span>Gender</span>
                </div>
                <div className="campaign-detail-value">
                  {getGenderText(campaign.targeting?.gender)}
                </div>
              </div>

              <div className="campaign-detail-item campaign-detail-full-width">
                <div className="campaign-detail-label">
                  <MapPin size={16} />
                  <span>Locations</span>
                </div>
                <div className="campaign-detail-value">
                  {campaign.targeting?.locations &&
                  campaign.targeting.locations.length > 0 ? (
                    <div className="campaign-detail-tags-container">
                      {campaign.targeting.locations.map((location, index) => (
                        <div
                          key={`location-${index}`}
                          className="campaign-detail-tag"
                        >
                          <span>{location}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="campaign-detail-empty-value">
                      No locations specified
                    </span>
                  )}
                </div>
              </div>

              <div className="campaign-detail-item campaign-detail-full-width">
                <div className="campaign-detail-label">
                  <Target size={16} />
                  <span>Interests</span>
                </div>
                <div className="campaign-detail-value">
                  {campaign.targeting?.interests &&
                  campaign.targeting.interests.length > 0 ? (
                    <div className="campaign-detail-tags-container">
                      {campaign.targeting.interests.map((interest, index) => (
                        <div
                          key={`interest-${index}`}
                          className="campaign-detail-tag"
                        >
                          <span>{interest}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="campaign-detail-empty-value">
                      No interests specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="campaign-detail-section">
            <h2 className="campaign-detail-section-title">Creatives</h2>
            <div className="campaign-detail-creatives-container">
              {campaign.creatives && campaign.creatives.length > 0 ? (
                campaign.creatives.map((creative, index) => (
                  <div
                    key={`creative-${index}`}
                    className="campaign-detail-creative-card"
                  >
                    <div className="campaign-detail-creative-header">
                      <h3>Creative {index + 1}</h3>
                    </div>
                    <div className="campaign-detail-creative-content">
                      <div className="campaign-detail-creative-field">
                        <span className="campaign-detail-field-label">
                          Headline
                        </span>
                        <span className="campaign-detail-field-value">
                          {creative.headline || "Not specified"}
                        </span>
                      </div>
                      <div className="campaign-detail-creative-field">
                        <span className="campaign-detail-field-label">
                          Description
                        </span>
                        <span className="campaign-detail-field-value">
                          {creative.description || "Not specified"}
                        </span>
                      </div>
                      <div className="campaign-detail-creative-field">
                        <span className="campaign-detail-field-label">
                          Call to Action
                        </span>
                        <span className="campaign-detail-field-value">
                          {creative.callToAction || "Not specified"}
                        </span>
                      </div>
                      {creative.primaryText && (
                        <div className="campaign-detail-creative-field">
                          <span className="campaign-detail-field-label">
                            Primary Text
                          </span>
                          <span className="campaign-detail-field-value">
                            {creative.primaryText}
                          </span>
                        </div>
                      )}

                      {creative.imageUrls && creative.imageUrls.length > 0 && (
                        <div className="campaign-detail-creative-images">
                          <span className="campaign-detail-field-label">
                            Images
                          </span>
                          <div className="campaign-detail-images-container">
                            {creative.imageUrls.map((imageUrl, imgIndex) => (
                              <div
                                key={`img-${index}-${imgIndex}`}
                                className="campaign-detail-creative-image"
                                onClick={() => openFullscreenImage(imageUrl)}
                              >
                                <img
                                  src={imageUrl}
                                  alt={`${
                                    creative.headline || "Creative"
                                  } image ${imgIndex + 1}`}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/200x150?text=Image+Not+Available";
                                  }}
                                />
                                <div className="campaign-detail-image-overlay">
                                  <Maximize2 size={18} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="campaign-detail-no-creatives">
                  <p>No creatives available for this campaign</p>
                </div>
              )}
            </div>

            {/* Display campaign files if available */}
            {files && files.length > 0 && (
              <div className="campaign-detail-files-section">
                <h3>Campaign Files</h3>
                <div className="campaign-detail-image-gallery">
                  {files.map((file, index) => (
                    <div
                      key={`file-${index}`}
                      className="campaign-detail-image-container"
                      onClick={() => openFullscreenImage(file.url)}
                    >
                      <img
                        src={file.url}
                        alt={`Campaign file ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/200x150?text=Image+Not+Available";
                        }}
                      />
                      <div className="campaign-detail-image-overlay">
                        <Maximize2 size={18} />
                      </div>
                      <div className="campaign-detail-file-info">
                        <span className="campaign-detail-file-name">
                          {file.originalFilename || file.filename}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!files || files.length === 0) &&
              (!campaign.creatives ||
                campaign.creatives.length === 0 ||
                !campaign.creatives.some(
                  (c) => c.imageUrls && c.imageUrls.length > 0
                )) && (
                <div className="campaign-detail-no-images">
                  <Image size={24} />
                  <p>No images attached to this campaign</p>
                </div>
              )}
          </div>

          {campaign.adminNotes && (
            <div className="campaign-detail-section campaign-detail-admin-notes-section">
              <h2 className="campaign-detail-section-title">Admin Notes</h2>
              <div className="campaign-detail-admin-notes">
                <p>{campaign.adminNotes}</p>
              </div>
            </div>
          )}

          {campaign.status === "rejected" && campaign.rejectionReason && (
            <div className="campaign-detail-section campaign-detail-rejection-section">
              <h2 className="campaign-detail-section-title">
                Rejection Details
              </h2>
              <div className="campaign-detail-rejection-reason">
                <AlertCircle size={16} />
                <div className="campaign-detail-reason-text">
                  <p className="campaign-detail-reason-label">
                    Reason for rejection:
                  </p>
                  <p>{campaign.rejectionReason}</p>
                </div>
              </div>
              {campaign.superAdminNotes && (
                <div className="campaign-detail-admin-notes">
                  <p className="campaign-detail-notes-label">
                    Additional notes:
                  </p>
                  <p>{campaign.superAdminNotes}</p>
                </div>
              )}
            </div>
          )}

          {campaign.status === "approved" && (
            <div className="campaign-detail-section campaign-detail-approval-section">
              <h2 className="campaign-detail-section-title">
                Approval Details
              </h2>
              <div className="campaign-detail-approval-info">
                <Check size={16} />
                <div className="campaign-detail-approval-text">
                  <p>
                    This campaign has been approved and is ready to be
                    published.
                  </p>
                  {campaign.reviewedAt && (
                    <p className="campaign-detail-approval-date">
                      Approved on: {formatDate(campaign.reviewedAt)}
                    </p>
                  )}
                </div>
              </div>
              {campaign.superAdminNotes && (
                <div className="campaign-detail-admin-notes">
                  <p className="campaign-detail-notes-label">
                    Additional notes:
                  </p>
                  <p>{campaign.superAdminNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="campaign-detail-not-found">
          <AlertCircle size={24} />
          <p>Campaign not found or has been deleted.</p>
          <button
            className="campaign-detail-back-to-list-button"
            onClick={handleBack}
          >
            Back to Campaigns List
          </button>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="campaign-detail-fullscreen-modal"
          onClick={closeFullscreenImage}
        >
          <div className="campaign-detail-fullscreen-container">
            <img
              src={fullscreenImage}
              alt="Campaign image"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/800x600?text=Image+Not+Available";
              }}
            />
            <button
              className="campaign-detail-close-fullscreen-button"
              onClick={closeFullscreenImage}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
