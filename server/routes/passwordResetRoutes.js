const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Student = require('../models/Student');

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
});

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Debug logging
    console.log('1. Received request for email:', email);
    console.log('2. Environment variables check:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS,
      emailUser: process.env.EMAIL_USER,
    });

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      console.log('3. No student found with email:', email);
      return res
        .status(404)
        .json({ message: 'No account with that email exists.' });
    }
    console.log('3. Found student:', student.email);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 10);
    console.log('4. Generated reset token');

    // Save token and expiry
    student.resetPasswordToken = hash;
    student.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await student.save();
    console.log('5. Saved token to student document');

    // Create reset URL
    const resetUrl = `http://192.168.100.108:3000/reset-password/${resetToken}`;

    // Verify SMTP connection
    try {
      await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
          if (error) {
            console.error('SMTP Verification Error:', error);
            reject(error);
          } else {
            console.log('SMTP Server is ready');
            resolve(success);
          }
        });
      });

      // Send email
      const info = await transporter.sendMail({
        from: {
          name: 'Faculty Feedback System',
          address: process.env.EMAIL_USER,
        },
        to: student.email,
        subject: 'Password Reset Request',
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });

      console.log('6. Email sent successfully:', info.response);
      res
        .status(200)
        .json({ message: 'Password reset link sent to your email.' });
    } catch (emailError) {
      console.error('6. Email send error:', emailError);

      // Cleanup the token since email failed
      student.resetPasswordToken = undefined;
      student.resetPasswordExpires = undefined;
      await student.save();

      throw emailError;
    }
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    res.status(500).json({
      message: 'Error sending password reset email.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// GET /verify-reset-token/:token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find student with non-expired token
    const student = await Student.findOne({
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Verify token
    const isValid = await bcrypt.compare(token, student.resetPasswordToken);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid reset token.' });
    }

    res.status(200).json({ message: 'Token is valid.' });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Error verifying reset token.' });
  }
});

// POST /reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find student with non-expired token
    const student = await Student.findOne({
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Verify token
    const isValid = await bcrypt.compare(token, student.resetPasswordToken);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid reset token.' });
    }

    // Update password and clear reset token fields
    student.password = password;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;
    await student.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password.' });
  }
});

module.exports = router;
