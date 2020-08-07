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

// Include other resource router
const courseRouter = require('./courses.js');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;