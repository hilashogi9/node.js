// Importing the mongoose library, which helps us interact with a MongoDB database in an easier way
const mongoose = require('mongoose');

// Defining a function to connect to the database
const connectDB = () => {
    const uri = process.env.DB_URL;
    console.log(uri);
    mongoose.connect(uri);
    const database = mongoose.connection;

    database.on('error', (error) => {
        console.log('database connection error', error);
    });
    database.once('open', () => {
        console.log('Connected to the database');
    });
};

// Exporting the connectDB function so it can be used in other parts of the application
module.exports = connectDB;
