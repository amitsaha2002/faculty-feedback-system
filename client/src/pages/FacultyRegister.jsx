import React, { useState, useEffect } from 'react';
import styles from '../styles/FacultyRegister.module.css';
import 'boxicons/css/boxicons.min.css';

const API_URL = process.env.REACT_APP_API;

const FacultyRegister = () => {
  const [faculties, setFaculties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    department: '',
    phoneno: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch all faculties when component mounts
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/faculty`);
      const data = await response.json();
      if (response.ok) {
        setFaculties(data.faculties);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch faculties');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      username: '',
      email: '',
      department: '',
      phoneno: '',
      password: '',
    });
    setEditIndex(null);
    setError(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const saveFaculty = async () => {
    try {
      setLoading(true);
      setError(null);

      const { name, username, email, department, phoneno, password } = formData;
      if (!name || !email || !department || !phoneno) {
        setError('Please fill all fields.');
        return;
      }

      let response;
      if (editIndex !== null) {
        // Update existing faculty
        const facultyId = faculties[editIndex]._id;
        response = await fetch(`${API_URL}/faculty/${facultyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new faculty
        response = await fetch(`${API_URL}/faculty`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Refresh faculty list
      await fetchFaculties();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFaculty = async (index) => {
    try {
      setLoading(true);
      const facultyId = faculties[index]._id;
      const response = await fetch(`${API_URL}/faculty/${facultyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete faculty');
      }

      // Refresh faculty list
      await fetchFaculties();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editFaculty = (index) => {
    const faculty = faculties[index];
    setFormData({
      name: faculty.name,
      username: faculty.username,
      email: faculty.email,
      department: faculty.department,
      phoneno: faculty.phoneno,
      password: '', // Don't populate password for security
    });
    setEditIndex(index);
    openModal();
  };

  const printTable = () => {
    const content = document.getElementById('facultyTable').outerHTML;
    const win = window.open('', '', 'height=600,width=800');
    win.document.write('<html><head><title>Print</title></head><body>');
    win.document.write(content);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className={styles.headContainer1}>
        <h2>Faculty Registration</h2>
        <button className={styles.printBtn} onClick={openModal}>
          Add Faculty
        </button>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <h3>{editIndex !== null ? 'Edit' : 'Add'} Faculty</h3>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <i className="bx bx-user"></i>
              <input
                type="text"
                id="name"
                className={styles.inputBox}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Name"
                required
              />
            </div>

            {/* <div className={styles.formGroup}>
              <i className="bx bx-user"></i>
              <input
                type="text"
                id="username"
                className={styles.inputBox}
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Username"
                required
              />
            </div> */}

            <div className={styles.formGroup}>
              <i className="bx bx-envelope"></i>
              <input
                type="email"
                id="email"
                className={styles.inputBox}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <i className="bx bxs-graduation"></i>
              <input
                type="text"
                id="department"
                className={styles.inputBox}
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter Department"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <i className="bx bxs-phone"></i>
              <input
                type="number"
                id="phoneno"
                className={styles.inputBox}
                value={formData.phoneno}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                required
              />
            </div>

            {/* <div className={styles.formGroup}>
              <i className="bx bx-lock-alt"></i>
              <input
                type="password"
                id="password"
                className={styles.inputBox}
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  editIndex !== null
                    ? 'Leave blank to keep existing password'
                    : 'Enter Password'
                }
                required={editIndex === null}
              />
            </div> */}

            <button
              className={styles.btn}
              onClick={saveFaculty}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.headContainer2}>
        <h2>Registered Faculty</h2>
        <button className={styles.printBtn} onClick={printTable}>
          Print Details
        </button>
      </div>

      {error && !showModal && <div className={styles.error}>{error}</div>}

      {loading && !showModal && (
        <div className={styles.loading}>Loading...</div>
      )}

      <table id="facultyTable">
        <thead>
          <tr>
            <th>Name</th>
            {/* <th>Username</th> */}
            <th>Email</th>
            <th>Department</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((faculty, index) => (
            <tr key={faculty._id}>
              <td>{faculty.name}</td>
              {/* <td>{faculty.username}</td> */}
              <td>{faculty.email}</td>
              <td>{faculty.department}</td>
              <td>{faculty.phoneno}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => editFaculty(index)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteFaculty(index)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyRegister;
