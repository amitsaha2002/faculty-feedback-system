import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer_info">
        {/* About */}
        <div className="footer_width about">
          <h2>About</h2>
          <p>
            Welcome to <b style={{ color: 'aqua' }}>Faculty Feedback System</b>,
            a platform to enhance education through constructive feedback.
          </p>
        </div>
        {/* Links */}
        <div className="footer_width link">
          <h2>Quick Links</h2>
          <ul>
            <li>
              <a href="/">HOME</a>
            </li>
            <li>
              <a href="/admin">ADMIN</a>
            </li>
            <li>
              <a href="/faculty">FACULTY</a>
            </li>
            <li>
              <a href="/student">STUDENT</a>
            </li>
            <li>
              <a href="/contact">CONTACT US</a>
            </li>
          </ul>
        </div>
        {/* Contact */}
        <div className="footer_width Contact">
          <h2>Contact</h2>
          <ul>
            <li>
              <span>
                <i className="fa-regular fa-envelope"></i>
              </span>
              <a href="#">facultyfeedback@gmail.com</a>
            </li>
            <li>
              <span>
                <i className="fa-solid fa-phone"></i>
              </span>
              <a href="#">000 000 0000</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="copy-right">
        <p>&copy; Copyright 2024 | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
