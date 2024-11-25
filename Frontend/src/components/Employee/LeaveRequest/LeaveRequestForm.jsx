/* eslint-disable react/prop-types */
// LeaveRequestForm.jsx
import { useState } from "react";
import { Calendar } from "lucide-react";
import "./LeaveRequestForm.scss";
import apiRequest from "../../../lib/apiRequest";
import { useAuth } from "../../../context/authContext";
import EmployeeLeaveRequests from "./EmployeeLeaveRequests";

const LeaveRequestForm = () => {
  const { user: selectedEmployee } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      leaveType: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await apiRequest.post(
        `/employee/leaveRequests/${selectedEmployee._id}`,
        formData
      );
      if (!response.status) {
        throw new Error("Failed to submit leave request");
      }
      setSuccess(true);
      setFormData({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="holder">
      <div className="leave-request-form">
        <div className="form-card">
          <div className="form-header">
            <div className="holderH2CloseBtn">
              <h2>{selectedEmployee.name} Leave Request Form</h2>
            </div>

            <p>Submit your leave request for approval</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="leaveType">Leave Type</label>
              <select
                id="leaveType"
                value={formData.leaveType}
                onChange={handleSelectChange}
                required
              >
                <option value="">Select leave type</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div className="date-group">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Please provide a reason for your leave request"
              />
            </div>

            {success && (
              <div className="alert success">
                <h4>Success!</h4>
                <p>Your leave request has been submitted successfully.</p>
              </div>
            )}

            {error && (
              <div className="alert error">
                <h4>Error</h4>
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className={`submit-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Leave Request"}
            </button>
          </form>
        </div>
      </div>
      <EmployeeLeaveRequests selectedEmployee={selectedEmployee} />
    </div>
  );
};

export default LeaveRequestForm;
