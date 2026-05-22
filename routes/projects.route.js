const express = require('express');
const projectsController = require('../controllers/projects.controller');
const verifyToken = require('../middlewares/verifytoken.js');
const allowedTo = require('../middlewares/allowedTo.js');
const { projectValidationSchema } = require('../middlewares/validationSchema.js');

const router = express.Router();

router.use(verifyToken);

router.route('/')
    .get(projectsController.getAllProjects)
    .post(allowedTo('USER', 'ADMIN'), projectValidationSchema(), projectsController.createProject);

router.route('/:id')
    .get(projectsController.getProjectById)
    .patch(allowedTo('USER', 'ADMIN'), projectsController.updateProject)
    .delete(allowedTo('USER', 'ADMIN'), projectsController.deleteProject);

module.exports = router;