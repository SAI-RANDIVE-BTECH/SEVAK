const mongoose = require('mongoose');
const colors = require('colors'); // For colorful console output

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Deprecated, but good practice to include for older versions/clarity
      useUnifiedTopology: true // Recommended for new deployments
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;