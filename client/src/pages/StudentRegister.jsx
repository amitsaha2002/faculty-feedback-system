import React, { useState, useEffect } from 'react';
import styles from '../styles/StudentRegister.module.css';
import 'boxicons/css/boxicons.min.css';

const API_URL = process.env.REACT_APP_API;

const StudentRegister = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    rollno: '',
    branch: '',
    phoneno: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch all students when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('Fetching students...');
      const response = await fetch(`${API_URL}/student`);
      const data = await response.json();
      console.log('Received students data:', data);
      if (response.ok) {
        setStudents(data.students);
        console.log('Students state updated:', data.students);
      } else {
        setError(data.error);
        console.error('Error fetching students:', data.error);
      }
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Failed to fetch students:', err);
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
      email: '',
      rollno: '',
      branch: '',
      phoneno: '',
    });
    setEditIndex(null);
    setError(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const saveStudent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { name, email, rollno, branch, phoneno } = formData;
      if (!name || !email || !rollno || !branch || !phoneno) {
        setError('Please fill all fields.');
        console.log('Saving student data:', { ...formData });

        return;
      }

      console.log('Saving student data:', { ...formData });
      let response;
      if (editIndex !== null) {
        // Update existing student
        const studentId = students[editIndex]._id;
        response = await fetch(`${API_URL}/student/${studentId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new student
        console.log('Creating new student...');
        response = await fetch(`${API_URL}/student/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Refresh student list
      console.log('Student saved successfully, refreshing list...');
      await fetchStudents();
      closeModal();
    } catch (err) {
      console.error('Error saving student:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (index) => {
    try {
      setLoading(true);
      const studentId = students[index]._id;
      const response = await fetch(`${API_URL}/student/${studentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete student');
      }

      // Refresh student list
      await fetchStudents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const editStudent = (index) => {
    const student = students[index];
    setFormData({
      name: student.name,
      username: student.username,
      email: student.email,
      rollno: student.rollno,
      branch: student.branch,
      phoneno: student.phoneno,
      password: '', // Don't populate password for security
    });
    setEditIndex(index);
    openModal();
  };

  const printTable = () => {
    const content = document.getElementById('studentTable').outerHTML;
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
        <h2>Student Registration</h2>
        <button className={styles.printBtn} onClick={openModal}>
          Add Student
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
            <h3>{editIndex !== null ? 'Edit' : 'Add'} Student</h3>

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
              <i className="bx bx-id-card"></i>
              <input
                type="text"
                id="rollno"
                className={styles.inputBox}
                value={formData.rollno}
                onChange={handleChange}
                placeholder="Enter Roll Number"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <i className="bx bxs-graduation"></i>
              <input
                type="text"
                id="branch"
                className={styles.inputBox}
                value={formData.branch}
                onChange={handleChange}
                placeholder="Enter Branch"
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
              onClick={saveStudent}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.headContainer2}>
        <h2>Registered Students</h2>
        <button className={styles.printBtn} onClick={printTable}>
          Print Details
        </button>
      </div>

      {error && !showModal && <div className={styles.error}>{error}</div>}

      {loading && !showModal && (
        <div className={styles.loading}>Loading...</div>
      )}

      <table id="studentTable">
        <thead>
          <tr>
            <th>Name</th>
            {/* <th>Username</th> */}
            <th>Email</th>
            <th>Roll Number</th>
            <th>Branch</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              {/* <td>{student.username}</td> */}
              <td>{student.email}</td>
              <td>{student.rollno}</td>
              <td>{student.branch}</td>
              <td>{student.phoneno}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => editStudent(index)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteStudent(index)}
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

export default StudentRegister;
