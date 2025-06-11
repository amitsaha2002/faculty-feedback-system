import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/adminlogin.module.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [captchaHTML, setCaptchaHTML] = useState('');
  const navigate = useNavigate();

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
  }, []);

  const handleLogin = async () => {
    if (username.length < 6) {
      alert('Username must be at least 6 characters');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    if (inputCaptcha.trim() !== captcha) {
      alert('Invalid CAPTCHA');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admindashboard');
      } else {
        alert(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Please try again later.');
    }
  };

  const validateUsername = username.length >= 6 ? 'valid' : 'error';
  const validatePassword = password.length >= 8 ? 'valid' : 'error';

  return (
    <>
      <br />
      <br />
      <br />

      <div className={styles.form} id="login-form">
        <div className={styles.formHeader}>
          <h2>Login to Your Account</h2>
          <p>Welcome! Login to Access to Your Dashboard!!</p>
        </div>

        <div className={`${styles.formInput} ${styles[validateUsername]}`}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={`${styles.formInput} ${styles[validatePassword]}`}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.captcha}>
          <label htmlFor="captcha-input">Enter Captcha</label>
          <div
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: captchaHTML }}
          ></div>
          <div className={styles.captchaForm}>
            <input
              type="text"
              id="captcha-form"
              placeholder="Enter Captcha Text"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
            />
            <button
              type="button"
              className={styles.captchaRefresh}
              onClick={generateCaptcha}
            >
              <i className="fa fa-refresh"></i>
            </button>
          </div>
        </div>

        <div className={styles.supportLinks}>
          <a href="#">
            <i>Forget Password?</i>
          </a>
          <a href="#">
            <i>Need Help? Contact Support.</i>
          </a>
        </div>

        <div className={styles.formSubmit}>
          <button id="loginBtn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
