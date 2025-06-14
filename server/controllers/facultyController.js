const Faculty = require('../models/Faculty');

// Get all faculties
const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({}).select('-password');
    res.status(200).json({ faculties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get faculty details (for display)
const getFacultyDetails = async (req, res) => {
  try {
    const faculties = await Faculty.find({})
      .select('name department')
      .sort({ name: 1 }); // Sort by name in ascending order
    res.status(200).json({ faculties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create faculty
const createFaculty = async (req, res) => {
  try {
    const { name, username, email, department, phoneno, password } = req.body;

    // Check if faculty with same email or username exists
    const existingFaculty = await Faculty.findOne({
      $or: [{ email }, { username }],
    });
    if (existingFaculty) {
      return res
        .status(400)
        .json({ error: 'Email or username already exists' });
    }

    const faculty = await Faculty.create({
      name,
      username,
      email,
      department,
      phoneno,
      password,
    });

    const facultyWithoutPassword = {
      _id: faculty._id,
      name: faculty.name,
      username: faculty.username,
      email: faculty.email,
      department: faculty.department,
      phoneno: faculty.phoneno,
    };

    res.status(201).json({ faculty: facultyWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update faculty
const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email, department, phoneno } = req.body;

    // Check if faculty exists
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Check if email/username is taken by another faculty
    if (email !== faculty.email || username !== faculty.username) {
      const existingFaculty = await Faculty.findOne({
        $or: [{ email }, { username }],
        _id: { $ne: id },
      });
      if (existingFaculty) {
        return res
          .status(400)
          .json({ error: 'Email or username already exists' });
      }
    }

    faculty.name = name;
    faculty.username = username;
    faculty.email = email;
    faculty.department = department;
    faculty.phoneno = phoneno;

    await faculty.save();

    const facultyWithoutPassword = {
      _id: faculty._id,
      name: faculty.name,
      username: faculty.username,
      email: faculty.email,
      department: faculty.department,
      phoneno: faculty.phoneno,
    };

    res.status(200).json({ faculty: facultyWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete faculty
const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByIdAndDelete(id);

    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get faculties by department
const getFacultiesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const faculties = await Faculty.find({ department })
      .select('name department')
      .sort({ name: 1 });
    res.status(200).json({ faculties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFaculties,
  getFacultyDetails,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultiesByDepartment,
};
