const express = require('express');
const requireFirebaseToken = require('../middleware/requireFirebaseToken');

const router = express.Router();
const {
  createTask,
  getAllTasks,
  getCurrentUserTasks,
  updateStudentTask,
  updateCompanyTask,
  getSingleTask,
  deleteTask,
} = require('../controllers/taskController');

router.get('/', requireFirebaseToken, getAllTasks);
router.post('/', requireFirebaseToken, createTask);
router.get('/showMyTasks', getCurrentUserTasks);
router.patch('/:id', requireFirebaseToken, updateStudentTask);
router.get('/:id', getSingleTask);
router.delete('/:id', deleteTask);

module.exports = router;
