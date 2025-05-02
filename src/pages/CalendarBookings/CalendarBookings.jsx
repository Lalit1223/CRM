// src/pages/CalendarBookings/CalendarBookings.jsx
import React, { useState, useEffect } from "react";
import "./CalendarBookings.css";
import CalendarView from "./components/CalendarView";
import EventsList from "./components/EventsList";
import BookingsList from "./components/BookingsList";
import CreateEventModal from "./components/CreateEventModal";
import AvailabilityModal from "./components/AvailabilityModal";

const CalendarBookings = () => {
  const [activeTab, setActiveTab] = useState("calendar"); // 'calendar', 'events', 'bookings', 'availability'
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availabilitySchedules, setAvailabilitySchedules] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data when component mounts
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      // In a real app, replace these with actual API calls
      // Simulate API calls with setTimeout
      setTimeout(() => {
        setEvents(sampleEvents);
        setBookings(sampleBookings);
        setAvailabilitySchedules(sampleAvailability);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setLoading(false);
    }
  };

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: `event-${Date.now()}` }]);
    setShowCreateEventModal(false);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleCreateAvailability = (newSchedule) => {
    setAvailabilitySchedules([
      ...availabilitySchedules,
      { ...newSchedule, id: `schedule-${Date.now()}` },
    ]);
    setShowAvailabilityModal(false);
  };

  const handleUpdateAvailability = (updatedSchedule) => {
    setAvailabilitySchedules(
      availabilitySchedules.map((schedule) =>
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      )
    );
  };

  const handleUpdateBooking = (updatedBooking) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowCreateEventModal(true);
  };

  return (
    <div className="calendar-bookings-container">
      <div className="calendar-header">
        <h1>Calendar Bookings</h1>

        <div className="calendar-actions">
          <button
            className="availability-button"
            onClick={() => setShowAvailabilityModal(true)}
          >
            Manage Availability
          </button>
          <button
            className="create-event-button"
            onClick={() => {
              setSelectedEvent(null);
              setShowCreateEventModal(true);
            }}
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="calendar-tabs">
        <button
          className={`tab ${activeTab === "calendar" ? "active" : ""}`}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar
        </button>
        <button
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
        <button
          className={`tab ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          Bookings
        </button>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading calendar data...</div>
      ) : (
        <div className="calendar-content">
          {activeTab === "calendar" && (
            <CalendarView
              events={events}
              bookings={bookings}
              onEditEvent={handleEditEvent}
              onUpdateBooking={handleUpdateBooking}
            />
          )}
          {activeTab === "events" && (
            <EventsList
              events={events}
              availabilitySchedules={availabilitySchedules}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onUpdateEvent={handleUpdateEvent}
            />
          )}
          {activeTab === "bookings" && (
            <BookingsList
              bookings={bookings}
              events={events}
              onUpdateBooking={handleUpdateBooking}
            />
          )}
        </div>
      )}

      {showCreateEventModal && (
        <CreateEventModal
          onClose={() => setShowCreateEventModal(false)}
          onSave={handleCreateEvent}
          onUpdate={handleUpdateEvent}
          event={selectedEvent}
          availabilitySchedules={availabilitySchedules}
        />
      )}

      {showAvailabilityModal && (
        <AvailabilityModal
          onClose={() => setShowAvailabilityModal(false)}
          onSave={handleCreateAvailability}
          onUpdate={handleUpdateAvailability}
          availabilitySchedules={availabilitySchedules}
        />
      )}
    </div>
  );
};

// Sample data
const sampleEvents = [
  {
    id: "event-1",
    title: "Product Consultation",
    description: "One-on-one product consultation session",
    duration: 30, // minutes
    location: "Virtual",
    eventType: "Free",
    webhookUrl: "https://example.com/webhook",
    customFields: {
      "Detail Field One": "Office",
      "Detail Field Two": "Business",
    },
    availabilityId: "schedule-1",
    createdAt: "2023-03-15T10:00:00Z",
  },
  {
    id: "event-2",
    title: "Marketing Strategy Session",
    description: "Discuss marketing strategies for your business",
    duration: 60, // minutes
    location: "In-Person",
    eventType: "Paid",
    amount: 75,
    webhookUrl: "",
    customFields: {
      "Detail Field One": "Conference Room",
      "Detail Field Two": "Marketing",
    },
    availabilityId: "schedule-2",
    createdAt: "2023-03-20T14:30:00Z",
  },
];

const sampleBookings = [
  {
    id: "booking-1",
    eventId: "event-1",
    customerName: "John Doe",
    customerPhone: "+1234567890",
    customerEmail: "john@example.com",
    date: "2023-04-05",
    startTime: "10:00",
    endTime: "10:30",
    status: "approved",
    notes: "Looking forward to discussing the product features",
    createdAt: "2023-04-01T09:15:00Z",
    reminderSent: true,
  },
  {
    id: "booking-2",
    eventId: "event-2",
    customerName: "Jane Smith",
    customerPhone: "+9876543210",
    customerEmail: "jane@example.com",
    date: "2023-04-10",
    startTime: "14:00",
    endTime: "15:00",
    status: "pending",
    notes: "Interested in discussing social media strategy",
    createdAt: "2023-04-02T11:20:00Z",
    reminderSent: false,
  },
  {
    id: "booking-3",
    eventId: "event-1",
    customerName: "Mike Johnson",
    customerPhone: "+1122334455",
    customerEmail: "mike@example.com",
    date: "2023-04-07",
    startTime: "15:30",
    endTime: "16:00",
    status: "cancelled",
    notes: "Need to reschedule due to conflict",
    createdAt: "2023-04-03T10:45:00Z",
    reminderSent: false,
  },
];

const sampleAvailability = [
  {
    id: "schedule-1",
    title: "Weekday Schedule",
    timezone: "America/New_York",
    weeklyHours: {
      monday: [{ start: "09:00", end: "17:00" }],
      tuesday: [{ start: "09:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "17:00" }],
      thursday: [{ start: "09:00", end: "17:00" }],
      friday: [{ start: "09:00", end: "17:00" }],
      saturday: [],
      sunday: [],
    },
    dateOverrides: [
      { date: "2023-04-15", slots: [] }, // Unavailable day
      { date: "2023-04-20", slots: [{ start: "13:00", end: "18:00" }] }, // Special hours
    ],
    createdAt: "2023-03-10T08:00:00Z",
  },
  {
    id: "schedule-2",
    title: "Weekend Schedule",
    timezone: "America/New_York",
    weeklyHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [{ start: "10:00", end: "15:00" }],
      sunday: [{ start: "10:00", end: "15:00" }],
    },
    dateOverrides: [],
    createdAt: "2023-03-12T09:30:00Z",
  },
];

export default CalendarBookings;
