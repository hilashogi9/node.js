// Import necessary validation schema and models
const { incomeSchema } = require('../lib/validation/income'); // Schema for validating income data
const User = require('../models/user'); // User model for database interaction
const Income = require('../models/income'); // Income model for database interaction
const { z } = require("zod"); // Zod library for schema validation
const { userIdValidation } = require('../lib/validation/user'); // Schema for validating user ID

// Function to add income entry for a user
const addIncome = async (req, res) => {
    try {
        //validating userId using userIdValidation from /lib/validation/user to check if the correct conditions are met according to the function
        const userId = userIdValidation.parse(req.params.userId);
        //Checking that the data received from the entity matches the schema(with parse and incomeSchema) and if so, save the data in the variables defined respectively
        const { title, description, amount, tag, currency } = incomeSchema.parse(req.body);

        // Check if the user exists in the database
        const userExists = await User.findById(userId);
        if (!userExists) {
            // If user doesn't exist, return a 404 error
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new income entry with the parsed data
        const income = new Income({
            title,
            description,
            amount,
            tag,
            currency
        });

        // Save the new income entry to the database
        await income.save();

        // Link the income entry to the user and save the user data
        userExists.incomes.push(income);
        await userExists.save();

        // Respond with success message
        return res.status(201).json({ message: 'Income added successfully' });

    } catch (error) {
        console.log(error);
        // Check if the error is a Zod validation error
        if (error instanceof z.ZodError) {
            // If validation error, return a 400 error with specific message
            return res.status(400).json({ message: error.errors[0].message });
        }
        // For any other errors, return a 500 server error
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to get all income entries for a specific user
const getIncomes = async (req, res) => {
    try {
        // Parse and validate user ID from request parameters
        const userId = userIdValidation.parse(req.params.userId);

        // Check if the user exists in the database
        const userExists = await User.findById(userId);
        if (!userExists) {
            // If user doesn't exist, return a 404 error
            return res.status(404).json({ message: 'User not found' });
        }

        // This line fetches all income records for the user.
        // It uses the Income model to find documents where the income ID (_id)
        // matches any ID in the user's income list (userExists.incomes).
        //
        // The { $in: userExists.incomes } part checks if the income ID
        // is included in the user's income IDs. This means we get
        // all the incomes that belong to the user.
        //
        // For example, if userExists.incomes contains ['incomeId1', 'incomeId2'],
        // this line will find and return all income records with IDs 
        // 'incomeId1' or 'incomeId2'. This way, we can retrieve all 
        // the incomes associated with that user.
        const incomes = await Income.find({ _id: { $in: userExists.incomes } });

        // Respond with the income data as a JSON array
        return res.status(200).json(incomes);

    } catch (error) {
        console.log(error);
        // Check if the error is a Zod validation error
        if (error instanceof z.ZodError) {
            // If validation error, return a 400 error with specific message
            return res.status(400).json({ message: error.errors[0].message });
        }
        // For any other errors, return a 500 server error
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// Export the functions for use in other parts of the application
module.exports = { addIncome, getIncomes };
