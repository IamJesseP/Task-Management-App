import { firestore } from 'firebase-admin';
import { StatusCodes } from 'http-status-codes';

const db = firestore();
import 'http-status-codes';

const createTask = async (req, res) => {
<<<<<<< HEAD
    const { title, description, company } = req.body;
    if (!title || !description || !company) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Missing required fields',
        });
    }
    const newTask = {
        title: 'null title',
        description: 'null description',
        company: 'null company',
        student: 'null student',
        status: 'open',
        dateCreated: firestore.FieldValue.serverTimestamp(),
        dateCompleted: 'null date',
    };
    try {
        await db.collection('tasks').add(newTask);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Failed to create task',
        });
    }
    res.status(StatusCodes.CREATED).json({ msg: 'Successfuly created task' });
=======
  const { title, description, company } = req.body;
  if (!title || !description || !company) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Missing required fields',
    });
  }
  const newTask = {
    title,
    description,
    company,
    student: null,
    status: 'open',
    dateCreated: admin.firestore.FieldValue.serverTimestamp(),
    dateCompleted: null,
  };
  try {
    await db.collection('tasks').add(newTask);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Failed to create task',
    });
  }
  res.status(StatusCodes.CREATED).json({ msg: 'Successfuly created task' });
>>>>>>> f2acea0fa02fd87f7c5cbd38e0044579fb91a26a
};

const getAllTasks = async (req, res) => {
  const taskCollection = db.collection('tasks');
  const snapshot = await taskCollection.get();
  if (snapshot.empty) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Tasks not found' });
  }
  const tasks = [];
  snapshot.forEach((doc) => {
    const { id } = doc;
    const data = doc.data();
    tasks.push({ id, ...data });
  });
  res.status(StatusCodes.OK).json(tasks);
};

const getCurrentUserTasks = async (req, res) => {
  res.send('get current user tasks route');
};

const updateTask = async (req, res) => {
  res.send('update task route');
};

const getSingleTask = async (req, res) => {
  res.send('get single task route');
};

const deleteTask = async (req, res) => {
  res.send('delete task route');
};

<<<<<<< HEAD
export default {
    createTask,
    getAllTasks,
    getCurrentUserTasks,
    updateTask,
    getSingleTask,
    deleteTask,
=======
module.exports = {
  createTask,
  getAllTasks,
  getCurrentUserTasks,
  updateTask,
  getSingleTask,
  deleteTask,
>>>>>>> f2acea0fa02fd87f7c5cbd38e0044579fb91a26a
};
