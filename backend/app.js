const express = require('express');
const cors = require('cors');

const app = express();
const admin = require('./db/firebaseAdmin');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

const taskRouter = require('./routes/taskRoutes');

// endpoints
app.use('/dashboard/tasks', taskRouter);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
