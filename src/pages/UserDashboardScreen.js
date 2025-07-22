import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './UserDashboardScreen.module.css'; // Import CSS Module

function UserDashboardScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'profile' or 'wallet'

  // Fetch User Profile and Bookings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user profile (assuming an endpoint like /api/users/profile or /api/auth/profile)
        // For simplicity now, we'll assume '/api/auth/profile' exists or get user from context
        const userProfileRes = await axios.get('/api/auth/profile', { withCredentials: true }); // SIMPLIFIED PATH
        setUser(userProfileRes.data);

        // Fetch user's bookings
        const bookingsRes = await axios.get('/api/bookings/my', { withCredentials: true }); // SIMPLIFIED PATH
        setBookings(bookingsRes.data);

        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
        // If unauthorized, redirect to login (common for private routes)
        if (err.response && err.response.status === 401) {
          navigate('/auth');
        }
        console.error('Error fetching dashboard data:', err.response?.data || err.message);
      }
    };

    fetchUserData();
  }, [navigate]); // navigate in dependency array as good practice

  // Function to format date/time for display
  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return `${date.toLocaleDateString(undefined, options)} at ${timeString}`;
  };

  // Function to handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setLoading(true); // Re-use loading for cancellation
      setError(null);
      try {
        const { data } = await axios.put(
          `/api/bookings/${bookingId}/cancel`, // SIMPLIFIED PATH
          {}, // No body needed for cancel
          { withCredentials: true }
        );
        alert(data.message); // Show success message
        // Update local state to reflect cancellation and new wallet balance
        setUser(prevUser => ({ ...prevUser, walletBalance: data.newWalletBalance }));
        setBookings(prevBookings => 
          prevBookings.map(b => b._id === bookingId ? { ...b, status: 'Cancelled', paymentStatus: 'Refunded' } : b)
        );
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
        console.error('Error cancelling booking:', err.response?.data || err.message);
      }
    }
  };


  if (loading) {
    return <div className={styles.loadingMessage}>Loading your dashboard...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}. Please <Link to="/auth">login</Link> again.</div>;
  }

  if (!user) {
    return <div className={styles.noUserMessage}>No user data found.</div>;
  }

  return (
    <div className={styles.dashboardScreen}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Welcome, {user.name}!</h1>
        <p className={styles.pageSubtitle}>Your personal hub for SEVAK services.</p>

        {/* Dashboard Navigation Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'bookings' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({bookings.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'wallet' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            My Wallet
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'profile' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'bookings' && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>Your Bookings</h2>
              {bookings.length === 0 ? (
                <div className={styles.noBookingsMessage}>You have no bookings yet. <Link to="/services">Book a service!</Link></div>
              ) : (
                <div className={styles.bookingList}>
                  {bookings.map((booking) => (
                    <div key={booking._id} className={styles.bookingCard}>
                      <div className={styles.cardHeader}>
                        <h3>{booking.service.name}</h3>
                        <span className={`${styles.statusBadge} ${styles[booking.status.toLowerCase()]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p><strong>Patient:</strong> {booking.patientDetails.fullName}</p>
                      <p><strong>Date & Time:</strong> {formatDateTime(booking.serviceDate, booking.serviceTime)}</p>
                      <p><strong>Location:</strong> {booking.patientDetails.address.street}, {booking.patientDetails.address.city}</p>
                      <p><strong>Total Cost:</strong> ₹{booking.totalCost.toFixed(2)}</p>
                      <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                      {booking.caretaker && (
                        <p><strong>Assigned Caretaker:</strong> {booking.caretaker.name}</p>
                      )}
                      <div className={styles.cardActions}>
                        <Link to={`/booking/${booking._id}`} className={`${styles.viewDetailsButton} button-small`}>
                          View Details
                        </Link>
                        {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                          <button onClick={() => handleCancelBooking(booking._id)} className={`${styles.cancelButton} button-small`}>
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'wallet' && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>My Wallet</h2>
              <div className={styles.walletInfo}>
                <p>Current Balance:</p>
                <p className={styles.walletBalanceValue}>₹{user.walletBalance.toFixed(2)}</p>
                <p className={styles.walletNote}>Initial Rs 1000 provided on signup. All bookings are deducted from this balance. Cancellations are refunded here.</p>
                {/* Future: Add "Add Funds" button here */}
              </div>
            </section>
          )}

          {activeTab === 'profile' && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>My Profile</h2>
              <div className={styles.profileInfo}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> <span className={styles.userRole}>{user.role}</span></p>
                <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                {/* Future: Add "Edit Profile" button here */}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboardScreen;