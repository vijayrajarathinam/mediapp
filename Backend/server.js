// create a express server and start listening to port 8080

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// express instance
const app = express();
const port = 8080;

// middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// connect to database using mongoose server
mongoose.connect("mongodb://localhost:27017/myDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// define routes
const userRouter = require("./routes/userRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");

app.use("/user", userRouter);
app.use("/appointment", appointmentRouter);

// server starts listening
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
