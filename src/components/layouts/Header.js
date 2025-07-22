import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; // Import CSS Module

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link to="/" className={`${styles.logo} font-logo`}>
            SEVAK
          </Link>
          <span className={styles.tagline}>"Stay tension free as we are your SEVAK!"</span>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/services" className={styles.navLink}>Services</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/support" className={styles.navLink}>Support</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/company" className={styles.navLink}>Company</Link>
            </li>
            {/* Example: Add dynamic links for authenticated users */}
            {/* <li className={styles.navItem}>
              <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
            </li> */}
            {/* Login/Register or Logout Button */}
            <li className={styles.navItem}>
              <Link to="/auth" className={`${styles.navLink} ${styles.ctaButton}`}>Sign In / Register</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;