const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {z} = require("zod");
const { adminModel, assignmentModel } = require("../db/db.js");
const { JWT_ADMIN_PASSWORD } = require("../jwt/config.js");

// Register a new admin
const registerAdmin = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

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

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(403).json({
        message: "Admin does not exist!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { id: admin._id },
        JWT_ADMIN_PASSWORD,
        { expiresIn: "1h" }
      );

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

const getAssignments = async (req, res) => {
  try {
    // Ensure that adminId exists in the request
    if (!req.adminId) {
      return res.status(400).json({ message: "Admin ID is required." });
    }

    console.log("Admin ID:", req.adminId); // Verify that req.adminId is set

    // Fetch assignments associated with the admin
    const assignments = await assignmentModel
      .find({ admin: req.adminId }) // Use req.adminId to get assignments associated with the admin
      .populate("userId", "firstName lastName") // Populate userId with firstName and lastName
      .lean(); // Use lean for plain JS objects

    if (assignments.length === 0) {
      console.log("No assignments found for the given admin.");
      return res.status(404).json({ message: "No assignments found for the given admin." });
    } else {
      console.log("Assignments fetched:", assignments);
    }

    res.status(200).json(assignments); // Send the assignments back in the response
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
  try {
    const assignment = await assignmentModel.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
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
  try {
    console.log("Assignment ID from request params:", req.params.id); // Log the ID to console

    const assignment = await assignmentModel.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
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
