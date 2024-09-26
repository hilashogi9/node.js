const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,

        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 24,
            trim: true,
        },
        incomes:  [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Income',
            },
        ],
        expenses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Expense',
            },
        ],
    },

    { timestamps: true }
)
module.exports=mongoose.model("User", userSchema)