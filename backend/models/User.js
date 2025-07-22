const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true, // Removes whitespace from both ends of a string
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // Ensures email is unique in the database
      trim: true,
      lowercase: true, // Store emails in lowercase for consistent lookup
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email address',
      ], // Basic email validation regex
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['customer', 'caretaker', 'admin'], // Predefined roles
      default: 'customer', // Default role for new signups
    },
    walletBalance: {
      type: Number,
      default: 1000, // Initial wallet balance for new users upon signup (Rs 1000)
      min: 0, // Wallet balance cannot go below zero
    },
    // Add other user-specific fields as needed, e.g.,
    // phoneNumber: { type: String },
    // address: { type: String },
    // city: { type: String },
    // state: { type: String },
    // country: { type: String, default: 'India' },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    next();
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10); // 10 is the number of rounds for hashing, more rounds = more secure but slower
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;