const admin = require('firebase-admin');
const { StatusCodes } = require('http-status-codes');
const db = admin.firestore();
const CustomError = require('../errors');
require('http-status-codes')


const createTask = async (req, res) => {
    const {title, description, company} = req.body
    if (!title || !description || !company){
        throw new CustomError.BadRequestError('Please provide all values')
    }
    const newTask = {
        title,
        description,
        company,
        student: null,
        status: "open",
        dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        dateCompleted: null
    };
    try {
         await db.collection('tasks').add(newTask);
    } catch (error) {
        throw new CustomError.BadRequestError(`Error: ${error}`)
    }
    res.status(StatusCodes.CREATED).json({msg: "Successfuly created task"})
}

const getAllTasks = async (req, res) => {
    const taskCollection = db.collection('tasks')
    const snapshot = await taskCollection.get()
    if (snapshot.empty){
        throw new CustomError.NotFoundError('No tasks found')
    }
    let tasks = []
    snapshot.forEach(doc =>{
        let id = doc.id
        let data = doc.data()
        tasks.push({id, ...data})
    })
    res.status(StatusCodes.OK).json(tasks)
}

const getCurrentUserTasks = async (req, res) => {
    res.send('get current user tasks route')
}

const updateTask = async (req, res) => {
    res.send('update task route')
}

const getSingleTask = async (req, res) => {
    res.send('get single task route')
}

const deleteTask = async (req, res) => {
    res.send('delete task route')
}


module.exports = {
    createTask,
    getAllTasks,
    getCurrentUserTasks,
    updateTask,
    getSingleTask,
    deleteTask
}