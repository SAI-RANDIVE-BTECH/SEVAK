const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  // Sign the JWT with the user's ID and a secret from environment variables
  // The token expires after a certain period (e.g., 30 days)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE, // e.g., '30d' for 30 days
  });

  // Set the JWT as an HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
    sameSite: 'Strict', // Protects against CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds (must match JWT_COOKIE_EXPIRE for consistency)
  });
};

module.exports = generateToken;