import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeScreen.module.css'; // Import CSS Module

function HomeScreen() {
  return (
    <div className={styles.homeScreen}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={`${styles.heroTitle} font-logo`}>
            Your Health, Our Priority.
          </h1>
          <p className={styles.heroSubtitle}>
            Reliable and Compassionate Healthcare Assistance, Right at Your Doorstep.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/services" className={`${styles.heroCtaButton} button`}>
              Explore Services
            </Link>
            <Link to="/contact" className={`${styles.heroContactButton} button-outline`}>
              Contact Us
            </Link>
          </div>
        </div>
        {/* Placeholder for 3D element / illustration */}
        <div className={styles.heroIllustration}>
          {/* This is where your conceptual 3D element or stylized illustration would go */}
          {/* For now, a simple placeholder or a relevant image */}
          <img src="/images/hero-illustration.png" alt="Healthcare Assistance" className={styles.illustrationImage}/>
        </div>
      </section>

      {/* About SEVAK Section */}
      <section className={styles.aboutSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>About SEVAK</h2>
          <p className={styles.sectionText}>
            SEVAK is a dedicated web application connecting individuals in need of healthcare assistance in India with qualified and compassionate service providers. From daily medical works like bathing and medication management to night care in hospitals and post-surgery support, we ensure you stay tension-free, as we are your SEVAK!
          </p>
          <Link to="/about" className={`${styles.learnMoreButton} button-secondary`}>
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Services Highlights Section */}
      <section className={styles.servicesHighlightSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Our Core Services</h2>
          <div className={styles.serviceCards}>
            {/* Example Service Card 1 */}
            <div className={styles.serviceCard}>
              <div className={styles.iconPlaceholder}>🏥</div> {/* Replace with actual icons */}
              <h3 className={styles.cardTitle}>Hospital Companion</h3>
              <p className={styles.cardDescription}>Support and companionship during hospital stays.</p>
              <Link to="/services" className={styles.cardLink}>View Details &rarr;</Link>
            </div>
            {/* Example Service Card 2 */}
            <div className={styles.serviceCard}>
              <div className={styles.iconPlaceholder}>🏡</div>
              <h3 className={styles.cardTitle}>Home Patient Care</h3>
              <p className={styles.cardDescription}>Professional medical and non-medical care at home.</p>
              <Link to="/services" className={styles.cardLink}>View Details &rarr;</Link>
            </div>
            {/* Example Service Card 3 */}
            <div className={styles.serviceCard}>
              <div className={styles.iconPlaceholder}>💊</div>
              <h3 className={styles.cardTitle}>Medication Management</h3>
              <p className={styles.cardDescription}>Ensuring timely and correct medication administration.</p>
              <Link to="/services" className={styles.cardLink}>View Details &rarr;</Link>
            </div>
          </div>
          <div className={styles.viewAllServices}>
            <Link to="/services" className={`${styles.viewAllButton} button`}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action / Trust Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionHeading}>Ready to Experience Peace of Mind?</h2>
          <p className={styles.sectionText}>
            Join the SEVAK family and let us take care of your loved ones with the compassion and professionalism they deserve.
          </p>
          <Link to="/auth" className={`${styles.ctaSignInButton} button`}>
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomeScreen;