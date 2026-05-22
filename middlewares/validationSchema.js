const { body } = require('express-validator');
const status = require('../utils/statusProject.js');
const visibility = require('../utils/visibilityPro.js');

const projectValidationSchema = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage('Project title is required')
            .isLength({ min: 3 })
            .withMessage('Title must be at least 3 characters long'),
        body("status")
            .optional()
            .isIn([status.ACTIVE, status.COMPLETED, status.ARCHIVED])
            .withMessage('Status must be ACTIVE, COMPLETED, or ARCHIVED'),
        body("visibility")
            .optional()
            .isIn([visibility.PUBLIC, visibility.PRIVATE])
            .withMessage('Visibility must be PUBLIC or PRIVATE')
    ];
};


const blueprintValidationSchema = () => {
    return [
        body("title")
            .notEmpty()
            .withMessage('Blueprint title is required')
            .isLength({ min: 3 })
            .withMessage('Title must be at least 3 characters long'),
        body("projectId")
            .notEmpty()
            .withMessage('Project ID is required')
            .isMongoId()
            .withMessage('Invalid Project ID format')
    ];
};

module.exports = {
    projectValidationSchema,
    blueprintValidationSchema
};