// Importing the mongoose library, which helps us interact with a MongoDB database in an easier way
const mongoose = require('mongoose');

// Defining a function to connect to the database
const connectDB = () => {
    const uri = process.env.DB_URL; // Get the database connection string from environment variables
    console.log(uri); // Log the connection string to the console (for debugging purposes)
    
    mongoose.connect(uri); // Use mongoose to connect to the database using the URI

    const database = mongoose.connection; // Access the database connection instance

    // Set up an event listener for connection errors
    database.on('error', (error) => {
        console.log('database connection error', error); // Log any connection errors to the console
    });

    // Set up an event listener for when the connection is successfully opened
    database.once('open', () => {
        console.log('Connected to the database'); // Log a success message when the connection is established
    });
};

// Exporting the connectDB function so it can be used in other parts of the application
module.exports = connectDB;
