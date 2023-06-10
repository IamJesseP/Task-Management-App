const admin = require('firebase-admin');
const { StatusCodes } = require('http-status-codes');

const db = admin.firestore();

const createTask = async (req, res) => {
  const { title, description } = req.body;
  const displayName = req.user.name;
  if (!title || !description || !displayName) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Missing required fields',
    });
  }
  const newTask = {
    title,
    description,
    company: displayName.slice(8),
    status: 'open',
    submissionCounter: 0,
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
};

const getAllTasks = async (req, res) => {
  const taskCollection = db.collection('tasks');
  const snapshot = await taskCollection.get();
  if (snapshot.empty) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Task not found' });
  }
  const tasks = [];
  snapshot.forEach((doc) => {
    const task = doc.data();
    task.id = doc.id;
    tasks.push(task);
  });
  res.status(StatusCodes.OK).json(tasks);
};

const getCurrentUserTasks = async (req, res) => {
  res.send('get current user tasks route');
};

const updateStudentTask = async (req, res) => {
  // requires: displayName, taskId, isSubmitted, submissionCounter
  const displayName = req.user.name;
  const taskId = req.params.id;
  const { isSubmitted } = req.body;
  let { submissionCounter } = req.body;

  if (!displayName || !taskId || !isSubmitted) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Missing required fields',
    });
  }
  if (displayName.startsWith('student')) {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      await taskRef.update({
        submissionCounter: isSubmitted
          ? (submissionCounter += 1)
          : submissionCounter,
      });

      const task = await taskRef.get();
      if (!task.exists) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(StatusCodes.OK).json({ ...task.data() });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Failed to update task', msg: error });
    }
  } else {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Failed to update task' });
  }
};

const updateCompanyTask = async (req, res) => {
  // requires: title, id, description, status
  const displayName = req.user.name;
  const taskId = req.params.id;
  const { title, description, status } = req.body;
  if (!title || !description || !status) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Missing required fields',
    });
  }
  if (displayName.startsWith('company')) {
    try {
      const taskRef = db.collection('tasks').doc(taskId);
      await taskRef.update({
        title,
        description,
        status,
      });
      const task = await taskRef.get();
      if (!task.exists) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.status(StatusCodes.OK).json({ ...task.data() });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Failed to update task', msg: error });
    }
  } else {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Failed to update task' });
  }
};

const getSingleTask = async (req, res) => {
  res.send('get single task route');
};

const deleteTask = async (req, res) => {
  res.send('delete task route');
};

module.exports = {
  createTask,
  getAllTasks,
  getCurrentUserTasks,
  updateStudentTask,
  updateCompanyTask,
  getSingleTask,
  deleteTask,
};
