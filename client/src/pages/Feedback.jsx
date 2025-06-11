import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaIdCard, FaBars, FaRightFromBracket } from 'react-icons/fa6';
import Chart from '../components/Chart';
import styles from '../styles/Feedback.module.css'; // CSS Module

const API_URL = 'http://localhost:5000/api';

const QUESTIONS = [
  "How clearly did the faculty member explain the course objectives and expectations?",
  "Did the faculty member make the class content engaging and interesting?",
  "Was the course material (textbooks, notes, online resources) provided by the faculty helpful and sufficient?",
  "How effectively did the faculty manage time during lectures and cover the syllabus?",
  "How responsive was the faculty member to students' questions and concerns during lectures?",
  "How effectively did the faculty member present and explain complex topics?",
  "Did the faculty complete the syllabus within the allotted time frame?",
  "Did the faculty give students enough time to prepare for exams and assignments?",
  "Was the faculty punctual in attending scheduled classes?",
  "Do faculty treat all students fairly and without bias?",
  "How often did the faculty motivate and encourage students to perform better?",
  "How respectful and polite is the faculty member when interacting with students?",
  "Was the faculty open to answering unexpected or challenging questions from students?"
];

const RATING_KEYS = [
  'courseObjectives',
  'contentEngagement',
  'courseMaterial',
  'timeManagement',
  'responsiveness',
  'complexTopics',
  'syllabusCoverage',
  'examPreparation',
  'punctuality',
  'fairness',
  'motivation',
  'respect',
  'openness'
];

const GRADES = [
  { rating: 5, grade: 'BEST', color: '#28db09' },
  { rating: 4, grade: 'GOOD', color: '#a7f39a' },
  { rating: 3, grade: 'NEUTRAL', color: '#fffb04' },
  { rating: 2, grade: 'SATISFACTORY', color: '#f58f8f' },
  { rating: 1, grade: 'NOT SATISFACTORY', color: '#ff0000' }
];

const Feedback = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);

  useEffect(() => {
    fetchFeedbackData();
  }, [facultyId]);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/feedback/aggregated/${facultyId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch feedback data');
      }

      setFeedbackData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('isFacultyAuthenticated');
    navigate('/');
  };

  if (loading) {
    return <div className={styles.loading}>Loading feedback data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!feedbackData) {
    return <div className={styles.error}>No feedback data available</div>;
  }

  const chartData = {
    labels: QUESTIONS.map((_, idx) => `Question ${idx + 1}`),
    datasets: [{
      label: 'DISTRIBUTION OF FEEDBACK SCORES',
      data: RATING_KEYS.map(key => feedbackData.averageRatings[key]),
      backgroundColor: RATING_KEYS.map(key => {
        const rating = Math.round(feedbackData.averageRatings[key]);
        return GRADES.find(g => g.rating === rating)?.color || '#ccc';
      }),
      borderColor: 'rgba(0,0,0,0.2)',
      borderWidth: 1,
      barPercentage: 0.8,
      categoryPercentage: 0.9,
    }]
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Faculty Feedback Report</h2>
        <div className={styles.facultyInfo}>
          <h3>{feedbackData.faculty.name}</h3>
          <p>{feedbackData.faculty.department}</p>
          <p>Total Feedbacks: {feedbackData.totalFeedbacks}</p>
        </div>
      </div>

      <main>
        {/* Feedback Table */}
        <div className={styles.card}>
          <div className={styles.tableWrapper}>
            <table width="100%">
              <thead>
                <tr align="center">
                  <th rowSpan="2" style={{ backgroundColor: '#0a1ef6', color: '#fff' }}>
                    Feedback On
                  </th>
                  <th colSpan="5" style={{ backgroundColor: '#0a1ef6', color: '#fff' }}>
                    Rating Distribution
                  </th>
                  <th rowSpan="2" style={{ backgroundColor: '#0a1ef6', color: '#fff' }}>
                    Average
                  </th>
                </tr>
                <tr align="center">
                  <td style={{ backgroundColor: '#26e926' }}>5</td>
                  <td style={{ backgroundColor: '#b8f0b8' }}>4</td>
                  <td style={{ backgroundColor: '#e4f439' }}>3</td>
                  <td style={{ backgroundColor: '#f1806f' }}>2</td>
                  <td style={{ backgroundColor: '#ff0101' }}>1</td>
                </tr>
              </thead>
              <tbody>
                {QUESTIONS.map((question, idx) => (
                  <tr key={idx}>
                    <td>{`${idx + 1}. ${question}`}</td>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <td key={rating} align="center">
                        {feedbackData.ratingDistribution[RATING_KEYS[idx]][rating]}
                      </td>
                    ))}
                    <td align="center">
                      {feedbackData.averageRatings[RATING_KEYS[idx]]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Table */}
        <div className={styles.card}>
          <div className={styles.tableWrapper}>
            <table width="100%">
              <thead>
                <tr align="center">
                  <th style={{ backgroundColor: '#147bf2', color: '#fff' }}>
                    RATING
                  </th>
                  <th style={{ backgroundColor: '#313fdf', color: '#fff' }}>
                    GRADE
                  </th>
                </tr>
              </thead>
              <tbody>
                {GRADES.map(({ rating, grade, color }, i) => (
                  <tr key={i} align="center">
                    <td style={{ backgroundColor: color }}>{rating}</td>
                    <td>{grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Section */}
        <div className={styles.chartContainer}>
          <Chart data={chartData} />
        </div>
      </main>
    </div>
  );
};

export default Feedback;
