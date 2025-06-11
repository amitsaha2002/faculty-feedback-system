const express = require('express');
const router = express.Router();
const {
  getStudents,
  registerStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

// Get all students
router.get('/', getStudents);

// Register a new student
router.post('/register', registerStudent);

// Update a student
router.patch('/:id', updateStudent);

// Delete a student
router.delete('/:id', deleteStudent);

module.exports = router; 