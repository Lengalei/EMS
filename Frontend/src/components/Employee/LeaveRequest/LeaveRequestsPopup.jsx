/* eslint-disable react/prop-types */
import { useState } from 'react';
import Pagination from 'react-js-pagination';
import './LeaveRequestsPopup.scss';

const LeaveRequestsPopup = ({ isOpen, onClose, leaveRequests }) => {
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage] = useState(3); // Number of cards per page
  const [expandedCards, setExpandedCards] = useState({}); // Track expanded cards

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const toggleReadMore = (index) => {
    setExpandedCards((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Paginate data
  const paginatedLeaveRequests = leaveRequests.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    isOpen && (
      <div
        className={
          paginatedLeaveRequests?.length > 0
            ? `popup-container`
            : 'nothing-container'
        }
      >
        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* Cards Section */}
        {paginatedLeaveRequests && paginatedLeaveRequests.length > 0 ? (
          <>
            <div className="cards-section">
              {paginatedLeaveRequests.map((leave, index) => (
                <div key={index} className="leave-card">
                  <div className="leave-header">
                    <span>
                      <strong>Type:</strong> {leave.leaveType}
                    </span>
                    <span className={`status ${leave.status}`}>
                      {leave.status}
                    </span>
                  </div>

                  <div className="leave-details">
                    <p>
                      <strong>Start Date:</strong>{' '}
                      {new Date(leave.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>End Date:</strong>{' '}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Reason:</strong>{' '}
                      {expandedCards[index]
                        ? leave.reason
                        : `${leave.reason.substring(0, 100)}...`}
                      <span
                        className="read-more-toggle"
                        onClick={() => toggleReadMore(index)}
                      >
                        {expandedCards[index] ? ' Read Less' : ' Read More'}
                      </span>
                    </p>
                    {leave.reviewedBy && (
                      <p>
                        <strong>Reviewed By:</strong> {leave.reviewedBy.name}
                      </p>
                    )}
                    {leave.reviewedAt && (
                      <p>
                        <strong>Reviewed At:</strong>{' '}
                        {new Date(leave.reviewedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={leaveRequests.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                prevPageText="&laquo;"
                nextPageText="&raquo;"
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          </>
        ) : (
          <div className="noLeaveRequests">
            <p>There are no Leave requests to display!</p>
          </div>
        )}
      </div>
    )
  );
};

export default LeaveRequestsPopup;
