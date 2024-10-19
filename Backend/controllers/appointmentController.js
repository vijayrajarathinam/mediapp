// Create a exprees controller function that will Allows a user to book an appointment for a specified time.

const Appointment = require("../models/Appointment");

exports.bookAppointment = async (req, res) => {
  try {
    // Extract the appointment details from the request body
    const { date, time, doctorName } = req.body;

    // Validate the appointment details
    if (!date || !time) {
      return res.status(400).json({
        message: "Please provide both date and time for the appointment.",
      });
    }

    // Check if the selected date and time are available for booking
    const availableAppointments = await Appointment.find({ date, time });

    if (availableAppointments.length > 0) {
      return res
        .status(409)
        .json({ message: "The selected appointment time is already booked." });
    }

    // Create a new appointment document
    const newAppointment = new Appointment({ date, time, doctorName });

    // Save the appointment document to the database
    await newAppointment.save();

    // Return a success response with the appointment details
    res.status(201).json({
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    // Handle any errors that occur during the booking process
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while booking the appointment." });
  }
  // END SOLUTION
  // ...
};

// ...
// create a exprees controller function that will Retrieves all appointments booked by the authenticated user.

exports.getAllAppointments = async (req, res) => {
  try {
    // Retrieve the authenticated user's ID from the request headers
    const userId = req.query.user;

    // Find all appointments that belong to the authenticated user
    const appointments = await Appointment.find({ user: userId });

    // Return a success response with the appointments
    res.json({ appointments });
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving appointments." });
  }
  // END SOLUTION
  // ...
};

// ...
// create a exprees controller function that will Allows a user to cancel an appointment by providing its ID.

exports.cancelAppointment = async (req, res) => {
  try {
    // Extract the appointment ID from the request parameters
    const appointmentId = req.params.id;

    // Find the appointment document with the provided ID
    const appointment = await Appointment.findById(appointmentId);

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Check if the authenticated user is the owner of the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to cancel this appointment.",
      });
    }

    // Delete the appointment document from the database
    await appointment.delete();

    // Return a success response with a confirmation message
    res.status(200).json({ message: "Appointment canceled successfully." });
  } catch (error) {
    // Handle any errors that occur during the cancellation process
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while canceling the appointment." });
  }
  // END SOLUTION
};

// ...
// create a express controller function that will  Allows a user to reschedule an appointment to a new date and time.

exports.rescheduleAppointment = async (req, res) => {
  try {
    // Extract the appointment ID and new appointment details from the request body
    const appointmentId = req.params.id;
    const { newDate, newTime } = req.body;

    // Find the appointment document with the provided ID
    const appointment = await Appointment.findById(appointmentId);

    // Check if the appointment exists
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Check if the authenticated user is the owner of the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to reschedule this appointment.",
      });
    }

    // Check if the new appointment details are provided
    if (!newDate || !newTime) {
      return res.status(400).json({
        message: "Please provide both new date and time for the appointment.",
      });
    }

    // Check if the selected new date and time are available for booking

    const availableAppointments = await Appointment.find({
      date: newDate,
      time: newTime,
    });

    if (availableAppointments.length > 0) {
      return res.status(409).json({
        message: "The selected new appointment time is already booked.",
      });
    }

    // Update the appointment document with the new date and time
    appointment.date = newDate;
    appointment.time = newTime;
    await appointment.save();

    // Return a success response with the updated appointment details
    res.json({ message: "Appointment rescheduled successfully.", appointment });
  } catch (error) {
    // Handle any errors that occur during the rescheduling process
    console.error(error);
    res.status(500).json({
      message: "An error occurred while rescheduling the appointment.",
    });
  }
  // END SOLUTION
};

// ...
