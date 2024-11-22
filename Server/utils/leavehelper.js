//to be used larer for future refaral and implementation
const CreateLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        message:
          'Please provide all required fields: leaveType, startDate, endDate, and reason',
      });
    }

    // Validate leave type
    const validLeaveTypes = ['annual', 'sick', 'personal', 'unpaid'];
    if (!validLeaveTypes.includes(leaveType)) {
      return res.status(400).json({
        message:
          'Invalid leave type. Must be one of: annual, sick, personal, or unpaid',
      });
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const today = new Date();

    // Check if dates are valid
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({
        message: 'Invalid date format',
      });
    }

    // Check if start date is in the past
    if (startDateObj < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        message: 'Start date cannot be in the past',
      });
    }

    // Check if end date is before start date
    if (endDateObj < startDateObj) {
      return res.status(400).json({
        message: 'End date must be after start date',
      });
    }

    // Calculate leave duration in days
    const durationInDays =
      Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1; // Adding 1 to include both start and end dates

    // Optional: Check for overlapping leave requests
    const overlappingRequests = await LeaveRequest.findOne({
      employeeId: req.user._id, // Assuming you have the authenticated user in req.user
      status: { $ne: 'rejected' }, // Exclude rejected requests
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
      ],
    });

    if (overlappingRequests) {
      return res.status(400).json({
        message: 'You already have a leave request for these dates',
      });
    }

    // Optional: Check remaining leave balance
    // This is just an example - implement according to your leave balance tracking system
    const userLeaveBalance = await LeaveBalance.findOne({
      employeeId: req.user._id,
      leaveType: leaveType,
    });

    if (userLeaveBalance && userLeaveBalance.remainingDays < durationInDays) {
      return res.status(400).json({
        message: `Insufficient ${leaveType} leave balance. You have ${userLeaveBalance.remainingDays} days remaining`,
      });
    }

    // Create new leave request
    const newLeaveRequest = new LeaveRequest({
      employeeId: req.user._id, // Assuming you have the authenticated user in req.user
      leaveType,
      startDate,
      endDate,
      reason,
      durationInDays,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Save the leave request
    await newLeaveRequest.save();

    // Populate employee details for response
    const populatedRequest = await LeaveRequest.findById(
      newLeaveRequest._id
    ).populate('employeeId', 'firstName lastName employeeId');

    // Transform response to match frontend expectations
    const transformedRequest = {
      id: populatedRequest._id,
      employeeName: `${populatedRequest.employeeId.firstName} ${populatedRequest.employeeId.lastName}`,
      employeeId: populatedRequest.employeeId.employeeId,
      leaveType: populatedRequest.leaveType,
      startDate: populatedRequest.startDate,
      endDate: populatedRequest.endDate,
      reason: populatedRequest.reason,
      status: populatedRequest.status,
      durationInDays: populatedRequest.durationInDays,
      createdAt: populatedRequest.createdAt,
    };

    // Optional: Send notification to admin/supervisor
    try {
      await sendNotificationToAdmin({
        type: 'NEW_LEAVE_REQUEST',
        employeeName: transformedRequest.employeeName,
        leaveType,
        startDate,
        endDate,
        reason,
      });
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't fail the request if notification fails
    }

    // Return success response
    res.status(201).json({
      message: 'Leave request submitted successfully',
      request: transformedRequest,
    });
  } catch (error) {
    console.error('Error creating leave request:', error.message);
    return res.status(500).json({
      message: error.message || 'Error submitting leave request',
    });
  }
};

// Example notification helper function
const sendNotificationToAdmin = async (notificationData) => {
  // Implement your notification logic here
  // This could be sending an email, push notification, or creating a notification in your system
  console.log('New leave request notification:', notificationData);
};

// Example LeaveBalance model (if you're tracking leave balances)
/*
const leaveBalanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['annual', 'sick', 'personal', 'unpaid']
  },
  totalDays: {
    type: Number,
    required: true
  },
  usedDays: {
    type: Number,
    default: 0
  },
  remainingDays: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
});
*/

module.exports = {
  CreateLeaveRequest,
};
