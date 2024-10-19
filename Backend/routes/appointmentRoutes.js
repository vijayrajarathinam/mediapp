// create a instance of express router

const {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  getAllAppointments,
} = require("../controllers/appointmentController");

const appointmentRouter = require("express").Router();

// define routes
appointmentRouter
  .route("/")
  .post(bookAppointment)
  .get(getAllAppointments)
  .put(rescheduleAppointment)
  .delete(cancelAppointment);

// export the router
module.exports = appointmentRouter;
