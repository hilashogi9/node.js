const { addExpense, getExpenses, deleteExpense, updateExpense} = require('../controllers/expense');


const router = require('express').Router();

router.post('/add-expense/:userId', addExpense);
router.get('/get-expenses/:userId', getExpenses);
router.delete('/delete-expense/:userId/:expenseId', deleteExpense);
router.patch('/update-expense/:userId/:expenseId', updateExpense);



module.exports = router;