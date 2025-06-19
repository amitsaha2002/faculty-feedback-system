import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/studentlogin.module.css';

const API_URL = process.env.REACT_APP_API;

const Student = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [captchaHTML, setCaptchaHTML] = useState('');
  const [message, setMessage] = useState('');

  const fonts = ['cursive', 'sans-serif', 'serif', 'monospace'];

  const generateCaptcha = () => {
    let value = btoa(Math.random() * 1000000000);
    value = value.substr(0, 5 + Math.random() * 5);
    setCaptcha(value);
    let html = value
      .split('')
      .map((char) => {
        const rotate = -20 + Math.trunc(Math.random() * 40);
        const font = Math.trunc(Math.random() * fonts.length);
        return `<span style="display: inline-block; transform: rotate(${rotate}deg); font-family: ${fonts[font]};">${char}</span>`;
      })
      .join('');
    setCaptchaHTML(html);
  };

  useEffect(() => {
    generateCaptcha();
    // Clear any stored auth data on component mount
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset error and message
    setError('');
    setMessage('');

    if (inputCaptcha.trim() !== captcha) {
      setError('Invalid CAPTCHA');
      generateCaptcha();
      return;
    }

    if (!username || !password) {
      setError('Please provide both username and password');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/student-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token and student info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('studentId', data.student.id);
      localStorage.setItem('studentName', data.student.name);
      localStorage.setItem('studentBranch', data.student.branch);

      setMessage('Login successful! Redirecting...');

      // Redirect to faculty details page after a short delay
      setTimeout(() => {
        navigate('/facultydetails');
      }, 1500);
    } catch (err) {
      setError(err.message);
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <br />
      <br />
      <br />
      <div className={styles.form} id="login-form">
        <div className={styles.formHeader}>
          <h2>Student Login</h2>
          <p>Welcome! Login to Give Feedback</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Email</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>CAPTCHA</label>
            <div
              className={styles.captcha}
              dangerouslySetInnerHTML={{ __html: captchaHTML }}
            />
            <input
              type="text"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
              placeholder="Enter CAPTCHA"
              required
              disabled={loading}
            />
            <button
              type="button"
              className={styles.refreshBtn}
              onClick={generateCaptcha}
              disabled={loading}
            >
              Refresh CAPTCHA
            </button>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Student;
