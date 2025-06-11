import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/FeedbackForm.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRightFromBracket,
  faIdCard,
} from '@fortawesome/free-solid-svg-icons';

const API_URL = 'http://localhost:5000/api';

const QUESTIONS = [
  {
    id: 'courseObjectives',
    text: 'How clearly did the faculty member explain the course objectives and expectations?',
  },
  {
    id: 'contentEngagement',
    text: 'Did the faculty member make the class content engaging and interesting?',
  },
  {
    id: 'courseMaterial',
    text: 'Was the course material (textbooks, notes, online resources) provided by the faculty helpful and sufficient?',
  },
  {
    id: 'timeManagement',
    text: 'How effectively did the faculty manage time during lectures and cover the syllabus?',
  },
  {
    id: 'responsiveness',
    text: "How responsive was the faculty member to students' questions and concerns during lectures?",
  },
  {
    id: 'complexTopics',
    text: 'How effectively did the faculty member present and explain complex topics?',
  },
  {
    id: 'syllabusCoverage',
    text: 'Did the faculty complete the syllabus within the allotted time frame?',
  },
  {
    id: 'examPreparation',
    text: 'Did the faculty give students enough time to prepare for exams and assignments?',
  },
  {
    id: 'punctuality',
    text: 'Was the faculty punctual in attending scheduled classes?',
  },
  {
    id: 'fairness',
    text: 'Do faculty treat all students fairly and without bias?',
  },
  {
    id: 'motivation',
    text: 'How often did the faculty motivate and encourage students to perform better?',
  },
  {
    id: 'respect',
    text: 'How respectful and polite is the faculty member when interacting with students?',
  },
  {
    id: 'openness',
    text: 'Was the faculty open to answering unexpected or challenging questions from students?',
  },
];

const FeedbackForm = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faculty, setFaculty] = useState(null);
  const [canSubmitFeedback, setCanSubmitFeedback] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // In a real application, you would get this from your auth context/state
  const studentId = localStorage.getItem('studentId');

  const handleLogout = () => {
    // Clear all student-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentBranch');
    // Redirect to login page
    navigate('/student');
  };

  const [formData, setFormData] = useState({
    ratings: {
      courseObjectives: 5,
      contentEngagement: 5,
      courseMaterial: 5,
      timeManagement: 5,
      responsiveness: 5,
      complexTopics: 5,
      syllabusCoverage: 5,
      examPreparation: 5,
      punctuality: 5,
      fairness: 5,
      motivation: 5,
      respect: 5,
      openness: 5,
    },
    comments: '',
  });

  useEffect(() => {
    fetchFacultyAndStatus();
  }, [facultyId, studentId]);

  const fetchFacultyAndStatus = async () => {
    try {
      setLoading(true);

      // Fetch faculty details
      const facultyResponse = await fetch(
        `${API_URL}/feedback/faculty/${facultyId}`
      );
      const facultyData = await facultyResponse.json();

      if (!facultyResponse.ok) {
        throw new Error(facultyData.error || 'Failed to fetch faculty details');
      }

      setFaculty(facultyData.faculty);

      // Check feedback status
      const statusResponse = await fetch(
        `${API_URL}/feedback/status/${facultyId}/${studentId}`
      );
      const statusData = await statusResponse.json();

      if (!statusResponse.ok) {
        throw new Error(statusData.error || 'Failed to check feedback status');
      }

      setCanSubmitFeedback(statusData.canSubmitFeedback);

      if (!statusData.canSubmitFeedback) {
        setError(
          'You have already submitted feedback for this faculty this month'
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (aspect, value) => {
    setFormData((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [aspect]: parseInt(value),
      },
    }));
  };

  const handleCommentsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      comments: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId) {
      setError('Please log in to submit feedback');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facultyId,
          studentId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      // Navigate back to faculty list
      navigate('/facultydetails');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!faculty) {
    return <div className={styles.error}>Faculty not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Faculty Feedback Form</h2>
        <div className={styles.facultyInfo}>
          <h3>{faculty.name}</h3>
          <p>{faculty.department}</p>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <i className="bx bx-log-out"></i> Logout
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.ratingsSection}>
          <h3>Performance Ratings</h3>

          {QUESTIONS.map((question, index) => (
            <div key={index} className={styles.ratingGroup}>
              <label>{`${index + 1}. ${question.text}`}</label>
              <div className={styles.ratingInputs}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className={styles.ratingLabel}>
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={formData.ratings[question.id] === value}
                      onChange={(e) =>
                        handleRatingChange(question.id, e.target.value)
                      }
                      disabled={!canSubmitFeedback || submitting}
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* <div className={styles.commentsSection}>
          <label htmlFor="comments">Additional Comments (Optional)</label>
          <textarea
            id="comments"
            value={formData.comments}
            onChange={handleCommentsChange}
            placeholder="Share your thoughts about the faculty..."
            maxLength={500}
            disabled={!canSubmitFeedback || submitting}
          />
        </div> */}

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate('/facultydetails')}
            className={styles.cancelBtn}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!canSubmitFeedback || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
