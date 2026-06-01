const express = require('express');
const collaborationController = require('../controllers/collaboration.controller.js');
const verifyToken = require('../middlewares/verifytoken.js');
const allowedTo = require('../middlewares/allowedTo.js');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Invitation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "664b3c7d1f9a2b0017cd0999"
 *
 *         projectId:
 *           type: string
 *           example: "6a0f6010937f46c62378cbaa"
 *
 *         senderId:
 *           type: string
 *           example: "6a0f6010937f46c62378cbff"
 *
 *         receiverEmail:
 *           type: string
 *           example: "engineer.ahmed@example.com"
 *
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - ACCEPTED
 *             - REJECTED
 *           example: "PENDING"
 *
 *         createdAt:
 *           type: string
 *           format: date-time
 */

router.use(verifyToken);

/**
 * @swagger
 * /api/collaboration/invite:
 *   post:
 *     summary: Send a project collaboration invitation
 *     description: Allows the project owner to invite another registered engineer via email.
 *     tags: [Collaboration]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - receiverEmail
 *             properties:
 *               projectId:
 *                 type: string
 *                 example: "6a0f6010937f46c62378cbaa"
 *               receiverEmail:
 *                 type: string
 *                 format: email
 *                 example: "engineer.ahmed@example.com"
 *     responses:
 *       201:
 *         description: Invitation sent successfully.
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
 *                     invitation:
 *                       $ref: '#/components/schemas/Invitation'
 *
 *       400:
 *         description: Duplicate pending invitation.
 *
 *       403:
 *         description: Forbidden - Only owner can invite.
 *
 *       404:
 *         description: Project or Engineer email not found.
 */

router.route('/invite')
    .post(allowedTo('USER', 'ADMIN'), collaborationController.sendInvitation);

/**
 * @swagger
 * /api/collaboration/my-invitations:
 *   get:
 *     summary: Get all pending/received invitations for the logged-in engineer
 *     tags: [Collaboration]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success response.
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
 *                     invitations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Invitation'
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 */
router.route('/my-invitations')
    .get(allowedTo('USER', 'ADMIN'), collaborationController.getMyInvitations);

/**
 * @swagger
 * /api/collaboration/respond:
 *   post:
 *     summary: Accept or Reject an invitation
 *     description: Process the invitation. If accepted, the user is added to the project's collaborator list.
 *     tags: [Collaboration]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invitationId
 *               - action
 *             properties:
 *               invitationId:
 *                 type: string
 *                 example: "664b3c7d1f9a2b0017cd0999"
 *               action:
 *                 type: string
 *                 enum:
 *                   - ACCEPTED
 *                   - REJECTED
 *                 example: "ACCEPTED"
 *
 *     responses:
 *       200:
 *         description: Invitation status updated successfully.
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
 *                     invitation:
 *                       $ref: '#/components/schemas/Invitation'
 *
 *       400:
 *         description: Invitation already processed or invalid action.
 *
 *       401:
 *         description: Unauthorized - Invalid or missing token.
 *
 *       403:
 *         description: Not authorized to respond to this invitation.
 *
 *       404:
 *         description: Invitation not found.
 */
router.route('/respond')
    .post(allowedTo('USER', 'ADMIN'), collaborationController.respondToInvitation);

module.exports = router;