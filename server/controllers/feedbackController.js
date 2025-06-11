const Feedback = require('../models/Feedback');
const Faculty = require('../models/Faculty');

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { facultyId, studentId, ratings, comments } = req.body;

    // Check if faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Create monthYear string for the current month (e.g., "2024-03")
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Check if feedback already exists for this month
    const existingFeedback = await Feedback.findOne({
      facultyId,
      studentId,
      monthYear
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        error: 'You have already submitted feedback for this faculty this month' 
      });
    }

    // Create new feedback
    const feedback = await Feedback.create({
      facultyId,
      studentId,
      ratings,
      comments,
      monthYear
    });

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedback 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get faculty feedback status for a student
const getFeedbackStatus = async (req, res) => {
  try {
    const { facultyId, studentId } = req.params;

    // Create monthYear string for the current month
    const now = new Date();
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Check if feedback exists for this month
    const existingFeedback = await Feedback.findOne({
      facultyId,
      studentId,
      monthYear
    });

    res.status(200).json({ 
      canSubmitFeedback: !existingFeedback,
      lastFeedbackDate: existingFeedback ? existingFeedback.submittedAt : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get faculty details with feedback form
const getFacultyForFeedback = async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    const faculty = await Faculty.findById(facultyId)
      .select('name department');

    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    res.status(200).json({ faculty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get aggregated feedback for a faculty
const getAggregatedFeedback = async (req, res) => {
  try {
    const { facultyId } = req.params;

    // Check if faculty exists
    const faculty = await Faculty.findById(facultyId).select('name department');
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Get all feedback for this faculty
    const feedbacks = await Feedback.find({ facultyId });

    // Calculate average ratings for each question
    const ratingCounts = {
      courseObjectives: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      contentEngagement: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      courseMaterial: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      timeManagement: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      responsiveness: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      complexTopics: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      syllabusCoverage: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      examPreparation: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      punctuality: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      fairness: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      motivation: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      respect: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      openness: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };

    const averageRatings = {};
    const totalFeedbacks = feedbacks.length;

    // Count ratings for each question
    feedbacks.forEach(feedback => {
      Object.entries(feedback.ratings).forEach(([question, rating]) => {
        ratingCounts[question][rating]++;
      });
    });

    // Calculate averages and prepare response data
    Object.entries(ratingCounts).forEach(([question, counts]) => {
      let sum = 0;
      Object.entries(counts).forEach(([rating, count]) => {
        sum += rating * count;
      });
      averageRatings[question] = totalFeedbacks > 0 ? (sum / totalFeedbacks).toFixed(2) : 0;
    });

    res.status(200).json({
      faculty: {
        name: faculty.name,
        department: faculty.department
      },
      totalFeedbacks,
      averageRatings,
      ratingDistribution: ratingCounts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedbackStatus,
  getFacultyForFeedback,
  getAggregatedFeedback
}; 