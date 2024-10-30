const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,

        },
        username: {
            type: String,
            required: true,
            trim: true, //להסיר רווחים מיותרים

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