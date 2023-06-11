const admin = require('firebase-admin');
const { StatusCodes } = require('http-status-codes');

const db = admin.firestore();

const createTask = async (req, res) => {
  const { title, description } = req.body;
  const { name, picture } = req.user;
  if (!title || !description || !name || !picture) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Missing required fields',
    });
  }
  const newTask = {
    title,
    description,
    company: name.slice(8),
    status: false,
    submissionCounter: 0,
    dateCreated: admin.firestore.FieldValue.serverTimestamp(),
    dateCompleted: null,
    createdBy: name,
    isSubmitted: false,
    student: '',
    displayPhoto: picture,
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
  console.log(displayName, taskId, isSubmitted, submissionCounter);
  if (!displayName || !taskId) {
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
        student: displayName.slice(8),
      });

      const task = await taskRef.get();
      if (!task.exists) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Task not found' });
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
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Task not found' });
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

const deleteTask = async (req, res) => {
  const displayName = req.user.name;
  if (!displayName.startsWith('company')) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
  }
  const taskId = req.params.id;
  if (!taskId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Missing required task ID' });
  }

  try {
    const taskRef = db.collection('tasks').doc(taskId);
    const doc = await taskRef.get();
    if (!doc.exists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Task not found' });
    }

    await taskRef.delete();
    res
      .status(StatusCodes.OK)
      .json({ message: `Task ${taskId} deleted successfully` });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error', msg: err });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getCurrentUserTasks,
  updateStudentTask,
  updateCompanyTask,
  deleteTask,
};
