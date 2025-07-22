import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LoginRegisterScreen.module.css'; // Import CSS Module

function LoginRegisterScreen() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages

  const navigate = useNavigate();

  // Basic check if user is already logged in (can be refined with actual global state later)
  useEffect(() => {
    // For now, if we have a success message or error, clear it after some time
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Clear form fields and messages when switching forms
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setMessage(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // IMPORTANT: Allows cookies to be sent with requests (handled by proxy)
    };

    try {
      if (isLogin) {
        // Login Logic
        const { data } = await axios.post(
          '/api/auth/login', // SIMPLIFIED PATH
          { email, password },
          config
        );
        setMessage(data.message || 'Login Successful!');
        console.log('Logged in user:', data);
        navigate('/dashboard'); // Redirect to dashboard on successful login

      } else {
        // Register Logic
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { data } = await axios.post(
          '/api/auth/register', // SIMPLIFIED PATH
          { name, email, password },
          config
        );
        setMessage(data.message || 'Registration Successful! Please log in.');
        console.log('Registered user:', data);
        setIsLogin(true); // Switch to login form after successful registration

      }
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      console.error('Authentication error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginRegisterScreen}>
      <div className={styles.formContainer}>
        {/* Animated tab for switching between forms */}
        <div className={styles.formToggle}>
          <button
            className={`${styles.toggleButton} ${isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`${styles.toggleButton} ${!isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
          <div className={`${styles.toggleBackground} ${isLogin ? styles.toggleLogin : styles.toggleRegister}`}></div>
        </div>

        <form onSubmit={submitHandler} className={styles.form}>
          <h2>{isLogin ? 'Sign In' : 'Register'}</h2>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {message && <div className={styles.successMessage}>{message}</div>}
          {loading && <div className={styles.loadingMessage}>Loading...</div>}

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          {isLogin && (
            <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
          )}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {isLogin ? 'Sign In' : 'Register'} <span className={styles.arrow}>&rarr;</span>
          </button>

          {/* Social Login/Register Icons (Placeholder) */}
          <div className={styles.socialLogin}>
            <p>Or {isLogin ? 'Sign In' : 'Register'} with</p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}><i className="fab fa-google"></i></a>
              <a href="#" className={styles.socialIcon}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className={styles.socialIcon}><i className="fab fa-twitter"></i></a>
              <a href="#" className={styles.socialIcon}><i className="fab fa-github"></i></a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginRegisterScreen;