const { Router } = require("express");
const adminRouter = Router();
const {adminMiddleware} = require("../middlewares/adminMiddleware.js");
const {
  registerAdmin,
  loginAdmin,
  getAssignments,
  acceptAssignment,
  rejectAssignment,
} = require("../controllers/adminControllers.js");

// All admin endpoints
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/assignments", adminMiddleware, getAssignments);
adminRouter.post("/assignments/:id/accept", adminMiddleware, acceptAssignment);
adminRouter.post("/assignments/:id/reject", adminMiddleware , rejectAssignment);

module.exports = {
  adminRouter: adminRouter,
};
