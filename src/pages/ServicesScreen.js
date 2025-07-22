import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './ServicesScreen.module.css'; // Import CSS Module

function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/services'); // SIMPLIFIED PATH
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
        console.error('Error fetching services:', err.response?.data || err.message);
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className={styles.servicesScreen}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Our Comprehensive Services</h1>
        <p className={styles.pageSubtitle}>
          Discover the wide range of compassionate healthcare assistance we provide to bring you peace of mind.
        </p>

        {loading ? (
          <div className={styles.loadingMessage}>Loading services...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : services.length === 0 ? (
          <div className={styles.noServicesMessage}>No services available at the moment. Please check back later!</div>
        ) : (
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <div key={service._id} className={styles.serviceCard}>
                <h2 className={styles.cardTitle}>{service.name}</h2>
                <p className={styles.cardCategory}>{service.category}</p>
                <p className={styles.cardDescription}>{service.description}</p>
                <div className={styles.cardPrice}>
                  Starting from: <span className={styles.priceValue}>₹{service.price}</span>
                </div>
                <Link to={`/book/${service._id}`} className={`${styles.bookNowButton} button`}>
                  Book Now &rarr;
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServicesScreen;