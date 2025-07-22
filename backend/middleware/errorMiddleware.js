// Middleware to handle routes that don't exist (404 Not Found)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404); // Set status to 404
  next(error); // Pass the error to the next error handling middleware
};

// Generic error handling middleware
const errorHandler = (err, req, res, next) => {
  // If status code is 200 (OK), it means an error occurred but Express might not have set the status yet.
  // We default to 500 (Internal Server Error) in such cases.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message, // The error message
    // In development, send the stack trace for debugging.
    // In production, hide the stack trace for security (to avoid exposing internal details).
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };