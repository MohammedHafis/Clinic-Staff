import React, { useState } from "react";
import { patients, doctors } from "../data/sampleData";

export default function AppointmentForm({ date, onClose, onSave, existingData }) {
  const [patient, setPatient] = useState(existingData?.patient || patients[0]);
  const [doctor, setDoctor] = useState(existingData?.doctor || doctors[0]);
  const [time, setTime] = useState(existingData?.time || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(date, { patient, doctor, time }, existingData);
    onClose();
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit} className="form">
        <h3>{existingData ? "Edit" : "New"} Appointment for {date}</h3>
        <label>Patient:</label>
        <select value={patient} onChange={(e) => setPatient(e.target.value)}>
          {patients.map((p) => <option key={p}>{p}</option>)}
        </select>
        <label>Doctor:</label>
        <select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
          {doctors.map((d) => <option key={d}>{d}</option>)}
        </select>
        <label>Time:</label>
        <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} />
        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
