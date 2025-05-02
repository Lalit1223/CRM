// src/pages/CalendarBookings/components/CalendarView.jsx
import React, { useState, useEffect } from "react";
import BookingDetailsModal from "./BookingDetailsModal";

const CalendarView = ({ events, bookings, onEditEvent, onUpdateBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, events, bookings]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of the week of the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;

    // Calculate days from next month to show
    const daysInMonth = lastDay.getDate();
    const daysFromNextMonth = 42 - (daysFromPrevMonth + daysInMonth); // 42 = 6 weeks * 7 days

    const days = [];

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();

    for (
      let i = prevMonthDays - daysFromPrevMonth + 1;
      i <= prevMonthDays;
      i++
    ) {
      days.push({
        date: new Date(year, month - 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Add days from current month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
      });
    }

    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    setCalendar(days);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Group bookings by date
  const groupBookingsByDate = () => {
    const grouped = {};

    bookings.forEach((booking) => {
      const key = booking.date; // Assuming the date is already in YYYY-MM-DD format
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(booking);
    });

    return grouped;
  };

  const bookingsByDate = groupBookingsByDate();

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleEventClick = (event) => {
    if (onEditEvent) {
      onEditEvent(event);
    }
  };

  const getDateEvents = (date) => {
    const dateKey = formatDateKey(date);
    return bookingsByDate[dateKey] || [];
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-container">
      <div className="calendar-navigation">
        <button
          className="calendar-nav-button"
          onClick={() => navigateMonth(-1)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Previous
        </button>

        <h2 className="calendar-current-month">
          {formatMonthYear(currentDate)}
        </h2>

        <button
          className="calendar-nav-button"
          onClick={() => navigateMonth(1)}
        >
          Next
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="calendar-view">
        <div className="calendar-header-row">
          {weekDays.map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendar.map((day, index) => {
            const dateEvents = getDateEvents(day.date);
            const maxEventsToShow = 3;
            const hasMoreEvents = dateEvents.length > maxEventsToShow;

            return (
              <div
                key={index}
                className={`calendar-day ${
                  day.isCurrentMonth ? "current-month" : "other-month"
                } ${day.isToday ? "today" : ""}`}
              >
                <div className="calendar-day-number">{day.date.getDate()}</div>

                <div className="calendar-day-events">
                  {dateEvents.slice(0, maxEventsToShow).map((booking) => (
                    <div
                      key={booking.id}
                      className={`calendar-booking ${booking.status}`}
                      onClick={() => handleBookingClick(booking)}
                    >
                      {booking.startTime} - {booking.customerName}
                    </div>
                  ))}

                  {hasMoreEvents && (
                    <div className="calendar-more-events" onClick={() => {}}>
                      +{dateEvents.length - maxEventsToShow} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showBookingModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          events={events}
          onClose={() => setShowBookingModal(false)}
          onUpdateBooking={onUpdateBooking}
        />
      )}
    </div>
  );
};

export default CalendarView;
