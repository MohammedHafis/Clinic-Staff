import React, { useState, useEffect } from "react";
import AppointmentForm from "./AppointmentForm";
import "./../styles.css";

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month, year) {
  return new Date(year, month, 1).getDay();
}

function Calendar({ setIsAuthenticated }) {
  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments")) || {}
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileDate, setMobileDate] = useState(
    `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today
      .getDate()
      .toString()
      .padStart(2, "0")}`
  );
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSave = (date, data, oldData = null) => {
    const updated = { ...appointments };
    const existing = updated[date] || [];

    if (oldData) {
      const index = existing.findIndex(
        (item) =>
          item.patient === oldData.patient &&
          item.doctor === oldData.doctor &&
          item.time === oldData.time
      );
      if (index !== -1) existing[index] = data;
    } else {
      existing.push(data);
    }

    updated[date] = existing;
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    setEditingData(null);
  };

  const handleDelete = (date, data) => {
    const updated = { ...appointments };
    updated[date] = updated[date].filter(
      (a) =>
        !(
          a.patient === data.patient &&
          a.time === data.time &&
          a.doctor === data.doctor
        )
    );
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem("authenticated");
    setIsAuthenticated(false);
  };

  const openForm = (date, existing = null) => {
    setSelectedDate(date);
    setEditingData(existing);
  };

  const modeClass = darkMode ? "dark" : "";

  if (isMobile) {
    const appts = appointments[mobileDate] || [];
    return (
      <div className={`calendar-container ${modeClass}`}>
        <div className="calendar-header">
          <h2>Appointments (Mobile)</h2>
          <div>
            <button onClick={() => setDarkMode(!darkMode)}>Dark Mode</button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
        <input
          type="date"
          value={mobileDate}
          onChange={(e) => setMobileDate(e.target.value)}
        />
        <div className="day">
          <div className="date">{mobileDate}</div>
          <ul>
            {appts.map((appt, i) => (
              <li key={i}>
                {appt.patient} at {appt.time} — {appt.doctor}
                <button className="edit" onClick={() => openForm(mobileDate, appt)}>✏️</button>
                <button className="del" onClick={() => handleDelete(mobileDate, appt)}>❌</button>
              </li>
            ))}
          </ul>
          <button onClick={() => openForm(mobileDate)}>Add Appointment</button>
        </div>
        {selectedDate && (
          <AppointmentForm
            date={selectedDate}
            onClose={() => {
              setSelectedDate(null);
              setEditingData(null);
            }}
            onSave={handleSave}
            existingData={editingData}
          />
        )}
      </div>
    );
  }

  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const blankDays = Array(firstDay).fill(null);

  const actualDays = [...Array(daysInMonth)].map((_, index) => {
    const dateKey = `${currentYear}-${currentMonth + 1}-${index + 1}`;
    return (
      <div className="day" key={index} onClick={() => openForm(dateKey)}>
        <div className="date">{index + 1}</div>
        <ul>
          {(appointments[dateKey] || []).map((appt, i) => (
            <li key={i}>
              {appt.patient} at {appt.time} — {appt.doctor}
              <button className="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  openForm(dateKey, appt);
                }}
              >
                ✏️
              </button>
              <button className="del"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(dateKey, appt);
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  });

  const calendarDays = [
    ...blankDays.map((_, i) => (
      <div className="day empty" key={"blank-" + i}></div>
    )),
    ...actualDays,
  ];

  return (
    <div className={`calendar-container ${modeClass}`}>
      <div className="calendar-header">
        <h2>Appointments - {today.toLocaleString("default", { month: "long" })}</h2>
        <div>
          <button onClick={() => setDarkMode(!darkMode)}>Dark Mode</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="calendar-grid">{calendarDays}</div>
      {selectedDate && (
        <AppointmentForm
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setEditingData(null);
          }}
          onSave={handleSave}
          existingData={editingData}
        />
      )}
    </div>
  );
}

export default Calendar;
