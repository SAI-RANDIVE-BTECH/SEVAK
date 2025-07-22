const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

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

// Middleware
// Enable CORS for frontend communication. Adjust origin for production deployment.
app.use(cors({
  origin: 'http://localhost:3000', // IMPORTANT: Change this to your frontend's actual URL in production
  credentials: true // Allow cookies to be sent with cross-origin requests
}));

app.use(express.json()); // Body parser for raw JSON payloads
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cookieParser()); // Cookie parser for handling cookies (specifically for JWT)

// Basic Route for testing server status
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);         // Routes for user authentication (register, login, logout)
app.use('/api/services', serviceRoutes);  // Routes for service management (get all, get by ID, admin CRUD)
app.use('/api/bookings', bookingRoutes);  // Routes for booking management (create, get my, get by ID, admin all, status update, cancel)

// Custom Error Handling Middleware (must be after all routes)
app.use(notFound); // Catches 404 Not Found errors
app.use(errorHandler); // Handles all other errors

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});