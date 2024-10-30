// Import necessary validation schema and models
const { expenseSchema } = require('../lib/validation/expense'); // Schema for validating expense data
const User = require('../models/user'); // User model for database interaction
const Expense = require('../models/expense'); // expense model for database interaction
const { z } = require("zod"); // Zod library for schema validation
const { userIdValidation } = require('../lib/validation/user'); // Schema for validating user ID

// Function to add expense entry for a user
const addExpense = async (req, res) => {
    try {
        //validating userId using userIdValidation from /lib/validation/user to check if the correct conditions are met according to the function
        const userId = userIdValidation.parse(req.params.userId);
        //Checking that the data received from the entity matches the schema(with parse and expenseSchema) and if so, save the data in the variables defined respectively
        const { title, description, amount, tag, currency } = expenseSchema.parse(req.body);

        // Check if the user exists in the database
        const userExists = await User.findById(userId);
        if (!userExists) {
            // If user doesn't exist, return a 404 error
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new expense entry with the parsed data
        const expense = new Expense({
            title,
            description,
            amount,
            tag,
            currency
        });

        // Save the new expense entry to the database
        await expense.save();

        // Link the expense entry to the user and save the user data
        userExists.expenses.push(expense);
        await userExists.save();

        // Respond with success message
        return res.status(201).json({ message: 'expense added successfully' });

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

// Function to get all expense entries for a specific user
const getExpenses = async (req, res) => {
    try {
        // Parse and validate user ID from request parameters
        const userId = userIdValidation.parse(req.params.userId);

        // Check if the user exists in the database
        const userExists = await User.findById(userId);
        if (!userExists) {
            // If user doesn't exist, return a 404 error
            return res.status(404).json({ message: 'User not found' });
        }

        // This line fetches all expense records for the user.
        // It uses the expense model to find documents where the expense ID (_id)
        // matches any ID in the user's expense list (userExists.expenses).
        //
        // The { $in: userExists.expenses } part checks if the expense ID
        // is included in the user's expense IDs. This means we get
        // all the expenses that belong to the user.
        //
        // For example, if userExists.expenses contains ['expenseId1', 'expenseId2'],
        // this line will find and return all expense records with IDs 
        // 'expenseId1' or 'expenseId2'. This way, we can retrieve all 
        // the expenses associated with that user.
        const expenses = await Expense.find({ _id: { $in: userExists.expenses } });

        // Respond with the expense data as a JSON array
        return res.status(200).json(expenses);

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
const deleteExpense = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId)
        const expenseId = (req.params.expenseId)
        // Check if the user exists in the database
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the expense exists in the database
        const expenseExists = userExists.expenses.find(id => id.toString() === expenseId);
        if (!expenseExists) {
            return res.status(404).json({ message: 'expense not found' });
        }

        // Remove the expenseId from the user's expenses array
        //בעזרת פילטר אפשר ליצור מערך חדש על פי תנאי מסוים במקרה זה התנאי הוא שהמערך יכיל כל הוצאה שהאיידי שלה שונה מהאיידי הנתון
        userExists.expenses = userExists.expenses.filter(id => id.toString() !== expenseId);
        // Save the updated user object
        await userExists.save();

        // Respond with success message
        return res.status(200).json({ message: 'expense deleted successfully' });

    } catch (error) {
        console.log(error);
        // Check for Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
const updateExpense = async (req, res) => {
    try {
        const userId = userIdValidation.parse(req.params.userId)
        const expenseId = (req.params.expenseId)
        const { title, description, amount, tag, currency } = expenseSchema.parse(req.body);
        // Check if the user exists in the database
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the expense exists in the database
        const expenseExists = userExists.expenses.find(id => id.toString() === expenseId);
        if (!expenseExists) {
            return res.status(404).json({ message: 'expense not found' });
        }
        console.log(expenseExists)
        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, {
            title,
            description,
            amount,
            tag,
            currency
        }, { new: true }); //להחזיר את ההוצאה המעודכנת ולא המקורית
        console.log(updatedExpense)

        // Respond with success message
        return res.status(200).json({ message: 'Expense updated successfully' });

    } catch (error) {
        console.log(error);
        // Check for Zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// Export the functions for use in other parts of the application
module.exports = { addExpense, getExpenses, deleteExpense, updateExpense };
