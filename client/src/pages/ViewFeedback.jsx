import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/ViewFeedback.module.css'; // Adjust path as needed
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'remixicon/fonts/remixicon.css';

const API_URL = 'http://localhost:5000/api';

const ViewFeedback = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDepartmentClick = async (department) => {
    try {
      setLoading(true);
      setSelectedDepartment(department);
      setError(null);

      const response = await fetch(
        `${API_URL}/faculty/department/${department}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch faculty list');
      }

      setFaculties(data.faculties);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyClick = (facultyId) => {
    navigate(`/feedback/${facultyId}`);
  };

  const logout = () => {
    navigate('/'); // Assuming '/' is your homepage route
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>View Faculty Feedback</h2>

      {/* Department Selection */}
      <div className={styles.departmentGrid}>
        <div
          className={`${styles.departmentCard} ${
            selectedDepartment === 'BCA' ? styles.selected : ''
          }`}
          onClick={() => handleDepartmentClick('BCA')}
        >
          <h3>BCA</h3>
          <p>Bachelor of Computer Applications</p>
        </div>
        <div
          className={`${styles.departmentCard} ${
            selectedDepartment === 'BBA' ? styles.selected : ''
          }`}
          onClick={() => handleDepartmentClick('BBA')}
        >
          <h3>BBA</h3>
          <p>Bachelor of Business Administration</p>
        </div>
        <div
          className={`${styles.departmentCard} ${
            selectedDepartment === 'BHM' ? styles.selected : ''
          }`}
          onClick={() => handleDepartmentClick('BHM')}
        >
          <h3>BHM</h3>
          <p>Bachelor of Hospital Management</p>
        </div>
      </div>

      {/* Faculty List */}
      {loading ? (
        <div className={styles.loading}>Loading faculty list...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        selectedDepartment && (
          <div className={styles.facultyList}>
            <h3>Faculty Members - {selectedDepartment}</h3>
            {faculties.length === 0 ? (
              <p className={styles.noFaculty}>
                No faculty members found in this department
              </p>
            ) : (
              <div className={styles.facultyGrid}>
                {faculties.map((faculty) => (
                  <div
                    key={faculty._id}
                    className={styles.facultyCard}
                    onClick={() => handleFacultyClick(faculty._id)}
                  >
                    <h4>{faculty.name}</h4>
                    <p>{faculty.department}</p>
                    <button className={styles.viewButton}>View Feedback</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ViewFeedback;
