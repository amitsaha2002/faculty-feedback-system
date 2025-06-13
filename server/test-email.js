require('dotenv').config();
const nodemailer = require('nodemailer');

// Create test email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Log configuration
console.log('Email Configuration:', {
  hasEmailUser: !!process.env.EMAIL_USER,
  emailUserLength: process.env.EMAIL_USER ? process.env.EMAIL_USER.length : 0,
  hasEmailPass: !!process.env.EMAIL_PASS,
  emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
});

// Test email
async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email',
      text: 'If you receive this email, the email configuration is working correctly.'
    });

    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testEmail(); 