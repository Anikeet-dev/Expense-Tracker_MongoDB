const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = process.env.SECRET_KEY;

exports.authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, secretKey);
        User.findById(user.userId).then(user => {
            req.user = user;
            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
};




