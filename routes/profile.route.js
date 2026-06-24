const express = require('express');
const profileController = require('../controllers/profile.controller.js');
const verifyToken = require('../middlewares/verifytoken.js');
const multer = require('multer');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusTexxt');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const newFilename = `user-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
    cb(null, newFilename)
  }
})

const fileFilter = (req, file, cb) => {
        const typeFile = file.mimetype.split('/')[0];
        if (typeFile === 'image') {
            cb(null, true);
        } else {
            cb(appError.create(400,httpStatusTexxt.ERROR,'Only image files are allowed'), false);
        }
}

var avatarUpload = multer({ storage: storage, fileFilter })

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     PublicProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "664b3c7d1f9a2b0017cde123"
 *         name:
 *           type: string
 *           example: "Eng. Ahmed"
 *         avatar:
 *           type: string
 *           example: "/uploads/avatar-1716645600000.jpg"
 *
 *     MyProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "664b3c7d1f9a2b0017cde123"
 *         name:
 *           type: string
 *           example: "Eng. Ahmed"
 *         email:
 *           type: string
 *           example: "ahmed@example.com"
 *         role:
 *           type: string
 *           example: "USER"
 *         avatar:
 *           type: string
 *           example: "/uploads/avatar-1716645600000.jpg"
 */



/**
 * @swagger
 * /api/profiles/{id}/public:
 *   get:
 *     summary: Get public profile of any user (Public Access)
 *     description: Retrieve user details (excluding email/role) and their public projects. This route does not require authentication and can be shared with unregistered users.
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The User ID
 *     responses:
 *       200:
 *         description: Public profile fetched successfully.
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
 *                     user:
 *                       $ref: '#/components/schemas/PublicProfile'
 *                     projects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *
 *       404:
 *         description: User not found.
 */

router.get('/:id/public', profileController.getUserProfile);

router.use(verifyToken);
/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     description: Retrieve all profile details of the authenticated user along with all their owned projects.
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Private profile fetched successfully.
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
 *                     user:
 *                       $ref: '#/components/schemas/MyProfile'
 *                     projects:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized - Token missing or expired.
 *
 *   patch:
 *     summary: Update current user profile
 *     description: Update profile details such as name and avatar image. Email, password, and role modifications are restricted on this endpoint.
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ahmed Ali"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: New profile picture file to upload.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
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
 *                     user:
 *                       $ref: '#/components/schemas/MyProfile'
 *       401:
 *         description: Unauthorized.
 */
router.route('/me')
    .get(profileController.getMyProfile)
    .patch(avatarUpload.single('avatar'), profileController.updateProfile);

module.exports = router;