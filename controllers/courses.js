const ErrorResponse = require('../utils/errorResponse.js');
const asyncHanler = require('../middleware/async.js');
const Course = require('../models/Course.js');
const Bootcamp = require('../models/Bootcamp.js');

// @desc    Get all couses
// @route   GET /api/v1/couses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHanler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId});

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Get single courses
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHanler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`No course with id ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Add course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHanler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with id ${req.params.bootcampId}`), 404);
    }

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized add course to this bootcamp id ${bootcamp.id}`, 401));
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Update Course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHanler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorResponse(`No course with id ${req.params.id}`), 404);
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized update course to this course id ${course.id}`, 401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Delete Course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHanler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorResponse(`No course with id ${req.params.id}`), 404);
    }

    // Make sure user is course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this course with id ${course.id}`, 401));
    }

    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});