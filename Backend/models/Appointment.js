const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true, // Assuming time is stored as a string like "14:00"
    },
    service: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "rescheduled"],
      default: "confirmed",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the admin if applicable
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
