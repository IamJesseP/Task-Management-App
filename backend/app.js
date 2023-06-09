import express, { json } from 'express';
import cors from 'cors';

const app = express();
<<<<<<< HEAD
import admin from './db/firebaseAdmin';
=======
const admin = require('./db/firebaseAdmin'); // Removing stops firebase connection
>>>>>>> f2acea0fa02fd87f7c5cbd38e0044579fb91a26a

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
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
