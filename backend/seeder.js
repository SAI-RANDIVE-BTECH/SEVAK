const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db'); // Import DB connection
const Service = require('./models/Service'); // Import Service model
const User = require('./models/User'); // Import User model (optional, for future user seeding)

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

// Predefined Services Data
const services = [
  {
    name: 'Hospital Companion',
    description: 'Dedicated assistance and companionship for patients during hospital stays, including emotional support, basic needs, and communication with staff.',
    price: 2500, // Example: Per day rate
    category: 'Hospital Companion',
    isActive: true,
  },
  {
    name: 'Home Patient Care (Basic)',
    description: 'Assistance with daily activities for patients at home, including bathing, dressing, meal preparation, and light housekeeping. Non-medical.',
    price: 1800, // Example: Per 8-hour shift
    category: 'Home Patient Care',
    isActive: true,
  },
  {
    name: 'Home Patient Care (Medical)',
    description: 'Skilled nursing care at home, including wound care, vital signs monitoring, injections, and medication administration by a certified nurse.',
    price: 3500, // Example: Per 8-hour shift, higher due to medical expertise
    category: 'Home Patient Care',
    isActive: true,
  },
  {
    name: 'Medication Management',
    description: 'Ensuring timely and correct administration of prescribed medications, including reminders, dosage verification, and record keeping.',
    price: 750, // Example: Per visit
    category: 'Medication Management',
    isActive: true,
  },
  {
    name: 'Night Care',
    description: 'Overnight supervision and assistance for patients needing continuous support, ensuring safety and comfort throughout the night.',
    price: 3000, // Example: Per night (10-12 hours)
    category: 'Night Care',
    isActive: true,
  },
  {
    name: 'Post-Surgery Care',
    description: 'Specialized care for patients recovering from surgery, focusing on wound management, pain control, mobility assistance, and rehabilitation support.',
    price: 4000, // Example: Per day, often part of a package
    category: 'Post-Surgery Care',
    isActive: true,
  },
  {
    name: 'Elderly Care (Companion)',
    description: 'Companionship, social engagement, and assistance with non-medical daily tasks for elderly individuals to enhance their quality of life.',
    price: 1500, // Example: Per 6-hour shift
    category: 'Elderly Care',
    isActive: true,
  },
  {
    name: 'Elderly Care (Advanced)',
    description: 'Comprehensive care for elderly individuals, including personal care, mobility assistance, medication reminders, and coordination with healthcare providers.',
    price: 2800, // Example: Per 8-hour shift, more involved
    category: 'Elderly Care',
    isActive: true,
  },
];

// Function to import data
const importData = async () => {
  try {
    await Service.deleteMany(); // Clear existing services to prevent duplicates on re-run
    // await User.deleteMany(); // Uncomment if you want to clear users too

    await Service.insertMany(services); // Insert the predefined services

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    await Service.deleteMany(); // Delete all services
    // await User.deleteMany(); // Uncomment if you want to clear users too

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Check command line arguments to determine whether to import or destroy
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}