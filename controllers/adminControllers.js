const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { adminModel, assignmentModel } = require("../db/db.js");
const { JWT_ADMIN_PASSWORD } = require("../jwt/config.js");

// Register a new admin
const registerAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message:
        "Please enter all required details: firstName, lastName, email, and password",
    });
  }

  //logic for zod to put input
  const requiredBody = z.object({
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    email: z.string().min(3).max(100).email(),
    password: z
      .string()
      .min(8)
      .max(30)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  //check whether registeration is valid or not
  try {
    const parseDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parseDataWithSuccess) {
      return res.status(400).json({
        message: "Incorrect format",
        error: parseDataWithSuccess.error,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await adminModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "You are registered",
    });
  } catch (error) {
    console.log("error while entering the credentials", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter all required details: email, and password",
    });
  }

  //login logic for admin using JWT middleware
  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(403).json({
        message: "Admin does not exist!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (passwordMatch) {
      const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD, {
        expiresIn: "1h",
      });

      res.status(200).json({
        message: "Login successful",
        token,
      });
    } else {
      res.status(403).json({
        message: "Incorrect Credentials!",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

//get assignments
const getAssignments = async (req, res) => {
  //logic for gives assignments under specific userId
  try {
    // Ensure that adminId exists in the request
    if (!req.adminId) {
      return res.status(400).json({ message: "Admin ID is required." });
    }

    // console.log("Admin ID:", req.adminId); 

    // Fetch assignments associated with the admin
    const assignments = await assignmentModel
      .find({ admin: req.adminId, status: "accepted" })
      .populate({
        path: "admin",
        select: "firstName lastName email",
      })
      .populate({
        path: "userId",
        select: "firstName lastName",
      })
      .lean();

    //if there is no assignment in arrays of objects
    if (assignments.length === 0) {
      console.log("No assignments found for the given admin.");
      return res
        .status(404)
        .json({ message: "No assignments found for the given admin." });
    } else {
      console.log("Assignments fetched successfully");
    }

    // Function to format date in AM/PM format
    const formatDate = (date) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formattedDate = new Date(date).toLocaleString("en-US", options);
      return formattedDate;
    };
    const transformedAssignments = assignments.map((assignment) => {
      return {
        userId: assignment.userId._id,
        name: `${assignment.userId.firstName} ${assignment.userId.lastName}`,
        admin: assignment.admin._id,
        status: assignment.status,
        task: assignment.task,
        createdAt: formatDate(assignment.createdAt),
      };
    });

    res.status(200).json({transformedAssignments});
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      message: "Error fetching assignments",
      error: error.message,
    });
  }
};

// Accept assignment
const acceptAssignment = async (req, res) => {
  //check whether userId is valid or not
  try {
    const assignment = await assignmentModel.findById(req.params.id);

    if (assignment.admin.toString() !== req.adminId) {
      return res.status(403).json({
        message: "You are not authorized to accept this assignment.",
      });
    }

    assignment.status = "accepted";
    await assignment.save();

    res.status(200).json({
      message: "Assignment accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting assignment:", error);
    res.status(500).json({
      message: "Error in server",
      error: error.message,
    });
  }
};

// Reject assignment
const rejectAssignment = async (req, res) => {
  //check whether userId is valid or not
  try {
    
    const assignment = await assignmentModel.findById(req.params.id);

    if (assignment.admin.toString() !== req.adminId) {
      return res.status(403).json({
        message: "You are not authorized to accept this assignment.",
      });
    }

    assignment.status = "rejected";
    await assignment.save();

    res.status(200).json({
      message: "Assignment rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting assignment:", error);
    res.status(500).json({
      message: "Error in server",
      error: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAssignments,
  acceptAssignment,
  rejectAssignment,
};
