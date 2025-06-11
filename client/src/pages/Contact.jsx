import React from 'react';
import styles from '../styles/contact.module.css';

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! Our team will contact you soon.');
  };

  return (
    <>
      <br />
      <br />
      <br />
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <h2 style={{ textAlign: 'center' }}>Contact Us</h2>
          <h5 style={{ textAlign: 'center' }}>
            Got a question? We'd love to hear from you
          </h5>
          <form onSubmit={handleSubmit}>
            <br />
            <label>What can we help you with?</label>
            <br />
            <input
              type="text"
              placeholder="required field"
              className={`${styles.wideInput} ${styles.inputHover}`}
              required
            />
            <br />
            <br />
            <label>Name:</label>
            <br />
            <input
              type="text"
              className={`${styles.wideInput} ${styles.inputHover}`}
            />
            <br />
            <br />
            <label>Email:</label>
            <br />
            <input
              type="email"
              placeholder="required field"
              className={`${styles.wideInput} ${styles.inputHover}`}
              required
            />
            <br />
            <br />
            <label>Message:</label>
            <br />
            <textarea
              rows="4"
              cols="40"
              placeholder="required field"
              className={styles.inputHover}
              required
            ></textarea>
            <br />
            <br />
            <input type="submit" value="Submit" className={styles.submitBtn} />
          </form>
        </div>

        <div className={styles.rightSection}>
          <br />
          <h2 style={{ textAlign: 'center' }}>GET IN TOUCH WITH US</h2>
          <br />
          <br />
          <p style={{ textAlign: 'justify' }}>
            Have a question? We are here to help you. Feel free to reach us over
            phone, email or the form. Support is available Monday to Friday, 9
            AM - 5 PM (excluding holidays)
            <br />
            <br />
            <br />
            <h4>
              Phone No: +911234567890
              <br />
              General Inquiries: generalinquiries@institution.edu
              <br />
              Technical Support: techsupport@institution.edu
              <br />
              Feedback or Suggestions: feedback@institution.edu
            </h4>
          </p>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
