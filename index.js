const express = require("express");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); 

const { connectDB } = require("./db/db.js")
const { userRouter } = require("./routes/userRouter.js")
const { adminRouter } = require("./routes/adminRouter.js")

//for loading the environment variables from .env file
dotenv.config(); 

const app = express();

//Connect to DB
connectDB();

// Middleware to parse JSON body
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());


//calling all routes from routes files
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);


//making the server
const PORT = process.env.PORT || 3000 

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
});