require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors= require("cors")

const authRoute = require("./routes/auth.route");
const interviewReportRouter=require("./routes/interview.route")

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))
app.use(cookieParser());

/**

 * @route   POST   /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 *
 * @route   POST   /api/auth/login
 * @desc    Authenticate user and return JWT token via cookie
 * @access  Public
 *
 * @route   POST   /api/auth/logout
 * @desc    Logout user and blacklist the current JWT token
 * @access  Public
 *
 * @route   GET    /api/auth/get-me
 * @desc    Get the currently authenticated user's profile
 * @access  Private (requires JWT)
 *
 * @route   POST   /api/interview
 * @desc    Generate an AI-powered interview preparation report (PDF upload)
 * @access  Private (requires JWT)
 *
 * @route   GET    /api/interview
 * @desc    List all interview reports for the user (paginated)
 * @access  Private (requires JWT)

 */

app.use("/api/auth", authRoute);
app.use("/api/interview", interviewReportRouter)

module.exports = app;
