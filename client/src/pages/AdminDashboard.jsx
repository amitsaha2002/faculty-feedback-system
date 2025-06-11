import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.brand}>
          <span className="lab la-affiliatetheme"></span>
        </div>

        <div className={styles.sidemenu}>
          <div className={styles['side-user']}>
            <div
              className={styles['side-img']}
              style={{ backgroundImage: `url(../images/profilepic.jpg)` }}
            ></div>
            <div className={styles.user}>
              <small>
                <b>Admin</b>
              </small>
              <p>
                Associate Professor,
                <br />
                Computer Science
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles['main-content']}>
        <header>
          <label htmlFor="" className={styles['menu-toggle']}>
            <i className="fa-solid fa-bars"></i>
          </label>

          <div className={styles.dashboard}>
            <h2 style={{ color: 'rgb(23, 23, 23)' }}>Admin Dashboard</h2>
          </div>

          <div>
            <button onClick={logout}>
              <i className="fa-solid fa-right-from-bracket"></i> Log Out
            </button>
          </div>
        </header>

        <div className={styles.admincontainer}>
          <div
            className={styles.box}
            onClick={() => handleNavigation('/facultyregister')}
          >
            <img src="../images/fms.png" alt="Faculty Management" />
            <p>Faculty Management System</p>
          </div>
          <div
            className={styles.box}
            onClick={() => handleNavigation('/studentregister')}
          >
            <img src="../images/sms.png" alt="Student Management" />
            <p>Student Management System</p>
          </div>
          <div
            className={styles.box}
            onClick={() => handleNavigation('/viewfeedback')}
          >
            <img src="../images/vf.webp" alt="View Feedback" />
            <p>View Feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
