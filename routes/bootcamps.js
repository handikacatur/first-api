const express = require('express');
const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps.js');

const Bootcamp = require('../models/Bootcamp.js');

const advancedResults = require('../middleware/advancedResults.js');

// Include other resource router
const courseRouter = require('./courses.js');

const router = express.Router();

const {protect} = require('../middleware/auth.js');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);
router.route('/:id/photo').put(protect, bootcampPhotoUpload);

module.exports = router;