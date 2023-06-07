
const createTask = async (req, res) => {
    res.send('create task route')
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