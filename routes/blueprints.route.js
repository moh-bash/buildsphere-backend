const express = require('express');
const blueprintUpload = require('../middlewares/blueprintUpload.js');
const blueprintsController = require('../controllers/blueprints.controller');
const verifyToken = require('../middlewares/verifytoken.js');
const allowedTo = require('../middlewares/allowedTo.js');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

/**
 * @swagger
 * /api/blueprints:
 *   post:
 *     summary: Create a new blueprint with multiple images
 *     description: Creates a blueprint and uploads its technical diagrams. Requires Multipart Form Data.
 *     tags: [Blueprints]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Ground Floor Architectural Plan"
 *               description:
 *                 type: string
 *                 example: "Detailed layout of columns, walls, and luxury entrances."
 *               projectId:
 *                 type: string
 *                 example: "6a0f6010937f46c62378cbaa"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: You can upload up to 10 image files simultaneously.
 *     responses:
 *       201:
 *         description: Blueprint created successfully.
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
 *                     blueprint:
 *                       $ref: '#/components/schemas/Blueprint'
 *       400:
 *         description: Bad Request - Missing images or invalid project ID.
 *       401:
 *         description: Unauthorized - Token is missing or expired.
 */

router.route('/')
    .post(allowedTo('USER', 'ADMIN'), blueprintUpload, blueprintsController.createBlueprint);

/**
 * @swagger
 * /api/blueprints/{id}:
 *   patch:
 *     summary: Update an existing blueprint
 *     description: Updates blueprint texts and appends new layout images to the existing ones.
 *     tags: [Blueprints]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Blueprint ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Ground Floor Plan"
 *               description:
 *                 type: string
 *                 example: "Modified electrical sockets distribution."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Additional images to append to this blueprint.
 *     responses:
 *       200:
 *         description: Blueprint updated successfully.
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
 *                     blueprint:
 *                       $ref: '#/components/schemas/Blueprint'
 *       404:
 *         description: Blueprint not found.
 *
 *   delete:
 *     summary: Delete a blueprint
 *     description: Permanently deletes a blueprint by its ID.
 *     tags: [Blueprints]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Blueprint ID
 *     responses:
 *       200:
 *         description: Blueprint deleted successfully.
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
 *       404:
 *         description: Blueprint not found.
 */

router.route('/:id')
    .patch(allowedTo('USER', 'ADMIN'), blueprintUpload, blueprintsController.updateBlueprint)
    .delete(allowedTo('USER', 'ADMIN'), blueprintsController.deleteBlueprint);

router.route('/:blueprintId/images/:imageId/notes')
    .post(allowedTo('USER', 'ADMIN'), blueprintsController.addNoteToImage);

router.post('/comments', allowedTo('USER', 'ADMIN'), blueprintsController.addComment);
module.exports = router;