const User = require('../models/user');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const usersLeaderBoard = await User.find().sort({ totalExpenses: -1 });
        res.status(200).json(usersLeaderBoard);
    } catch (err) {
        console.error('Error in UserLeaderBoard:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.isPremiumUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (user) {
            const isPremium = user.ispremiumuser;
            res.status(200).json({ isPremium });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.log('Error checking premium status:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
