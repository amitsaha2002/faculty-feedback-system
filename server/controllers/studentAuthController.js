const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Login student
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if username and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Please provide username and password' });
    }

    // Find student by username
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordCorrect = await student.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response
    res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
        username: student.username,
        email: student.email,
        rollno: student.rollno,
        branch: student.branch,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current student profile
const getCurrentStudent = async (req, res) => {
  try {
    console.log(req.user);
    console.log(req.body.userId);
    const student = await Student.findById(req.user.userId).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  getCurrentStudent,
};
