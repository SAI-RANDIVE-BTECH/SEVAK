import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css'; // Import CSS Module

function Footer() {
  // Using 2025 as the current year for the copyright notice, based on current context
  const currentYear = 2025; 

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerSection}>
          <Link to="/" className={`${styles.footerLogo} font-logo`}>SEVAK</Link>
          <p className={styles.tagline}>"Your trusted partner in healthcare assistance."</p>
          <p className={styles.copyright}>&copy; {currentYear} SEVAK. All rights reserved. | Licensed Healthcare Provider</p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionHeading}>Services</h4>
          <ul className={styles.footerLinks}>
            <li><Link to="/services" className={styles.link}>Hospital Companion</Link></li>
            <li><Link to="/services" className={styles.link}>Home Patient Care</Link></li>
            <li><Link to="/services" className={styles.link}>Medication Management</Link></li>
            <li><Link to="/services" className={styles.link}>Night Care</Link></li>
            <li><Link to="/services" className={styles.link}>Post-Surgery Care</Link></li>
            <li><Link to="/services" className={styles.link}>Elderly Care</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionHeading}>Support</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/contact" className={styles.link}>Help Center</a></li> {/* Changed to <a> as Contact is now a React Component */}
            <li><Link to="/contact" className={styles.link}>Contact Us</Link></li>
            <li><a href="#" className={styles.link}>Emergency Support</a></li>
            <li><a href="#" className={styles.link}>FAQ</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionHeading}>Company</h4>
          <ul className={styles.footerLinks}>
            <li><Link to="/about" className={styles.link}>About SEVAK</Link></li>
            <li><a href="#" className={styles.link}>Careers</a></li>
            <li><a href="#" className={styles.link}>Become a Partner</a></li>
            <li><a href="#" className={styles.link}>Blog</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionHeading}>Legal</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/privacy-policy.html" className={styles.link}>Privacy Policy</a></li>
            <li><a href="/terms-of-service.html" className={styles.link}>Terms of Service</a></li>
            <li><a href="/medical-disclaimer.html" className={styles.link}>Medical Disclaimer</a></li>
            <li><a href="/licensing.html" className={styles.link}>Licensing</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionHeading}>Connect With Us</h4>
          {/* Placeholder for Social Media Icons */}
          <div className={styles.socialIcons}>
            {/* You'll need to include Font Awesome CDN in public/index.html for these to display */}
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <p className={styles.contactInfo}>Email: info@sevak.com</p>
          <p className={styles.contactInfo}>Phone: +91 123 456 7890</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;