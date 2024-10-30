const { addIncome, getIncomes, deleteIncome, updateIncome } = require('../controllers/income');


const router = require('express').Router();

router.post('/add-income/:userId', addIncome);
router.get('/get-incomes/:userId', getIncomes);
router.delete('/delete-income/:userId/:incomeId', deleteIncome);
router.patch('/update-income/:userId/:incomeId', updateIncome);



module.exports = router;