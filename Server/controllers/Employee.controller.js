import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import LeaveRequest from "../models/LeaveRequest.js";
import Salary from "../models/salaryModel.js";
import Department from "../models/DepartmentModel.js";

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "Employee" });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getting a single employee by id
const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const fetchedEmployee = await User.findById(id);

    res.status(200).json(fetchedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// getting employee by Department
export const getEmployeesByDepartment = async (req, res) => {
  try {
    const employees = await User.find({
      department: req.params.departmentId,
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new employee
const createEmployee = async (req, res) => {
  const { name, dob, department, email, password } = req.body; // Removed 'image'
  try {
    // hashed password
    const hashedPass = await bcrypt.hash(password, 10);
    const employee = new User({
      name,
      dob,
      department,
      email,
      password: hashedPass,
      role: "Employee",
    });
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an employee by ID
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, dob, department, email } = req.body;

  try {
    const employee = await User.findByIdAndUpdate(
      id,
      { name, dob, department, email },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await User.findByIdAndDelete(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//post a leave request
const PostLeaveRequests = async (req, res) => {
  const { id } = req.params;
  const { leaveType, startDate, endDate, reason } = req.body;

  try {
    // Validate the incoming data
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate leave type
    const validLeaveTypes = ["annual", "sick", "personal", "unpaid"];
    if (!validLeaveTypes.includes(leaveType)) {
      return res.status(400).json({
        message:
          "Invalid leave type. Must be one of: annual, sick, personal, or unpaid",
      });
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const today = new Date();

    // Check if dates are valid
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    // Check if start date is in the past
    if (startDateObj < today.setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        message: "Start date cannot be in the past",
      });
    }

    // Check if end date is before start date
    if (endDateObj < startDateObj) {
      return res.status(400).json({
        message: "End date must be after start date",
      });
    }

    // // Check for overlapping leave requests
    // const overlappingRequests = await LeaveRequest.findOne({
    //   employeeId: id,
    //   status: { $ne: 'rejected' }, // Exclude rejected requests
    //   $or: [
    //     {
    //       startDate: { $lte: endDate },
    //       endDate: { $gte: startDate },
    //     },
    //   ],
    // });

    // if (overlappingRequests) {
    //   return res.status(400).json({
    //     message: 'You already have a leave request for these dates',
    //   });
    // }

    // Create a new leave request
    const newLeaveRequest = await LeaveRequest.create({
      employeeId: id,
      leaveType,
      startDate: startDateObj,
      endDate: endDateObj,
      reason,
    });

    // Respond with the saved leave request
    return res.status(201).json({
      message: "Leave request submitted successfully.",
      leaveRequest: newLeaveRequest,
    });
  } catch (error) {
    console.error("Error creating leave request:", error);
    return res.status(500).json({
      message: {
        error:
          error.message ||
          "An error occurred while submitting the leave request.",
      },
    });
  }
};

//get all the leave requests
const GetleaveRequests = async (req, res) => {
  try {
    // Extract query parameters
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 5) || 5);
    const status = req.query.status || "all";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build filter query
    let filterQuery = {};
    if (status !== "all") {
      filterQuery.status = status;
    }

    // Get total count for pagination
    const totalRequests = await LeaveRequest.countDocuments(filterQuery);

    // Fetch paginated and filtered leave requests
    const leaveRequests = await LeaveRequest.find(filterQuery)
      .populate("employeeId", "name email department")
      .populate("reviewedBy", "name email ")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Transform data to match frontend expectations
    const transformedRequests = leaveRequests.map((request) => ({
      id: request._id,
      employeeName: request.employeeId.name,
      employeeId: request.employeeId._id,
      department: request.employeeId.department,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      status: request.status,
      createdAt: request.createdAt,
      reviewedAt: request.reviewedAt,
      reviewedBy: request.reviewedBy,
    }));

    // Check if no leave requests exist
    if (totalRequests === 0) {
      return res.status(200).json({
        total: 0,
        requests: [],
        currentPage: page,
        totalPages: 0,
        itemsPerPage: limit,
      });
    }

    // Return the paginated response
    res.status(200).json({
      total: totalRequests,
      requests: transformedRequests,
      currentPage: page,
      totalPages: Math.ceil(totalRequests / limit),
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error("Error getting leave requests: ", error.message);
    return res.status(500).json({
      message: error.message || "Error fetching leave requests!",
    });
  }
};

//get an employee leave requests
export const getEmployeeLeaveRequests = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const leaveRequests = await LeaveRequest.find({ employeeId: employeeId })
      .populate("employeeId", "name email department")
      .populate("reviewedBy", "name email ")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving leave requests",
      error: error.message,
    });
  }
};

// Add status update controller
const UpdateLeaveRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Status must be pending, approved, or rejected.",
      });
    }

    // Find and update the leave request
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      requestId,
      {
        status,
        updatedAt: Date.now(),
        reviewedBy: req.user._id,
        reviewedAt: Date.now(),
      },
      { new: true }
    )
      .populate("employeeId", "name email department")
      .populate("reviewedBy", "name email ");

    if (!updatedRequest) {
      return res.status(404).json({
        message: "Leave request not found",
      });
    }

    // Transform the response to match frontend expectations
    const transformedRequest = {
      id: updatedRequest._id,
      employeeName: `${updatedRequest.employeeId.name}`,
      employeeId: updatedRequest.employeeId.employeeId,
      department: updatedRequest.employeeId.department,
      leaveType: updatedRequest.leaveType,
      startDate: updatedRequest.startDate,
      endDate: updatedRequest.endDate,
      reason: updatedRequest.reason,
      status: updatedRequest.status,
      reviewedAt: updatedRequest.updatedRequest,
      reviewedBy: updatedRequest.reviewedBy,
    };

    res.status(200).json(transformedRequest);
  } catch (error) {
    console.error("Error updating leave request status: ", error.message);
    return res.status(500).json({
      message: error.message || "Error updating leave request status!",
    });
  }
};

//delete leave request
const deleteLeaveRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLeave = await LeaveRequest.findByIdAndDelete(id);
    if (!deletedLeave) {
      return res.status(404).json({ message: "No such leave to delete!" });
    }
    res.status(200).json(deletedLeave);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error deleting Leave Request!" });
  }
};

export const generalData = async (req, res) => {
  try {
    const employees = await User.find({ role: "Employee" });
    const salaries = await Salary.find();
    const departments = await Department.find();

    const transformedRequest = {
      employees: employees.length > 0 ? employees : [],
      salaries: salaries.length > 0 ? salaries : [],
      departments: departments.length > 0 ? departments : [],
    };

    res.status(200).json(transformedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message || "Error fetching data!" });
  }
};
export {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  PostLeaveRequests,
  GetleaveRequests,
  UpdateLeaveRequestStatus,
  deleteLeaveRequest,
};
