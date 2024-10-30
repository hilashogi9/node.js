const { z } = require('zod');

// Define the incomeSchema using Zod for data validation
const expenseSchema = z.object({
    title: z.string(), // 'title' must be a string
    description: z.string().optional(), // 'description' is optional and must be a string if provided
    amount: z.number().positive(), // 'amount' must be a positive number
    tag: z.enum([
        'food',
        'rent',
        'transport',
        'other',
        'clothing',
        'entertainment',
        'health',
        'education',
      ],), // 'tag' must be one of the specified values
    currency: z.enum(['ILS', 'USD', 'EUR']), // 'currency' must be one of the specified currencies
});

// Export the incomeSchema for use in other modules
module.exports = { expenseSchema };