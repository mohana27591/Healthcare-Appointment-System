
import React, { useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");

  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctor, setDoctor] = useState("Dr. Priya Sharma - Dermatologist");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments")) || []
  );

  const doctors = [
    "Dr. Priya Sharma - Dermatologist",
    "Dr. Rahul Kumar - Cardiologist",
    "Dr. Ananya Rao - General Physician",
    "Dr. Vikram Singh - Neurologist"
  ];

  function handleRegister(e) {
    e.preventDefault();

    if (!registerName || !email || !password) {
      alert("Please fill all registration fields");
      return;
    }

    if (users.some((u) => u.email === email)) {
      alert("This email is already registered. Please login.");
      return;
    }

    const newId = "PAT-" + (1001 + users.length);

    const newUser = {
      name: registerName,
      email: email,
      password: password,
      patientId: newId
    };

    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setCurrentUser(newUser);
    setPatientName(newUser.name);
    setPatientId(newUser.patientId);

    setModal(false);
    setRegisterName("");
    setEmail("");
    setPassword("");

    alert("Registration successful! Your Patient ID is " + newId);
  }

  function handleLogin(e) {
    e.preventDefault();

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      alert("Invalid email or password. Please register first.");
      return;
    }

    setCurrentUser(foundUser);
    setPatientName(foundUser.name);
    setPatientId(foundUser.patientId);

    setModal(false);
    setEmail("");
    setPassword("");

    alert("Login successful!");
  }

  function handleLogout() {
    setCurrentUser(null);
    setPatientName("");
    setPatientId("");
    alert("Logged out successfully");
  }

  function bookAppointment(e) {
    e.preventDefault();

    if (!patientName || !patientId || !doctor || !date || !time) {
      alert("Please fill all appointment fields");
      return;
    }

    const newAppointment = {
      patientName,
      patientId,
      doctor,
      date,
      time
    };

    const updatedAppointments = [...appointments, newAppointment];

    setAppointments(updatedAppointments);
    localStorage.setItem(
      "appointments",
      JSON.stringify(updatedAppointments)
    );

    alert("Appointment booked successfully!");

    setDate("");
    setTime("");
  }

  function cancelAppointment(index) {
    const updatedAppointments = appointments.filter(
      (_, i) => i !== index
    );

    setAppointments(updatedAppointments);
    localStorage.setItem(
      "appointments",
      JSON.stringify(updatedAppointments)
    );
  }

  return (
    <div className="app">

      <header className="header">
        <h1>CityCare Hospital</h1>

        <div>
          {currentUser ? (
            <>
              <span>Welcome, {currentUser.name}</span>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setModal(true);
              }}
            >
              Login
            </button>
          )}
        </div>
      </header>

      <section className="hero">
        <h2>Welcome to CityCare Hospital</h2>
        <p>Your health is our priority</p>

        {!currentUser && (
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setModal(true);
            }}
          >
            Register Now
          </button>
        )}
      </section>

      <section className="booking">
        <h2>Book an Appointment</h2>

        <form onSubmit={bookAppointment}>

          <label>Patient Name</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            required
          />

          <label>Patient ID</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
            required
          />

          <label>Select Doctor</label>
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            {doctors.map((d, index) => (
              <option key={index} value={d}>
                {d}
              </option>
            ))}
          </select>

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />

          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <button type="submit">Book Appointment</button>
        </form>
      </section>

      <section className="appointments">
        <h2>Appointments</h2>

        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          appointments.map((a, index) => (
            <div className="appointment" key={index}>
              <p><strong>Patient:</strong> {a.patientName}</p>
              <p><strong>Patient ID:</strong> {a.patientId}</p>
              <p><strong>Doctor:</strong> {a.doctor}</p>
              <p><strong>Date:</strong> {a.date}</p>
              <p><strong>Time:</strong> {a.time}</p>

              <button
                type="button"
                onClick={() => cancelAppointment(index)}
              >
                Cancel
              </button>
            </div>
          ))
        )}
      </section>

      <section className="community">
        <h2>Community Cares</h2>
        <p>We care for our community and your well-being.</p>
      </section>

      {modal && (
        <div className="modal-overlay">
          <div className="modal">

            <button
              type="button"
              className="close"
              onClick={() => setModal(false)}
            >
              ×
            </button>

            <h2>{tab === "login" ? "Login" : "Register"}</h2>

            {tab === "login" ? (
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit">Login</button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit">Register</button>
              </form>
            )}

            <p>
              {tab === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>

            <button
              type="button"
              onClick={() =>
                setTab(tab === "login" ? "register" : "login")
              }
            >
              {tab === "login" ? "Register" : "Login"}
            </button>

          </div>
        </div>
      )}

      <footer>
        <p>© 2026 CityCare Hospital</p>
      </footer>

    </div>
  );
}

export default App;
