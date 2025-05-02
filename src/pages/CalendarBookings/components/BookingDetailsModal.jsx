// src/pages/CalendarBookings/components/BookingDetailsModal.jsx
import React from "react";

const BookingDetailsModal = ({ booking, events, onClose, onUpdateBooking }) => {
  const getEvent = () => {
    return events.find((event) => event.id === booking.eventId) || {};
  };

  const event = getEvent();

  const handleApprove = () => {
    const updatedBooking = { ...booking, status: "approved" };
    onUpdateBooking(updatedBooking);
    onClose();
  };

  const handleReject = () => {
    const updatedBooking = { ...booking, status: "rejected" };
    onUpdateBooking(updatedBooking);
    onClose();
  };

  const handleCancel = () => {
    const updatedBooking = { ...booking, status: "cancelled" };
    onUpdateBooking(updatedBooking);
    onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Booking Details</h2>
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

        <div className="modal-body">
          <div className="booking-details-grid">
            <div className="booking-detail-section">
              <div className="booking-detail-section-header">
                Event Information
              </div>
              <div className="booking-detail-section-body">
                <div className="booking-detail-field">
                  <div className="booking-detail-label">Event</div>
                  <div className="booking-detail-value">{event.title}</div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Type</div>
                  <div className="booking-detail-value">
                    {event.eventType || "N/A"}
                  </div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Duration</div>
                  <div className="booking-detail-value">
                    {event.duration} minutes
                  </div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Location</div>
                  <div className="booking-detail-value">{event.location}</div>
                </div>
              </div>
            </div>

            <div className="booking-detail-section">
              <div className="booking-detail-section-header">
                Customer Information
              </div>
              <div className="booking-detail-section-body">
                <div className="booking-detail-field">
                  <div className="booking-detail-label">Name</div>
                  <div className="booking-detail-value">
                    {booking.customerName}
                  </div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Phone</div>
                  <div className="booking-detail-value">
                    {booking.customerPhone}
                  </div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Email</div>
                  <div className="booking-detail-value">
                    {booking.customerEmail}
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-detail-section">
              <div className="booking-detail-section-header">
                Booking Details
              </div>
              <div className="booking-detail-section-body">
                <div className="booking-detail-field">
                  <div className="booking-detail-label">Date</div>
                  <div className="booking-detail-value">
                    {formatDate(booking.date)}
                  </div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Time</div>
                  <div className="booking-detail-value">
                    {booking.startTime} - {booking.endTime}
                  </div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Status</div>
                  <div className="booking-detail-value">
                    <span className={`booking-status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Created</div>
                  <div className="booking-detail-value">
                    {new Date(booking.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="booking-detail-field">
                  <div className="booking-detail-label">Reminder Sent</div>
                  <div className="booking-detail-value">
                    {booking.reminderSent ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-detail-section">
              <div className="booking-detail-section-header">Notes</div>
              <div className="booking-detail-section-body">
                <div className="booking-detail-field">
                  <div className="booking-detail-value">
                    {booking.notes || "No notes provided."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {booking.status === "pending" && (
            <div className="booking-actions-container">
              <button
                className="booking-action-btn reject-btn"
                onClick={handleReject}
              >
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
                Reject
              </button>

              <button
                className="booking-action-btn approve-btn"
                onClick={handleApprove}
              >
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
                Approve
              </button>
            </div>
          )}

          {booking.status === "approved" && (
            <div className="booking-actions-container">
              <button
                className="booking-action-btn reject-btn"
                onClick={handleCancel}
              >
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
                Cancel Booking
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
