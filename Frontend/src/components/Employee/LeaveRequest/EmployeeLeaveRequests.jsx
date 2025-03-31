/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import { format, formatDistance } from "date-fns";
import "./EmployeeLeaveRequests.scss";
import apiRequest from "../../../lib/apiRequest";
import { InfinitySpin } from "react-loader-spinner";

const EmployeeLeaveRequests = ({ selectedEmployee }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState("");
  const [displayMoreDetails, setDisplayMoreDetails] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(4);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await apiRequest.get(
          `/employee/getEmployeeLeaveRequests/${selectedEmployee._id}`
        );
        setLeaveRequests(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to retrieve leave requests"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [selectedEmployee]);

  const calculateLeaveDuration = (startDate, endDate) => {
    const days = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  // Pagination Logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = leaveRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (error) return <div className="leave-requests__error">{error}</div>;

  const handleDisplayLeave = (request) => {
    setSelectedLeaveRequest(request);
    setDisplayMoreDetails(true);
  };

  const LeaveDetailsPopup = ({ leaveRequest, onClose }) => {
    return (
      <div className="leave-details-popup-overlay">
        <div className="leave-details-popup">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <div className="leave-details-content">
            <h3>{leaveRequest.leaveType} Leave</h3>
            <p>
              <strong>Status:</strong> {leaveRequest.status}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {format(new Date(leaveRequest.startDate), "dd MMMM yyyy")} to{" "}
              {format(new Date(leaveRequest.endDate), "dd MMMM yyyy")}
            </p>
            <p>
              <strong>Reason:</strong> {leaveRequest.reason}
            </p>
            <p>
              <strong>Reviewed By:</strong>{" "}
              {leaveRequest.reviewedBy
                ? leaveRequest.reviewedBy.name
                : "Not reviewed yet"}
            </p>
            {leaveRequest.reviewedAt && (
              <p>
                <strong>Reviewed On:</strong>{" "}
                {format(new Date(leaveRequest.reviewedAt), "dd MMMM yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="leave-requests-container">
      <div className="leave-requests__header">
        <h2>Leave Request History</h2>
      </div>

      {loading ? (
        <div className="loader-overlay">
          <InfinitySpin
            width="200"
            color="#4fa94d"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      ) : (
        <>
          <div className="leave-requests__list">
            {leaveRequests.length === 0 ? (
              <div className="leave-requests__empty">
                No leave requests found
              </div>
            ) : (
              currentRequests.map((request) => (
                <div
                  key={request._id}
                  className="leave-request-item"
                  onClick={() => handleDisplayLeave(request)}
                >
                  <div className="leave-request__details">
                    <div className="leave-request__type-status">
                      <span className="leave-request__type">
                        {request.leaveType.charAt(0).toUpperCase() +
                          request.leaveType.slice(1)}{" "}
                        Leave
                      </span>
                      <span
                        className={`leave-request__status leave-request__status--${request.status.toLowerCase()}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="leave-request__duration">
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                      <span className="leave-request__days">
                        (
                        {calculateLeaveDuration(
                          request.startDate,
                          request.endDate
                        )}
                        )
                      </span>
                    </div>
                    <div className="leave-request__reason">
                      {request.reason}
                    </div>
                    <div className="leave-request__metadata">
                      Requested{" "}
                      {formatDistance(new Date(request.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {leaveRequests.length > 0 && (
            <div className="leave-requests__pagination">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={requestsPerPage}
                totalItemsCount={leaveRequests.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="pagination-item"
                linkClass="pagination-link"
                activeClass="pagination-item--active"
              />
            </div>
          )}
        </>
      )}

      {displayMoreDetails && (
        <LeaveDetailsPopup
          leaveRequest={selectedLeaveRequest}
          onClose={() => setDisplayMoreDetails(false)}
        />
      )}
    </div>
  );
};

export default EmployeeLeaveRequests;
