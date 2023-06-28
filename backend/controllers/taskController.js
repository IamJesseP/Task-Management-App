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
    submissionLink: null,
    dateCreated: admin.firestore.FieldValue.serverTimestamp(),
    dateCompleted: null,
    createdBy: name,
    submissionStatus: false,
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
  const { name } = req.user;
  if (!name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Missing required fields',
    });
  }
  const displayName = name.slice(8);
  if (name.startsWith('student')) {
    const tasksRef = db.collection('tasks');
    const snapshot = await tasksRef.where('student', '==', displayName).get();
    if (snapshot.empty) {
      return res.status(404).send('No matching tasks.');
    }
    const tasks = [];
    snapshot.forEach((doc) => {
      const task = doc.data();
      task.id = doc.id;
      tasks.push(task);
    });
    res.status(200).json(tasks);
  }
  if (name.startsWith('company')) {
    const tasksRef = db.collection('tasks');
    const snapshot = await tasksRef.where('company', '==', displayName).get();
    if (snapshot.empty) {
      return res.status(404).send('No matching tasks.');
    }
    const tasks = [];
    snapshot.forEach((doc) => {
      const { id } = doc;
      const data = doc.data();
      tasks.push({ id, ...data });
    });
    res.status(200).json(tasks);
  }
};

const updateStudentTask = async (req, res) => {
  // requires: displayName, taskId, submissionFile
  const displayName = req.user.name;
  const taskId = req.params.id;
  let { submissionStatus } = req.body;
  let { submissionFile } = req.body;
  if (!displayName || !taskId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Missing required fields',
    });
  }
  if (!submissionFile) {
    submissionFile = false;
  }
  if (!submissionStatus) {
    submissionStatus = false;
  }
  const taskRef = db.collection('tasks').doc(taskId);
  if (displayName.startsWith('student')) {
    try {
      await taskRef.update({
        submissionLink: submissionFile,
        submissionStatus,
        student: displayName.slice(8),
      });
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Failed to update task', msg: error });
    }
    try {
      const task = await taskRef.get();
      if (!task.exists) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Task not found' });
      }

      return res.status(StatusCodes.OK).json({ ...task.data() });
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Failed to get task', msg: error });
    }
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Not a student' });
  }
};

const updateCompanyTask = async (req, res) => {
  // requires: title, id, description
  const displayName = req.user.name;
  const taskId = req.params.id;
  const { title, description } = req.body;
  if (!title || !description) {
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
      });
      const task = await taskRef.get();
      if (!task.exists) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Task not found' });
      }

      res.status(StatusCodes.OK).json({ ...task.data() });
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'Failed to update task', msg: error });
    }
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const displayName = req.user.name;
  if (!displayName.startsWith('company')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' });
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
    return res
      .status(StatusCodes.OK)
      .json({ message: `Task ${taskId} deleted successfully` });
  } catch (err) {
    return res
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
