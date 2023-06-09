import express, { json } from 'express';
import cors from 'cors';

const app = express();
import admin from './db/firebaseAdmin';

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

import taskRouter from './routes/taskRoutes';

// endpoints
app.use('/dashboard/tasks', taskRouter);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
