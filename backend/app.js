var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors()); // Enable CORS

// Add some middleware to parse JSON in the body of HTTP requests
app.use(express.json());

// Define your endpoints here
// For example:
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
var port = 3000;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});

function findDuplicates(numberList){ const result = new Set();
  const hashSet = new Set();

  numberList.forEach((item) => {
    if (hashSet.has(item)) { result.add(item);} 
    else { hashSet.add(item);}
  });
  return result;
}

const testSet = [3, 4, 5, 1, 4, 5, 8, 4, 6];
console.log(findDuplicates(testSet));