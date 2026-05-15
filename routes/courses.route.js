const express = require('express');
const coursesController = require('../controllers/courses.controller');
const {validationSchema} = require('../middlewares/validationSchema');

const router = express.Router();


router.route('/')
        .get(coursesController.getAllCourses)
        .post( validationSchema(), coursesController.createCourse);


router.route('/:id')
        .get(coursesController.getCourse)
        .patch(coursesController.updateCourse)
        .delete(coursesController.deleteCourse);

module.exports = router;