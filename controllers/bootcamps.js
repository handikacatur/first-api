const ErrorResponse = require('../utils/errorResponse.js');
const asyncHanler = require('../middleware/async.js');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp.js');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHanler( async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = {...req.query};

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete select from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    // If there is an operator like gt,gte, ect. This will turn that into $gt, $gte, ect.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    // sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const bootcamps = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        pagination,
        data: bootcamps
    });
});

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/
// @access  Public
exports.getBootcamp = asyncHanler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if (!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
});

// @desc    Create bootcamps
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = asyncHanler( async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHanler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }

    res.status(200).json({success: true, data: bootcamp});
});

// @desc    Delete bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHanler( async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id,);

    if (!bootcamp){
        return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
    }

    bootcamp.remove();

    res.status(200).json({success: true, data: {}});
});

// @desc    Get bootcamps within the radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHanler( async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const {latitude, longitude} = loc[0];
    
    // Calc radius using radians
    // Deviding distance by radius of the earth
    // Earth radius = 3,963 miles / 6,378 km
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[longitude, latitude], radius]}}
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});