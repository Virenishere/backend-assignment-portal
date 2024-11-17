const { userModel, assignmentModel, adminModel } = require("../db/db.js");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../jwt/config.js");

// Register User Controller
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message:
        "Please enter all required details: firstName, lastName, email, and password",
    });
  }

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
    // Validate the request body using Zod
    const parseDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
      return res.status(400).json({
        message: "Incorrect format",
        error: parseDataWithSuccess.error,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    // Create a new user with the validated data and hashed password
    await userModel.create({
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

// Login User Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter all required details: email, and password",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "User does not exist!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate a JWT token with the user's id from DB
      const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD, {
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

// Upload Assignment Controller
const uploadAssignment = async (req, res) => {
  try {
    const { task, admin, userId } = req.body;

    // Check if user exists by firstName and lastName
    const user = await userModel.findOne({
      firstName: userId.split(" ")[0],
      lastName: userId.split(" ")[1],
    });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if admin exists by firstName and lastName
    const adminUser = await adminModel.findOne({
      firstName: admin.split(" ")[0],
      lastName: admin.split(" ")[1],
    });
    if (!adminUser) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // Create the assignment
    const assignment = new assignmentModel({
      userId: user._id,
      task,
      admin: adminUser._id,
      status: "pending",
    });

    // Save the assignment
    await assignment.save();

    // Populate userId and admin fields
    const populatedAssignment = await assignmentModel
      .findById(assignment._id)
      .populate("userId", "firstName lastName")
      .populate("admin", "firstName lastName")
      .select("task status userId admin");

    // Create a new object with only the required fields
    const transformedAssignment = {
      userId: populatedAssignment.userId._id,
      name: `${populatedAssignment.userId.firstName} ${populatedAssignment.userId.lastName}`,
      admin: populatedAssignment.admin._id,
      task: populatedAssignment.task,
      status: populatedAssignment.status,
    };
    res.status(200).json({
      msg: "Assignment uploaded successfully",
      assignment: transformedAssignment,
    });
  } catch (error) {
    console.error("Error uploading assignment:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Get Admins Controller
const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find({}, "firstName lastName _id");

    const formattedAdmins = admins.map((admin) => ({
      userId: admin._id,
      name: `${admin.firstName} ${admin.lastName}`,
    }));

    res.status(200).json(formattedAdmins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({
      message: "Error fetching admins",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  uploadAssignment,
  getAdmins,
};
