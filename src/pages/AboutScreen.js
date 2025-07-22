import React from 'react';
import styles from './AboutScreen.module.css'; // Import CSS Module

function AboutScreen() {
  return (
    <div className={styles.aboutScreen}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>About SEVAK</h1>
        <p className={styles.pageSubtitle}>
          Dedicated to providing compassionate and reliable healthcare assistance.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Our Mission</h2>
          <p className={styles.sectionText}>
            Our mission is to bridge the gap between individuals needing healthcare support and qualified, empathetic service providers across India. We strive to deliver peace of mind to families by ensuring their loved ones receive professional, timely, and respectful care, whether at home or in a hospital setting.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Our Vision</h2>
          <p className={styles.sectionText}>
            To become the leading and most trusted platform for healthcare assistance in India, recognized for our unwavering commitment to quality, transparency, and compassionate service. We envision a future where accessing professional care is seamless, affordable, and stress-free for every family.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>What We Offer</h2>
          <ul className={styles.offersList}>
            <li><span className={styles.listItemIcon}>✓</span> **Professional Caretakers:** Vetted and experienced professionals dedicated to patient well-being.</li>
            <li><span className={styles.listItemIcon}>✓</span> **Diverse Services:** From daily medical assistance and medication management to night care and post-surgery support.</li>
            <li><span className={styles.listItemIcon}>✓</span> **Ease of Booking:** A user-friendly platform for quick and hassle-free service booking.</li>
            <li><span className={styles.listItemIcon}>✓</span> **Transparency:** Clear pricing and service descriptions.</li>
            <li><span className={styles.listItemIcon}>✓</span> **Peace of Mind:** "Stay tension free as we are your SEVAK!" is our promise.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3>Compassion</h3>
              <p>Caring for others with empathy and understanding.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Integrity</h3>
              <p>Operating with honesty, transparency, and ethical conduct.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Excellence</h3>
              <p>Striving for the highest standards in all services we provide.</p>
            </div>
            <div className={styles.valueCard}>
              <h3>Reliability</h3>
              <p>Being a trustworthy and dependable partner in healthcare.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutScreen;