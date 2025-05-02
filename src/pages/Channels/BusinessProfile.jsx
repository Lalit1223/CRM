// src/pages/Channels/BusinessProfile.jsx

import React, { useState, useEffect } from "react";
import "./BusinessProfile.css";

const BusinessProfile = () => {
  const [profile, setProfile] = useState({
    displayName: "",
    description: "",
    address: "",
    email: "",
    websites: [""],
    profileImage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  // Fetch existing profile data
  useEffect(() => {
    // This would be an API call in production
    // Simulating data fetch
    setTimeout(() => {
      setProfile({
        displayName: "My Business",
        description: "We provide quality products and services",
        address: "123 Business St, City, Country",
        email: "contact@mybusiness.com",
        websites: ["https://www.mybusiness.com"],
        profileImage: null,
      });
    }, 500);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle website array changes
  const handleWebsiteChange = (index, value) => {
    const updatedWebsites = [...profile.websites];
    updatedWebsites[index] = value;
    setProfile((prev) => ({ ...prev, websites: updatedWebsites }));
  };

  // Add new website field
  const addWebsite = () => {
    setProfile((prev) => ({
      ...prev,
      websites: [...prev.websites, ""],
    }));
  };

  // Remove website field
  const removeWebsite = (index) => {
    const updatedWebsites = [...profile.websites];
    updatedWebsites.splice(index, 1);
    setProfile((prev) => ({ ...prev, websites: updatedWebsites }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, profileImage: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data and update business profile
    console.log("Updated profile:", profile);
    // API call to update profile would go here

    // Show success message
    alert("Business profile updated successfully!");
  };

  return (
    <div className="business-profile-container">
      <h1>Business Profile</h1>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-image-section">
          <div className="profile-image-container">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="profile-image-preview"
              />
            ) : (
              <div className="profile-image-placeholder">
                <span>Upload Image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            id="profileImage"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
            className="image-upload-input"
          />
          <label htmlFor="profileImage" className="image-upload-button">
            Choose Image
          </label>
          <p className="image-requirements">
            Image should be square (512x512 pixels) in PNG or JPEG format
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={profile.displayName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Websites</label>
          {profile.websites.map((website, index) => (
            <div key={index} className="website-input-group">
              <input
                type="url"
                value={website}
                onChange={(e) => handleWebsiteChange(index, e.target.value)}
                placeholder="https://example.com"
              />
              {profile.websites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWebsite(index)}
                  className="remove-website-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addWebsite}
            className="add-website-btn"
          >
            Add Website
          </button>
        </div>

        <button type="submit" className="update-profile-btn">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default BusinessProfile;
