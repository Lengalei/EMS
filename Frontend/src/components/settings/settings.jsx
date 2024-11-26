import React, { useState } from "react";
import "./Settings.css"; // Optional: Create a CSS file for styling.

const Settings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    // Simulate an API call for password change
    fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("Password updated successfully.");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setMessage(data.message || "Error updating password.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred while updating the password.");
      });
  };

  return (
    <div className="settings-container">
      <h2>Reset Password</h2>
      <div className="form-group">
        <label htmlFor="oldPassword">Old Password</label>
        <input
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter your old password"
        />
      </div>
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
        />
      </div>
      <button className="change-password-button" onClick={handlePasswordChange}>
        Change Password
      </button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Settings;
