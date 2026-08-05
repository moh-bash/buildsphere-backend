const express = require('express');
const tasksController = require('../controllers/tasks.controller.js');
const verifyToken = require('../middlewares/verifytoken.js'); // تأكد من مطابقة اسم الملف تماماً

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: manage tasks in the system
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - projectId
 *       properties:
 *         title:
 *           type: string
 *           description: Task title
 *         description:
 *           type: string
 *           description: Detailed description of the task
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, POSTPONED]
 *           description: Current status of the task
 *         projectId:
 *           type: string
 *           description: ID of the engineering project it belongs to
 */

router.use(verifyToken);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: add a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Missing required data (title or project ID)
 *       401:
 *         description: Not authorized (Token missing or invalid)
 */
router.route('/')
    .post(tasksController.createTask);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update task title or description
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found or you are not authorized to update it
 *   
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found or you are not authorized to delete it
 */
router.route('/:taskId')
    .patch(tasksController.updateTask) 
    .delete(tasksController.deleteTask); 

/**
 * @swagger
 * /api/tasks/{taskId}/status:
 *   patch:
 *     summary: Change task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, POSTPONED]
 *     responses:
 *       200:
 *         description: Task status updated successfully
 *       400:
 *         description: Invalid task status
 *       404:
 *         description: Task not found
 */
router.route('/:taskId/status')
    .patch(tasksController.changeTaskStatus);

module.exports = router;