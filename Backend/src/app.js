require("dotenv").config();
const authRoute = require("./routes/auth.route");
const cors= require("cors")
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost/5173",
    withCredentials:true
}))
app.use(cookieParser());


app.use("/api/auth", authRoute);

module.exports = app;
