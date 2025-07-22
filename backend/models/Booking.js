const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User who made the booking (customer)
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Service', // Reference to the Service being booked
    },
    caretaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who is the caretaker (optional, assigned later)
      default: null, // Initially null, assigned by admin or through matching
    },
    // Patient Details Form Fields
    patientDetails: {
      fullName: {
        type: String,
        required: [true, 'Patient full name is required'],
        trim: true,
      },
      dateOfBirth: {
        type: Date,
        required: [true, 'Patient date of birth is required'],
      },
      gender: {
        type: String,
        required: [true, 'Patient gender is required'],
        enum: ['Male', 'Female', 'Other'],
      },
      contactNumber: {
        type: String,
        required: [true, 'Patient contact number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number'], // Basic 10-digit phone number validation
      },
      address: {
        street: { type: String, required: [true, 'Street address is required'], trim: true },
        city: { type: String, required: [true, 'City is required'], trim: true },
        state: { type: String, required: [true, 'State is required'], trim: true },
        zipCode: { type: String, required: [true, 'Zip code is required'], trim: true },
        // Coordinates for map integration (from Nominatim)
        latitude: { type: Number },
        longitude: { type: Number },
      },
      medicalHistorySummary: { // A brief summary of relevant medical history
        type: String,
        trim: true,
        default: 'No specific medical history provided.',
      },
      currentMedications: { // List of current medications
        type: String,
        trim: true,
        default: 'No current medications.',
      },
      allergies: { // Any known allergies
        type: String,
        trim: true,
        default: 'No known allergies.',
      },
      specialInstructions: { // Any other specific care instructions
        type: String,
        trim: true,
        default: 'No special instructions.',
      },
      // Emergency Contact
      emergencyContact: {
        name: { type: String, trim: true },
        relationship: { type: String, trim: true },
        phone: { type: String, match: [/^\d{10}$/, 'Please enter a valid 10-digit emergency contact number'] },
      },
    },
    // Service Specifics
    serviceDate: {
      type: Date,
      required: [true, 'Service date is required'],
    },
    serviceTime: { // Storing time as a string for simplicity (e.g., "09:00 AM", "14:30")
      type: String,
      required: [true, 'Service time is required'],
      trim: true,
    },
    serviceDuration: { // e.g., in hours or number of visits
      type: Number,
      required: [true, 'Service duration is required'],
      min: [1, 'Duration must be at least 1 unit'],
    },
    totalCost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost cannot be negative'],
    },
    // Booking Status
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending', // Will be 'Paid' after successful wallet deduction
    },
    // Optional: Payment transaction ID if we integrate with a real gateway later
    // transactionId: { type: String },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;