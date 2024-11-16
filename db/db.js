const mongoose = require("mongoose");
const dotenv = require("dotenv");

//async function to connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://virender:test123@cluster0.pdpgnob.mongodb.net/backend-assignment-portal");
    console.log("connected to DB");
  } catch (error) {
    console.error("DB error:", error);
    process.exit(1);
  }
};

// Define schema and models
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

//making the schema for all types

//user schema
const userSchema = new Schema({
  firstName: { type: String},
  lastName: { type: String},
  email: { type: String, unique: true },
  password: { type: String },
});

//admin schema
const adminSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
});

//assignment schema
const assignmentSchema = new Schema({
  userId: { type: ObjectId, ref: "user" },
  admin: { type: ObjectId, ref: "admin" },
  task: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Create all models and export them
const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const assignmentModel = mongoose.model("assignment", assignmentSchema); 


module.exports = {
  connectDB,
  userModel,
  adminModel,
  assignmentModel,
};
