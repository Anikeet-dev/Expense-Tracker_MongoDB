const mongoose = require('mongoose');

const passwordRequestSchema = new mongoose.Schema({

    active: {
        type: Boolean,
        default: true,
    },
    expiresBy: {
        type: Date,
        default: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiration by default
    },
});

const PasswordRequest = mongoose.model('PasswordRequest', passwordRequestSchema);

module.exports = PasswordRequest;



// const database = require('../util/database');

// const PasswordRequest = database.define('passwordrequest',{
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN
//     // expiresby: Sequelize.DATE
// });


// module.exports = PasswordRequest;