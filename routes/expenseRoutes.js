
const express = require('express');

const expenseController = require('../controllers/expenseController');

const userAuthentication = require('../middleware/auth');

const router = express.Router();


router.get('/get-expenses',userAuthentication.authenticate, expenseController.getExpenses);

router.put('/edit-expense/:_id', userAuthentication.authenticate, expenseController.editExpense);

router.post('/create-expense',  userAuthentication.authenticate, expenseController.createExpense);

router.delete('/delete-expense/:_id', userAuthentication.authenticate, expenseController.deleteExpense);

// router.get('/user/download', userAuthentication.authenticate, expenseController.downloadExpense);

module.exports = router;
