const { Router } = require("express");
const userRouter = Router();
const {userMiddleware} = require("../middlewares/userMiddleware.js");
const {
  registerUser,
  loginUser,
  uploadAssignment,
  getAdmins,
} = require("../controllers/userControllers.js");

// All users endpoints
userRouter.post("/register", registerUser); 
userRouter.post("/login", loginUser); 
userRouter.post("/upload",  userMiddleware , uploadAssignment); 
userRouter.get("/admins",  userMiddleware , getAdmins); 

module.exports = {
  userRouter: userRouter
};
