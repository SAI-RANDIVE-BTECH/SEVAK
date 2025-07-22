const path = require('path'); // Ensure this is imported at the top: const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');
// const cors = require('cors'); // <--- REMOVE THIS LINE (or comment it out)

const connectDB = require('./config/db'); // Database connection
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Custom error handlers
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const serviceRoutes = require('./routes/serviceRoutes'); // Service routes
const bookingRoutes = require('./routes/bookingRoutes'); // Booking routes

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware (Keep these)
// app.use(cors({ // <--- REMOVE OR COMMENT OUT THIS BLOCK, it's no longer needed in this setup
//   origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
//   credentials: true
// }));

app.use(express.json()); // Body parser for raw JSON payloads
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cookieParser()); // Cookie parser for handling cookies (specifically for JWT)

// --- API Routes (These must come before static file serving or catch-all) ---
app.use('/api/auth', authRoutes);         // Routes for user authentication (register, login, logout)
app.use('/api/services', serviceRoutes);  // Routes for service management (get all, get by ID, admin CRUD)
app.use('/api/bookings', bookingRoutes);  // Routes for booking management (create, get my, get by ID, admin all, status update, cancel)


// --- Static HTML serving for specific legal pages (Keep these) ---
// These are explicitly handled outside the React app, directly from the public folder.
// This needs to come before the catch-all for React app.
app.use(express.static(path.join(__dirname, '..', 'public'))); // Serve static files from the public directory as well

app.get('/privacy-policy.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'privacy-policy.html'));
});

app.get('/terms-of-service.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'terms-of-service.html'));
});

app.get('/medical-disclaimer.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'medical-disclaimer.html'));
});

app.get('/licensing.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'licensing.html'));
});
// -----------------------------------------------------------------


// --- PRODUCTION DEPLOYMENT CONFIGURATION (Backend serving Frontend) ---
// This part only runs when NODE_ENV is 'production' (e.g., on Render)
if (process.env.NODE_ENV === 'production') {
  // Set the build folder of the React app as a static folder
  // path.join(__dirname, '..', 'build') points from backend/server.js to the root's 'build' folder
  app.use(express.static(path.join(__dirname, '..', 'build')));

  // For any GET request that doesn't match an API route or an explicit static HTML file,
  // serve the index.html from the React build folder.
  // This allows React Router to handle client-side routes (e.g., /dashboard, /services).
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
} else {
  // Development mode: Only a basic API testing route if not serving frontend via Express
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}
// --------------------------------------------------------------------


// Custom Error Handling Middleware (must be after all routes, including static)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});