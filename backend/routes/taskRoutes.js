import { Router } from 'express';

const router = Router();
import { createTask, getAllTasks, getCurrentUserTasks, updateTask, getSingleTask, deleteTask } from '../controllers/taskController';

router.get('/', getAllTasks);
router.post('/', createTask);
router.get('/showMyTasks', getCurrentUserTasks);
router.patch('/:id', updateTask);
router.get('/:id', getSingleTask);
router.delete('/:id', deleteTask);

export default router;
