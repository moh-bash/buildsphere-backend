const express = require('express');
const projectsController = require('../controllers/projects.controller');
const verifyToken = require('../middlewares/verifytoken.js');
const allowedTo = require('../middlewares/allowedTo.js');
const { projectValidationSchema } = require('../middlewares/validationSchema.js');

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "664b3c7d1f9a2b0017cde123"
 *         title:
 *           type: string
 *           minLength: 3
 *           example: "Modern Villa Design"
 *         description:
 *           type: string
 *           example: "Architectural blueprint and planning for a 3-story modern villa."
 *         status:
 *           type: string
 *           enum: [ACTIVE, COMPLETED, ARCHIVED]
 *           default: ACTIVE
 *           example: "ACTIVE"
 *         visibility:
 *           type: string
 *           enum: [PUBLIC, PRIVATE]
 *           default: PUBLIC
 *           example: "PUBLIC"
 *         location:
 *           type: string
 *           example: "Cairo, Egypt"
 *         owner:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "664b3c7d1f9a2b0017cd000"
 *             name:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               example: "john@example.com"
 *             role:
 *               type: string
 *               example: "USER"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProjectInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           example: "Modern Villa Design"
 *         description:
 *           type: string
 *           example: "Architectural blueprint and planning for a 3-story modern villa."
 *         status:
 *           type: string
 *           enum: [ACTIVE, COMPLETED, ARCHIVED]
 *           example: "ACTIVE"
 *         visibility:
 *           type: string
 *           enum: [PUBLIC, PRIVATE]
 *           example: "PUBLIC"
 *         location:
 *           type: string
 *           example: "Cairo, Egypt"
 */


router.use(verifyToken);


/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve all public projects or private projects owned by the current logged-in user.
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of projects retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     projects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with the current logged-in user assigned as the owner.
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       201:
 *         description: Project created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation Error (e.g. title too short or missing fields).
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden - User doesn't have permissions.
 */


router.route('/')
    .get(projectsController.getAllProjects)
    .post(allowedTo('USER', 'ADMIN'), projectValidationSchema(), projectsController.createProject);



/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID with blueprints
 *     description: Fetch details of a specific project by its ID, along with all its related blueprints. If the project is private, only the owner can view it.
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project ID
 *     responses:
 *       200:
 *         description: Project details and blueprints fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *                     blueprints:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *       403:
 *         description: Access denied to this private project.
 *       404:
 *         description: Project not found.
 *
 *   patch:
 *     summary: Update project details
 *     description: Update specific fields of a project. Only the project owner can perform this operation.
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       200:
 *         description: Project updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       $ref: '#/components/schemas/Project'
 *       403:
 *         description: Forbidden - You are not authorized to update this project.
 *       404:
 *         description: Project not found.
 *
 *   delete:
 *     summary: Delete a project
 *     description: Delete a project from the system. Only the project owner can perform this operation.
 *     tags: [Projects]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       403:
 *         description: Forbidden - You are not authorized to delete this project.
 *       404:
 *         description: Project not found.
 */
router.route('/:id')
    .get(projectsController.getProjectById)
    .patch(allowedTo('USER', 'ADMIN'), projectsController.updateProject)
    .delete(allowedTo('USER', 'ADMIN'), projectsController.deleteProject);

module.exports = router;