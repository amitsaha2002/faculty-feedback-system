const express = require('express');
const router = express.Router();
const {
  getAllFaculties,
  getFacultyDetails,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultiesByDepartment
} = require('../controllers/facultyController');

router.route('/').get(getAllFaculties).post(createFaculty);
router.route('/details').get(getFacultyDetails);
router.route('/:id').patch(updateFaculty).delete(deleteFaculty);
router.route('/department/:department').get(getFacultiesByDepartment);

module.exports = router; 