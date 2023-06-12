// Express
const express = require('express');


// firebase
const app = express();
const admin = require('./db/firebaseAdmin');

//Security
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
var corsOptions = {
  origin: 'https://task-management-app-nine-beryl.vercel.app/', //  frontend domain
  optionsSuccessStatus: 200 
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Routers
const taskRouter = require('./routes/taskRoutes');

// Endpoints
app.use('/dashboard/tasks', taskRouter);

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running`);
});
