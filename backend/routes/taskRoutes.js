const express = require('express');
const requireFirebaseToken = require('../middleware/requireFirebaseToken');

const router = express.Router();
const {
  createTask,
  getAllTasks,
  getCurrentUserTasks,
  updateStudentTask,
  updateCompanyTask,
  deleteTask,
} = require('../controllers/taskController');

router.get('/', requireFirebaseToken, getAllTasks);
router.post('/', requireFirebaseToken, createTask);
router.get('/showMyTasks', requireFirebaseToken, getCurrentUserTasks);
router.patch('/studentUpdate/:id', requireFirebaseToken, updateStudentTask);
router.patch('/companyUpdate/:id', requireFirebaseToken, updateCompanyTask);
router.delete('/:id', deleteTask);

module.exports = router;
