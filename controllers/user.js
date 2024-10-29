const User = require('../models/user'); // Import the User model for database operations
const { signUpSchema, signInSchema } = require('../lib/validation/user'); // Import validation schemas for sign-up and sign-in
const { z } = require('zod'); // Import zod for validation
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating JWTs

const signUp = async (req, res) => {
    try {
        // Validate the request body against the signUpSchema
        const { fullName, username, email, password } = signUpSchema.parse(req.body);

        // Check if the username already exists in the database
        // Difference between findOne and find:
        // - findOne: 
        //   - Purpose: Used to retrieve a single document that matches the query criteria.
        //   - Return Value: Returns a single document or null if no document matches the query.
        //   - Use Case: Ideal for situations where you expect only one document to match the query, such as looking for a user by a unique field like username or email.
        // 
        // - find:
        //   - Purpose: Used to retrieve multiple documents that match the query criteria.
        //   - Return Value: Returns an array of documents that match the query. If no documents match, it returns an empty array.
        //   - Use Case: Suitable for cases where you expect multiple results and want to work with them as a collection.
        // 
        // In this code, findOne is used to check if a user with the specified username already exists.
        //Since username is typically a unique identifier, using findOne is efficient and straightforward, allowing for quick existence checks without retrieving an unnecessary array of users.

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if the email already exists in the database
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the user's password for secure storage
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user object with the validated data
        const user = new User({
            fullName,
            username,
            email,
            password: hashPassword,
        });

        // Save the new user to the database
        const newUser = await user.save();

        // Create a JWT token for the new user
        const token = jwt.sign(
            {
                id: newUser._id, // Include the user's ID in the token payload
                username: newUser.username, // Include the username in the token payload
            },
            process.env.JWT_SECRET, // Use the JWT secret from environment variables
            {
                expiresIn: '1h', // Set the token to expire in 1 hour
            }
        );

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript from accessing the cookie
            maxAge: 60 * 60 * 1000, // Set cookie expiration to 1 hour
        });

        // Respond with a success message
        return res.status(201).json({ message: 'Created' });
    } catch (error) {
        console.log(error); // Log any errors to the console

        // Check if the error is a validation error from zod
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message }); // Return the first validation error message
        }

        // For any other errors, return a 500 Internal Server Error response
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const signIn = async (req, res) => {
    try {
        // Validate the request body against the signInSchema
        const { username, password } = signInSchema.parse(req.body);

        // Check if the user exists in the database
        const userExists = await User.findOne({ username }).select('+password'); // Ensure password is included in the query
        if (!userExists) {
            return res.status(400).json({ message: 'Username does not exist' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, userExists.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token for the authenticated user
        const token = jwt.sign(
            {
                id: userExists._id, // Include the user's ID in the token payload
                username: userExists.username, // Include the username in the token payload
            },
            process.env.JWT_SECRET, // Use the JWT secret from environment variables
            {
                expiresIn: '1h', // Set the token to expire in 1 hour
            }
        );

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript from accessing the cookie
            maxAge: 60 * 60 * 1000, // Set cookie expiration to 1 hour
        });

        // Respond with a success message indicating the user is authenticated
        return res.status(201).json({ message: 'User authenticated' });
    } catch (error) {
        // Check if the error is a validation error from zod
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message }); // Return the first validation error message
        }

        // For any other errors, return a 500 Internal Server Error response
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const logOut = async (req, res) => {
    // Clear the token cookie to log the user out
    res.clearCookie('token');
    return res.status(200).json({ message: "User logged out" }); // Respond with a success message
}

module.exports = { signUp, signIn, logOut }; // Export the signUp, signIn, and logOut functions for use in other modules
