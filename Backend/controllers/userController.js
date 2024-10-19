// create a express controller function that will Allows a new user to register an account.

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    // // validate the request body using the Joi library
    // const { error } = registerValidation.validate(req.body);

    // // if validation fails, return an error response with a 400 status code

    // if (error) return res.status(400).json({ error: error.details[0].message });

    // check if the email already exists in the database
    const emailExists = await User.findOne({ email: req.body.email });

    // if the email exists, return an error response with a 400 status code
    if (emailExists)
      return res.status(400).json({ error: "Email already exists" });

    // create a new user with the validated data
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // save the user to the database
    await user.save();

    // return a success response with a 201 status code and the user object
    res.status(201).json({ user });
  } catch (error) {
    // if any error occurs during the registration process, return an error response with a 500 status code
    res.status(500).json({ error: "Server error" });
  }

  // if the registration process is successful, return a success response with a 200 status code
};

//create a express controller function that will  Authenticates a user and returns a JWT token.

const loginController = async (req, res) => {
  const { email, password } = req?.body || { email: "", password: "" };
  try {
    // // validate the request body using the Joi library
    // const { error } = loginValidation.validate(req.body);

    // // if validation fails, return an error response with a 400 status code
    // if (error) return res.status(400).json({ error: error.details[0].message });

    // find the user by email in the database
    const user = await User.findOne({ email }).select("+password");

    // if the user does not exist, return an error response with a 401 status code
    if (!user)
      return res.status(401).json({ error: "Invalid email or password 1" });

    // compare the hashed password from the request body with the hashed password in the database
    const validPassword = await user.comparePassword(password);

    // if the passwords do not match, return an error response with a 401 status code
    if (!validPassword)
      return res.status(401).json({ error: "Invalid email or password 2" });

    // create a JSON Web Token (JWT) with the user's id
    const token = jwt.sign({ id: user.id }, "ai-in-use", {
      expiresIn: "1h",
    });

    // return a success response with a 200 status code and the JWT token
    res.json({ token });
  } catch (error) {
    // if any error occurs during the login process, return an error response with a 500 status code
    res.status(500).json({ error: "Server error" });
  }

  // if the login process is successful, return a success response with a 200 status code
};

// create a express controller function that will  Logs the user out by invalidating their token (if using token invalidation).

const logoutController = async (req, res) => {
  try {
    // invalidate the token by setting it to null
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    // save the updated user document to the database
    await req.user.save();

    // return a success response with a 200 status code
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // if any error occurs during the logout process, return an error response with a 500 status code
    res.status(500).json({ error: "Server error" });
  }

  // if the logout process is successful, return a success response with a 200 status code
  // (the token will be invalidated upon the next request)
};

// create a express controller function that will Retrieves the logged-in user's profile information.
const getProfileController = async (req, res) => {
  try {
    // return the logged-in user's profile information with a 200 status code
    res.json({ user: req.user });
  } catch (error) {
    // if any error occurs during the profile retrieval process, return an error response with a 500 status code
    res.status(500).json({ error: "Server error" });
  }

  // if the profile retrieval process is successful, return a success response with a 200 status code
};

// create a express controller function that will Update the logged-in user's profile information.

const updateProfileController = async (req, res) => {
  try {
    // update the user's profile information in the database
    req.user.name = req.body.name;
    req.user.email = req.body.email;

    // if the password is provided, hash it and update it in the database
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.user.password = hashedPassword;
    }

    // save the updated user document to the database
    await req.user.save();

    // return the updated user's profile information with a 200 status code
    res.json({ user: req.user });
  } catch (error) {
    // if any error occurs during the profile update process, return an error response with a 500 status code
    res.status(500).json({
      error: "Server error",
    });

    // if the profile update process is successful, return a success response with a 200 status code
  }
  // (the updated profile information will be returned upon the next request)
  // (the token will be invalidated upon the next request)
};

// create a express controller function that will Delete the logged-in user's account.

const deleteAccountController = async (req, res) => {
  try {
    // delete the user's account from the database
    await req.user.remove();

    // return a success response with a 200 status code
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    // if any error occurs during the account deletion process, return an error response with a 500 status code
    res.status(500).json({ error: "Server error" });
  }

  // if the account deletion process is successful, return a success response with a 200 status code
  // (the user's account will be removed upon the next request)
  // (the token will be invalidated upon the next request)
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  getProfileController,
  updateProfileController,
  deleteAccountController,
};
