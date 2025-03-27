/* eslint-disable react/prop-types */
// LeaveRequestsAdmin.jsx
import { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Pagination from "react-js-pagination";
import "./LeaveRequestsAdmin.scss";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the default toast styles
import { FaTrashAlt } from "react-icons/fa";
import apiRequest from "../../../lib/apiRequest";
import { InfinitySpin } from "react-loader-spinner";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const LeaveRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [itemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage, filterStatus]);

  const fetchRequests = async (page) => {
    setLoading(true);
    try {
      const response = await apiRequest.get(
        `/employee/getleaveRequests?page=${page}&status=${filterStatus}`
      );
      if (response.status) {
        setRequests(response?.data?.requests);
        setTotalRequests(response?.data?.total);
      }
    } catch (err) {
      console.error(err.message || "Error fetching leave requests!");
      toast.error(
        err.response?.data?.message || "Error fetching leave requests!",
        {
          className: "custom-toast",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    setLoading(true);
    try {
      const response = await apiRequest.patch(
        `/employee/leaveRequests/${requestId}/status`,
        { status: newStatus }
      );

      if (response.status) {
        await fetchRequests(currentPage);
        toast.success(`Status updated to ${newStatus}!`, {
          className: "custom-toast",
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating leave request:", err);
      toast.error(
        err.response?.data?.message || "Error updating leave request!",
        {
          className: "custom-toast",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <Check className="status-icon approved" />;
      case "Rejected":
        return <X className="status-icon rejected" />;
      default:
        return <Clock className="status-icon pending" />;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [displayReason, setDisplayReason] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setDisplayReason(true);
  };

  // Popup Component for Displaying Reason
  const RequestDetailsPopup = ({ request, onClose }) => (
    <div className="reason-popup-overlay" onClick={onClose}>
      <div
        className="reason-popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="reason-popup-header">
          <h3>Leave Request Details</h3>
          <button className="close-popup-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="reason-popup-content">
          <div className="reason-popup-details">
            <p>
              <strong>Employee Name:</strong> {request?.employeeName || "N/A"}
            </p>
            <p>
              <strong>Employee ID:</strong> {request?.employeeId || "N/A"}
            </p>
            <p>
              <strong>Leave Type:</strong> {request?.leaveType || "N/A"}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {request?.startDate && request?.endDate
                ? `${new Date(
                    request?.startDate
                  ).toLocaleDateString()} - ${new Date(
                    request?.endDate
                  ).toLocaleDateString()}`
                : "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {request?.status || "N/A"}
            </p>
            {request?.reviewedBy && (
              <>
                <p>
                  <strong>Reviewed By:</strong>{" "}
                  {request?.reviewedBy.name || "N/A"}
                </p>
                <p>
                  <strong>Reviewed At:</strong>{" "}
                  {request?.reviewedAt
                    ? new Date(request?.reviewedAt).toLocaleDateString()
                    : "Pending Review"}
                </p>
              </>
            )}
          </div>
          <div className="reason-popup-reason">
            <h4>Reason for Leave</h4>
            <div className="reason-text">
              {request?.reason || "No reason provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const [confirmInput, setConfirmInput] = useState("");
  const handleConfirmChange = (e) => {
    setConfirmInput(e.target.value);
  };
  const [leaveRequestToDelete, setLeaveRequestToDelete] = useState("");
  const [showDeleteModal, setDeleteModal] = useState(false);
  const handleOpenModal = (request) => {
    setLeaveRequestToDelete(request);
    setDeleteModal(true);
  };

  const handleCloseModal = () => {
    setDeleteModal(false);
    setConfirmInput("");
    setLeaveRequestToDelete("");
  };

  const handleDelete = async (_id) => {
    setLoading(true);
    try {
      const res = await apiRequest.delete(
        `/employee/deleteLeaveRequest/${_id}`
      );
      if (res.status) {
        await fetchRequests(currentPage);
        handleCloseModal();
        toast.success("Leave request deleted successfully!", {
          className: "custom-toast",
        });
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error deleting leave request"
      );
      toast.error(
        error.response?.data?.message || "Error deleting leave request!",
        {
          className: "custom-toast",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-requests-admin">
      <div className="admin-card">
        <div className="admin-header">
          <h2>
            <Calendar className="calendar-icon" />
            Leave Requests Management
          </h2>
          <div className="filter-section">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                requests &&
                requests?.map((request) => (
                  <tr key={request?.id}>
                    <td>
                      <div
                        className="employee-info"
                        onClick={() => handleRequestClick(request)}
                      >
                        <span className="employee-name">
                          {request?.employeeName}
                        </span>
                        <span className="employee-id">
                          ID: {request?.employeeId}
                        </span>
                      </div>
                    </td>
                    <td
                      className="leave-type"
                      onClick={() => handleRequestClick(request)}
                    >
                      {request?.leaveType}
                    </td>
                    <td
                      className="duration"
                      onClick={() => handleRequestClick(request)}
                    >
                      <div className="date-range">
                        <span>
                          {new Date(request?.startDate).toLocaleDateString()}
                        </span>
                        <span>to</span>
                        <span>
                          {new Date(request?.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td
                      className="reason"
                      onClick={() => handleRequestClick(request)}
                    >
                      <div className="reason-text">{request?.reason}</div>
                    </td>
                    <td
                      className="status"
                      onClick={() => handleRequestClick(request)}
                    >
                      <div className={`status-badge ${request?.status}`}>
                        {getStatusIcon(request?.status)}
                        {request?.status}
                      </div>
                    </td>
                    <td className="actions">
                      <div className="action-buttons">
                        {request?.status === "Approved" ? (
                          ""
                        ) : (
                          <button
                            className="action-btn approve"
                            onClick={() =>
                              handleStatusChange(request?.id, "Approved")
                            }
                            disabled={request?.status === "Approved"}
                          >
                            <Check size={16} />
                            Approve
                          </button>
                        )}
                        <button
                          className="action-btn reject"
                          onClick={() =>
                            handleStatusChange(request?.id, "Rejected")
                          }
                          disabled={request?.status === "Rejected"}
                        >
                          <X size={16} />
                          Reject
                        </button>
                        <button
                          onClick={() => handleOpenModal(request)}
                          className="delete-btn"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalRequests > 0 && (
          <div className="pagination-container">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={totalRequests}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
              activeClass="active"
              firstPageText="First"
              lastPageText="Last"
              prevPageText={<ChevronLeft size={16} />}
              nextPageText={<ChevronRight size={16} />}
            />
          </div>
        )}
      </div>
      {displayReason && (
        <RequestDetailsPopup
          request={selectedRequest}
          onClose={() => setDisplayReason(false)}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {showDeleteModal && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h2>Confirm Leave Request Deletion</h2>
            <p className="warning">
              <strong>Warning:</strong> This action is{" "}
              <strong>irreversible</strong>. By proceeding, you will permanently
              delete all leave Requests associated with{" "}
              <strong>{leaveRequestToDelete.employeeName}</strong>, including:
            </p>
            <ul className="delete-consequences">
              <li>This Leave Request made by this Employee.</li>
            </ul>
            <p>
              To confirm, please type:{" "}
              <strong>delete {leaveRequestToDelete.leaveType} Leave</strong>
            </p>
            <input
              type="text"
              value={confirmInput}
              onChange={handleConfirmChange}
              placeholder={`Type "delete ${leaveRequestToDelete.leaveType} Leave" to confirm`}
              className="confirm-input"
            />
            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => handleDelete(leaveRequestToDelete.id)}
                disabled={
                  confirmInput !==
                  `delete ${leaveRequestToDelete.leaveType} Leave`
                }
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loader-overlay">
          <InfinitySpin
            height="200"
            width="200"
            color="#4fa94d"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
    </div>
  );
};

export default LeaveRequestsAdmin;
