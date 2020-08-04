const ErrorResponse = require('../utils/errorResponse.js');
const asyncHanler = require('../middleware/async.js');
const Course = require('../models/Course.js');

// @desc    Get all couses
// @route   GET /api/v1/couses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHanler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId})
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});
