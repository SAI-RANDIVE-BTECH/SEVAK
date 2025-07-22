const asyncHandler = require('express-async-handler'); // For simplifying async error handling
const generateToken = require('../utils/generateToken'); // Utility to generate JWT
const User = require('../models/User'); // Import the User model
const validator = require('validator'); // For email validation

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body; // Destructure data from request body

  // Input Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all required fields: name, email, password');
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Bad request
    throw new Error('User already exists with this email');
  }

  // Determine role based on input, default to 'customer'
  let userRole = 'customer';
  // You might add logic here to allow admin to register caretakers,
  // but for public registration, only 'customer' is typically allowed.
  // For now, we'll only allow 'customer' via this public endpoint.
  // If 'role' is sent by client, we'll ignore it to prevent unauthorized role assignment.
  // If we need to register 'caretaker' via UI, it would typically be an admin action
  // or a separate application process/endpoint.

  // Create new user
  const user = await User.create({
    name,
    email,
    password, // Password hashing happens in the pre-save hook in User model
    role: userRole,
    // walletBalance is set to default: 1000 in User model schema upon creation
  });

  if (user) {
    // If user created successfully
    generateToken(res, user._id); // Generate JWT and set as HTTP-only cookie

    res.status(201).json({ // 201 status for successful resource creation
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance, // Send initial wallet balance
      message: 'Registration successful and Rs 1000 added to your wallet!'
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data'); // If creation failed for unexpected reasons
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Input Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter all required fields: email, password');
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // If user exists and password matches
    generateToken(res, user._id); // Generate JWT and set as HTTP-only cookie

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletBalance: user.walletBalance, // Send current wallet balance
      message: 'Login successful!'
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private (accessible only by authenticated users)
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { // Clear the 'jwt' cookie
    httpOnly: true,
    expires: new Date(0), // Set expiry to past date
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'Strict' // Protect against CSRF attacks
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};