<<<<<<< HEAD
import { Router } from 'express';

const router = Router();
import { createTask, getAllTasks, getCurrentUserTasks, updateTask, getSingleTask, deleteTask } from '../controllers/taskController';
=======
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
>>>>>>> f2acea0fa02fd87f7c5cbd38e0044579fb91a26a

router.get('/', requireFirebaseToken, getAllTasks);
router.post('/', requireFirebaseToken, createTask);
router.get('/showMyTasks', getCurrentUserTasks);
router.patch('/:id', updateTask);
router.get('/:id', getSingleTask);
router.delete('/:id', deleteTask);

export default router;
