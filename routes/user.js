const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();


router.get('/user/getLogin', userController.getLogin);

router.post('/user/login', userController.login);

router.get('/user/getSignup', userController.getSignup);

router.post('/user/signup', userController.signup);


//get forgot password page
router.get('/password/forgotpassword',userController.forgotPassword);

// verify the user to get password over email
router.post('/password/verification',userController.forgotPasswordVerification);

router.post('/password/resetpassword',userController.resettingPassword);

router.get('/password/resetpasswordform/:id',userController.resetPasswordForm);

router.post('/password/updatepassword/:id', userController.updatePassword);


module.exports = router;