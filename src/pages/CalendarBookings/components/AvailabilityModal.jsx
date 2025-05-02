// src/pages/CalendarBookings/components/AvailabilityModal.jsx
import React, { useState, useEffect } from "react";

const AvailabilityModal = ({
  onClose,
  onSave,
  onUpdate,
  availabilitySchedules,
  selectedSchedule,
}) => {
  const emptyTimeSlot = { start: "09:00", end: "17:00" };

  const [editMode, setEditMode] = useState(false);
  const [scheduleList, setScheduleList] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    weeklyHours: {
      monday: [{ ...emptyTimeSlot }],
      tuesday: [{ ...emptyTimeSlot }],
      wednesday: [{ ...emptyTimeSlot }],
      thursday: [{ ...emptyTimeSlot }],
      friday: [{ ...emptyTimeSlot }],
      saturday: [],
      sunday: [],
    },
    dateOverrides: [],
  });

  useEffect(() => {
    if (selectedSchedule) {
      setFormData(selectedSchedule);
      setEditMode(true);
      setScheduleList(false);
    }
  }, [selectedSchedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTimeSlotChange = (day, index, field, value) => {
    const updatedHours = { ...formData.weeklyHours };
    updatedHours[day][index][field] = value;

    setFormData({
      ...formData,
      weeklyHours: updatedHours,
    });
  };

  const addTimeSlot = (day) => {
    const updatedHours = { ...formData.weeklyHours };
    updatedHours[day] = [...updatedHours[day], { ...emptyTimeSlot }];

    setFormData({
      ...formData,
      weeklyHours: updatedHours,
    });
  };

  const removeTimeSlot = (day, index) => {
    const updatedHours = { ...formData.weeklyHours };
    updatedHours[day] = updatedHours[day].filter((_, i) => i !== index);

    setFormData({
      ...formData,
      weeklyHours: updatedHours,
    });
  };

  const addDateOverride = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split("T")[0];

    setFormData({
      ...formData,
      dateOverrides: [
        ...formData.dateOverrides,
        { date: dateString, slots: [] },
      ],
    });
  };

  const removeDateOverride = (index) => {
    setFormData({
      ...formData,
      dateOverrides: formData.dateOverrides.filter((_, i) => i !== index),
    });
  };

  const handleDateOverrideChange = (index, date) => {
    const updatedOverrides = [...formData.dateOverrides];
    updatedOverrides[index].date = date;

    setFormData({
      ...formData,
      dateOverrides: updatedOverrides,
    });
  };

  const addOverrideTimeSlot = (overrideIndex) => {
    const updatedOverrides = [...formData.dateOverrides];
    if (!updatedOverrides[overrideIndex].slots) {
      updatedOverrides[overrideIndex].slots = [];
    }
    updatedOverrides[overrideIndex].slots.push({ ...emptyTimeSlot });

    setFormData({
      ...formData,
      dateOverrides: updatedOverrides,
    });
  };

  const removeOverrideTimeSlot = (overrideIndex, slotIndex) => {
    const updatedOverrides = [...formData.dateOverrides];
    updatedOverrides[overrideIndex].slots = updatedOverrides[
      overrideIndex
    ].slots.filter((_, i) => i !== slotIndex);

    setFormData({
      ...formData,
      dateOverrides: updatedOverrides,
    });
  };

  const handleOverrideTimeChange = (overrideIndex, slotIndex, field, value) => {
    const updatedOverrides = [...formData.dateOverrides];
    updatedOverrides[overrideIndex].slots[slotIndex][field] = value;

    setFormData({
      ...formData,
      dateOverrides: updatedOverrides,
    });
  };

  const handleCreateNew = () => {
    setFormData({
      id: "",
      title: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      weeklyHours: {
        monday: [{ ...emptyTimeSlot }],
        tuesday: [{ ...emptyTimeSlot }],
        wednesday: [{ ...emptyTimeSlot }],
        thursday: [{ ...emptyTimeSlot }],
        friday: [{ ...emptyTimeSlot }],
        saturday: [],
        sunday: [],
      },
      dateOverrides: [],
    });
    setEditMode(false);
    setScheduleList(false);
  };

  const handleEditSchedule = (schedule) => {
    setFormData(schedule);
    setEditMode(true);
    setScheduleList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      onUpdate(formData);
    } else {
      onSave(formData);
    }

    onClose();
  };

  const weekdays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {scheduleList
              ? "Availability Schedules"
              : editMode
              ? "Edit Availability Schedule"
              : "Create Availability Schedule"}
          </h2>
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
          {scheduleList ? (
            <>
              <div className="availability-schedules-list">
                {availabilitySchedules.length > 0 ? (
                  availabilitySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="availability-schedule-item"
                    >
                      <div className="schedule-info">
                        <h3>{schedule.title}</h3>
                        <p>Timezone: {schedule.timezone}</p>
                        <p>
                          {Object.entries(schedule.weeklyHours)
                            .filter(([_, slots]) => slots.length > 0)
                            .map(
                              ([day]) =>
                                day.charAt(0).toUpperCase() + day.slice(1)
                            )
                            .join(", ")}
                        </p>
                      </div>
                      <button
                        className="edit-schedule-button"
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        Edit
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-schedules">
                    <p>No availability schedules found.</p>
                  </div>
                )}
              </div>

              <button className="add-schedule-button" onClick={handleCreateNew}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Create New Schedule
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Schedule Name</label>
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
                <label htmlFor="timezone">Timezone</label>
                <select
                  id="timezone"
                  name="timezone"
                  className="form-control"
                  value={formData.timezone}
                  onChange={handleChange}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>

              <div className="form-section-title">Weekly Hours</div>

              <div className="availability-schedule">
                {weekdays.map((day) => (
                  <div key={day} className="day-row">
                    <div className="day-name">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </div>

                    <div className="time-slots">
                      {formData.weeklyHours[day].length > 0 ? (
                        formData.weeklyHours[day].map((slot, index) => (
                          <div key={index} className="time-slot">
                            <input
                              type="time"
                              className="time-input"
                              value={slot.start}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  day,
                                  index,
                                  "start",
                                  e.target.value
                                )
                              }
                            />
                            <span>to</span>
                            <input
                              type="time"
                              className="time-input"
                              value={slot.end}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  day,
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                            />

                            <button
                              type="button"
                              className="remove-slot-button"
                              onClick={() => removeTimeSlot(day, index)}
                              title="Remove Time Slot"
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
                          </div>
                        ))
                      ) : (
                        <div className="unavailable-day">Unavailable</div>
                      )}

                      <button
                        type="button"
                        className="add-slot-button"
                        onClick={() => addTimeSlot(day)}
                        title="Add Time Slot"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-section-title">Date Overrides</div>
              <div className="date-overrides">
                {formData.dateOverrides.map((override, overrideIndex) => (
                  <div key={overrideIndex} className="date-override">
                    <input
                      type="date"
                      className="date-input"
                      value={override.date}
                      onChange={(e) =>
                        handleDateOverrideChange(overrideIndex, e.target.value)
                      }
                    />

                    <div className="override-time-slots">
                      {override.slots && override.slots.length > 0 ? (
                        override.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="time-slot">
                            <input
                              type="time"
                              className="time-input"
                              value={slot.start}
                              onChange={(e) =>
                                handleOverrideTimeChange(
                                  overrideIndex,
                                  slotIndex,
                                  "start",
                                  e.target.value
                                )
                              }
                            />
                            <span>to</span>
                            <input
                              type="time"
                              className="time-input"
                              value={slot.end}
                              onChange={(e) =>
                                handleOverrideTimeChange(
                                  overrideIndex,
                                  slotIndex,
                                  "end",
                                  e.target.value
                                )
                              }
                            />

                            <button
                              type="button"
                              className="remove-slot-button"
                              onClick={() =>
                                removeOverrideTimeSlot(overrideIndex, slotIndex)
                              }
                              title="Remove Time Slot"
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
                          </div>
                        ))
                      ) : (
                        <div className="unavailable-day">
                          Unavailable on this date
                        </div>
                      )}

                      <button
                        type="button"
                        className="add-slot-button"
                        onClick={() => addOverrideTimeSlot(overrideIndex)}
                        title="Add Time Slot"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-slot-button"
                      onClick={() => removeDateOverride(overrideIndex)}
                      title="Remove Date Override"
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
                  </div>
                ))}

                <button
                  type="button"
                  className="add-override-button"
                  onClick={addDateOverride}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add Date Override
                </button>
              </div>

              <div className="modal-footer">
                {scheduleList ? (
                  <button
                    type="button"
                    className="modal-cancel-button"
                    onClick={onClose}
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="modal-cancel-button"
                      onClick={() => setScheduleList(true)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="modal-save-button">
                      {editMode ? "Update" : "Save"}
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
