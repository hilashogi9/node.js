const express = require('express');
const Router = require('./routes');
const connectDB = require('./lib/connect');

const app = express();
app.use(express.json());
app.use('/api', Router);


app.listen(3000, () => {
  connectDB();
  console.log('Server is running on http://localhost:3000');
});