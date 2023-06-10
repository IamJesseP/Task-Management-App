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
router.patch('/studentUpdate/:id', requireFirebaseToken, updateStudentTask);
router.patch('/companyUpdate/:id', requireFirebaseToken, updateCompanyTask);
router.get('/companyUpdate/:id', getSingleTask);
router.delete('/:id', deleteTask);

module.exports = router;
