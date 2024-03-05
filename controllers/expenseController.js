const Expense = require('../models/expense');
const User = require('../models/user');
// const UserServices = require('../services/userservices');
// const S3Service = require('../services/S3services');
const mongoose = require('mongoose');


exports.createExpense = async (req, res, next) => {
    try {
        if (!req.body.amount) {
            throw new Error('Amount is mandatory!');
        }

        const { amount, description, category } = req.body;

        const userId = new mongoose.Types.ObjectId(req.user._id);

        const expense = await Expense.create({ userId, amount, description, category });

        const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
        await User.findByIdAndUpdate(req.user._id, { totalExpenses }, { new: true });

        res.status(201).json({ newExpenseDetails: expense });
    } catch (err) {
        console.log('Error creating expense:', err);
        return res.status(500).json({ error: err.message });
    }
};


exports.getExpenses = async (req, res, next) => {
    try {
        const page = req.query.page || 1; // Default to page 1 if not specified
        const pageSize = parseInt(req.query.items) || 10;
        const offset = (page - 1) * pageSize;

        const userId = new mongoose.Types.ObjectId(req.user._id);

        const expenses = await Expense.find({ userId })
            .skip(offset)
            .limit(pageSize);

        // Get the total count of expenses
        const totalCount = await Expense.countDocuments({ userId });

        const totalPages = Math.ceil(totalCount / pageSize);

        res.status(200).json({ expenses, totalPages, currentPage: page });
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: err.message });
    }
};


exports.editExpense = async (req, res, next) => {

    const expenseId = req.params._id;
    const userId = new mongoose.Types.ObjectId(req.user._id);

    try {
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
        } else {
            res.json(expense);
        }
    } catch (err) {
        console.error('Error fetching expense:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res, next) => {
    const expenseId = req.params._id;
    const userId = new mongoose.Types.ObjectId(req.user._id);

    try {
        if (!expenseId) {
            console.log('Invalid expensId', expenseId);
            return res.status(400).json({ success: false, message: 'Invalid expense ID' });
        }

        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        // if (expense.userId !== userId) {
        //     return res.status(403).json({ success: false, message: 'Expense does not belong to the user' });
        // }

        const updatedAmount = req.user.totalExpenses - expense.amount;

        await Expense.findByIdAndDelete(expenseId);
        await User.findByIdAndUpdate(userId, { totalExpenses: updatedAmount });

        return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};


exports.downloadExpense = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expenses${userId}/${new Date()}.txt`;
        const fileURL = await S3Service.uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({ fileURL, success: true });
    }
    catch (err) {
        console.error('Error processing downloadExpense:', err);
        res.status(500).json({ fileURL: '', success: false, error: err });
    }
};
