const express = require('express');

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
router.post('/', createTask);
router.get('/showMyTasks', getCurrentUserTasks);
router.patch('/:id', updateTask);
router.get('/:id', getSingleTask);
router.delete('/:id', deleteTask);

module.exports = router;
