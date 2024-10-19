// create a express route instance

const {
  registerController,
  loginController,
  logoutController,
  getProfileController,
  updateProfileController,
  deleteAccountController,
} = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.route("/register").post(registerController);
userRouter.route("/login").post(loginController);
userRouter.route("/logout").post(logoutController);
userRouter
  .route("/profile")
  .get(getProfileController)
  .put(updateProfileController)
  .delete(deleteAccountController);

module.exports = userRouter;
