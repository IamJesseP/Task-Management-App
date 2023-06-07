const admin = require('firebase-admin');
const { StatusCodes } = require('http-status-codes');
const db = admin.firestore();
require('http-status-codes')


const createTask = async (req, res) => {
    const {title, description, company} = req.body
    if (!title || !description || !company){
        return res.status(StatusCodes.BAD_REQUEST).json({error: 'Missing required fields'})
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
        console.log(error)
    }
    res.status(StatusCodes.CREATED).json({msg: "successfuly created task"})
}

const getAllTasks = async (req, res) => {
    res.send('get all tasks route')
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