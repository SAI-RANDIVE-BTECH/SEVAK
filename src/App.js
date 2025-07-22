import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async'; // For managing document head (titles etc.) - optional

// Import shared components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Import pages
import HomeScreen from './pages/HomeScreen';
import LoginRegisterScreen from './pages/LoginRegisterScreen'; // Combines Login & Register for Glassmorphism effect
import ServicesScreen from './pages/ServicesScreen';
import UserDashboardScreen from './pages/UserDashboardScreen';
import BookingScreen from './pages/BookingScreen';
import ContactScreen from './pages/ContactScreen';
import AboutScreen from './pages/AboutScreen';
// import NotFoundScreen from './pages/NotFoundScreen'; // For 404 pages - optional

function App() {
  return (
    // <HelmetProvider> {/* Optional: Wrapper for Helmet */}
      <Router>
        <div className="app-container">
          <Header /> {/* Your main application header */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomeScreen />} />
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/contact" element={<ContactScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/auth" element={<LoginRegisterScreen />} /> {/* Login/Register combined */}

              {/* Private Routes (Will require authentication logic implemented later) */}
              <Route path="/dashboard" element={<UserDashboardScreen />} />
              <Route path="/book/:serviceId" element={<BookingScreen />} /> {/* Dynamic route for booking a specific service */}
              
              {/* Example Admin Routes (will need role-based protection) */}
              {/* <Route path="/admin/services" element={<AdminServiceListScreen />} /> */}
              {/* <Route path="/admin/bookings" element={<AdminBookingListScreen />} /> */}

              {/* Catch-all for 404 - optional */}
              {/* <Route path="*" element={<NotFoundScreen />} /> */}
            </Routes>
          </main>
          <Footer /> {/* Your main application footer */}
        </div>
      </Router>
    // </HelmetProvider>
  );
}

export default App;