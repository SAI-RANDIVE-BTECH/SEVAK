const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User'); // We need User model to update wallet balance

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer only)
const createBooking = asyncHandler(async (req, res) => {
  const {
    serviceId,
    serviceDate,
    serviceTime,
    serviceDuration,
    patientDetails, // This will be the nested object from the form
  } = req.body;

  // 1. Basic Validation for required fields
  if (!serviceId || !serviceDate || !serviceTime || !serviceDuration || !patientDetails) {
    res.status(400);
    throw new Error('Please provide all required booking and patient details.');
  }

  // 2. Validate Patient Details (more detailed checks)
  const { fullName, dateOfBirth, gender, contactNumber, address, emergencyContact } = patientDetails;

  if (!fullName || !dateOfBirth || !gender || !contactNumber || !address.street || !address.city || !address.state || !address.zipCode) {
    res.status(400);
    throw new Error('Please fill in all required patient and address details.');
  }

  // Optional: More specific validation for date formats, contact numbers etc.
  // We'll rely on Mongoose schema for basic regex validation.

  // 3. Find the Service and calculate total cost
  const service = await Service.findById(serviceId);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Calculate total cost (example: service price per unit * duration)
  // You might need more complex logic here based on your pricing model (e.g., hourly, daily)
  const totalCost = service.price * serviceDuration;
  if (totalCost <= 0) {
    res.status(400);
    throw new Error('Calculated total cost cannot be zero or negative.');
  }

  // 4. Get the Customer (from req.user set by protect middleware)
  const customer = req.user; // req.user is set by the protect middleware

  // 5. Simulate Wallet Deduction
  if (customer.walletBalance < totalCost) {
    res.status(400); // Bad Request because of insufficient funds
    throw new Error(`Insufficient wallet balance. You have Rs ${customer.walletBalance}, but need Rs ${totalCost}.`);
  }

  customer.walletBalance -= totalCost; // Deduct from wallet
  await customer.save(); // Save updated wallet balance

  // 6. Create the Booking
  const booking = new Booking({
    customer: customer._id,
    service: service._id,
    serviceDate,
    serviceTime,
    serviceDuration,
    patientDetails: {
      fullName,
      dateOfBirth,
      gender,
      contactNumber,
      address, // This object should contain street, city, state, zipCode, latitude, longitude
      medicalHistorySummary: patientDetails.medicalHistorySummary || 'No specific medical history provided.',
      currentMedications: patientDetails.currentMedications || 'No current medications.',
      allergies: patientDetails.allergies || 'No known allergies.',
      specialInstructions: patientDetails.specialInstructions || 'No special instructions.',
      emergencyContact: patientDetails.emergencyContact || {}, // Can be empty if not provided
    },
    totalCost,
    status: 'Pending', // Initial status
    paymentStatus: 'Paid', // Set to 'Paid' after successful wallet deduction
  });

  const createdBooking = await booking.save();

  // 7. Success Response with Wallet Balance Update and Custom Message
  res.status(201).json({
    message: 'Booking successfully created and amount deducted from your wallet!',
    booking: createdBooking,
    newWalletBalance: customer.walletBalance,
    receiptMessage: 'Caretaker will call you soon! Thanks for booking with SEVAK. Your receipt details are below:',
    // The "receipt" itself will be structured on the frontend using `createdBooking` data.
  });
});

// @desc    Get all bookings for the authenticated user (customer or caretaker)
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const user = req.user; // Authenticated user

  let bookings;
  if (user.role === 'customer') {
    // Populate service details for customer's bookings
    bookings = await Booking.find({ customer: user._id })
      .populate('service', 'name description price category') // Get service name/details
      .populate('caretaker', 'name email phoneNumber'); // Get caretaker name/details if assigned
  } else if (user.role === 'caretaker') {
    // Populate service and customer details for caretaker's assigned bookings
    bookings = await Booking.find({ caretaker: user._id })
      .populate('service', 'name description price category')
      .populate('customer', 'name email phoneNumber'); // Get customer name/details
  } else {
    res.status(403);
    throw new Error('Not authorized to view bookings for this role.');
  }

  res.json(bookings);
});

// @desc    Get a single booking by ID (for customer/caretaker to view details)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service', 'name description price category')
    .populate('customer', 'name email') // Only if caretaker or admin
    .populate('caretaker', 'name email'); // Only if customer or admin

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Ensure user has access to this booking
  if (
    booking.customer._id.toString() !== req.user._id.toString() && // Not the customer who booked
    (booking.caretaker && booking.caretaker._id.toString() !== req.user._id.toString()) && // Not the assigned caretaker
    req.user.role !== 'admin' // Not an admin
  ) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});


// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  // Populate all relevant fields for admin overview
  const bookings = await Booking.find({})
    .populate('customer', 'name email walletBalance') // Get customer details
    .populate('service', 'name description price category') // Get service details
    .populate('caretaker', 'name email'); // Get caretaker details if assigned

  res.json(bookings);
});

// @desc    Update booking status (Admin/Caretaker)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin, Caretaker
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, caretakerId } = req.body; // CaretakerId only relevant for admin assigning

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Authorization: Only admin can assign caretaker or change status freely
  // Caretaker can only change status to 'In Progress' or 'Completed' for their assigned bookings
  if (req.user.role === 'admin') {
    booking.status = status || booking.status;
    if (caretakerId) {
      const caretaker = await User.findById(caretakerId);
      if (caretaker && caretaker.role === 'caretaker') {
        booking.caretaker = caretakerId;
      } else {
        res.status(400);
        throw new Error('Invalid caretaker ID provided or user is not a caretaker.');
      }
    }
  } else if (req.user.role === 'caretaker') {
    // Caretakers can only update status for bookings assigned to them
    if (booking.caretaker && booking.caretaker.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this booking (not assigned to you).');
    }
    // Caretakers can only change status to 'In Progress' or 'Completed'
    if (status && (status === 'In Progress' || status === 'Completed' || status === 'Cancelled')) {
      booking.status = status;
    } else {
      res.status(403);
      throw new Error('Caretakers can only set status to "In Progress", "Completed", or "Cancelled".');
    }
  } else {
    res.status(403);
    throw new Error('Not authorized to update booking status.');
  }

  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

// @desc    Cancel a booking (Customer can cancel if Pending/Confirmed)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Only the customer who made the booking can cancel it
  if (booking.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking.');
  }

  // Only allow cancellation if status is Pending or Confirmed
  if (booking.status === 'Pending' || booking.status === 'Confirmed') {
    booking.status = 'Cancelled';
    
    // Refund wallet: Add totalCost back to customer's wallet
    const customer = await User.findById(req.user._id);
    if (customer) {
      customer.walletBalance += booking.totalCost;
      await customer.save();
      booking.paymentStatus = 'Refunded'; // Update payment status
    } else {
        console.error(`Error refunding wallet for user ${req.user._id}: User not found.`);
        // Don't throw error to client, but log it for admin
    }

    const cancelledBooking = await booking.save();
    res.json({
      message: 'Booking successfully cancelled and amount refunded to your wallet!',
      booking: cancelledBooking,
      newWalletBalance: customer ? customer.walletBalance : undefined
    });
  } else {
    res.status(400);
    throw new Error(`Booking cannot be cancelled in '${booking.status}' status.`);
  }
});


module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookingsAdmin,
  updateBookingStatus,
  cancelBooking
};