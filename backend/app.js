var express = require('express');
var cors = require('cors');
var app = express();
var admin = require('./db/firebaseAdmin');

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
