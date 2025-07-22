import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './BookingScreen.module.css'; // Import CSS Module

function BookingScreen() {
  const { serviceId } = useParams(); // Get serviceId from URL parameters
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [errorService, setErrorService] = useState(null);

  // Form states for patient details
  const [patientFullName, setPatientFullName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [latitude, setLatitude] = useState(''); // Will be populated by geocoding
  const [longitude, setLongitude] = useState(''); // Will be populated by geocoding
  const [medicalHistorySummary, setMedicalHistorySummary] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Service specific states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceDuration, setServiceDuration] = useState(''); // E.g., number of hours/visits

  // Booking process states
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [errorBooking, setErrorBooking] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null); // Stores booking receipt details
  const [showReceipt, setShowReceipt] = useState(false); // Controls receipt popup visibility

  // 1. Fetch Service Details on component mount
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoadingService(true);
        const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/services/${serviceId}`);
        setService(data);
        setLoadingService(false);
      } catch (err) {
        setErrorService(err.response && err.response.data.message ? err.response.data.message : 'Error fetching service details.');
        setLoadingService(false);
        console.error('Error fetching service details:', err.response?.data || err.message);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    } else {
      setErrorService('No service ID provided.');
      setLoadingService(false);
    }
  }, [serviceId]); // Re-fetch if serviceId changes

  // 2. Handle Geocoding (Conceptual for now, real implementation would involve Nominatim API call)
  const handleAddressChange = (e, field) => {
    // This is where you'd typically trigger a Nominatim API call
    // or use an auto-suggest library that integrates with geocoding.
    // For this demo, we'll just update the state.
    const value = e.target.value;
    switch (field) {
      case 'street': setStreetAddress(value); break;
      case 'city': setCity(value); break;
      case 'state': setState(value); break;
      case 'zipCode': setZipCode(value); break;
      default: break;
    }
    // In a real application, after changing address fields,
    // you would debounce a call to Nominatim like this:
    /*
    if (streetAddress && city && state && zipCode) {
        // Debounce this call to avoid too many requests
        setTimeout(async () => {
            try {
                const query = `${streetAddress}, ${city}, ${state}, ${zipCode}, India`;
                const nominatimResponse = await axios.get(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
                    { headers: { 'User-Agent': 'SEVAK-WebApp/1.0' } } // Important for Nominatim policy
                );
                if (nominatimResponse.data && nominatimResponse.data.length > 0) {
                    setLatitude(nominatimResponse.data[0].lat);
                    setLongitude(nominatimResponse.data[0].lon);
                } else {
                    console.warn('Address not found by Nominatim, lat/lon not set.');
                    setLatitude('');
                    setLongitude('');
                }
            } catch (geoError) {
                console.error('Geocoding error:', geoError);
                setLatitude('');
                setLongitude('');
            }
        }, 1000); // Debounce by 1 second
    }
    */
  };


  // 3. Handle Booking Submission
  const submitBookingHandler = async (e) => {
    e.preventDefault();
    setLoadingBooking(true);
    setErrorBooking(null);
    setBookingConfirmation(null);

    // Basic client-side form validation (more comprehensive validation is on backend)
    if (!patientFullName || !patientDob || !patientGender || !patientContact ||
        !streetAddress || !city || !state || !zipCode || !selectedDate || !selectedTime || !serviceDuration) {
      setErrorBooking('Please fill in all required fields for patient details and service schedule.');
      setLoadingBooking(false);
      return;
    }

    // Prepare data for backend
    const bookingData = {
      serviceId: service._id,
      serviceDate: selectedDate,
      serviceTime: selectedTime,
      serviceDuration: parseInt(serviceDuration), // Ensure it's a number
      patientDetails: {
        fullName: patientFullName,
        dateOfBirth: patientDob,
        gender: patientGender,
        contactNumber: patientContact,
        address: {
          street: streetAddress,
          city: city,
          state: state,
          zipCode: zipCode,
          latitude: parseFloat(latitude) || null, // Ensure number, or null
          longitude: parseFloat(longitude) || null, // Ensure number, or null
        },
        medicalHistorySummary: medicalHistorySummary,
        currentMedications: currentMedications,
        allergies: allergies,
        specialInstructions: specialInstructions,
        emergencyContact: {
          name: emergencyContactName,
          relationship: emergencyContactRelationship,
          phone: emergencyContactPhone,
        },
      },
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/bookings`,
        bookingData,
        config
      );
      setBookingConfirmation(data); // Store the entire response for receipt
      setShowReceipt(true); // Show the receipt popup
      // No navigation here, user will interact with receipt popup first
      setLoadingBooking(false);

    } catch (err) {
      setErrorBooking(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingBooking(false);
      console.error('Booking error:', err.response?.data || err.message);
    }
  };

  // 4. Receipt Popup Management
  const closeReceipt = () => {
    setShowReceipt(false);
    navigate('/dashboard'); // Redirect to dashboard after closing receipt
  };

  if (loadingService) {
    return <div className={styles.loadingMessage}>Loading service details...</div>;
  }

  if (errorService) {
    return <div className={styles.errorMessage}>{errorService}. Please go back to <Link to="/services">Services</Link>.</div>;
  }

  if (!service) {
    return <div className={styles.noServiceFound}>Service not found.</div>;
  }

  return (
    <div className={styles.bookingScreen}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Book: {service.name}</h1>
        <p className={styles.pageSubtitle}>Price: ₹{service.price} per {service.category.includes('Care') ? 'day/visit' : 'unit'}</p> {/* Adjust unit display based on category */}

        <form onSubmit={submitBookingHandler} className={styles.bookingForm}>
          {/* Messages */}
          {errorBooking && <div className={styles.errorMessage}>{errorBooking}</div>}
          {loadingBooking && <div className={styles.loadingMessage}>Processing your booking...</div>}

          {/* Section 1: Patient Details */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionHeading}>Patient Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="patientFullName">Full Name</label>
              <input
                type="text"
                id="patientFullName"
                placeholder="Patient's full name"
                value={patientFullName}
                onChange={(e) => setPatientFullName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="patientDob">Date of Birth</label>
                <input
                  type="date"
                  id="patientDob"
                  value={patientDob}
                  onChange={(e) => setPatientDob(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="patientGender">Gender</label>
                <select
                  id="patientGender"
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="patientContact">Contact Number</label>
              <input
                type="tel" // Use tel for phone numbers
                id="patientContact"
                placeholder="e.g., 9876543210"
                value={patientContact}
                onChange={(e) => setPatientContact(e.target.value)}
                pattern="[0-9]{10}" // Basic 10-digit validation
                title="Please enter a 10-digit phone number"
                required
              />
            </div>
          </section>

          {/* Section 2: Service Location */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionHeading}>Service Location</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="streetAddress">Street Address</label>
                <input
                  type="text"
                  id="streetAddress"
                  placeholder="House No., Street Name, Area"
                  value={streetAddress}
                  onChange={(e) => handleAddressChange(e, 'street')}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => handleAddressChange(e, 'city')}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  placeholder="State"
                  value={state}
                  onChange={(e) => handleAddressChange(e, 'state')}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  placeholder="e.g., 123456"
                  value={zipCode}
                  onChange={(e) => handleAddressChange(e, 'zipCode')}
                  pattern="[0-9]{6}" // Basic 6-digit validation for Indian pin codes
                  title="Please enter a 6-digit zip code"
                  required
                />
              </div>
              {/* These are conceptual for now, populated by Nominatim in a full implementation */}
              {/* <div className={styles.formGroup}>
                <label htmlFor="latitude">Latitude (Auto-filled)</label>
                <input type="text" id="latitude" value={latitude} readOnly disabled />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="longitude">Longitude (Auto-filled)</label>
                <input type="text" id="longitude" value={longitude} readOnly disabled />
              </div> */}
            </div>
          </section>

          {/* Section 3: Service Schedule */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionHeading}>Service Schedule</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="selectedDate">Preferred Date</label>
                <input
                  type="date"
                  id="selectedDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Cannot select past dates
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="selectedTime">Preferred Time</label>
                <input
                  type="time"
                  id="selectedTime"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="serviceDuration">Duration (Units/Hours)</label>
                <input
                  type="number"
                  id="serviceDuration"
                  placeholder="e.g., 1 for a visit, 8 for hours"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 4: Medical Details & Instructions */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionHeading}>Additional Medical Details</h2>
            <div className={styles.formGroup}>
              <label htmlFor="medicalHistorySummary">Medical History Summary</label>
              <textarea
                id="medicalHistorySummary"
                rows="3"
                placeholder="Brief summary of relevant medical conditions..."
                value={medicalHistorySummary}
                onChange={(e) => setMedicalHistorySummary(e.target.value)}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="currentMedications">Current Medications</label>
              <textarea
                id="currentMedications"
                rows="2"
                placeholder="List all current medications and dosages..."
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="allergies">Allergies</label>
              <textarea
                id="allergies"
                rows="2"
                placeholder="Any known allergies (medications, food, etc.)..."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="specialInstructions">Special Instructions for Caretaker</label>
              <textarea
                id="specialInstructions"
                rows="3"
                placeholder="Any specific care preferences or instructions..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              ></textarea>
            </div>
          </section>

          {/* Section 5: Emergency Contact */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionHeading}>Emergency Contact</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="emergencyContactName">Name</label>
                <input
                  type="text"
                  id="emergencyContactName"
                  placeholder="Emergency contact's name"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="emergencyContactRelationship">Relationship</label>
                <input
                  type="text"
                  id="emergencyContactRelationship"
                  placeholder="e.g., Son, Daughter, Spouse"
                  value={emergencyContactRelationship}
                  onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="emergencyContactPhone">Phone Number</label>
                <input
                  type="tel"
                  id="emergencyContactPhone"
                  placeholder="e.g., 9876543210"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit phone number"
                />
              </div>
            </div>
          </section>

          <button type="submit" className={`${styles.submitBookingButton} button`} disabled={loadingBooking}>
            {loadingBooking ? 'Booking...' : `Confirm Booking - Pay ₹${(service ? service.price * serviceDuration : 0).toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* Booking Confirmation/Receipt Popup */}
      {showReceipt && bookingConfirmation && (
        <div className={styles.receiptOverlay}>
          <div className={styles.receiptPopup}>
            <button className={styles.closeButton} onClick={closeReceipt}>&times;</button>
            <h2 className={styles.receiptTitle}>Booking Confirmed!</h2>
            <p className={styles.receiptMessage}>{bookingConfirmation.receiptMessage}</p>
            
            <div className={styles.receiptDetails}>
              <h3>Your Receipt & Booking Details</h3>
              <p><strong>Booking ID:</strong> {bookingConfirmation.booking._id}</p>
              <p><strong>Service:</strong> {service.name}</p>
              <p><strong>Patient:</strong> {bookingConfirmation.booking.patientDetails.fullName}</p>
              <p><strong>Scheduled For:</strong> {new Date(bookingConfirmation.booking.serviceDate).toLocaleDateString()} at {bookingConfirmation.booking.serviceTime}</p>
              <p><strong>Total Cost:</strong> ₹{bookingConfirmation.booking.totalCost.toFixed(2)}</p>
              <p><strong>Payment Status:</strong> {bookingConfirmation.booking.paymentStatus}</p>
              <p className={styles.walletBalance}>
                <strong>New Wallet Balance:</strong> ₹{bookingConfirmation.newWalletBalance.toFixed(2)}
              </p>
            </div>
            
            <div className={styles.receiptFooter}>
              <p>Thank you for choosing SEVAK!</p>
              <Link to="/dashboard" onClick={closeReceipt} className={`${styles.viewDashboardButton} button`}>
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingScreen;