const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookingsAdmin,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route for testing (optional, remove in production)
// router.get('/', (req, res) => res.send('Booking API routes are ready!'));

// Customer and Caretaker specific routes
router.route('/my').get(protect, getMyBookings); // Get bookings for authenticated user (customer or caretaker)
router.route('/:id').get(protect, getBookingById); // Get single booking details (customer/caretaker/admin access control inside controller)

// Customer specific routes
router.route('/').post(protect, authorizeRoles('customer'), createBooking); // Create a new booking
router.route('/:id/cancel').put(protect, authorizeRoles('customer'), cancelBooking); // Customer can cancel their own booking

// Admin specific routes
router.route('/').get(protect, authorizeRoles('admin'), getAllBookingsAdmin); // Get all bookings (Admin only)
router.route('/:id/status').put(protect, authorizeRoles('admin', 'caretaker'), updateBookingStatus); // Update booking status (Admin or assigned Caretaker)

module.exports = router;