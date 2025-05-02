// src/pages/CalendarBookings/components/CreateEventModal.jsx
import React, { useState, useEffect } from "react";

const CreateEventModal = ({
  onClose,
  onSave,
  onUpdate,
  event,
  availabilitySchedules,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    location: "Virtual",
    eventType: "Free",
    amount: 0,
    webhookUrl: "",
    customFields: {
      "Detail Field One": "",
      "Detail Field Two": "",
    },
    availabilityId: "",
    reminderTiming: 30, // minutes before event
  });

  const [customFieldNames, setCustomFieldNames] = useState({
    "Detail Field One": "Detail Field One",
    "Detail Field Two": "Detail Field Two",
  });

  // If editing an existing event, populate the form
  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        amount: event.amount || 0,
      });

      if (event.customFields) {
        const fieldNames = {};
        Object.keys(event.customFields).forEach((key) => {
          fieldNames[key] = key;
        });
        setCustomFieldNames(fieldNames);
      }
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCustomFieldChange = (e, fieldKey) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      customFields: {
        ...formData.customFields,
        [fieldKey]: value,
      },
    });
  };

  const handleCustomFieldNameChange = (e, fieldKey) => {
    const { value } = e.target;
    const updatedFieldNames = { ...customFieldNames };

    // Create a new customFields object with updated keys
    const updatedCustomFields = {};
    Object.entries(formData.customFields).forEach(([key, fieldValue]) => {
      if (key === fieldKey) {
        updatedCustomFields[value] = fieldValue;
        updatedFieldNames[value] = value;
        delete updatedFieldNames[fieldKey];
      } else {
        updatedCustomFields[key] = fieldValue;
      }
    });

    setFormData({
      ...formData,
      customFields: updatedCustomFields,
    });

    setCustomFieldNames(updatedFieldNames);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (event) {
      onUpdate(formData);
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{event ? "Edit Event" : "Create New Event"}</h2>
          <button className="modal-close-button" onClick={onClose}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="title">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    className="form-control"
                    value={formData.duration}
                    onChange={handleChange}
                    min="5"
                    required
                  />
                </div>
              </div>

              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <select
                    id="location"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                  >
                    <option value="Virtual">Virtual</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="eventType">Event Type</label>
                  <select
                    id="eventType"
                    name="eventType"
                    className="form-control"
                    value={formData.eventType}
                    onChange={handleChange}
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="amount">Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="form-control"
                    value={formData.amount}
                    onChange={handleChange}
                    disabled={formData.eventType !== "Paid"}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="availabilityId">Availability Schedule</label>
              <select
                id="availabilityId"
                name="availabilityId"
                className="form-control"
                value={formData.availabilityId}
                onChange={handleChange}
                required
              >
                <option value="">Select a schedule</option>
                {availabilitySchedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="webhookUrl">Webhook URL (Optional)</label>
              <input
                type="url"
                id="webhookUrl"
                name="webhookUrl"
                className="form-control"
                value={formData.webhookUrl}
                onChange={handleChange}
              />
              <span className="help-text">
                Your webhook will be triggered when a booking is created,
                updated, or cancelled.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="reminderTiming">Send Reminder</label>
              <select
                id="reminderTiming"
                name="reminderTiming"
                className="form-control"
                value={formData.reminderTiming}
                onChange={handleChange}
              >
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="120">2 hours before</option>
                <option value="1440">1 day before</option>
              </select>
            </div>

            <div className="form-section-title">Custom Fields</div>

            {Object.entries(formData.customFields).map(([key, value]) => (
              <div className="form-row" key={key}>
                <div className="form-col">
                  <div className="form-group">
                    <label>Field Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customFieldNames[key]}
                      onChange={(e) => handleCustomFieldNameChange(e, key)}
                    />
                  </div>
                </div>

                <div className="form-col">
                  <div className="form-group">
                    <label>Field Value</label>
                    <input
                      type="text"
                      className="form-control"
                      value={value}
                      onChange={(e) => handleCustomFieldChange(e, key)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="modal-save-button">
              {event ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
