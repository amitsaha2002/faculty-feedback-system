const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  ratings: {
    courseObjectives: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    contentEngagement: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    courseMaterial: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    timeManagement: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    responsiveness: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    complexTopics: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    syllabusCoverage: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    examPreparation: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    punctuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    fairness: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    motivation: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    respect: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    openness: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  comments: {
    type: String,
    trim: true,
    maxlength: 500
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  // To prevent multiple feedbacks in the same month
  monthYear: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Compound index to ensure one feedback per student per faculty per month
feedbackSchema.index({ studentId: 1, facultyId: 1, monthYear: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema); 