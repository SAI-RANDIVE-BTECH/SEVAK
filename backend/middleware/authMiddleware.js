const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Import the User model

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the 'jwt' cookie exists in the request
  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;

      // Verify token
      // This will decode the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from the decoded token payload and exclude password
      // We attach the user to the request object (req.user)
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, user not found');
      }

      next(); // Move to the next middleware or route handler
    } catch (error) {
      console.error(error.message.red.bold);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token found');
  }
});

// Middleware for role-based authorization
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the authenticated user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(`User role (${req.user.role}) is not authorized to access this resource.`);
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };