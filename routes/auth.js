const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.js');

const router = express.Router();

const {protect} = require('../middleware/auth.js');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetPassword/:resettoken', resetPassword);

module.exports = router;