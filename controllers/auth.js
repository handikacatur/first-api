const ErrorResponse = require('../utils/errorResponse.js');
const asyncHanler = require('../middleware/async.js');
const User = require('../models/User.js');

// @desc    Register User
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = asyncHanler(async (req, res, next) => {
    res.status(200).json({success: true});
});
