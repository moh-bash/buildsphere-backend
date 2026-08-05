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
 *     summary: Get project by ID with tasks and blueprints
 *     description: Fetch full details of a specific project including owner details, collaborators, associated tasks, and blueprints with images and notes.
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project ID
 *     responses:
 *       200:
 *         description: Project details, tasks, and blueprints fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   type: object
 *                   properties:
 *                     project:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "6a145ca0016792a232e5b303"
 *                         title:
 *                           type: string
 *                           example: "ABCD"
 *                         description:
 *                           type: string
 *                           example: "________________/.."
 *                         status:
 *                           type: string
 *                           example: "ACTIVE"
 *                         visibility:
 *                           type: string
 *                           example: "PUBLIC"
 *                         owner:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "6a11eed66abd53187add0787"
 *                             name:
 *                               type: string
 *                               example: "joud maklad"
 *                             email:
 *                               type: string
 *                               example: "joud23@gmail.com"
 *                             role:
 *                               type: string
 *                               example: "USER"
 *                         collaborators:
 *                           type: array
 *                           items:
 *                             type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                     tasks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6a7332b01a19fc15e7074170"
 *                           title:
 *                             type: string
 *                             example: "stringv1111"
 *                           description:
 *                             type: string
 *                             example: "string"
 *                           status:
 *                             type: string
 *                             example: "PENDING"
 *                           creator:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "6a6b470e9ecc728bd528cd0e"
 *                               name:
 *                                 type: string
 *                                 example: "Bashir"
 *                               email:
 *                                 type: string
 *                                 example: "bashir@test.com"
 *                               avatar:
 *                                 type: string
 *                                 example: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
 *                           projectId:
 *                             type: string
 *                             example: "6a145ca0016792a232e5b303"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     blueprints:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6a15b33e8454bd3089fa92c6"
 *                           title:
 *                             type: string
 *                             example: "مدرسة"
 *                           description:
 *                             type: string
 *                             example: "==="
 *                           projectId:
 *                             type: string
 *                             example: "6a145ca0016792a232e5b303"
 *                           images:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "6a15b33e8454bd3089fa92c7"
 *                                 imageUrl:
 *                                   type: string
 *                                   example: "/uploads/blueprint-1779807038372-134149345.jpeg"
 *                                 notes:
 *                                   type: array
 *                                   items:
 *                                     type: object
 *                                     properties:
 *                                       _id:
 *                                         type: string
 *                                         example: "6a15b3c18454bd3089fa9320"
 *                                       text:
 *                                         type: string
 *                                         example: "222"
 *                                       author:
 *                                         type: string
 *                                         example: "6a11eed66abd53187add0787"
 *                                       createdAt:
 *                                         type: string
 *                                         format: date-time
 *                                       updatedAt:
 *                                         type: string
 *                                         format: date-time
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                                 updatedAt:
 *                                   type: string
 *                                   format: date-time
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized - Missing or invalid token.
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