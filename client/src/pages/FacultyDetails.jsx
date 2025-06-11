import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/FacultyDetails.module.css';
import 'boxicons/css/boxicons.min.css';

const API_URL = 'http://localhost:5000/api';

const FacultyDetails = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if student is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/student');
      return;
    }

    fetchFaculties();
  }, [navigate]);

  const handleLogout = () => {
    // Clear all student-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentBranch');
    // Redirect to login page
    navigate('/student');
  };

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/faculty/details`);
      const data = await response.json();
      
      if (response.ok) {
        // Get student's branch from localStorage
        const studentBranch = localStorage.getItem('studentBranch');
        console.log('Student Branch:', studentBranch); // Debug log
        
        // Filter faculties based on student's branch
        const filteredFaculties = data.faculties.filter(faculty => {
          console.log('Faculty Department:', faculty.department); // Debug log
          return faculty.department === studentBranch;
        });
        
        console.log('Filtered Faculties:', filteredFaculties); // Debug log
        setFaculties(filteredFaculties);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch faculty details');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFeedback = (facultyId) => {
    navigate(`/feedbackform/${facultyId}`);
  };

  const filteredFaculties = faculties.filter(faculty => 
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className={styles.loading}>Loading faculty details...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Faculty List - {localStorage.getItem('studentBranch')}</h2>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <i className="bx bx-log-out"></i> Logout
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <i className="bx bx-search"></i>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredFaculties.length === 0 ? (
        <div className={styles.noResults}>
          No faculty members found in your department
        </div>
      ) : (
        <div className={styles.facultyGrid}>
          {filteredFaculties.map((faculty) => (
            <div key={faculty._id} className={styles.facultyCard}>
              <div className={styles.facultyInfo}>
                <h3>{faculty.name}</h3>
                <p>{faculty.department}</p>
              </div>
              <button
                className={styles.feedbackBtn}
                onClick={() => handleFeedback(faculty._id)}
              >
                Give Feedback
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDetails;
