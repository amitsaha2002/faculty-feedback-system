const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getFeedbackStatus,
  getFacultyForFeedback,
  getAggregatedFeedback
} = require('../controllers/feedbackController');

// Submit feedback
router.post('/', submitFeedback);

// Check if student can submit feedback for a faculty
router.get('/status/:facultyId/:studentId', getFeedbackStatus);

// Get faculty details for feedback form
router.get('/faculty/:facultyId', getFacultyForFeedback);

// Get aggregated feedback for a faculty
router.get('/aggregated/:facultyId', getAggregatedFeedback);

module.exports = router; 