const express = require('express');

const premiumFeatureController = require('../controllers/premiumFeature');

const userAuthentication = require('../middleware/auth');

const router = express.Router();   


router.get('/premiumUser/getUserleaderBoard', userAuthentication.authenticate, premiumFeatureController.getUserLeaderBoard);

router.get('/premiumUser/isPremiumUser', userAuthentication.authenticate, premiumFeatureController.isPremiumUser);

module.exports = router;