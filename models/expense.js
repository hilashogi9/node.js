

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,

        },
        description: {
            type: String,
            required: true,
            trim: true,

        },
        amount: {
            type: Number,
            required: true,
        },
        tag: {
            type: String,
            required: true,
            enum: [
                'food',
                'rent',
                'transport',
                'other',
                'clothing',
                'entertainment',
                'health',
                'education',
              ],
        },
        currency: {
            type: String,
            required: true,
            default: 'ILS',
            enum: ['ILS', 'USD', 'EUR'],
        },
    },
    {timestamps: true}
);
module.exports= mongoose.model('Expense', incomeSchema)
