const Course = require('../models/course.model.js');
const {validationResult} = require('express-validator');
const httpStatusText = require('../utils/httpStatusTexxt.js');

// handle error
const asyncWrapper = require('../middlewares/asyncWrapper.js');
const appError = require('../utils/appError.js');


const getAllCourses = asyncWrapper(
    async (req, res, next) => {
        const query = req.query;
      const page = query.page || 1;
        const limit = query.limit || 2;
        const skip = (page - 1) * limit;
    
        const courses = await Course.find({},{__v:0}).limit(limit).skip(skip);
        res.json({ status: httpStatusText.SCCESS, data: {courses} });
    }
);

const getCourse = asyncWrapper(
    async (req, res, next) => {
        const courseId = req.params.id;
        const course = await Course.findById(courseId, {__v:0});
        if(!course){
            const error = appError.create(404, httpStatusText.FAILED, "Course not found");
            return next(error);
        }
        return res.json({ status: httpStatusText.SUCCESS, data: {course} });
    }
);

const createCourse = asyncWrapper(
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = appError.create(400, httpStatusText.FAILED, "Invalid data");
            return next(error);
        }

        const newCourse = new Course(req.body);
        await newCourse.save();
        res.json({ status: httpStatusText.SCCESS, data: {course: newCourse} });
    }
);

const updateCourse = asyncWrapper(
    async (req, res, next) => {
        const courseId = req.params.id;
        const course = await Course.findByIdAndUpdate(courseId, req.body, { returnDocument: 'after' });
        if (!course) {
            const error = appError.create(404, httpStatusText.FAILED, "Course not found");
            return next(error);
        }
        res.json({ status: httpStatusText.SCCESS, data: {course} });
    }
);

const deleteCourse = asyncWrapper(
    async (req, res, next) => {
       const courseId = req.params.id;
       const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            const error = appError.create(404, httpStatusText.FAILED, "Course not found");
            return next(error);
        }
       res.json({ status: httpStatusText.SCCESS, data: null });
    }
);

module.exports ={
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
}