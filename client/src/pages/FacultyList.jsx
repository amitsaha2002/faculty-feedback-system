import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/FacultyList.module.css'; // CSS Module

const API_URL = process.env.REACT_APP_API;

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/faculty/details`);
      const data = await response.json();

      if (response.ok) {
        setFaculties(data.faculties);
        // Extract unique departments for filter dropdown
        const uniqueDepartments = [
          ...new Set(data.faculties.map((f) => f.department)),
        ].sort();
        setDepartments(uniqueDepartments);
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

  const handleDepartmentFilter = (e) => {
    setFilterDepartment(e.target.value);
  };

  const filteredFaculties = faculties.filter((faculty) => {
    const matchesSearch = faculty.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !filterDepartment || faculty.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return <div className={styles.loading}>Loading faculty details...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.sideUser}>
          <div
            className={styles.sideImg}
            style={{ backgroundImage: `url(../images/amit.png)` }}
          ></div>
          <div>
            <small>
              <b>Admin Dashboard</b>
            </small>
            <p>Faculty Management</p>
          </div>
        </div>
        <ul className={styles.sideMenu}>
          <li>
            <Link to="/admin/faculty" className={styles.active}>
              <i className="fa-solid fa-id-card"></i>{' '}
              <span>Faculty Details</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/settings">
              <i className="fa-solid fa-gear"></i> <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.dashboardTitle}>
            <h2>Faculty List</h2>
          </div>
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <i className="fa-solid fa-search"></i>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className={styles.filterBox}>
              <select
                value={filterDepartment}
                onChange={handleDepartmentFilter}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button className={styles.logoutBtn}>
              <i className="fa-solid fa-right-from-bracket"></i> Log Out
            </button>
          </div>
        </header>

        <main className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.container}>
              {filteredFaculties.length === 0 ? (
                <div className={styles.noResults}>
                  No faculty members found matching your criteria
                </div>
              ) : (
                filteredFaculties.map((faculty) => (
                  <div className={styles.buttonGroup} key={faculty._id}>
                    <div className={styles.imageText}>
                      <div className={styles.facultyInfo}>
                        <h3>{faculty.name}</h3>
                        <p>{faculty.department}</p>
                      </div>
                    </div>
                    <Link to={`/feedback/${faculty._id}`}>
                      <button className={styles.button}>SEE FEEDBACK</button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyList;
