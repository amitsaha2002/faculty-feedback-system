const Student = require('../models/Student');

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select('-password');
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register a new student
const registerStudent = async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { name, username, email, rollno, branch, phoneno, password } = req.body;

    // Check if username or email already exists
    const existingStudent = await Student.findOne({ 
      $or: [{ username }, { email }, { rollno }] 
    });
    
    if (existingStudent) {
      console.log('Found existing student:', existingStudent);
      if (existingStudent.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (existingStudent.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (existingStudent.rollno === rollno) {
        return res.status(400).json({ error: 'Roll number already exists' });
      }
    }

    console.log('Creating new student...');
    // Create new student
    const student = await Student.create({
      name,
      username,
      email,
      rollno,
      branch,
      phoneno,
      password
    });

    console.log('Student created successfully:', student._id);

    // Remove password from response
    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(201).json({ student: studentResponse });
  } catch (error) {
    console.error('Error in student registration:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If updating username, email, or rollno, check if they already exist
    if (updates.username || updates.email || updates.rollno) {
      const existingStudent = await Student.findOne({
        _id: { $ne: id },
        $or: [
          updates.username ? { username: updates.username } : null,
          updates.email ? { email: updates.email } : null,
          updates.rollno ? { rollno: updates.rollno } : null
        ].filter(Boolean)
      });

      if (existingStudent) {
        if (updates.username && existingStudent.username === updates.username) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        if (updates.email && existingStudent.email === updates.email) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        if (updates.rollno && existingStudent.rollno === updates.rollno) {
          return res.status(400).json({ error: 'Roll number already exists' });
        }
      }
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStudents,
  registerStudent,
  updateStudent,
  deleteStudent
}; 