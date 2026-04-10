import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    serviceType: "",
    name: "",
    phone: "",
    email: "",
    suburb: "",
    companyName: "",
    registrationNumber: "",
    idNumber: "",
    employer: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://icbp-git.onrender.com/api/onboard", formData);
      alert("Submitted successfully!");
    } catch (error) {
      alert("Error submitting form");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>New Client Onboarding</h1>

      <form onSubmit={handleSubmit}>
        <select name="serviceType" onChange={handleChange} required>
          <option value="">Select Service</option>
          <option value="Business Tax">Business Tax</option>
          <option value="Personal Tax">Personal Tax</option>
          <option value="Other">Other</option>
        </select>

        <br />
        <br />

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <br />
        <br />

        <input name="email" placeholder="Email" onChange={handleChange} />
        <br />
        <br />

        <input name="suburb" placeholder="Suburb" onChange={handleChange} />
        <br />
        <br />

        {/* Business Fields */}
        {formData.serviceType === "Business Tax" && (
          <>
            <input
              name="companyName"
              placeholder="Company Name"
              onChange={handleChange}
            />
            <br />
            <br />
            <input
              name="registrationNumber"
              placeholder="Registration Number"
              onChange={handleChange}
            />
          </>
        )}

        {/* Personal Fields */}
        {formData.serviceType === "Personal Tax" && (
          <>
            <input
              name="idNumber"
              placeholder="ID Number"
              onChange={handleChange}
            />
            <br />
            <br />
            <input
              name="employer"
              placeholder="Employer"
              onChange={handleChange}
            />
          </>
        )}

        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
