import React, { useState } from 'react';
import styles from './ContactScreen.module.css'; // Import CSS Module

function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState(''); // 'success', 'error', 'loading', ''

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    // In a real application, you would send this data to a backend API endpoint
    // For this demo, we'll simulate a submission.
    console.log({ name, email, subject, message });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // Simulate success or error
      const isSuccess = Math.random() > 0.3; // 70% chance of success for demo

      if (isSuccess) {
        setFormStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        console.log('Contact form submitted successfully!');
      } else {
        throw new Error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      setFormStatus('error');
      console.error('Contact form submission failed:', error.message);
    } finally {
      // Clear status message after some time
      setTimeout(() => setFormStatus(''), 5000);
    }
  };

  return (
    <div className={styles.contactScreen}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Contact Us</h1>
        <p className={styles.pageSubtitle}>
          Have questions or need assistance? Reach out to us, and we'll be happy to help!
        </p>

        <section className={styles.contactInfoSection}>
          <div className={styles.infoCard}>
            <div className={styles.iconPlaceholder}>📞</div>
            <h3>Phone Support</h3>
            <p>+91 123 456 7890</p>
            <p className={styles.smallText}>Available 9 AM - 6 PM IST, Mon-Sat</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.iconPlaceholder}>📧</div>
            <h3>Email Us</h3>
            <p>info@sevak.com</p>
            <p className={styles.smallText}>We aim to respond within 24 hours</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.iconPlaceholder}>📍</div>
            <h3>Our Office</h3>
            <p>SEVAK Healthcare Services</p>
            <p>123 Health Lane, Harmony City,</p>
            <p>Maharashtra, India - 411001</p>
          </div>
        </section>

        <section className={styles.contactFormSection}>
          <h2 className={styles.sectionHeading}>Send Us a Message</h2>
          <form onSubmit={handleSubmit} className={styles.contactForm}>
            {formStatus === 'loading' && <div className={styles.loadingMessage}>Sending message...</div>}
            {formStatus === 'success' && <div className={styles.successMessage}>Your message has been sent successfully! We will get back to you shortly.</div>}
            {formStatus === 'error' && <div className={styles.errorMessage}>Failed to send message. Please try again.</div>}

            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                placeholder="Subject of your inquiry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                rows="6"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className={`${styles.submitButton} button`} disabled={formStatus === 'loading'}>
              {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ContactScreen;