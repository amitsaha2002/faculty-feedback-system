require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const facultyRoutes = require('./routes/facultyRoutes');
const studentRoutes = require('./routes/studentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const studentAuthRoutes = require('./routes/studentAuthRoutes');

// Express app
const app = express();

// Set JWT_SECRET if not in environment
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_super_secret_jwt_key_2024';
}

// Middleware
app.use(cors());
app.use(express.json());

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({ success: true, token: 'dummy-admin-token' });
  } else {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid credentials' });
  }
});

// Routes
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/student-auth', studentAuthRoutes);

// MongoDB connection
console.log('Attempting to connect to MongoDB...');
mongoose
  .connect(
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/faculty-feedback'
  )
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // Listen for requests
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process on connection failure
  });
