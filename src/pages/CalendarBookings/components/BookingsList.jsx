// src/pages/CalendarBookings/components/BookingsList.jsx
import React, { useState } from "react";
import BookingDetailsModal from "./BookingDetailsModal";

const BookingsList = ({ bookings, events, onUpdateBooking }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filterBookings = () => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === activeFilter);
  };

  const getEventTitle = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.title : "Unknown Event";
  };

  const filteredBookings = filterBookings();

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleApproveBooking = (booking) => {
    const updatedBooking = { ...booking, status: "approved" };
    onUpdateBooking(updatedBooking);
  };

  const handleRejectBooking = (booking) => {
    const updatedBooking = { ...booking, status: "rejected" };
    onUpdateBooking(updatedBooking);
  };

  const handleCancelBooking = (booking) => {
    const updatedBooking = { ...booking, status: "cancelled" };
    onUpdateBooking(updatedBooking);
  };

  return (
    <div className="bookings-list-container">
      <div className="bookings-filters">
        <div
          className={`booking-filter all ${
            activeFilter === "all" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </div>
        <div
          className={`booking-filter pending ${
            activeFilter === "pending" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("pending")}
        >
          Pending
        </div>
        <div
          className={`booking-filter approved ${
            activeFilter === "approved" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("approved")}
        >
          Approved
        </div>
        <div
          className={`booking-filter cancelled ${
            activeFilter === "cancelled" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("cancelled")}
        >
          Cancelled/Rejected
        </div>
      </div>

      <table className="bookings-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Customer</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{getEventTitle(booking.eventId)}</td>
                <td>
                  <div>{booking.customerName}</div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>
                    {booking.customerPhone}
                  </div>
                </td>
                <td>
                  <div>{new Date(booking.date).toLocaleDateString()}</div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>
                    {booking.startTime} - {booking.endTime}
                  </div>
                </td>
                <td>
                  <span className={`booking-status ${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="booking-actions">
                    <button
                      className="booking-action-button view"
                      onClick={() => handleViewBooking(booking)}
                      title="View Details"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {booking.status === "pending" && (
                      <>
                        <button
                          className="booking-action-button approve"
                          onClick={() => handleApproveBooking(booking)}
                          title="Approve"
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
                        </button>

                        <button
                          className="booking-action-button reject"
                          onClick={() => handleRejectBooking(booking)}
                          title="Reject"
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
                        </button>
                      </>
                    )}

                    {booking.status === "approved" && (
                      <button
                        className="booking-action-button reject"
                        onClick={() => handleCancelBooking(booking)}
                        title="Cancel"
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
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                No bookings found with the selected filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          events={events}
          onClose={() => setShowDetailsModal(false)}
          onUpdateBooking={onUpdateBooking}
        />
      )}
    </div>
  );
};

export default BookingsList;
