// src/pages/CalendarBookings/components/EventsList.jsx
import React, { useState } from "react";

const EventsList = ({
  events,
  availabilitySchedules,
  onEditEvent,
  onDeleteEvent,
  onUpdateEvent,
}) => {
  const [copiedEvent, setCopiedEvent] = useState(null);

  const handleCopyEventLink = (eventId) => {
    // In a real app, this would be the actual booking link
    const bookingLink = `${window.location.origin}/book/${eventId}`;

    navigator.clipboard
      .writeText(bookingLink)
      .then(() => {
        setCopiedEvent(eventId);
        setTimeout(() => setCopiedEvent(null), 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  const getAvailabilityName = (scheduleId) => {
    const schedule = availabilitySchedules.find((s) => s.id === scheduleId);
    return schedule ? schedule.title : "Not assigned";
  };

  return (
    <div className="events-list">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-card-header">
              <div
                className={`event-type-badge ${event.eventType.toLowerCase()}`}
              >
                {event.eventType}
              </div>
              <h3 className="event-title">{event.title}</h3>
              <div className="event-duration">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 6V12L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {event.duration} minutes
              </div>
            </div>

            <div className="event-card-body">
              <p className="event-description">{event.description}</p>

              <div className="event-details">
                <div className="event-detail-label">Location:</div>
                <div className="event-detail-value">{event.location}</div>

                <div className="event-detail-label">Availability:</div>
                <div className="event-detail-value">
                  {getAvailabilityName(event.availabilityId)}
                </div>

                {event.eventType === "Paid" && (
                  <>
                    <div className="event-detail-label">Price:</div>
                    <div className="event-detail-value">${event.amount}</div>
                  </>
                )}

                {event.customFields &&
                  Object.entries(event.customFields).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <div className="event-detail-label">{key}:</div>
                      <div className="event-detail-value">{value}</div>
                    </React.Fragment>
                  ))}

                <div className="event-detail-label">Created:</div>
                <div className="event-detail-value">
                  {new Date(event.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="event-share-link">
                <input
                  type="text"
                  className="event-link"
                  value={`${window.location.origin}/book/${event.id}`}
                  readOnly
                />
                <button
                  className="copy-button"
                  onClick={() => handleCopyEventLink(event.id)}
                >
                  {copiedEvent === event.id ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="event-card-actions">
              <button
                className="event-action-button edit-button"
                onClick={() => onEditEvent(event)}
              >
                Edit
              </button>
              <button
                className="event-action-button delete-button"
                onClick={() => onDeleteEvent(event.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-events">
          <p>No events found. Create your first event to get started.</p>
        </div>
      )}
    </div>
  );
};

export default EventsList;
