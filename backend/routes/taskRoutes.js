const express = require('express');
const requireFirebaseToken = require('../middleware/requireFirebaseToken');

const router = express.Router();
const {
  createTask,
  getAllTasks,
  getCurrentUserTasks,
  updateTask,
  getSingleTask,
  deleteTask,
} = require('../controllers/taskController');

router.get('/', getAllTasks);
router.post('/', requireFirebaseToken, createTask);
router.get('/showMyTasks', getCurrentUserTasks);
router.patch('/:id', updateTask);
router.get('/:id', getSingleTask);
router.delete('/:id', deleteTask);

module.exports = router;
